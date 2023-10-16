import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  IEqGovernanceValve,
  IEqGovernanceValveFiltersProps,
  IEqGovernanceValveModal,
} from '../types/EquipmentsGovernanceValve';
import { sharepointContext } from '../../../context/sharepointContext';

const useEqGovernanceValve = (eqGovernancevalveFilters?: IEqGovernanceValveFiltersProps) => {
  const { crud } = sharepointContext();
  const params = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  let path = `?$Select=Id,cod_qrcode,cod_equipamento,Modified,excluido,tipo_equipamento/Title,conforme,site/Title,pavimento/Title,local/Title&$expand=site,tipo_equipamento,pavimento,local&$Orderby=Modified desc&$Top=100&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq 'Válvulas de Governo') and (excluido eq 'false')`;

  if (eqGovernancevalveFilters?.place) {
    for (let i = 0; i < eqGovernancevalveFilters.place.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (local/Title eq '${eqGovernancevalveFilters.place[i]}')`;
    }
  }

  if (eqGovernancevalveFilters?.pavement) {
    for (let i = 0; i < eqGovernancevalveFilters.pavement.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (pavimento/Title eq '${eqGovernancevalveFilters.pavement[i]}')`;
    }
  }

  if (eqGovernancevalveFilters?.conformity && eqGovernancevalveFilters?.conformity === 'Conforme') {
    path += ` and (conforme ne 'false')`;
  }

  if (eqGovernancevalveFilters?.conformity && eqGovernancevalveFilters?.conformity !== 'Conforme') {
    path += ` and (conforme eq 'false')`;
  }

  if (eqGovernancevalveFilters?.valveId) {
    path += ` and ( substringof('${eqGovernancevalveFilters?.valveId}', cod_equipamento ))`;
  }

  if (eqGovernancevalveFilters?.id) {
    path += ` and ( Id eq '${eqGovernancevalveFilters?.id}')`;
  }

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'equipamentos_diversos', path });
    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
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
    data: governanceValve,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      'governance_valve_data',
      user_site,
      params.form,
      eqGovernancevalveFilters?.place,
      eqGovernancevalveFilters?.pavement,
      eqGovernancevalveFilters?.conformity,
      eqGovernancevalveFilters?.valveId,
      eqGovernancevalveFilters?.id,
    ],
    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: params.form === 'valves' && location.pathname === '/equipments/valves',
  });

  const fetchEqGovernanceValveData = async () => {
    const pathModal = `?$Select=Id,cod_qrcode,site/Title,predio/Title,pavimento/Title,local/Title,tipo_equipamento/Title,cod_equipamento,conforme&$expand=site,predio,pavimento,local,tipo_equipamento&$Filter=((tipo_equipamento/Title eq 'Válvulas de Governo') and (Id eq ${params.id}) and (site/Title eq '${user_site}'))`;

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
  }: UseQueryResult<IEqGovernanceValveModal> = useQuery({
    queryKey:
      params.id && params.form === 'valves'
        ? ['eq_governance_valve_modal', params.id, params.form]
        : ['eq_governance_valve_modal'],
    queryFn: async () => {
      if (params.id && params.form === 'valves') {
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
    enabled: params.id !== undefined && params.form === 'valves',
  });

  const {
    data: eqGovernanceValve,
    isLoading: isLoadingEqGovernanceValve,
    isError: isErrorEqGovernanceValve,
  }: UseQueryResult<Array<IEqGovernanceValve>> = useQuery({
    queryKey: ['eq_governance_valve_data'],
    queryFn: async () => {
      const path = `?$Select=Id,cod_qrcode,site/Title,predio/Title,pavimento/Title,local/Title,tipo_equipamento/Title,excluido,cod_equipamento,conforme&$expand=site,predio,pavimento,local,tipo_equipamento&$Filter=((tipo_equipamento/Title eq 'Válvulas de Governo') and (site/Title eq '${user_site}') and (excluido eq false))`;

      const resp = await crud.getListItems('equipamentos_diversos', path);

      const dataWithTransformations = await Promise.all(
        resp.map(async (item: any) => {
          return {
            ...item,
            local: item.local?.Title,
            pavimento: item.pavimento?.Title,
            site: item.site?.Title,
            predio: item.predio?.Title,
          };
        }),
      );

      return dataWithTransformations;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.form === 'valves' && location.pathname === '/equipments/valves',
  });

  const { mutateAsync: mutateRemoveEqGovernanceValve, isLoading: isLoadingMutateRemoveEqGovernanceValve } = useMutation(
    {
      mutationFn: async (itemId: number) => {
        await crud.updateItemList('equipamentos_diversos', itemId, { excluido: true });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'governance_valve_data',
            user_site,
            params.form,
            eqGovernancevalveFilters?.place,
            eqGovernancevalveFilters?.pavement,
            eqGovernancevalveFilters?.conformity,
            eqGovernancevalveFilters?.valveId,
            eqGovernancevalveFilters?.id,
          ],
        });
      },
    },
  );

  const qrCodeValue = `Valvula;${eqEqGovernanceValveModal?.site};${eqEqGovernanceValveModal?.cod_qrcode}`;

  return {
    governanceValve,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,

    eqEqGovernanceValveModal,
    isLoadingEqEqGovernanceValveModal,

    mutateRemoveEqGovernanceValve,
    isLoadingMutateRemoveEqGovernanceValve,

    eqGovernanceValve,
    isLoadingEqGovernanceValve,
    isErrorEqGovernanceValve,

    qrCodeValue,
  };
};

export default useEqGovernanceValve;
