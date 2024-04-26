import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { DeaFiltersProps, DeaProps } from '../types/dea.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useDea = () => {
  const { crudParent } = sharepointContext();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Modified', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_equipments_dea_spo');
  const sessionFiltersActionsJSON: DeaFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    Id: sessionFiltersActionsJSON?.Id ? sessionFiltersActionsJSON.Id : null,
    numero_etiqueta: sessionFiltersActionsJSON?.numero_etiqueta ? sessionFiltersActionsJSON.numero_etiqueta : null,
    Predio: sessionFiltersActionsJSON?.Predio ? sessionFiltersActionsJSON.Predio : null,
    Codigo: sessionFiltersActionsJSON?.Codigo ? sessionFiltersActionsJSON.Codigo : null,
    LocEsp: sessionFiltersActionsJSON?.LocEsp ? sessionFiltersActionsJSON.LocEsp : null,
    Conforme: sessionFiltersActionsJSON?.Conforme ? sessionFiltersActionsJSON.Conforme : null,
  };

  const [tableFilters, setTableFilters] = useState<DeaFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<DeaFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      Id: null,
      numero_etiqueta: null,
      Predio: null,
      Codigo: null,
      LocEsp: null,
      Conforme: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_equipments_dea_spo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.Id) count++;
    if (tableFilters.numero_etiqueta) count++;
    if (tableFilters.Predio) count++;
    if (tableFilters.Codigo) count++;
    if (tableFilters.LocEsp) count++;
    if (tableFilters.Conforme) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_equipments_dea_spo', JSON.stringify(tempTableFilters));
  };

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,Modified,Predio,Codigo,LocEsp,Tipo,Title,Conforme,Excluido&$Top=25&${orderByQuery}&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'DEA')`;

    if (tableFilters?.Id) {
      path += ` and ( Id eq '${tableFilters?.Id}')`;
    }

    if (tableFilters?.numero_etiqueta) {
      path += ` and (substringof('${tableFilters?.numero_etiqueta}',Title))`;
    }

    if (tableFilters?.Predio) {
      path += ` and (substringof('${tableFilters?.Predio}',Predio))`;
    }

    if (tableFilters?.Codigo) {
      path += ` and (substringof('${tableFilters?.Codigo}',Codigo))`;
    }

    if (tableFilters?.LocEsp) {
      path += ` and (substringof('${tableFilters?.LocEsp}',LocEsp))`;
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

  const deaData = useInfiniteQuery({
    queryKey: ['equipments_dea_data_spo', user_site, tableFilters, sortColumns],
    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: user_site === 'SPO' && location.pathname.includes('/spo/equipments/dea'),
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      await crudParent.updateItemList('Diversos_Equipamentos', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments_ambulancecheck_data_spo', user_site, tableFilters, sortColumns],
      });
    },
  });

  const fetchAllEquipments = async () => {
    let path = `?$Select=Id,Modified,Predio,Codigo,LocEsp,Tipo,Title,Conforme,Excluido&$Filter=(Excluido eq 'false' or Excluido eq null) and (Tipo eq 'DEA')`;

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

      const columns: (keyof DeaProps)[] = ['Id', 'Predio', 'Codigo', 'LocEsp', 'Conforme', 'Title'];

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

        XLSX.utils.book_append_sheet(wb, ws, 'Desfibrilador Automático (DEA)');
        XLSX.writeFile(wb, `Equipamentos - Desfibrilador Automático (DEA).xlsx`);
      }
    },
  });

  return {
    deaData,
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
