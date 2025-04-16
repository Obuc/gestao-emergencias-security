import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { format, getYear, parseISO } from 'date-fns';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { sharepointContext } from '@/context/sharepointContext';
import { IEyewashShowerFiltersProps } from '../types/eyewash-shower.types';

export const useEyewashShower = () => {
  const { pathname } = useLocation();
  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Created', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_eyewash_shower_spo');
  const sessionFiltersActionsJSON: IEyewashShowerFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    responsible: sessionFiltersActionsJSON?.responsible ? sessionFiltersActionsJSON.responsible : null,
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    startDate: sessionFiltersActionsJSON?.startDate ? sessionFiltersActionsJSON.startDate : null,
    endDate: sessionFiltersActionsJSON?.endDate ? sessionFiltersActionsJSON.endDate : null,
    place: sessionFiltersActionsJSON?.place ? sessionFiltersActionsJSON.place : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
  };

  const [tableFilters, setTableFilters] = useState<IEyewashShowerFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<IEyewashShowerFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      responsible: null,
      id: null,
      startDate: null,
      endDate: null,
      place: null,
      conformity: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_eyewash_shower_spo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.responsible) count++;
    if (tableFilters.id) count++;
    if (tableFilters.startDate) count++;
    if (tableFilters.endDate) count++;
    if (tableFilters.place) count++;
    if (tableFilters.conformity) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_eyewash_shower_spo', JSON.stringify(tempTableFilters));
  };

  const fetch = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,Created,Responsavel/Title,Local,Sin,Obs,Insp,Press,Agua&$Expand=Responsavel&$Top=25&${orderByQuery}&$Filter=(Id ge 0)`;

    if (year) {
      const startDate = format(new Date(year, 0, 1), "yyyy-MM-dd'T'00:00:00'Z'");
      const endDate = format(new Date(year, 11, 31), "yyyy-MM-dd'T'23:59:59'Z'");

      path += `and (Created ge datetime'${startDate}') and (Created le datetime'${endDate}')`;
    }

    if (tableFilters?.responsible) {
      path += ` and ( substringof('${tableFilters.responsible}', Responsavel/Title ))`;
    }

    if (tableFilters?.id) {
      path += ` and ( substringof('${tableFilters.id}', Id ))`;
    }

    if (tableFilters?.startDate || tableFilters?.endDate) {
      const startDate = tableFilters.startDate && new Date(tableFilters.startDate);
      startDate && startDate.setUTCHours(0, 0, 0, 0);

      const endDate = tableFilters.endDate && new Date(tableFilters.endDate);
      endDate && endDate.setUTCHours(23, 59, 59, 999);

      if (startDate) {
        path += ` and (Created ge datetime'${startDate.toISOString()}')`;
      }

      if (endDate) {
        path += ` and (Created le datetime'${endDate.toISOString()}')`;
      }
    }

    if (tableFilters?.place) {
      path += ` and ( substringof('${tableFilters.place}', Local ))`;
    }

    const response = await crudParent.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'Chuveiro Lava Olhos', path });

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...item,
          Created: dataCriado,
          Responsavel: item?.Responsavel?.Title,
          conforme: item.Sin && item.Obs && item.Insp && item.Press && item.Agua,
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

  const eyewashShower = useInfiniteQuery({
    queryKey: ['eyewash_shower_data_spo', user_site, tableFilters, sortColumns, year],
    queryFn: fetch,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: pathname.includes('/spo/records/eyewash_shower') && user_site === 'SPO',
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        await crudParent.deleteItemList('Chuveiro Lava Olhos', itemId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['eyewash_shower_data_spo', user_site, tableFilters, sortColumns, year],
      });
    },
  });

  const fetchAllRecords = async () => {
    const path = `?$Select=Id,Created,Responsavel/Title,Local,Sin,Obs,Insp,Press,Agua,Area&$Expand=Responsavel&$Orderby=Created desc`;

    const response = await crudParent.getListItems('Chuveiro Lava Olhos', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...item,
          Created: dataCriado,
          Responsavel: item?.Responsavel?.Title,
          conforme: item.Sin && item.Obs && item.Insp && item.Press && item.Agua ? 'CONFORME' : 'NÃO CONFORME',
          Area: item.Area,
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchAllRecords();
      const columns = ['Responsavel', 'Area', 'Local', 'Created', 'conforme'];

      const headerRow = ['Responsável', 'Prédio', 'Pavimento', 'Data da Inspeção', 'Resultado'];

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

        const wscols = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 15 }];
        const firstRowHeight = 30;
        const wsrows = [{ hpx: firstRowHeight }];
        const filterRange = { ref: `A1:E1` };

        ws['!autofilter'] = filterRange;
        ws['!rows'] = wsrows;
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, 'Chuveiro Lava-Olhos');
        XLSX.writeFile(wb, `SPO - Registros - Chuveiro Lava-Olhos.xlsx`);
      }
    },
  });

  return {
    eyewashShower,
    mutateRemove,
    tempTableFilters,
    setTempTableFilters,
    handleRemoveAllFilters,
    countAppliedFilters,
    handleApplyFilters,
    mutateExportExcel,
    sortColumns,
    setSortColumns,
    year,
    setYear,
  };
};
