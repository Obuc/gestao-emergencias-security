import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ResponstaTestCmi, TestCmiDataModal } from '../types/TestCMI';
import { sharepointContext } from '../../../context/sharepointContext';

const useTestCMI = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const path = `?$Select=*,site/Title,bombeiro_id/Title&$expand=site,bombeiro_id&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;
  const fetchTestCMI = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'registros_teste_cmi', path });

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
    data: test_cmi,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['test_cmi_data', user_site],
    queryFn: fetchTestCMI,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
  });

  //

  const fetchCmiData = async () => {
    const pathModal = `?$Select=*,bombeiro_id/Title&$expand=bombeiro_id&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_teste_cmi', pathModal);
    return resp.results[0];
  };

  const fetchEquipmentCmiData = async (cmiId: number) => {
    const cmiResponse = await crud.getListItemsv2(
      'equipamentos_diversos',
      `?$Select=Id,predio/Title,site/Title,conforme,cod_qrcode&$expand=predio,site&$Filter=(Id eq ${cmiId})`,
    );
    return cmiResponse.results[0] || null;
  };

  const fetchResponseTestCmi = async () => {
    const response = await crud.getListItemsv2(
      'respostas_teste_cmi',
      `?$Select=Id,cmi_idId,pergunta_idId,registro_idId,resposta,resposta_2,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
    );

    const respostasPorCategoria: Record<string, Array<ResponstaTestCmi>> = {};
    response.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const { data: testCmiDataModal, isLoading: isLoadingTestCmiDataModal } = useQuery({
    queryKey: params.id ? ['teste_cmi_data_modal', params.id] : ['teste_cmi_data_modal'],
    queryFn: async () => {
      if (params.id && equipments_value === 'Teste CMI') {
        const cmiData = await fetchCmiData();
        const cmi = await fetchEquipmentCmiData(cmiData.cmi_idId);

        const respostas = await fetchResponseTestCmi();

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

  const { mutateAsync: mutateRemoveTestCmi, isLoading: IsLoadingMutateRemoveTestCmi } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        // Remove List: respostas_teste_cmi
        const itemResponse = await crud.getListItemsv2(
          'respostas_teste_cmi',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_teste_cmi', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
      }

      // Remove List: registros_teste_cmi
      await crud.deleteItemList('registros_teste_cmi', itemId);
    },
  });

  const { mutateAsync: mutateEditTestCmi, isLoading: isLoadingMutateEditTestCmi } = useMutation({
    mutationFn: async (values: TestCmiDataModal) => {
      const idRecordTestCmi = values.Id;
      const idCmi = +values.cmi.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && testCmiDataModal.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = testCmiDataModal.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            if (item.resposta !== itemOriginal.resposta || item.resposta_2 !== itemOriginal.resposta_2) {
              hasAccording.push(item.resposta);

              const postData = {
                resposta: item.resposta,
                resposta_2: item.resposta_2,
              };

              await crud.updateItemList('respostas_teste_cmi', item.Id, postData);
            }
          }
        }
      }

      const hasFalseAccording = hasAccording.some((item) => item === false);

      if (hasFalseAccording) {
        await crud.updateItemList('registros_teste_cmi', idRecordTestCmi, {
          conforme: false,
        });
        await crud.updateItemList('equipamentos_diversos', idCmi, {
          conforme: false,
        });
      }

      if (!hasFalseAccording) {
        await crud.updateItemList('registros_teste_cmi', idRecordTestCmi, {
          conforme: true,
        });
        await crud.updateItemList('equipamentos_diversos', idCmi, {
          conforme: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teste_cmi_data_modal', params.id] });
      queryClient.invalidateQueries({ queryKey: ['test_cmi_data', user_site] });
    },
  });

  return {
    test_cmi,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    testCmiDataModal,
    isLoadingTestCmiDataModal,
    mutateRemoveTestCmi,
    IsLoadingMutateRemoveTestCmi,
    mutateEditTestCmi,
    isLoadingMutateEditTestCmi,
  };
};

export default useTestCMI;
