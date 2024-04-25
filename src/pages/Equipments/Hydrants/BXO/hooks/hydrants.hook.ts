import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { sharepointContext } from '@/context/sharepointContext';
import { HydrantFiltersProps, HydrantProps } from '../types/hydrants.types';

export const useHydrant = () => {
  const { crud } = sharepointContext();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Modified', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_equipments_hydrant_bxo');
  const sessionFiltersActionsJSON: HydrantFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    pavement: sessionFiltersActionsJSON?.pavement ? sessionFiltersActionsJSON.pavement : null,
    place: sessionFiltersActionsJSON?.place ? sessionFiltersActionsJSON.place : [],
    hydrantId: sessionFiltersActionsJSON?.hydrantId ? sessionFiltersActionsJSON.hydrantId : null,
    hasShelter: sessionFiltersActionsJSON?.hasShelter ? sessionFiltersActionsJSON.hasShelter : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
  };

  const [tableFilters, setTableFilters] = useState<HydrantFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<HydrantFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      id: null,
      pavement: null,
      place: [],
      hydrantId: null,
      hasShelter: null,
      conformity: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_equipments_hydrant_bxo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.id) count++;
    if (tableFilters.pavement) count++;
    if (tableFilters.place.length > 0) count++;
    if (tableFilters.hydrantId) count++;
    if (tableFilters.hasShelter) count++;
    if (tableFilters.conformity) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_equipments_hydrant_bxo', JSON.stringify(tempTableFilters));
  };

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,site/Title,predio/Title,pavimento/Title,local/Title,cod_hidrante,possui_abrigo,conforme,excluido,Modified&$expand=site,predio,pavimento,local&$Orderby=Modified desc&$Top=25&${orderByQuery}&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false')`;

    if (tableFilters?.place) {
      for (let i = 0; i < tableFilters.place.length; i++) {
        path += `${i === 0 ? ' and' : ' or'} (local/Title eq '${tableFilters.place[i]}')`;
      }
    }

    if (tableFilters?.pavement?.value) {
      path += ` and (pavimento/Title eq '${tableFilters?.pavement?.label}')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
      path += ` and (conforme ne 'false')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
      path += ` and (conforme eq 'false')`;
    }

    if (tableFilters?.hydrantId) {
      path += ` and ( substringof('${tableFilters?.hydrantId}', cod_hidrante ))`;
    }

    if (tableFilters?.hasShelter && tableFilters?.hasShelter.value === 'Possui Abrigo: Sim') {
      path += ` and ( possui_abrigo ne 'false')`;
    }

    if (tableFilters?.hasShelter && tableFilters?.hasShelter.value === 'Possui Abrigo: Não') {
      path += ` and ( possui_abrigo eq 'false')`;
    }

    if (tableFilters?.id) {
      path += ` and ( Id eq '${tableFilters?.id}')`;
    }

    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'hidrantes', path });
    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
          site: item.site?.Title,
          predio: item.predio?.Title,
          pavimento: item.pavimento?.Title,
          local: item.local?.Title,
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

  const hydrantData = useInfiniteQuery({
    queryKey: ['equipments_hydrant_data_bxo', user_site, tableFilters, sortColumns],
    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: user_site === 'BXO' && location.pathname.includes('/equipments/hydrant'),
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('hidrantes', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments_hydrant_data_bxo', user_site, tableFilters, sortColumns],
      });
    },
  });

  const fetchAllEquipments = async () => {
    let path = `?$Select=Id,site/Title,predio/Title,pavimento/Title,local/Title,cod_hidrante,possui_abrigo,conforme,excluido,Modified&$expand=site,predio,pavimento,local&$Filter=(site/Title eq 'BXO')`;

    const response = await crud.getListItems('hidrantes', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        return {
          ...item,
          local: item.local?.Title,
          pavimento: item.pavimento?.Title,
          site: item.site?.Title,
          predio: item.predio?.Title,
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchAllEquipments();

      const columns: (keyof HydrantProps)[] = [
        'Id',
        'site',
        'pavimento',
        'local',
        'cod_hidrante',
        'possui_abrigo',
        'conforme',
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
        XLSX.writeFile(wb, `Equipamentos - Hidrantes.xlsx`);
      }
    },
  });

  return {
    hydrantData,
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
