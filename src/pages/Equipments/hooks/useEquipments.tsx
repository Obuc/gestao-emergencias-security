import { UseQueryResult, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { sharepointContext } from '../../../context/sharepointContext';
import { useParams } from 'react-router-dom';
import { EqExtinguisherModal, EquipmentsExtinguisher } from '../types/EquipmentsExtinguisher';

const useEquipments = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const user_site = localStorage.getItem('user_site');

  const path = `?$Select=Id,cod_qrcode,cod_extintor,conforme,site/Title,pavimento/Title,local/Title&$expand=site,pavimento,local&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;
  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'extintores', path });
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
    data: equipments,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['equipments_data', user_site],
    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
  });

  const fetchEqExtinguisherData = async () => {
    const pathModal = `?$Select=Id,cod_extintor,cod_qrcode,conforme,local/Title,massa/Title,pavimento/Title,predio/Title,site/Title,tipo_extintor/Title,validade,ultima_inspecao&$expand=local,massa,pavimento,predio,site,tipo_extintor&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('extintores', pathModal);
    return resp.results[0];
  };

  const fechRecordsExtinguisherData = async (extinguisherId: number) => {
    const resp = await crud.getListItemsv2(
      'registros_extintor',
      `?$Select=Id,extintor_idId,bombeiro_id/Title,data_pesagem,novo,observacao,status,conforme,Created&$expand=bombeiro_id&$Filter(extintor_idId eq ${extinguisherId})`,
    );
    return resp.results || null;
  };

  const { data: eqExtinguisherModal, isLoading: isLoadingEqExtinguisherModal }: UseQueryResult<EqExtinguisherModal> =
    useQuery({
      queryKey: params.id ? ['eq_extinguisher_data_modal', params.id] : ['eq_extinguisher_data_modal'],
      queryFn: async () => {
        if (params.id) {
          const eqExtinguisherData = await fetchEqExtinguisherData();

          const recordsExtinguisherData =
            eqExtinguisherData && (await fechRecordsExtinguisherData(eqExtinguisherData.Id));

          return {
            ...eqExtinguisherData,
            local: eqExtinguisherData.local.Title,
            massa: eqExtinguisherData.massa.Title,
            pavimento: eqExtinguisherData.pavimento.Title,
            predio: eqExtinguisherData.predio.Title,
            site: eqExtinguisherData.site.Title,
            tipo_extintor: eqExtinguisherData.tipo_extintor.Title,
            history: recordsExtinguisherData,
          };
        } else {
          return [];
        }
      },
      staleTime: 5000 * 60, // 5 Minute
      refetchOnWindowFocus: false,
    });

  const { data: eqExtinguisher, isLoading: isLoadingEqExtinguisher }: UseQueryResult<Array<EquipmentsExtinguisher>> =
    useQuery({
      queryKey: ['eq_extinguisher_data'],
      queryFn: async () => {
        const path = `?$Select=Id,cod_qrcode,predio/Title,pavimento/Title,local/Title,site/Title,cod_extintor,conforme&$expand=predio,site,pavimento,local&$Filter(site/Title eq '${user_site}')`;
        const resp = await crud.getListItems('extintores', path);

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
    });

  const { mutateAsync: mutateRemoveEquipment, isLoading: isLoadingMutateRemoveEquipment } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        await crud.deleteItemList('Extintores', itemId);
      }
    },
  });

  return {
    equipments,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveEquipment,
    isLoadingMutateRemoveEquipment,
    eqExtinguisherModal,
    isLoadingEqExtinguisherModal,
    eqExtinguisher,
    isLoadingEqExtinguisher,
  };
};

export default useEquipments;
