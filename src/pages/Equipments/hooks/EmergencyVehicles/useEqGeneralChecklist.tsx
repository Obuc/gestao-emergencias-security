import * as XLSX from 'xlsx';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  IEqGeneralChecklist,
  IEqGeneralChecklistModal,
} from '../../types/EmergencyVehicles/EquipmentsGeneralChecklist';
import { sharepointContext } from '../../../../context/sharepointContext';

const useEqGeneralChecklist = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const path = `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme_check_geral,excluido_check_geral&$Top=100&$expand=site,tipo_veiculo&$Filter=(site/Title eq '${user_site}') and (excluido_check_geral eq 'false')`;

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
    queryKey:
      equipments_value === 'Checklist Geral'
        ? ['eq_general_checklist_data', user_site, equipments_value]
        : ['eq_general_checklist_data', user_site],

    queryFn: fetchEqGeneralChecklist,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: equipments_value === 'Checklist Geral' && location.pathname === '/equipments',
  });

  const fetchEqGeneralChecklistData = async () => {
    if (params.id && equipments_value === 'Checklist Geral') {
      const path = `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme_check_geral,excluido&$expand=site,tipo_veiculo&$Filter=(Id eq ${params.id})`;

      const resp = await crud.getListItemsv2('veiculos_emergencia', path);
      return resp.results[0];
    }
  };

  const fechRecordsGeneralChecklistData = async (vehicleId: number) => {
    if (params.id && equipments_value === 'Checklist Geral') {
      const resp = await crud.getListItemsv2(
        'registros_veiculos_emergencia',
        `?$Select=Id,veiculo_idId,Created,site/Title,veiculo_id/Id,bombeiro/Title,conforme,observacao&$expand=site,veiculo_id,bombeiro&$Filter=(veiculo_id/Id eq '${vehicleId}')`,
      );
      return resp.results || null;
    }
  };

  const {
    data: eqGeneralChecklistModal,
    isLoading: isLoadingEqGeneralChecklistModal,
  }: UseQueryResult<IEqGeneralChecklistModal> = useQuery({
    queryKey:
      params.id && equipments_value === 'Checklist Geral'
        ? ['eq_general_checklist_data_modal', params.id, equipments_value]
        : ['eq_general_checklist_data_modal'],
    queryFn: async () => {
      if (params.id && equipments_value === 'Checklist Geral') {
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
    enabled: params.id !== undefined && equipments_value === 'Checklist Geral' && location.pathname === '/equipments',
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
    enabled: equipments_value === 'Checklist Geral' && location.pathname === '/equipments',
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
      queryClient.invalidateQueries({ queryKey: ['eq_general_checklist_data', user_site, equipments_value] });
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
