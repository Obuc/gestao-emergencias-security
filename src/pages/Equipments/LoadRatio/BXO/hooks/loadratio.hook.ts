import * as XLSX from 'xlsx';
import { useState } from 'react';
import { parseISO } from 'date-fns';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { sharepointContext } from '@/context/sharepointContext';
import { LoadRatioFiltersProps, LoadRatioProps } from '../types/loadratio.types';

export const useLoadRatio = () => {
  const { crud } = sharepointContext();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = pathname.split('/')[3];

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Modified', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_equipments_loadratio_bxo');
  const sessionFiltersActionsJSON: LoadRatioFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    plate: sessionFiltersActionsJSON?.plate ? sessionFiltersActionsJSON.plate : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
  };

  const [tableFilters, setTableFilters] = useState<LoadRatioFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<LoadRatioFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      id: null,
      plate: null,
      conformity: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_equipments_loadratio_bxo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.id) count++;
    if (tableFilters.plate) count++;
    if (tableFilters.conformity) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_equipments_loadratio_bxo', JSON.stringify(tempTableFilters));
  };

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,cod_qrcode,site/Title,Modified,tipo_veiculo/Title,tipo_veiculo/url_path,placa,ultima_inspecao,conforme,excluido&$Top=25&${orderByQuery}&$expand=site,tipo_veiculo&$Orderby=Modified desc&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false') and (tipo_veiculo/url_path eq '${equipments_value}')`;

    if (tableFilters?.id) {
      path += ` and ( Id eq '${tableFilters?.id}')`;
    }

    if (tableFilters?.plate) {
      path += ` and ( substringof('${tableFilters?.plate}', placa ))`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
      path += ` and (conforme ne 'false')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
      path += ` and (conforme eq 'false')`;
    }

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

  const loadRatioData = useInfiniteQuery({
    queryKey: ['equipments_load_ratio_data_bxo', user_site, tableFilters, sortColumns, equipments_value],

    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled:
      (pathname.includes('/bxo/equipments/scania') ||
        pathname.includes('/bxo/equipments/s10') ||
        pathname.includes('/bxo/equipments/mercedes') ||
        pathname.includes('/bxo/equipments/van') ||
        pathname.includes('/bxo/equipments/iveco') ||
        pathname.includes('/bxo/equipments/sprinter')) &&
      user_site === 'BXO',
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('veiculos_emergencia', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments_load_ratio_data_bxo', user_site, tableFilters, sortColumns],
      });
    },
  });

  const fetchAllEquipments = async () => {
    const path = `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,tipo_veiculo/url_path,placa,ultima_inspecao,conforme,excluido&$expand=site,tipo_veiculo&$Filter=(site/Title eq 'BXO') and (excluido eq 'false') and (tipo_veiculo/url_path eq '${equipments_value}')`;

    const response = await crud.getListItems('veiculos_emergencia', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const ultimaInspecaoIsoDate = item?.ultima_inspecao && parseISO(item?.ultima_inspecao);

        const ultima_inspecao =
          ultimaInspecaoIsoDate &&
          new Date(ultimaInspecaoIsoDate.getTime() + ultimaInspecaoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...item,
          ultima_inspecao: ultima_inspecao,
          tipo_veiculo: item.tipo_veiculo?.Title,
          site: item.site?.Title,
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchAllEquipments();

      const columns: (keyof LoadRatioProps)[] = ['Id', 'tipo_veiculo', 'placa', 'site', 'cod_qrcode', 'ultima_inspecao'];

      const headerRow = columns.map((column) => column.toString());

      const dataFiltered = data?.map((item) => {
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

        XLSX.utils.book_append_sheet(wb, ws, equipments_value);
        XLSX.writeFile(wb, `Relação de Carga - ${equipments_value}.xlsx`);
      }
    },
  });

  return {
    loadRatioData,
    tempTableFilters,
    setTempTableFilters,
    handleRemoveAllFilters,
    countAppliedFilters,
    handleApplyFilters,
    sortColumns,
    setSortColumns,
    mutateRemove,
    mutateExportExcel,
  };
};
