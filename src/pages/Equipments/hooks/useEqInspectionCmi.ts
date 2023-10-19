import * as XLSX from 'xlsx';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  IEqInspectionCmi,
  IEqInspectionCmiFiltersProps,
  IEqInspectionCmiModal,
} from '../types/EquipmentsInspectionCmi';
import { sharepointContext } from '../../../context/sharepointContext';

const useEqInspectionCmi = (eqCMIInspectionFilters?: IEqInspectionCmiFiltersProps) => {
  const { crud } = sharepointContext();
  const params = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  let path = `?$Select=Id,cod_qrcode,conforme,Modified,excluido,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,tipo_equipamento&$Orderby=Modified desc&$Top=25&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq 'Inspeção CMI') and (excluido eq 'false')`;

  if (eqCMIInspectionFilters?.conformity && eqCMIInspectionFilters?.conformity === 'Conforme') {
    path += ` and (conforme ne 'false')`;
  }

  if (eqCMIInspectionFilters?.conformity && eqCMIInspectionFilters?.conformity !== 'Conforme') {
    path += ` and (conforme eq 'false')`;
  }

  if (eqCMIInspectionFilters?.pavement) {
    for (let i = 0; i < eqCMIInspectionFilters.pavement.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (pavimento/Title eq '${eqCMIInspectionFilters.pavement[i]}')`;
    }
  }

  if (eqCMIInspectionFilters?.id) {
    path += ` and ( Id eq '${eqCMIInspectionFilters?.id}')`;
  }

  const fetchEqInspectionCmi = async ({ pageParam }: { pageParam?: string }) => {
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
      'equipments_data_inspection_cmi',
      user_site,
      params.form,
      eqCMIInspectionFilters?.conformity,
      eqCMIInspectionFilters?.pavement,
      eqCMIInspectionFilters?.id,
    ],
    queryFn: fetchEqInspectionCmi,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: params.form === 'cmi_inspection' && location.pathname === '/equipments/cmi_inspection',
  });

  const fetchEqCmiData = async () => {
    const path = `?$Select=Id,cod_qrcode,conforme,predio/Title,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,predio,tipo_equipamento&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq 'Inspeção CMI') and (excluido eq 'false')`;

    const resp = await crud.getListItemsv2('equipamentos_diversos', path);
    return resp.results[0];
  };

  const fechRecordsTestCmiData = async (cmiId: number) => {
    const resp = await crud.getListItemsv2(
      'registros_inspecao_cmi',
      `?$Select=Id,cmi_idId,cmi_id/Id,bombeiro_id/Title,observacao,conforme,Created&$expand=bombeiro_id,cmi_id&$Filter=(cmi_id/Id eq '${cmiId}')`,
    );
    return resp.results || null;
  };

  const {
    data: eqInspectionCmiModal,
    isLoading: isLoadingeEInspectionCmiModal,
  }: UseQueryResult<IEqInspectionCmiModal> = useQuery({
    queryKey:
      params.id && params.form === 'cmi_inspection'
        ? ['eq_inspection_cmi_data_modal', params.id, params.form]
        : ['eq_inspection_cmi_data_modal'],
    queryFn: async () => {
      if (params.id && params.form === 'cmi_inspection') {
        const eqInspectionCmiData = await fetchEqCmiData();
        const recordsTestCmi = eqInspectionCmiData && (await fechRecordsTestCmiData(eqInspectionCmiData.Id));

        return {
          ...eqInspectionCmiData,
          pavimento: eqInspectionCmiData.pavimento.Title,
          predio: eqInspectionCmiData.predio.Title,
          tipo_equipamento: eqInspectionCmiData.tipo_equipamento.Title,
          site: eqInspectionCmiData.site.Title,
          history: recordsTestCmi,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && params.form === 'cmi_inspection',
  });

  const { data: eqInspectionCmi, isLoading: isLoadingEqInspectionCmi }: UseQueryResult<Array<IEqInspectionCmi>> =
    useQuery({
      queryKey: ['eq_inspection_cmi_data', params.form],
      queryFn: async () => {
        const path = `?$Select=Id,cod_qrcode,conforme,predio/Title,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,predio,tipo_equipamento&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq 'Inspeção CMI') and (excluido eq 'false')`;

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
      enabled: params.form === 'cmi_inspection' && location.pathname === '/equipments/cmi_inspection',
    });

  const {
    mutateAsync: mutateRemoveEqInspectionCmi,
    isLoading: isLoadingMutateRemoveEqInspectionCmi,
    isError: isErrorEqInspectionCmi,
  } = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('equipamentos_diversos', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'equipments_data_inspection_cmi',
          user_site,
          params.form,
          eqCMIInspectionFilters?.conformity,
          eqCMIInspectionFilters?.pavement,
          eqCMIInspectionFilters?.id,
        ],
      });
    },
  });

  const qrCodeValue =
    eqInspectionCmiModal?.site === 'BXO'
      ? `InspecaoCMIBXO;${eqInspectionCmiModal?.site};${eqInspectionCmiModal?.cod_qrcode}`
      : `Casa;${eqInspectionCmiModal?.site};${eqInspectionCmiModal?.cod_qrcode}`;

  const handleExportEqInspectionCmiToExcel = () => {
    const columns: (keyof IEqInspectionCmi)[] = ['Id', 'cod_qrcode', 'predio', 'pavimento', 'conforme', 'site'];

    const headerRow = columns.map((column) => column.toString());

    const dataFiltered = eqInspectionCmi?.map((item) => {
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
      XLSX.writeFile(wb, `Equipamentos - Inspeção CMI.xlsx`);
    }
  };

  return {
    equipments,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveEqInspectionCmi,
    isLoadingMutateRemoveEqInspectionCmi,

    eqInspectionCmiModal,
    isLoadingeEInspectionCmiModal,

    eqInspectionCmi,
    isLoadingEqInspectionCmi,
    isErrorEqInspectionCmi,

    qrCodeValue,
    handleExportEqInspectionCmiToExcel,
  };
};

export default useEqInspectionCmi;
