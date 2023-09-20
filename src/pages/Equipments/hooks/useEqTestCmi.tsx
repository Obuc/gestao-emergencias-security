import { useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { EqTestCmiModal } from '../types/EquipmentsTestCmi';
import { sharepointContext } from '../../../context/sharepointContext';

const useEqTestCmi = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const path = `?$Select=Id,cod_qrcode,conforme,excluido,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,tipo_equipamento&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq '${equipments_value}') and (excluido eq 'false')`;

  const fetchEqTestCmi = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'equipamentos_diversos', path });
    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
          pavimento: item.pavimento?.Title,
          site: item.site?.Title,
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
    data: equipments,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['equipments_data_test_cmi', user_site],
    queryFn: fetchEqTestCmi,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
  });

  const fetchEqCmiData = async () => {
    if (params.id && equipments_value === 'Teste CMI') {
      const path = `?$Select=Id,cod_qrcode,conforme,predio/Title,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,predio,tipo_equipamento&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq '${equipments_value}')`;

      const resp = await crud.getListItemsv2('equipamentos_diversos', path);
      return resp.results[0];
    }
  };

  const fechRecordsTestCmiData = async (cmiId: number) => {
    if (params.id && equipments_value === 'Teste CMI') {
      const resp = await crud.getListItemsv2(
        'registros_teste_cmi',
        `?$Select=Id,cmi_idId,cmi_id/Id,bombeiro_id/Title,observacao,conforme,Created&$expand=bombeiro_id,cmi_id&$Filter=(cmi_id/Id eq '${cmiId}')`,
      );
      return resp.results || null;
    }
  };

  const { data: eqTestCmiModal, isLoading: isLoadingEqTestCmiModal }: UseQueryResult<EqTestCmiModal> = useQuery({
    queryKey: params.id ? ['eq_test_cmi_data_modal', params.id] : ['eq_test_cmi_data_modal'],
    queryFn: async () => {
      if (params.id && equipments_value === 'Teste CMI') {
        const eqTestCmiData = await fetchEqCmiData();
        const recordsTestCmi = eqTestCmiData && (await fechRecordsTestCmiData(eqTestCmiData.Id));

        return {
          ...eqTestCmiData,
          pavimento: eqTestCmiData.pavimento.Title,
          predio: eqTestCmiData.predio.Title,
          tipo_equipamento: eqTestCmiData.tipo_equipamento.Title,
          site: eqTestCmiData.site.Title,
          history: recordsTestCmi,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  // const { data: eqExtinguisher, isLoading: isLoadingEqExtinguisher }: UseQueryResult<Array<EquipmentsTestCmi>> =
  //   useQuery({
  //     queryKey: ['eq_test_cmi_data'],
  //     queryFn: async () => {
  //       const path = `?$Select=Id,cod_qrcode,predio/Title,tipo_extintor/Title,pavimento/Title,local/Title,site/Title,cod_extintor,conforme&$expand=tipo_extintor,predio,site,pavimento,local&$Filter(site/Title eq '${user_site}')`;
  //       const resp = await crud.getListItems('extintores', path);

  //       const dataWithTransformations = await Promise.all(
  //         resp.map(async (item: any) => {
  //           return {
  //             ...item,
  //             local: item.local?.Title,
  //             pavimento: item.pavimento?.Title,
  //             site: item.site?.Title,
  //             predio: item.predio?.Title,
  //             tipo_extintor: item.tipo_extintor?.Title,
  //           };
  //         }),
  //       );

  //       return dataWithTransformations;
  //     },
  //     staleTime: 5000 * 60, // 5 Minute
  //     refetchOnWindowFocus: false,
  //   });

  const { mutateAsync: mutateRemoveEqTestCmi, isLoading: isLoadingMutateRemoveEqTestCmi } = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('equipamentos_diversos', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments_data_test_cmi', user_site] });
    },
  });

  return {
    equipments,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveEqTestCmi,
    isLoadingMutateRemoveEqTestCmi,

    eqTestCmiModal,
    isLoadingEqTestCmiModal,

    // eqExtinguisher,
    // isLoadingEqExtinguisher,
  };
};

export default useEqTestCmi;
