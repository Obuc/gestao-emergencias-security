import * as XLSX from 'xlsx';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  IEqLoadRatio,
  IEqLoadRatioFiltersProps,
  IEqLoadRatioModal,
} from '../../types/EmergencyVehicles/EquipmentsLoadRatio';
import { sharepointContext } from '../../../../context/sharepointContext';

const useEqLoadRatio = (eqLoadRatioFilters?: IEqLoadRatioFiltersProps) => {
  const { crud } = sharepointContext();
  const params = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const isVehicleValue =
    params.form === 'scania' ||
    params.form === 's10' ||
    params.form === 'mercedes' ||
    params.form === 'van' ||
    params.form === 'iveco' ||
    params.form === 'sprinter';

  let path = `?$Select=Id,cod_qrcode,site/Title,Modified,tipo_veiculo/Title,placa,ultima_inspecao,conforme,excluido&$Top=25&$expand=site,tipo_veiculo&$Orderby=Modified desc&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false') and (tipo_veiculo/url_path eq '${params.form}')`;

  if (eqLoadRatioFilters?.conformity && eqLoadRatioFilters?.conformity === 'Conforme') {
    path += ` and (conforme ne 'false')`;
  }

  if (eqLoadRatioFilters?.conformity && eqLoadRatioFilters?.conformity !== 'Conforme') {
    path += ` and (conforme eq 'false')`;
  }

  if (eqLoadRatioFilters?.plate) {
    path += ` and ( substringof('${eqLoadRatioFilters?.plate}', placa ))`;
  }

  if (eqLoadRatioFilters?.id) {
    path += ` and ( Id eq '${eqLoadRatioFilters?.id}')`;
  }

  const fetchEqLoadRatio = async ({ pageParam }: { pageParam?: string }) => {
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
    data: eq_load_ratio,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      'eq_load_ratio_data',
      user_site,
      params.form,
      eqLoadRatioFilters?.conformity,
      eqLoadRatioFilters?.plate,
      eqLoadRatioFilters?.id,
    ],
    queryFn: fetchEqLoadRatio,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: isVehicleValue && location.pathname === `/equipments/${params.form}`,
  });

  const fetchEqLoadRatioData = async () => {
    if (params.id && isVehicleValue) {
      const path = `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme&$expand=site,tipo_veiculo&$Filter=(Id eq ${params.id})`;
      const resp = await crud.getListItemsv2('veiculos_emergencia', path);
      return resp.results[0];
    }
  };

  const fechRecordsLoadRatioData = async (vehicleId: number) => {
    if (params.id && isVehicleValue) {
      const resp = await crud.getListItemsv2(
        'registros_relacao_carga',
        `?$Select=Id,veiculo_idId,Created,site/Title,veiculo_id/Id,bombeiro/Title,conforme,observacao&$expand=site,veiculo_id,bombeiro&$Filter=(veiculo_id/Id eq '${vehicleId}')`,
      );
      return resp.results || null;
    }
  };

  const { data: eqLoadRatioModal, isLoading: isLoadingEqLoadRatioModal }: UseQueryResult<IEqLoadRatioModal> = useQuery({
    queryKey: ['eq_load_ratio_data_modal', params.id, params.form],
    queryFn: async () => {
      if (params.id && isVehicleValue) {
        const eqVehicle = await fetchEqLoadRatioData();
        const records = eqVehicle && (await fechRecordsLoadRatioData(eqVehicle.Id));

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
    enabled: params.id !== undefined && isVehicleValue,
  });

  const {
    data: eqVehiclesLoadRatio,
    isLoading: isLoadingVehiclesLoadRatio,
    isError: isErrorEqVehiclesLoadRatio,
  }: UseQueryResult<Array<IEqLoadRatio>> = useQuery({
    queryKey: ['eq_general_checklist', params.form],
    queryFn: async () => {
      const path = `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme,excluido&$expand=site,tipo_veiculo&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false') and (tipo_veiculo/url_path eq '${params.form}')`;

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
    enabled: isVehicleValue && location.pathname === `/equipments/${params.form}`,
  });

  const { mutateAsync: mutateRemoveEqLoadRatio, isLoading: isLoadingMutateRemoveEqLoadRatio } = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('veiculos_emergencia', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'eq_load_ratio_data',
          user_site,
          params.form,
          eqLoadRatioFilters?.conformity,
          eqLoadRatioFilters?.plate,
          eqLoadRatioFilters?.id,
        ],
      });
    },
  });

  const qrCodeValue = `RelacaoCarga;${eqLoadRatioModal?.site};${eqLoadRatioModal?.cod_qrcode};${eqLoadRatioModal?.tipo_veiculo}`;

  const handleExportEqLoadRatioToExcel = () => {
    const columns: (keyof IEqLoadRatio)[] = ['Id', 'tipo_veiculo', 'placa', 'site', 'cod_qrcode', 'ultima_inspecao'];

    const headerRow = columns.map((column) => column.toString());

    const dataFiltered = eqVehiclesLoadRatio?.map((item) => {
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
      XLSX.writeFile(wb, `Equipamentos - ${params.form}.xlsx`);
    }
  };

  return {
    eq_load_ratio,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,

    mutateRemoveEqLoadRatio,
    isLoadingMutateRemoveEqLoadRatio,

    eqLoadRatioModal,
    isLoadingEqLoadRatioModal,

    eqVehiclesLoadRatio,
    isLoadingVehiclesLoadRatio,
    isErrorEqVehiclesLoadRatio,

    qrCodeValue,
    handleExportEqLoadRatioToExcel,
  };
};

export default useEqLoadRatio;
