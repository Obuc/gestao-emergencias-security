import * as XLSX from 'xlsx';
import { useState } from 'react';
import { parseISO } from 'date-fns';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { sharepointContext } from '@/context/sharepointContext';
import { GeneralChecklistFiltersProps, GeneralChecklistProps } from '../types/general-checklist.types';

export const useGeneralChecklist = () => {
  const { crud } = sharepointContext();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Modified', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_equipments_general_checklist_bxo');
  const sessionFiltersActionsJSON: GeneralChecklistFiltersProps =
    sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    vehicleType: sessionFiltersActionsJSON?.vehicleType ? sessionFiltersActionsJSON.vehicleType : null,
    plate: sessionFiltersActionsJSON?.plate ? sessionFiltersActionsJSON.plate : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
  };

  const [tableFilters, setTableFilters] = useState<GeneralChecklistFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<GeneralChecklistFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      id: null,
      vehicleType: null,
      plate: null,
      conformity: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_equipments_general_checklist_bxo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.id) count++;
    if (tableFilters.vehicleType) count++;
    if (tableFilters.plate) count++;
    if (tableFilters.conformity) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_equipments_general_checklist_bxo', JSON.stringify(tempTableFilters));
  };

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,cod_qrcode,Modified,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme_check_geral,excluido_check_geral&$Top=25&$expand=site,tipo_veiculo&$Orderby=Modified desc&${orderByQuery}&$Filter=(site/Title eq 'BXO') and (excluido_check_geral eq 'false')`;

    if (tableFilters?.id) {
      path += ` and ( Id eq '${tableFilters?.id}')`;
    }

    if (tableFilters?.vehicleType?.label) {
      path += ` and ( tipo_veiculo/Title eq '${tableFilters?.vehicleType?.label}')`;
    }

    if (tableFilters?.plate) {
      path += ` and (placa eq '${tableFilters?.plate}')`;
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

  const generalChecklistData = useInfiniteQuery({
    queryKey: ['equipments_general_checklist_data_bxo', user_site, tableFilters, sortColumns],
    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: user_site === 'BXO' && location.pathname.includes('/bxo/equipments/general_checklist'),
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('veiculos_emergencia', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments_general_checklist_data_bxo', user_site, tableFilters, sortColumns],
      });
    },
  });

  const fetchAllEquipments = async () => {
    let path = `?$Select=Id,cod_qrcode,Modified,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme_check_geral,excluido_check_geral&$Top=25&$expand=site,tipo_veiculo&$Filter=(site/Title eq 'BXO')`;

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

      const columns: (keyof GeneralChecklistProps)[] = [
        'Id',
        'tipo_veiculo',
        'placa',
        'site',
        'cod_qrcode',
        'ultima_inspecao',
      ];

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

        XLSX.utils.book_append_sheet(wb, ws, '');
        XLSX.writeFile(wb, `Equipamentos - Checklist Geral.xlsx`);
      }
    },
  });

  return {
    generalChecklistData,
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
