import * as XLSX from 'xlsx';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import { ExtinguisherDataModal, IExtinguisherFiltersProps, RespostaExtintor } from '../types/Extinguisher';

const useExtinguisher = (extinguisherFilters?: IExtinguisherFiltersProps) => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [isLoadingExtinguisherExportToExcel, setIsLoadingExtinguisherExportToExcel] = useState<boolean>(false);

  let path = `?$Select=Id,Created,conforme,local,extintor_id/Id,extintor_id/validade,extintor_id/cod_extintor,pavimento,site/Title,bombeiro_id/Title&$expand=extintor_id,site,bombeiro_id&$Top=25&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;

  if (extinguisherFilters?.place) {
    for (let i = 0; i < extinguisherFilters.place.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (local eq '${extinguisherFilters.place[i]}')`;
    }
  }

  if (extinguisherFilters?.pavement) {
    for (let i = 0; i < extinguisherFilters.pavement.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (pavimento eq '${extinguisherFilters.pavement[i]}')`;
    }
  }

  if (extinguisherFilters?.conformity && extinguisherFilters?.conformity === 'Conforme') {
    path += ` and (conforme ne 'false')`;
  }

  if (extinguisherFilters?.conformity && extinguisherFilters?.conformity !== 'Conforme') {
    path += ` and (conforme eq 'false')`;
  }

  if (extinguisherFilters?.expiration) {
    const expirationDate = extinguisherFilters.expiration;
    const startDate = new Date(expirationDate);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(expirationDate);
    endDate.setUTCHours(23, 59, 59, 999);

    path += ` and (extintor_id/validade ge datetime'${startDate.toISOString()}') and (extintor_id/validade le datetime'${endDate.toISOString()}')`;
  }

  if (extinguisherFilters?.startDate || extinguisherFilters?.endDate) {
    const startDate = extinguisherFilters.startDate && new Date(extinguisherFilters.startDate);
    startDate && startDate.setUTCHours(0, 0, 0, 0);

    const endDate = extinguisherFilters.endDate && new Date(extinguisherFilters.endDate);
    endDate && endDate.setUTCHours(23, 59, 59, 999);

    if (startDate) {
      path += ` and (Created ge datetime'${startDate.toISOString()}')`;
    }

    if (endDate) {
      path += ` and (Created le datetime'${endDate.toISOString()}')`;
    }
  }

  if (extinguisherFilters?.responsible) {
    path += ` and ( substringof('${extinguisherFilters.responsible}', bombeiro_id/Title ))`;
  }

  if (extinguisherFilters?.extinguisherId) {
    path += ` and ( substringof('${extinguisherFilters.responsible}', extintor_id/cod_extintor ))`;
  }

  const fetchExtinguisher = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'registros_extintor', path });

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        const extintorValidadeIsoDate = item?.extintor_id?.validade && parseISO(item?.extintor_id?.validade);
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);
        const dataPesagemIsoDate = item.data_pesagem && parseISO(item.data_pesagem);

        const extintorValidade =
          extintorValidadeIsoDate &&
          new Date(extintorValidadeIsoDate.getTime() + extintorValidadeIsoDate.getTimezoneOffset() * 60000);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const dataPesagem =
          dataPesagemIsoDate && new Date(dataPesagemIsoDate.getTime() + dataPesagemIsoDate.getTimezoneOffset() * 60000);

        const extintorValues = {
          Id: item?.extintor_id?.Id,
          pavimento: item?.pavimento,
          local: item?.local,
          cod_extintor: item?.extintor_id?.cod_extintor,
          validade: extintorValidade,
          conforme: item.conforme,
        };

        return {
          ...item,
          Created: dataCriado,
          data_pesagem: dataPesagem,
          bombeiro: item.bombeiro_id?.Title,
          extintor: extintorValues,
        };
      }),
    );

    return {
      ...response,
      data: {
        ...response.data,
        value: dataWithTransformations,
      },
    };
  };

  const {
    data: extinguisher,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      'extinguisher_data',
      user_site,
      extinguisherFilters?.place,
      extinguisherFilters?.pavement,
      extinguisherFilters?.conformity,
      extinguisherFilters?.expiration,
      extinguisherFilters?.startDate,
      extinguisherFilters?.endDate,
      extinguisherFilters?.responsible,
      extinguisherFilters?.extinguisherId,
    ],
    queryFn: fetchExtinguisher,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: params.form === 'extinguisher',
  });

  const fetchExtinguisherData = async () => {
    const pathModal = `?$Select=*&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_extintor', pathModal);
    return resp.results[0];
  };

  const fetchBombeiroData = async (bombeiroId: number) => {
    const bombeiroResponse = await crud.getListItemsv2('bombeiros', `?$Select=Title&$Filter=(Id eq ${bombeiroId})`);
    return bombeiroResponse.results[0] || null;
  };

  const fetchExtintorData = async (extintorId: number) => {
    const extintorResponse = await crud.getListItemsv2(
      'extintores',
      `?$Select=Id,massa/Title,predio/Title,pavimento/Title,local/Title,site/Title,tipo_extintor/Title,cod_extintor,validade,conforme,massa,cod_qrcode&$expand=massa,predio,pavimento,local,site,tipo_extintor&$Filter=(Id eq ${extintorId})`,
    );
    return extintorResponse.results[0] || null;
  };

  const fetchRespostasExtintor = async () => {
    const respostasExtintorResponse = await crud.getListItemsv2(
      'respostas_extintor',
      `?$Select=Id,extintor_idId,pergunta_idId,registro_idId,resposta,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
    );

    const respostasPorCategoria: Record<string, Array<RespostaExtintor>> = {};
    respostasExtintorResponse.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const { data: extinguisherModal, isLoading: isLoadingExtinguisherModal } = useQuery({
    queryKey: params.id ? ['extinguisher_data_modal', params.id] : ['extinguisher_data_modal'],
    queryFn: async () => {
      if (params.id && params.form === 'extinguisher') {
        const extinguisherData = await fetchExtinguisherData();

        const bombeiro = await fetchBombeiroData(extinguisherData.bombeiro_idId);
        const extintor = await fetchExtintorData(extinguisherData.extintor_idId);
        const respostas = await fetchRespostasExtintor();

        const extintorValidadeIsoDate = extintor.validade && parseISO(extintor.validade);
        const dataCriadoIsoDate = extinguisherData.Created && parseISO(extinguisherData.Created);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const extintorValidade =
          extintorValidadeIsoDate &&
          new Date(extintorValidadeIsoDate.getTime() + extintorValidadeIsoDate.getTimezoneOffset() * 60000);

        const bombeiroValue = bombeiro ? bombeiro.Title : null;

        const extintorValues = extintor
          ? {
              Id: extintor.Id,
              site: extintor.site.Title,
              predio: extintor.predio.Title,
              pavimento: extintor.pavimento.Title,
              local: extintor.local.Title,
              cod_extintor: extintor.cod_extintor,
              validade: extintorValidade,
              conforme: extintor.conforme,
              massa: extintor.massa.Title,
              cod_qrcode: extintor.cod_qrcode,
              tipo_extintor: extintor.tipo_extintor.Title,
            }
          : null;

        return {
          ...extinguisherData,
          Created: dataCriado,
          bombeiro: bombeiroValue,
          extintor: extintorValues,
          respostas: respostas,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && params.form === 'extinguisher',
  });

  const { mutateAsync: mutateRemoveExtinguisher, isLoading: isLoadingMutateRemoveExtinguisher } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        const itemResponse = await crud.getListItemsv2(
          'respostas_extintor',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_extintor', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
        await crud.deleteItemList('registros_extintor', itemId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'extinguisher_data',
          user_site,
          extinguisherFilters?.place,
          extinguisherFilters?.pavement,
          extinguisherFilters?.conformity,
          extinguisherFilters?.expiration,
          extinguisherFilters?.startDate,
          extinguisherFilters?.endDate,
          extinguisherFilters?.responsible,
          extinguisherFilters?.extinguisherId,
        ],
      });
    },
  });

  const { mutateAsync: mutateEditExtinguisher, isLoading: IsLoadingMutateEditExtinguisher } = useMutation({
    mutationFn: async (values: ExtinguisherDataModal) => {
      const idRegistrosExtintor = values.Id;
      const idExtintor = +values.extintor.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && extinguisherModal.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = extinguisherModal.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            hasAccording.push(item.resposta);

            if (item.resposta !== itemOriginal.resposta) {
              const postData = {
                resposta: item.resposta,
              };

              await crud.updateItemList('respostas_extintor', item.Id, postData);
            }
          }
        }
      }

      const hasFalseAccording = hasAccording.some((item) => item === false);

      if (hasFalseAccording) {
        await crud.updateItemList('registros_extintor', idRegistrosExtintor, {
          conforme: false,
        });
        await crud.updateItemList('extintores', idExtintor, {
          conforme: false,
        });
      }

      if (!hasFalseAccording) {
        await crud.updateItemList('registros_extintor', idRegistrosExtintor, {
          conforme: true,
        });
        await crud.updateItemList('extintores', idExtintor, {
          conforme: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extinguisher_data_modal', params.id] });
      queryClient.invalidateQueries({
        queryKey: [
          'extinguisher_data',
          user_site,
          extinguisherFilters?.place,
          extinguisherFilters?.pavement,
          extinguisherFilters?.conformity,
          extinguisherFilters?.expiration,
          extinguisherFilters?.startDate,
          extinguisherFilters?.endDate,
          extinguisherFilters?.responsible,
          extinguisherFilters?.extinguisherId,
        ],
      });
    },
  });

  const fetchExtinguisherAllRecords = async () => {
    const path = `?$Select=Id,local,extintor_idId,data_pesagem,observacao,novo,pavimento,conforme,bombeiro_id/Title,site/Title&$expand=site,bombeiro_id&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;
    const response = await crud.getListItems('registros_extintor', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const extintorResponse = await crud.getListItemsv2(
          'extintores',
          `?$Select=Id,predio/Title,tipo_extintor/Title,cod_extintor,validade,conforme,cod_qrcode&$expand=predio,tipo_extintor&$Filter=(Id eq ${item.extintor_idId})`,
        );

        const extintor = extintorResponse.results[0] || null;

        return {
          ...item,
          bombeiro: item.bombeiro_id?.Title,
          local: item?.local,
          pavimento: item?.pavimento,
          data_pesagem: item?.data_pesagem ? format(new Date(item?.data_pesagem), 'dd/MM/yyyy') : 'N/A',
          novo: item?.novo ? 'SIM' : 'NÃO',
          tipo_extintor: extintor?.tipo_extintor?.Title,
          cod_extintor: extintor?.cod_extintor,
          predio: extintor?.predio?.Title,
          conforme: item?.conforme ? 'CONFORME' : 'NÃO CONFORME',
          validade: extintor?.validade ? format(new Date(extintor?.validade), 'dd/MM/yyyy') : '',
        };
      }),
    );

    return dataWithTransformations;
  };

  const handleExportExtinguisherToExcel = async () => {
    setIsLoadingExtinguisherExportToExcel(true);

    const data = await fetchExtinguisherAllRecords();

    const columns = [
      'Id',
      'bombeiro',
      'local',
      'pavimento',
      'data_pesagem',
      'novo',
      'tipo_extintor',
      'cod_extintor',
      'predio',
      'validade',
      'conforme',
      'observacao',
    ];

    const headerRow = columns.map((column) => column.toString());

    const dataFiltered = data?.map((item) => {
      const newItem: { [key: string]: any } = {};
      columns.forEach((column) => {
        newItem[column] = item[column];
      });
      return newItem;
    });

    if (dataFiltered) {
      const dataArray = [headerRow, ...dataFiltered.map((item) => columns.map((column) => item[column]))];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(dataArray);

      const wscols = [
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
      ];

      dataArray[0][0] = { t: 's', v: 'Texto com\nQuebra de Linha' };

      const firstRowHeight = 30;
      const wsrows = [{ hpx: firstRowHeight }];
      const filterRange = { ref: `A1:L1` };

      ws['!autofilter'] = filterRange;
      ws['!rows'] = wsrows;
      ws['!cols'] = wscols;

      XLSX.utils.book_append_sheet(wb, ws, 'Extintores');
      XLSX.writeFile(wb, `Registros - Extintores.xlsx`);
    }

    setIsLoadingExtinguisherExportToExcel(false);
  };

  return {
    extinguisher,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    extinguisherModal,
    isLoadingExtinguisherModal,
    mutateRemoveExtinguisher,
    isLoadingMutateRemoveExtinguisher,
    mutateEditExtinguisher,
    IsLoadingMutateEditExtinguisher,

    handleExportExtinguisherToExcel,
    isLoadingExtinguisherExportToExcel,
  };
};

export default useExtinguisher;
