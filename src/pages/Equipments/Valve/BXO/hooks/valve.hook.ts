import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { sharepointContext } from '@/context/sharepointContext';
import { ValveFiltersProps, ValveProps } from '../types/valve.types';

export const useValve = () => {
  const { crud } = sharepointContext();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Modified', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_equipments_valve_bxo');
  const sessionFiltersActionsJSON: ValveFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    pavement: sessionFiltersActionsJSON?.pavement ? sessionFiltersActionsJSON.pavement : null,
    place: sessionFiltersActionsJSON?.place ? sessionFiltersActionsJSON.place : [],
    valveId: sessionFiltersActionsJSON?.valveId ? sessionFiltersActionsJSON.valveId : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
    predio: sessionFiltersActionsJSON?.predio ? sessionFiltersActionsJSON.predio : null,
  };

  const [tableFilters, setTableFilters] = useState<ValveFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<ValveFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      id: null,
      pavement: null,
      place: [],
      valveId: null,
      conformity: null,
      predio: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_equipments_valve_bxo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.id) count++;
    if (tableFilters.pavement) count++;
    if (tableFilters.place.length > 0) count++;
    if (tableFilters.valveId) count++;
    if (tableFilters.conformity) count++;
    if (tableFilters.predio) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_equipments_valve_bxo', JSON.stringify(tempTableFilters));
  };

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,cod_qrcode,predio/Title,cod_equipamento,Modified,excluido,tipo_equipamento/Title,conforme,site/Title,pavimento/Title,local/Title&$expand=site,tipo_equipamento,pavimento,local,predio&$Orderby=Modified desc&$Top=25&${orderByQuery}&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq 'Válvulas de Governo') and (excluido eq 'false')`;

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

    if (tableFilters?.valveId) {
      path += ` and ( substringof('${tableFilters?.valveId}', cod_equipamento ))`;
    }

    if (tableFilters?.predio) {
      path += ` and ( substringof('${tableFilters?.predio}', predio/Title ))`;
    }

    if (tableFilters?.id) {
      path += ` and ( Id eq '${tableFilters?.id}')`;
    }

    if (tableFilters?.place) {
      for (let i = 0; i < tableFilters.place.length; i++) {
        path += `${i === 0 ? ' and' : ' or'} (local/Title eq '${tableFilters.place[i]}')`;
      }
    }

    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'equipamentos_diversos', path });
    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
          local: item.local?.Title,
          pavimento: item.pavimento?.Title,
          site: item.site?.Title,
          predio: item.predio?.Title,
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

  const valveData = useInfiniteQuery({
    queryKey: ['equipments_valve_data_bxo', user_site, tableFilters, sortColumns],
    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: user_site === 'BXO' && location.pathname.includes('/equipments/valve'),
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('equipamentos_diversos', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments_valve_data_bxo', user_site, tableFilters, sortColumns],
      });
    },
  });

  const fetchAllEquipments = async () => {
    let path = `?$Select=Id,cod_qrcode,predio/Title,cod_equipamento,Modified,excluido,tipo_equipamento/Title,conforme,site/Title,pavimento/Title,local/Title&$expand=site,tipo_equipamento,pavimento,local,predio&$Filter=((tipo_equipamento/Title eq 'Válvulas de Governo') and (site/Title eq 'BXO') and (excluido eq false))`;

    const response = await crud.getListItems('equipamentos_diversos', path);

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

      const columns: (keyof ValveProps)[] = ['Id', 'site', 'predio', 'pavimento', 'local', 'cod_equipamento', 'conforme'];

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
        XLSX.writeFile(wb, `Equipamentos - Valvula de Governo.xlsx`);
      }
    },
  });

  return {
    valveData,
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
