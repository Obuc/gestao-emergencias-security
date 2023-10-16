import * as XLSX from 'xlsx';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  IEqGeneralChecklist,
  IEqGeneralChecklistFiltersProps,
  IEqGeneralChecklistModal,
} from '../../types/EmergencyVehicles/EquipmentsGeneralChecklist';
import { sharepointContext } from '../../../../context/sharepointContext';

const useEqGeneralChecklist = (eqGeneralChecklistFilters?: IEqGeneralChecklistFiltersProps) => {
  const { crud } = sharepointContext();
  const params = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  let path = `?$Select=Id,cod_qrcode,Modified,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme_check_geral,excluido_check_geral&$Top=100&$expand=site,tipo_veiculo&$Orderby=Modified desc&$Filter=(site/Title eq '${user_site}') and (excluido_check_geral eq 'false')`;

  if (eqGeneralChecklistFilters?.conformity && eqGeneralChecklistFilters?.conformity === 'Conforme') {
    path += ` and (conforme ne 'false')`;
  }

  if (eqGeneralChecklistFilters?.conformity && eqGeneralChecklistFilters?.conformity !== 'Conforme') {
    path += ` and (conforme eq 'false')`;
  }

  if (eqGeneralChecklistFilters?.vehicleType) {
    for (let i = 0; i < eqGeneralChecklistFilters?.vehicleType.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (tipo_veiculo/Title eq '${eqGeneralChecklistFilters?.vehicleType[i]}')`;
    }
  }

  if (eqGeneralChecklistFilters?.plate) {
    path += ` and ( substringof('${eqGeneralChecklistFilters?.plate}', placa ))`;
  }

  if (eqGeneralChecklistFilters?.id) {
    path += ` and ( Id eq '${eqGeneralChecklistFilters?.id}')`;
  }

  const fetchEqGeneralChecklist = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'veiculos_emergencia', path });

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
          tipo_veiculo: item.tipo_veiculo?.Title,
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
    data: eq_general_checklist,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      'eq_general_checklist_data',
      user_site,
      params.form,
      eqGeneralChecklistFilters?.conformity,
      eqGeneralChecklistFilters?.vehicleType,
      eqGeneralChecklistFilters?.plate,
      eqGeneralChecklistFilters?.id,
    ],

    queryFn: fetchEqGeneralChecklist,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: params.form === 'general_checklist' && location.pathname === '/equipments/general_checklist',
  });

  const fetchEqGeneralChecklistData = async () => {
    const path = `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme_check_geral,excluido&$expand=site,tipo_veiculo&$Filter=(Id eq ${params.id})`;

    const resp = await crud.getListItemsv2('veiculos_emergencia', path);
    return resp.results[0];
  };

  const fechRecordsGeneralChecklistData = async (vehicleId: number) => {
    const resp = await crud.getListItemsv2(
      'registros_veiculos_emergencia',
      `?$Select=Id,veiculo_idId,Created,site/Title,veiculo_id/Id,bombeiro/Title,conforme,observacao&$expand=site,veiculo_id,bombeiro&$Filter=(veiculo_id/Id eq '${vehicleId}')`,
    );
    return resp.results || null;
  };

  const {
    data: eqGeneralChecklistModal,
    isLoading: isLoadingEqGeneralChecklistModal,
  }: UseQueryResult<IEqGeneralChecklistModal> = useQuery({
    queryKey:
      params.id && params.form === 'general_checklist'
        ? ['eq_general_checklist_data_modal', params.id, equipments_value]
        : ['eq_general_checklist_data_modal'],
    queryFn: async () => {
      if (params.id && params.form === 'general_checklist') {
        const eqVehicle = await fetchEqGeneralChecklistData();
        const records = eqVehicle && (await fechRecordsGeneralChecklistData(eqVehicle.Id));

        return {
          ...eqVehicle,
          tipo_veiculo: eqVehicle.tipo_veiculo?.Title,
          site: eqVehicle.site?.Title,
          history: records,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && params.form === 'general_checklist',
  });

  const {
    data: eqVehiclesGeneralChecklist,
    isLoading: isLoadingVehiclesGeneralChecklist,
    isError: isErrorEqVehiclesGeneralChecklist,
  }: UseQueryResult<Array<IEqGeneralChecklist>> = useQuery({
    queryKey: ['eq_general_checklist'],
    queryFn: async () => {
      const path = `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme_check_geral,excluido_check_geral&$expand=site,tipo_veiculo&$Filter=(site/Title eq '${user_site}') and (excluido_check_geral eq 'false')`;

      const resp = await crud.getListItems('veiculos_emergencia', path);

      const dataWithTransformations = await Promise.all(
        resp.map(async (item: any) => {
          return {
            ...item,
            tipo_veiculo: item.tipo_veiculo?.Title,
            site: item.site?.Title,
          };
        }),
      );

      return dataWithTransformations;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.form === 'general_checklist' && location.pathname === '/equipments/general_checklist',
  });

  const {
    mutateAsync: mutateRemoveEqGeneralChecklist,
    isLoading: isLoadingMutateRemoveEqGeneralChecklist,
    isError: isErrorMutateRemoveEqGeneralChecklist,
  } = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('veiculos_emergencia', itemId, { excluido_check_geral: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'eq_general_checklist_data',
          user_site,
          params.form,
          eqGeneralChecklistFilters?.conformity,
          eqGeneralChecklistFilters?.vehicleType,
          eqGeneralChecklistFilters?.plate,
          eqGeneralChecklistFilters?.id,
        ],
      });
    },
  });

  const qrCodeValue = `VeiculosCheckGeral;${eqGeneralChecklistModal?.site};${eqGeneralChecklistModal?.cod_qrcode}`;

  const handleExportEqGeneralChecklistToExcel = () => {
    const columns: (keyof IEqGeneralChecklist)[] = [
      'Id',
      'tipo_veiculo',
      'placa',
      'site',
      'cod_qrcode',
      'ultima_inspecao',
    ];

    const headerRow = columns.map((column) => column.toString());

    const dataFiltered = eqVehiclesGeneralChecklist?.map((item) => {
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
      XLSX.writeFile(wb, `Equipamentos - Checklist Geral.xlsx`);
    }
  };

  return {
    eq_general_checklist,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,

    mutateRemoveEqGeneralChecklist,
    isLoadingMutateRemoveEqGeneralChecklist,
    isErrorMutateRemoveEqGeneralChecklist,

    eqGeneralChecklistModal,
    isLoadingEqGeneralChecklistModal,

    eqVehiclesGeneralChecklist,
    isLoadingVehiclesGeneralChecklist,
    isErrorEqVehiclesGeneralChecklist,

    qrCodeValue,
    handleExportEqGeneralChecklistToExcel,
  };
};

export default useEqGeneralChecklist;
