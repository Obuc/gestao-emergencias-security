import * as XLSX from 'xlsx';
import { useState } from 'react';
import { parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { RespostaExtintor } from '../types/Extinguisher';
import { sharepointContext } from '../../../context/sharepointContext';
import { GovernanceValve, IGovernanceValveFiltersProps } from '../types/GovernanceValve';

const useGovernanceValve = (governanceValveFilters?: IGovernanceValveFiltersProps) => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [isLoadingGovernanceValveExportToExcel, setIsLoadingGovernanceValveExportToExcel] = useState<boolean>(false);

  let path = `?$Select=Id,predio,Created,site/Title,valvula_id/cod_equipamento,valvula_id/Id,bombeiro_id/Title,conforme,observacao,data_legado&$expand=site,valvula_id,bombeiro_id&$Top=100&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;

  if (governanceValveFilters?.responsible) {
    path += ` and ( substringof('${governanceValveFilters.responsible}', bombeiro_id/Title ))`;
  }

  if (governanceValveFilters?.id) {
    path += ` and (Id eq '${governanceValveFilters.id}')`;
  }

  if (governanceValveFilters?.valveNumber) {
    path += ` and ( valvula_id/cod_equipamento eq '${governanceValveFilters.valveNumber}')`;
  }

  if (governanceValveFilters?.startDate || governanceValveFilters?.endDate) {
    const startDate = governanceValveFilters.startDate && new Date(governanceValveFilters.startDate);
    startDate && startDate.setUTCHours(0, 0, 0, 0);

    const endDate = governanceValveFilters.endDate && new Date(governanceValveFilters.endDate);
    endDate && endDate.setUTCHours(23, 59, 59, 999);

    if (startDate) {
      path += ` and (Created ge datetime'${startDate.toISOString()}')`;
    }

    if (endDate) {
      path += ` and (Created le datetime'${endDate.toISOString()}')`;
    }
  }

  if (governanceValveFilters?.property) {
    for (let i = 0; i < governanceValveFilters.property.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (predio eq '${governanceValveFilters.property[i]}')`;
    }
  }

  if (governanceValveFilters?.conformity && governanceValveFilters?.conformity === 'Conforme') {
    path += ` and (conforme ne 'false')`;
  }

  if (governanceValveFilters?.conformity && governanceValveFilters?.conformity !== 'Conforme') {
    path += ` and (conforme eq 'false')`;
  }

  const fetchGovernaceValve = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(
      pageParam ? { nextUrl: pageParam } : { list: 'registros_valvula_governo', path },
    );

    const dataWithTransformations = await Promise.all(
      response.data.value.map(async (item: any) => {
        const valvulaResponse = await crud.getListItemsv2(
          'equipamentos_diversos',
          `?$Select=Id,tipo_equipamento/Title,predio/Title,pavimento/Title,local/Title,cod_equipamento,conforme,cod_qrcode,excluido&$expand=predio,pavimento,local,tipo_equipamento&$Filter=((Id eq ${item.valvula_id.Id}) and (tipo_equipamento/Title eq 'Válvulas de Governo'))`,
        );

        const valvula = valvulaResponse.results[0] || null;
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const valvulaValues = valvula
          ? {
              predio: valvula.predio.Title,
              cod_equipamento: valvula.cod_equipamento,
              pavimento: valvula.pavimento.Title,
              local: valvula.local.Title,
              validade: valvula.validade,
              conforme: valvula.conforme,
            }
          : null;

        return {
          ...item,
          Created: dataCriado,
          bombeiro: item.bombeiro_id.Title,
          valvula: valvulaValues,
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
    data: governaceValve,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      'governace_valve_data',
      user_site,
      governanceValveFilters?.responsible,
      governanceValveFilters?.id,
      governanceValveFilters?.valveNumber,
      governanceValveFilters?.startDate,
      governanceValveFilters?.endDate,
      governanceValveFilters?.property,
      governanceValveFilters?.conformity,
    ],
    queryFn: fetchGovernaceValve,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: params.form === 'valves',
  });

  const fetchGovernaceValveModalData = async () => {
    const pathModal = `?$Select=*,bombeiro_id/Title&$expand=bombeiro_id&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_valvula_governo', pathModal);
    return resp.results[0];
  };

  const fetchGovernaceValveData = async (valveId: number) => {
    const response = await crud.getListItemsv2(
      'equipamentos_diversos',
      `?$Select=Id,tipo_equipamento/Title,predio/Title,site/Title,pavimento/Title,local/Title,cod_equipamento,conforme,cod_qrcode,excluido&$expand=predio,pavimento,local,tipo_equipamento,site&$Filter=((Id eq ${valveId}) and (tipo_equipamento/Title eq 'Válvulas de Governo'))`,
    );
    return response.results[0] || null;
  };

  const fetchRespostasValvulas = async () => {
    const response = await crud.getListItemsv2(
      'respostas_valvula_governo',
      `?$Select=Id,valvula_idId,pergunta_idId,registro_idId,resposta,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
    );

    const respostasPorCategoria: Record<string, Array<RespostaExtintor>> = {};
    response.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const { data: governaceValveModal, isLoading: isLoadingGovernaceValveModal } = useQuery({
    queryKey: params.id ? ['governace_valve_modal', params.id] : ['governace_valve_modal'],
    queryFn: async () => {
      if (params.id) {
        const governaceValveModalData = await fetchGovernaceValveModalData();
        const valvula = await fetchGovernaceValveData(governaceValveModalData.valvula_idId);
        const respostas = await fetchRespostasValvulas();

        const dataCriadoIsoDate = governaceValveModalData.Created && parseISO(governaceValveModalData.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const valvulaValues = valvula
          ? {
              Id: valvula.Id,
              site: valvula.site.Title,
              predio: valvula.predio.Title,
              pavimento: valvula.pavimento.Title,
              local: valvula.local.Title,
              validade: valvula.validade,
              conforme: valvula.conforme,
              cod_qrcode: valvula.cod_qrcode,
              cod_equipamento: valvula.cod_equipamento,
            }
          : null;

        return {
          ...governaceValveModalData,
          Created: dataCriado,
          bombeiro: governaceValveModalData.bombeiro_id.Title,
          extintor: valvulaValues,
          respostas: respostas,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && params.form === 'valves',
  });

  const { mutateAsync: mutateRemoveGovernanceValve, isLoading: isLoadingMutateRemoveGovernanceValve } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        const itemResponse = await crud.getListItemsv2(
          'respostas_valvula_governo',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_valvula_governo', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
        await crud.deleteItemList('registros_valvula_governo', itemId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'governace_valve_data',
          user_site,
          governanceValveFilters?.responsible,
          governanceValveFilters?.id,
          governanceValveFilters?.valveNumber,
          governanceValveFilters?.startDate,
          governanceValveFilters?.endDate,
          governanceValveFilters?.property,
          governanceValveFilters?.conformity,
        ],
      });
    },
  });

  const { mutateAsync: mutateEditGovernanceValve, isLoading: isLoadingMutateEditGovernanceValve } = useMutation({
    mutationFn: async (values: GovernanceValve) => {
      const idRegistrosValvulaGoverno = values.Id;
      const idValvulaGoverno = +values.valvula.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && governaceValveModal.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = governaceValveModal.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            hasAccording.push(item.resposta);

            if (item.resposta !== itemOriginal.resposta) {
              const postData = {
                resposta: item.resposta,
              };

              await crud.updateItemList('respostas_valvula_governo', item.Id, postData);
            }
          }
        }

        const hasFalseAccording = hasAccording.some((item) => item === false);

        if (hasFalseAccording) {
          await crud.updateItemList('registros_valvula_governo', idRegistrosValvulaGoverno, {
            conforme: false,
          });
          await crud.updateItemList('equipamentos_diversos', idValvulaGoverno, {
            conforme: false,
          });
        }

        if (!hasFalseAccording) {
          await crud.updateItemList('registros_valvula_governo', idRegistrosValvulaGoverno, {
            conforme: true,
          });
          await crud.updateItemList('equipamentos_diversos', idValvulaGoverno, {
            conforme: true,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governace_valve_modal', params.id] });
      queryClient.invalidateQueries({
        queryKey: [
          'governace_valve_data',
          user_site,
          governanceValveFilters?.responsible,
          governanceValveFilters?.id,
          governanceValveFilters?.valveNumber,
          governanceValveFilters?.startDate,
          governanceValveFilters?.endDate,
          governanceValveFilters?.property,
          governanceValveFilters?.conformity,
        ],
      });
    },
  });

  const fetchGovernanceValveAllRecords = async () => {
    const path = `?$Select=Id,site/Title,valvula_id/Id,bombeiro_id/Title,conforme,observacao,data_legado&$expand=site,valvula_id,bombeiro_id&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;
    const response = await crud.getListItems('registros_valvula_governo', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const valvulaResponse = await crud.getListItemsv2(
          'equipamentos_diversos',
          `?$Select=Id,tipo_equipamento/Title,predio/Title,pavimento/Title,local/Title,cod_equipamento,conforme,cod_qrcode,excluido&$expand=predio,pavimento,local,tipo_equipamento&$Filter=((Id eq ${item.valvula_id.Id}) and (tipo_equipamento/Title eq 'Válvulas de Governo'))`,
        );

        const valvula = valvulaResponse.results[0] || null;

        return {
          ...item,
          bombeiro: item.bombeiro_id?.Title,
          predio: valvula.predio.Title,
          cod_equipamento: valvula.cod_equipamento,
          pavimento: valvula.pavimento.Title,
          local: valvula.local.Title,
          validade: valvula.validade,
          valvula_conforme: valvula.conforme,
        };
      }),
    );

    return dataWithTransformations;
  };

  const handleExportGovernanceValveToExcel = async () => {
    setIsLoadingGovernanceValveExportToExcel(true);

    const data = await fetchGovernanceValveAllRecords();

    const columns = [
      'Id',
      'bombeiro',
      'predio',
      'cod_equipamento',
      'pavimento',
      'local',
      'validade',
      'conforme',
      'valvula_conforme',
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
      XLSX.writeFile(wb, `Registros - Valvula de Governo.xlsx`);
    }

    setIsLoadingGovernanceValveExportToExcel(false);
  };

  return {
    governaceValve,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,

    governaceValveModal,
    isLoadingGovernaceValveModal,

    mutateRemoveGovernanceValve,
    isLoadingMutateRemoveGovernanceValve,

    mutateEditGovernanceValve,
    isLoadingMutateEditGovernanceValve,

    handleExportGovernanceValveToExcel,
    isLoadingGovernanceValveExportToExcel,
  };
};

export default useGovernanceValve;
