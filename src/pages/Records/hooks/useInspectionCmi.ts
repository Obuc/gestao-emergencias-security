import * as XLSX from 'xlsx';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import { InspectionCmiDataModal, ResponstaInspectionCMI } from '../types/InspectionCMI';

const useInspectionCmi = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const [isLoadingInspectionCmiExportToExcel, setIsLoadingInspectionCmiExportToExcel] = useState<boolean>(false);

  const path = `?$Select=*,site/Title,bombeiro_id/Title&$expand=site,bombeiro_id&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;
  const fetchTestCMI = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'registros_inspecao_cmi', path });

    const dataWithTransformations = await Promise.all(
      response.data.value.map(async (item: any) => {
        const cmiResponse = await crud.getListItemsv2(
          'equipamentos_diversos',
          `?$Select=*,Id,predio/Title,conforme,cod_qrcode&$expand=predio&$Filter=(Id eq ${item.cmi_idId})`,
        );

        const cmi = cmiResponse.results[0] || null;

        const cmiValues = cmi
          ? {
              Id: cmi.Id,
              predio: cmi.predio.Title,
            }
          : null;

        return {
          ...item,
          bombeiro: item.bombeiro_id?.Title,
          cmi: cmiValues,
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
    data: inspection_cmi,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['inspection_cmi_data', user_site],
    queryFn: fetchTestCMI,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
  });

  const fetchCmiData = async () => {
    const pathModal = `?$Select=*,bombeiro_id/Title&$expand=bombeiro_id&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_inspecao_cmi', pathModal);
    return resp.results[0];
  };

  const fetchEquipmentCmiData = async (cmiId: number) => {
    const cmiResponse = await crud.getListItemsv2(
      'equipamentos_diversos',
      `?$Select=Id,predio/Title,site/Title,conforme,cod_qrcode&$expand=predio,site&$Filter=(Id eq ${cmiId})`,
    );
    return cmiResponse.results[0] || null;
  };

  const fetchResponseInspectionCmi = async () => {
    const response = await crud.getListItemsv2(
      'respostas_inspecao_cmi',
      `?$Select=Id,cmi_idId,pergunta_idId,registro_idId,resposta,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
    );

    const respostasPorCategoria: Record<string, Array<ResponstaInspectionCMI>> = {};
    response.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const { data: inspectionCmiDataModal, isLoading: isLoadingInspectionCmiDataModal } = useQuery({
    queryKey: params.id ? ['inspection_cmi_data_modal', params.id] : ['inspection_cmi_data_modal'],
    queryFn: async () => {
      if (params.id && equipments_value === 'Inspeção CMI') {
        const cmiData = await fetchCmiData();
        const cmi = await fetchEquipmentCmiData(cmiData.cmi_idId);

        const respostas = await fetchResponseInspectionCmi();

        const cmiValues = cmi
          ? {
              Id: cmi.Id,
              site: cmi.site.Title,
              predio: cmi.predio.Title,
              conforme: cmi.conforme,
              cod_qrcode: cmi.cod_qrcode,
            }
          : null;

        return {
          ...cmiData,
          bombeiro: cmiData.bombeiro_id?.Title,
          extintor: cmiValues,
          respostas: respostas,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: mutateRemoveInspectionCmi, isLoading: IsLoadingMutateRemoveInspectionCmi } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        // Remove List: respostas_inspecao_cmi
        const itemResponse = await crud.getListItemsv2(
          'respostas_inspecao_cmi',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_inspecao_cmi', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
      }

      // Remove List: registros_teste_cmi
      await crud.deleteItemList('registros_inspecao_cmi', itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection_cmi_data', user_site] });
    },
  });

  const { mutateAsync: mutateEditInspectionCmi, isLoading: isLoadingMutateEditInspectionCmi } = useMutation({
    mutationFn: async (values: InspectionCmiDataModal) => {
      const idRecordTestCmi = values.Id;
      const idCmi = +values.cmi.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && inspectionCmiDataModal.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = inspectionCmiDataModal.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            hasAccording.push(item.resposta);

            if (item.resposta !== itemOriginal.resposta) {
              const postData = {
                resposta: item.resposta,
              };

              await crud.updateItemList('respostas_inspecao_cmi', item.Id, postData);
            }
          }
        }
      }

      const hasFalseAccording = hasAccording.some((item) => item === false);

      if (hasFalseAccording) {
        await crud.updateItemList('registros_inspecao_cmi', idRecordTestCmi, {
          conforme: false,
        });
        await crud.updateItemList('equipamentos_diversos', idCmi, {
          conforme: false,
        });
      }

      if (!hasFalseAccording) {
        await crud.updateItemList('registros_inspecao_cmi', idRecordTestCmi, {
          conforme: true,
        });
        await crud.updateItemList('equipamentos_diversos', idCmi, {
          conforme: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection_cmi_data_modal', params.id] });
      queryClient.invalidateQueries({ queryKey: ['inspection_cmi_data', user_site] });
    },
  });

  const fetchCmiInspectionAllRecords = async () => {
    const path = `?$Select=*,site/Title,bombeiro_id/Title&$expand=site,bombeiro_id&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;
    const response = await crud.getListItems('registros_inspecao_cmi', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const cmiResponse = await crud.getListItemsv2(
          'equipamentos_diversos',
          `?$Select=*,Id,predio/Title,conforme,cod_qrcode&$expand=predio&$Filter=(Id eq ${item.cmi_idId})`,
        );
        const cmi = cmiResponse.results[0] || null;

        return {
          ...item,
          bombeiro: item.bombeiro_id?.Title,
          cmi_id: cmi?.Id,
          predio: cmi?.predio.Title,
        };
      }),
    );

    return dataWithTransformations;
  };

  const handleExportInspectionCmiToExcel = async () => {
    setIsLoadingInspectionCmiExportToExcel(true);

    const data = await fetchCmiInspectionAllRecords();

    const columns = ['Id', 'bombeiro', 'cmi_id', 'predio', 'conforme'];

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
      XLSX.writeFile(wb, `Registros - Inspeção CMI.xlsx`);
    }

    setIsLoadingInspectionCmiExportToExcel(false);
  };

  return {
    inspection_cmi,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    inspectionCmiDataModal,
    isLoadingInspectionCmiDataModal,
    mutateRemoveInspectionCmi,
    IsLoadingMutateRemoveInspectionCmi,
    mutateEditInspectionCmi,
    isLoadingMutateEditInspectionCmi,

    isLoadingInspectionCmiExportToExcel,
    handleExportInspectionCmiToExcel,
  };
};

export default useInspectionCmi;
