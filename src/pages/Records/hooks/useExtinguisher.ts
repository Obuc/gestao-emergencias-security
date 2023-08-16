import { UseInfiniteQueryResult, UseQueryResult, useInfiniteQuery } from '@tanstack/react-query';
import { sharepointContext } from '../../../context/sharepointContext';

interface Extinguisher {
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

  // const { data: extinguisher }: UseQueryResult<Array<Extinguisher>> = useQuery({
  //   queryKey: ['extinguisher_data'],
  //   queryFn: async () => {
  //     const path = `?$Select=*,Responsavel1/Title,codExtintor/Title,codExtintor/codExtintor,codExtintor/validadeExtintor&$expand=Responsavel1,codExtintor&$top=100&$Orderby=Created desc`;

  //     const resp = await crud.getListItemsv2('Extintores', path);

  //     return resp.results;
  //   },
  //   refetchOnWindowFocus: false,
  // });

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

  return {
    extinguisher,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  };
};

export default useExtinguisher;
