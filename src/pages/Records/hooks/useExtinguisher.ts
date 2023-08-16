import { useParams } from 'react-router-dom';
import { sharepointContext } from '../../../context/sharepointContext';
import { ExtinguisherDataModal } from '../types/ExtinguisherModalTypes';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Extinguisher {
  Area: string;
  AuthorId: number;
  Created: string;
  DataPesagem: string | null;
  DataVenc: string | null;
  EditorId: number;
  Id: number;
  Local: string;
  LocalEsp: string;
  Massa: string;
  Modified: string;
  Municipios: string;
  Novo: string;
  OData__x004c_tv1: boolean;
  OData__x004c_tv2: boolean;
  OData__x004d_an1: boolean;
  OData__x004d_an2: boolean;
  OData__x0043_ar1: boolean;
  OData__x0043_ar2: boolean;
  OData__x0043_il1: boolean;
  OData__x0043_il2: boolean;
  OData__x0043_il3: boolean;
  OData__x0053_in1: boolean;
  OData__x0053_in2: boolean;
  Observacao: string | null;
  Obst1: boolean;
  Obst2: boolean;
  Pavimento: string;
  Responsavel1: { Title: string };
  Responsavel1Id: number;
  Site: string;
  Status: string;
  Tipo: string;
  Title: string | null;
  UF: string;
  codExtintorId: string | null;
  codigo: string;
}

const useExtinguisher = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();

  const path = `?$Select=*,Responsavel1/Title,codExtintor/Title,codExtintor/codExtintor,codExtintor/validadeExtintor&$expand=Responsavel1,codExtintor&$top=50&$Orderby=Created desc`;

  const fetchExtinguisher = async ({ pageParam }: { pageParam?: string }) =>
    await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'Extintores', path });

  const {
    data: extinguisher,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['extinguisher_data'],
    queryFn: fetchExtinguisher,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,

    staleTime: 1000 * 60,
  });

  const { data: extinguisherModal, isLoading: isLoadingExtinguisherModal }: UseQueryResult<Extinguisher> = useQuery({
    queryKey: params.id ? ['extinguisher_data_modal', params.id] : ['extinguisher_data_modal'],
    queryFn: async () => {
      if (params.id) {
        const pathModal = `?$Select=*,Responsavel1/Title,codExtintor/Title,codExtintor/codExtintor,codExtintor/validadeExtintor&$expand=Responsavel1,AttachmentFiles,codExtintor&$filter=Id eq ${params.id}`;

        const resp = await crud.getListItemsv2('Extintores', pathModal);
        return resp.results[0];
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: mutateRemoveExtinguisher, isLoading: IsLoadingMutateRemoveExtinguisher } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        await crud.deleteItemList('Extintores', itemId);
      }
    },
  });

  const { mutateAsync: mutateEditExtinguisher, isLoading: IsLoadingMutateEditExtinguisher } = useMutation({
    mutationFn: async (values: ExtinguisherDataModal) => {
      if (values.ID && values) {
        await crud.updateItemList('Extintores', values.ID, values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extinguisher_data_modal', params.id] });
    },
  });

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
  };
};

export default useExtinguisher;
