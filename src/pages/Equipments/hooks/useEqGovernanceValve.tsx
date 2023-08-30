import { useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import { EqGovernanceValveModal } from '../types/EquipmentsGovernanceValve';

const useEqGovernanceValve = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const path = `?$Select=Id,cod_qrcode,cod_equipamento,tipo_equipamento/Title,conforme,site/Title,pavimento/Title,local/Title&$expand=site,tipo_equipamento,pavimento,local&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq '${equipments_value}')`;
  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'equipamentos_diversos', path });
    const dataWithTransformations = await Promise.all(
      response.data.value.map(async (item: any) => {
        return {
          ...item,
          local: item.local?.Title,
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
    data: eqGovernanceValve,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['eq_governance_valve_data', user_site],
    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
  });

  const fetchEqGovernanceValveData = async () => {
    const pathModal = `?$Select=Id,cod_qrcode,site/Title,predio/Title,pavimento/Title,local/Title,tipo_equipamento/Title,cod_equipamento,conforme&$expand=site,predio,pavimento,local,tipo_equipamento&$Filter=((tipo_equipamento/Title eq '${equipments_value}') and (Id eq ${params.id}) and (site/Title eq '${user_site}'))`;

    const resp = await crud.getListItemsv2('equipamentos_diversos', pathModal);
    return resp.results[0];
  };

  const fechRecordsGovernanceValveData = async (governanceValveId: number) => {
    const resp = await crud.getListItemsv2(
      'registros_valvula_governo',
      `?$Select=Id,valvula_id/Id,bombeiro_id/Title,observacao,conforme,Created,data_legado&$expand=bombeiro_id,valvula_id&$Filter=(valvula_id/Id eq '${governanceValveId}')`,
    );
    return resp.results || null;
  };

  const {
    data: eqEqGovernanceValveModal,
    isLoading: isLoadingEqEqGovernanceValveModal,
  }: UseQueryResult<EqGovernanceValveModal> = useQuery({
    queryKey: params.id ? ['eq_governance_valve_modal', params.id] : ['eq_governance_valve_modal'],
    queryFn: async () => {
      if (params.id) {
        const eqGovernanceValveData = await fetchEqGovernanceValveData();

        const recordsGovernanceValveData =
          eqGovernanceValveData && (await fechRecordsGovernanceValveData(eqGovernanceValveData.Id));

        return {
          ...eqGovernanceValveData,
          local: eqGovernanceValveData.local.Title,
          pavimento: eqGovernanceValveData.pavimento.Title,
          predio: eqGovernanceValveData.predio.Title,
          site: eqGovernanceValveData.site.Title,
          history: recordsGovernanceValveData,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: mutateRemoveEqGovernanceValve, isLoading: isLoadingMutateRemoveEqGovernanceValve } = useMutation(
    {
      mutationFn: async (itemId: number) => {
        if (itemId) {
          await crud.deleteItemList('Extintores', itemId);
        }
      },
    },
  );

  return {
    eqGovernanceValve,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,

    eqEqGovernanceValveModal,
    isLoadingEqEqGovernanceValveModal,

    mutateRemoveEqGovernanceValve,
    isLoadingMutateRemoveEqGovernanceValve,
  };
};

export default useEqGovernanceValve;
