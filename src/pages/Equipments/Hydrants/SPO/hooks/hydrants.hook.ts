import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { sharepointContext } from '@/context/sharepointContext';
import { HydrantsFiltersProps, HydrantsProps } from '../types/hydrants.types';

const useHydrant = () => {
  const { crudParent } = sharepointContext();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Modified', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_equipments_hydrants_spo');
  const sessionFiltersActionsJSON: HydrantsFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    numero_hidrante: sessionFiltersActionsJSON?.numero_hidrante ? sessionFiltersActionsJSON.numero_hidrante : null,
    predio: sessionFiltersActionsJSON?.predio ? sessionFiltersActionsJSON.predio : null,
    pavimento: sessionFiltersActionsJSON?.pavimento ? sessionFiltersActionsJSON.pavimento : null,
    local: sessionFiltersActionsJSON?.local ? sessionFiltersActionsJSON.local : null,
    conforme: sessionFiltersActionsJSON?.conforme ? sessionFiltersActionsJSON.conforme : null,
    cod_local: sessionFiltersActionsJSON?.cod_local ? sessionFiltersActionsJSON.cod_local : null,
  };

  const [tableFilters, setTableFilters] = useState<HydrantsFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<HydrantsFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      id: null,
      numero_hidrante: null,
      predio: null,
      pavimento: null,
      local: null,
      conforme: null,
      cod_local: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_equipments_hydrants_spo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.id) count++;
    if (tableFilters.numero_hidrante) count++;
    if (tableFilters.predio) count++;
    if (tableFilters.pavimento) count++;
    if (tableFilters.local) count++;
    if (tableFilters.conforme) count++;
    if (tableFilters.cod_local) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_equipments_hydrants_spo', JSON.stringify(tempTableFilters));
  };

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,Title,Modified,ultimaInsp,numero_hidrante,NumMangueiras,NumLacre,Predio,Pavimento,LocEsp,Conforme,Excluido&$Top=25&${orderByQuery}&$Filter=(Excluido eq 'Não' or Excluido eq null)`;

    if (tableFilters?.id) {
      path += ` and ( Id eq '${tableFilters?.id}')`;
    }

    if (tableFilters?.numero_hidrante) {
      path += ` and ( numero_hidrante eq '${tableFilters?.numero_hidrante}')`;
    }

    if (tableFilters?.predio) {
      path += ` and ( Predio eq '${tableFilters?.predio}')`;
    }

    if (tableFilters?.pavimento) {
      path += ` and ( Pavimento eq '${tableFilters?.pavimento}')`;
    }

    if (tableFilters?.local) {
      path += ` and ( LocEsp eq '${tableFilters?.local}')`;
    }

    if (tableFilters?.conforme?.value === 'Sim') {
      path += ` and ( Conforme eq 'Sim')`;
    }

    if (tableFilters?.conforme?.value === 'Não') {
      path += ` and ( Conforme eq 'Não')`;
    }

    if (tableFilters?.cod_local) {
      path += ` and ( Title eq '${tableFilters?.cod_local}')`;
    }

    const response = await crudParent.getPaged(
      pageParam ? { nextUrl: pageParam } : { list: 'Hidrantes_Equipamentos', path },
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

  const hydrantsData = useInfiniteQuery({
    queryKey: ['equipments_hydrants_data_spo', user_site, tableFilters, sortColumns],

    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: user_site === 'SPO' && location.pathname.includes('/equipments/hydrant'),
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      await crudParent.updateItemList('Hidrantes_Equipamentos', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments_hydrants_data_spo', user_site, tableFilters, sortColumns],
      });
    },
  });

  const fetchAllEquipments = async () => {
    let path = `?$Select=Id,Title,ultimaInsp,numero_hidrante,NumMangueiras,NumLacre,Predio,Pavimento,LocEsp,Conforme,Excluido&$Filter=(Excluido eq 'Não' or Excluido eq null)`;

    const response = await crudParent.getListItems('Hidrantes_Equipamentos', path);

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

      const columns: (keyof HydrantsProps)[] = [
        'Id',
        'numero_hidrante',
        'Predio',
        'Pavimento',
        'LocEsp',
        'Conforme',
        'Title',
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

        XLSX.utils.book_append_sheet(wb, ws, 'Hidrantes');
        XLSX.writeFile(wb, `Equipamentos - Hidrantes.xlsx`);
      }
    },
  });

  return {
    hydrantsData,
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

export default useHydrant;
