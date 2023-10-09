import * as XLSX from 'xlsx';
import { useState } from 'react';
import { parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import { ExtinguisherDataModal, IExtinguisherFiltersProps, RespostaExtintor } from '../types/Extinguisher';

const useExtinguisher = (extinguisherFilters?: IExtinguisherFiltersProps) => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const [isLoadingExtinguisherExportToExcel, setIsLoadingExtinguisherExportToExcel] = useState<boolean>(false);

  let path = `?$Select=*,Created,conforme,local,extintor_id/validade,pavimento,site/Title,bombeiro_id/Title&$expand=extintor_id,site,bombeiro_id&$Top=100&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;

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

  const fetchExtinguisher = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'registros_extintor', path });

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        const extintorResponse = await crud.getListItemsv2(
          'extintores',
          `?$Select=*,Id,predio/Title,pavimento/Title,local/Title,cod_extintor,validade,conforme,cod_qrcode&$expand=predio,pavimento,local&$Filter=(Id eq ${item.extintor_idId})`,
        );

        const extintor = extintorResponse.results[0] || null;
        const extintorValidadeIsoDate = extintor.validade && parseISO(extintor.validade);
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);
        const dataPesagemIsoDate = item.data_pesagem && parseISO(item.data_pesagem);

        const extintorValidade =
          extintorValidadeIsoDate &&
          new Date(extintorValidadeIsoDate.getTime() + extintorValidadeIsoDate.getTimezoneOffset() * 60000);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const dataPesagem =
          dataPesagemIsoDate && new Date(dataPesagemIsoDate.getTime() + dataPesagemIsoDate.getTimezoneOffset() * 60000);

        const extintorValues = extintor
          ? {
              Id: extintor.Id,
              predio: extintor.predio.Title,
              pavimento: extintor.pavimento.Title,
              local: extintor.local.Title,
              cod_extintor: extintor.cod_extintor,
              validade: extintorValidade,
              conforme: extintor.conforme,
            }
          : null;

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
    ],
    queryFn: fetchExtinguisher,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: equipments_value === 'Extintores',
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
      if (params.id && equipments_value === 'Extintores') {
        const extinguisherData = await fetchExtinguisherData();
        const bombeiro = await fetchBombeiroData(extinguisherData.bombeiro_idId);
        const extintor = await fetchExtintorData(extinguisherData.extintor_idId);
        const respostas = await fetchRespostasExtintor();

        const bombeiroValue = bombeiro ? bombeiro.Title : null;

        const extintorValues = extintor
          ? {
              Id: extintor.Id,
              site: extintor.site.Title,
              predio: extintor.predio.Title,
              pavimento: extintor.pavimento.Title,
              local: extintor.local.Title,
              cod_extintor: extintor.cod_extintor,
              validade: extintor.validade,
              conforme: extintor.conforme,
              massa: extintor.massa.Title,
              cod_qrcode: extintor.cod_qrcode,
              tipo_extintor: extintor.tipo_extintor.Title,
            }
          : null;

        return {
          ...extinguisherData,
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
    enabled: params.id !== undefined && equipments_value === 'Extintores',
  });

  const { mutateAsync: mutateRemoveExtinguisher, isLoading: IsLoadingMutateRemoveExtinguisher } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        await crud.deleteItemList('Extintores', itemId);
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
        ],
      });
    },
  });

  const fetchExtinguisherAllRecords = async () => {
    const path = `?$Select=*,site/Title,bombeiro_id/Title&$expand=site,bombeiro_id&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;
    const response = await crud.getListItems('registros_extintor', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const extintorResponse = await crud.getListItemsv2(
          'extintores',
          `?$Select=*,Id,predio/Title,pavimento/Title,local/Title,cod_extintor,validade,conforme,cod_qrcode&$expand=predio,pavimento,local&$Filter=(Id eq ${item.extintor_idId})`,
        );

        const extintor = extintorResponse.results[0] || null;

        return {
          ...item,
          bombeiro: item.bombeiro_id?.Title,
          extintor_id: extintor?.Id,
          predio: extintor?.predio,
          pavimento: extintor?.pavimento,
          local: extintor?.local,
          cod_extintor: extintor?.cod_extintor,
          validade: extintor?.validade,
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
      'data_pesagem',
      'extintor_id',
      'predio',
      'pavimento',
      'local',
      'cod_extintor',
      'validade',
      'conforme',
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

      XLSX.utils.book_append_sheet(wb, ws, '');
      XLSX.writeFile(wb, `Registros - Extintores.xlsx`);
    }

    setIsLoadingExtinguisherExportToExcel(false);
  };

  // const { data: extintoresLocal } = useQuery({
  //   queryKey: equipments_value ? ['extinguisher_place', equipments_value] : ['extinguisher_place'],
  //   queryFn: async () => {
  //     const resp = await crud.getListItems(
  //       'local',
  //       `?$Select=Id,Title,site/Title&$expand=site&$Filter=( site/Title eq '${localSite}')`,
  //     );
  //     return resp;
  //   },
  //   staleTime: 5000 * 60, // 5 Minute
  //   refetchOnWindowFocus: false,
  //   enabled: equipments_value === 'Extintores',
  // });

  return {
    extinguisher,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    extinguisherModal,
    isLoadingExtinguisherModal,
    mutateRemoveExtinguisher,
    IsLoadingMutateRemoveExtinguisher,
    mutateEditExtinguisher,
    IsLoadingMutateEditExtinguisher,

    handleExportExtinguisherToExcel,
    isLoadingExtinguisherExportToExcel,
  };
};

export default useExtinguisher;
