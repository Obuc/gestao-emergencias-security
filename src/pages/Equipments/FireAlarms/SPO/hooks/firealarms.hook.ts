import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { sharepointContext } from '@/context/sharepointContext';
import { FireAlarmsFiltersProps, FireAlarmsProps } from '../types/firealarms.types';

export const useFireAlarms = () => {
  const { crudParent } = sharepointContext();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Modified', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_equipments_firealarms_spo');
  const sessionFiltersActionsJSON: FireAlarmsFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    Id: sessionFiltersActionsJSON?.Id ? sessionFiltersActionsJSON.Id : null,
    Predio: sessionFiltersActionsJSON?.Predio ? sessionFiltersActionsJSON.Predio : null,
    numero_etiqueta: sessionFiltersActionsJSON?.numero_etiqueta ? sessionFiltersActionsJSON.numero_etiqueta : null,
    Conforme: sessionFiltersActionsJSON?.Conforme ? sessionFiltersActionsJSON.Conforme : null,
  };

  const [tableFilters, setTableFilters] = useState<FireAlarmsFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<FireAlarmsFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      Id: null,
      Predio: null,
      numero_etiqueta: null,
      Conforme: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_equipments_firealarms_spo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.Id) count++;
    if (tableFilters.Predio) count++;
    if (tableFilters.numero_etiqueta) count++;
    if (tableFilters.Conforme) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_equipments_firealarms_spo', JSON.stringify(tempTableFilters));
  };

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,Modified,Tipo,Predio,Title,Conforme,Excluido&$Top=25&${orderByQuery}&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'Alarme')`;

    if (tableFilters?.Id) {
      path += ` and ( Id eq '${tableFilters?.Id}')`;
    }

    if (tableFilters?.Predio) {
      path += ` and ( Predio eq '${tableFilters?.Predio}')`;
    }

    if (tableFilters?.numero_etiqueta) {
      path += ` and ( Title eq '${tableFilters?.numero_etiqueta}')`;
    }

    if (tableFilters?.Conforme?.value === 'Sim') {
      path += ` and ( Conforme eq 'Sim')`;
    }

    if (tableFilters?.Conforme?.value === 'Não') {
      path += ` and ( Conforme eq 'Não')`;
    }

    const response = await crudParent.getPaged(
      pageParam ? { nextUrl: pageParam } : { list: 'Diversos_Equipamentos', path },
    );

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
          Conforme: item.Conforme === 'Sim' || item.Conforme === null ? true : false,
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

  const fireAlarmsData = useInfiniteQuery({
    queryKey: ['equipments_firealarms_data_spo', user_site, tableFilters, sortColumns],
    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: user_site === 'SPO' && location.pathname.includes('/spo/equipments/fire_alarms'),
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      await crudParent.updateItemList('Diversos_Equipamentos', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments_firealarms_data_spo', user_site, tableFilters, sortColumns],
      });
    },
  });

  const fetchAllEquipments = async () => {
    let path = `?$Select=Id,Tipo,Predio,Title,Conforme,Excluido&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'Alarme')`;

    const response = await crudParent.getListItems('Diversos_Equipamentos', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        return {
          ...item,
          Conforme: item.Conforme === 'Sim' || item.Conforme === null ? 'Sim' : 'Não',
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchAllEquipments();

      const columns: (keyof FireAlarmsProps)[] = ['Id', 'Predio', 'Conforme', 'Title'];

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

        XLSX.utils.book_append_sheet(wb, ws, 'Alarmes de Incêndio');
        XLSX.writeFile(wb, `Equipamentos - Alarmes de Incêndio.xlsx`);
      }
    },
  });

  return {
    fireAlarmsData,
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
