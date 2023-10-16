import * as XLSX from 'xlsx';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import { IEqTestCmi, IEqTestCmiFiltersProps, IEqTestCmiModal } from '../types/EquipmentsTestCmi';

const useEqTestCmi = (eqCMITestFilters?: IEqTestCmiFiltersProps) => {
  const { crud } = sharepointContext();
  const params = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  let path = `?$Select=Id,cod_qrcode,conforme,Modified,excluido,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,tipo_equipamento&$Orderby=Modified desc&$Top=100&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq 'Teste CMI') and (excluido eq 'false')`;

  if (eqCMITestFilters?.conformity && eqCMITestFilters?.conformity === 'Conforme') {
    path += ` and (conforme ne 'false')`;
  }

  if (eqCMITestFilters?.conformity && eqCMITestFilters?.conformity !== 'Conforme') {
    path += ` and (conforme eq 'false')`;
  }

  if (eqCMITestFilters?.pavement) {
    for (let i = 0; i < eqCMITestFilters.pavement.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (pavimento/Title eq '${eqCMITestFilters.pavement[i]}')`;
    }
  }

  if (eqCMITestFilters?.id) {
    path += ` and ( Id eq '${eqCMITestFilters?.id}')`;
  }

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
    queryKey: [
      'equipments_data_test_cmi',
      user_site,
      params.form,
      eqCMITestFilters?.conformity,
      eqCMITestFilters?.pavement,
      eqCMITestFilters?.id,
    ],
    queryFn: fetchEqTestCmi,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: params.form === 'cmi_test' && location.pathname === '/equipments/cmi_test',
  });

  const fetchEqCmiData = async () => {
    const path = `?$Select=Id,cod_qrcode,conforme,predio/Title,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,predio,tipo_equipamento&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq 'Teste CMI') and (excluido eq 'false')`;

    const resp = await crud.getListItemsv2('equipamentos_diversos', path);
    return resp.results[0];
  };

  const fechRecordsTestCmiData = async (cmiId: number) => {
    const resp = await crud.getListItemsv2(
      'registros_teste_cmi',
      `?$Select=Id,cmi_idId,cmi_id/Id,bombeiro_id/Title,observacao,conforme,Created&$expand=bombeiro_id,cmi_id&$Filter=(cmi_id/Id eq '${cmiId}')`,
    );
    return resp.results || null;
  };

  const { data: eqTestCmiModal, isLoading: isLoadingEqTestCmiModal }: UseQueryResult<IEqTestCmiModal> = useQuery({
    queryKey:
      params.id && params.form === 'cmi_test'
        ? ['eq_test_cmi_data_modal', params.id, params.form]
        : ['eq_test_cmi_data_modal'],
    queryFn: async () => {
      if (params.id && params.form === 'cmi_test') {
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
    enabled: params.id !== undefined && params.form === 'cmi_test',
  });

  const { data: eqTestCmi, isLoading: isLoadingEqTestCmi }: UseQueryResult<Array<IEqTestCmi>> = useQuery({
    queryKey: ['eq_test_cmi_data', equipments_value],
    queryFn: async () => {
      const path = `?$Select=Id,cod_qrcode,conforme,predio/Title,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,predio,tipo_equipamento&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq 'Teste CMI') and (excluido eq 'false')`;

      const resp = await crud.getListItems('equipamentos_diversos', path);

      const dataWithTransformations = await Promise.all(
        resp.map(async (item: any) => {
          return {
            ...item,
            pavimento: item.pavimento?.Title,
            site: item.site?.Title,
            predio: item.predio?.Title,
            tipo_equipamento: item.tipo_equipamento?.Title,
          };
        }),
      );

      return dataWithTransformations;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.form === 'cmi_test' && location.pathname === '/equipments/cmi_test',
  });

  const {
    mutateAsync: mutateRemoveEqTestCmi,
    isLoading: isLoadingMutateRemoveEqTestCmi,
    isError: isErrorEqTestCmi,
  } = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('equipamentos_diversos', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'equipments_data_test_cmi',
          user_site,
          params.form,
          eqCMITestFilters?.conformity,
          eqCMITestFilters?.pavement,
          eqCMITestFilters?.id,
        ],
      });
    },
  });

  const qrCodeValue =
    eqTestCmiModal?.site === 'BXO'
      ? `TesteCMIBXO;${eqTestCmiModal?.site};${eqTestCmiModal?.cod_qrcode}`
      : `Bomba;${eqTestCmiModal?.site};${eqTestCmiModal?.cod_qrcode}`;

  const handleExportEqTestCmiToExcel = () => {
    const columns: (keyof IEqTestCmi)[] = ['Id', 'cod_qrcode', 'predio', 'pavimento', 'conforme', 'site'];

    const headerRow = columns.map((column) => column.toString());

    const dataFiltered = eqTestCmi?.map((item) => {
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
      XLSX.writeFile(wb, `Equipamentos - Teste CMI.xlsx`);
    }
  };

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

    eqTestCmi,
    isLoadingEqTestCmi,
    isErrorEqTestCmi,

    qrCodeValue,
    handleExportEqTestCmiToExcel,
  };
};

export default useEqTestCmi;
