import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endOfMonth, endOfYear, format, getMonth, getYear, parseISO, startOfMonth, startOfYear } from 'date-fns';

import months from '../../../../../utils/month.mock';
import { IHydrantFiltersProps } from '../types/HydrantSPO';
import buildOrderByQuery from '../../../../../utils/buildOrderByQuery';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useHydrantSPO = () => {
  const { pathname } = useLocation();
  const { crud, crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Created', direction: 'DESC' }]);
  const [month, setMonth] = useState<{ value: string; label: string } | undefined>(
    months.find((option) => option.value === getMonth(new Date()).toString()),
  );
  const sessionFiltersActions = sessionStorage.getItem('session_filters_hydrant_spo');
  const sessionFiltersActionsJSON: IHydrantFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    responsible: sessionFiltersActionsJSON?.responsible ? sessionFiltersActionsJSON.responsible : null,
    hydrantId: sessionFiltersActionsJSON?.hydrantId ? sessionFiltersActionsJSON.hydrantId : null,
    startDate: sessionFiltersActionsJSON?.startDate ? sessionFiltersActionsJSON.startDate : null,
    endDate: sessionFiltersActionsJSON?.endDate ? sessionFiltersActionsJSON.endDate : null,
    seal: sessionFiltersActionsJSON?.seal ? sessionFiltersActionsJSON.seal : null,
    hoses: sessionFiltersActionsJSON?.hoses ? sessionFiltersActionsJSON.hoses : null,
    place: sessionFiltersActionsJSON?.place ? sessionFiltersActionsJSON.place : null,
    pavement: sessionFiltersActionsJSON?.pavement ? sessionFiltersActionsJSON.pavement : null,
    specificLocation: sessionFiltersActionsJSON?.specificLocation ? sessionFiltersActionsJSON.specificLocation : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
  };

  const [tableFilters, setTableFilters] = useState<IHydrantFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<IHydrantFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      responsible: null,
      hydrantId: null,
      startDate: null,
      endDate: null,
      seal: null,
      hoses: null,
      place: null,
      pavement: null,
      specificLocation: null,
      conformity: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_hydrant_spo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.responsible) count++;
    if (tableFilters.hydrantId) count++;
    if (tableFilters.startDate) count++;
    if (tableFilters.endDate) count++;
    if (tableFilters.seal) count++;
    if (tableFilters.hoses) count++;
    if (tableFilters.place) count++;
    if (tableFilters.pavement) count++;
    if (tableFilters.specificLocation) count++;
    if (tableFilters.conformity) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_hydrant_spo', JSON.stringify(tempTableFilters));
  };

  const fetchHydrant = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,Created,Responsavel1/Title,Title,CodLacre,CodMangueira,Local,Pavimento,LocalEsp,OData__x0048_id1,OData__x0048_id2,OData__x0041_bg1,OData__x0041_bg2,OData__x0053_nl1,OData__x0053_nl2,Obst1,Obst2,OData__x004c_cr1,OData__x004c_cr2,Insp1,Insp2&$Expand=Responsavel1&$Top=25&${orderByQuery}&$Filter=`;

    if (!month?.value) {
      const startDate = format(startOfYear(year), "yyyy-MM-dd'T'00:00:00'Z'");
      const endDate = format(endOfYear(year), "yyyy-MM-dd'T'23:59:59'Z'");

      path += `(Created ge ${startDate} and Created le ${endDate})`;
    }

    if (month?.value) {
      const startOfMonthDate = startOfMonth(new Date(year, +month.value));
      const endOfMonthDate = endOfMonth(new Date(year, +month.value));

      path += `(Created ge datetime'${format(
        startOfMonthDate,
        "yyyy-MM-dd'T'HH:mm:ssxxx",
      )}') and (Created le datetime'${format(endOfMonthDate, "yyyy-MM-dd'T'HH:mm:ssxxx")}')`;
    }

    if (tableFilters?.responsible) {
      path += ` and ( substringof('${tableFilters.responsible}', Responsavel1/Title ))`;
    }

    if (tableFilters?.hydrantId) {
      path += ` and ( substringof('${tableFilters.hydrantId}', Title ))`;
    }

    if (tableFilters?.seal) {
      path += ` and ( substringof('${tableFilters.seal}', CodLacre ))`;
    }

    if (tableFilters?.hoses) {
      path += ` and ( substringof('${tableFilters.hoses}', CodMangueira ))`;
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

    if (tableFilters?.pavement) {
      path += ` and ( substringof('${tableFilters.pavement}', Pavimento ))`;
    }

    if (tableFilters?.specificLocation) {
      path += ` and ( substringof('${tableFilters.specificLocation}', LocalEsp ))`;
    }

    // if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
    //   path += ` or ((OData__x004d_an1 eq true) and (OData__x004d_an2 eq true) and (OData__x0043_ar1 eq true) and (OData__x0043_ar2 eq true) and (OData__x0043_il2 eq true) and (OData__x0043_il1 eq true) and (OData__x0043_il3 eq true) and (OData__x0053_in1 eq true) and (OData__x0053_in2 eq true) and (OData__x004c_tv1 eq true) and (OData__x004c_tv2 eq true) and (Obst1 eq true) and (Obst2 eq true))`;
    // }

    // if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
    //   path += ` and (OData__x004d_an1 eq 'true') or (OData__x004d_an2 eq 'true') or (OData__x0043_ar1 eq 'true') or (OData__x0043_ar2 eq 'true') or (OData__x0043_il2 eq 'true') or (OData__x0043_il1 eq 'true') or (OData__x0043_il3 eq 'true') or (OData__x0053_in1 eq 'true') or (OData__x0053_in2 eq 'true') or (OData__x004c_tv1 eq 'true') or (OData__x004c_tv2 eq 'true') or (Obst1 eq 'true') or (Obst2 eq 'true'))`;
    // }

    const response = await crudParent.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'Hidrantes', path });

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...item,
          Created: dataCriado,
          Responsavel1: item?.Responsavel1?.Title,
          conforme:
            item.OData__x0048_id1 &&
            item.OData__x0048_id2 &&
            item.OData__x0041_bg1 &&
            item.OData__x0041_bg2 &&
            item.OData__x0053_nl1 &&
            item.OData__x0053_nl2 &&
            item.Obst1 &&
            item.Obst2 &&
            item.OData__x004c_cr1 &&
            item.OData__x004c_cr2 &&
            item.Insp1 &&
            item.Insp2,
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

  const hydrant = useInfiniteQuery({
    queryKey: ['hydrant_data_spo', user_site, tableFilters, sortColumns, year, month],
    queryFn: fetchHydrant,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: pathname.includes('/records/hydrants') && user_site === 'SPO',
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        await crud.deleteItemList('Hidrantes', itemId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hydrant_data_spo', user_site, tableFilters, sortColumns, year, month],
      });
    },
  });

  const fetchHydrantAllRecords = async () => {
    const path = `?$Select=Id,Created,Responsavel1/Title,Title,CodLacre,CodMangueira,Local,Pavimento,LocalEsp,OData__x0048_id1,OData__x0048_id2,OData__x0041_bg1,OData__x0041_bg2,OData__x0053_nl1,OData__x0053_nl2,Obst1,Obst2,OData__x004c_cr1,OData__x004c_cr2,Insp1,Insp2&$Expand=Responsavel1&$Orderby=Created desc`;

    const response = await crudParent.getListItems('Hidrantes', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...item,
          Created: dataCriado,
          Responsavel1: item?.Responsavel1?.Title,
          conforme:
            item.OData__x0048_id1 &&
            item.OData__x0048_id2 &&
            item.OData__x0041_bg1 &&
            item.OData__x0041_bg2 &&
            item.OData__x0053_nl1 &&
            item.OData__x0053_nl2 &&
            item.Obst1 &&
            item.Obst2 &&
            item.OData__x004c_cr1 &&
            item.OData__x004c_cr2 &&
            item.OData_Insp1
              ? 'CONFORME'
              : 'NÃO CONFORME',
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchHydrantAllRecords();

      const columns = ['Responsavel1', 'Title', 'CodLacre', 'CodMangueira', 'Local', 'Pavimento', 'LocalEsp', 'conforme'];

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

        const wscols = [
          { wch: 20 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 25 },
          { wch: 15 },
        ];

        dataArray[0][0] = { t: 's', v: 'Texto com\nQuebra de Linha' };

        const firstRowHeight = 30;
        const wsrows = [{ hpx: firstRowHeight }];
        const filterRange = { ref: `A1:H1` };

        ws['!autofilter'] = filterRange;
        ws['!rows'] = wsrows;
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, 'Hidrantes');
        XLSX.writeFile(wb, `SPO - Registros - Hidrantes.xlsx`);
      }
    },
  });

  return {
    hydrant,
    mutateRemove,
    tempTableFilters,
    setTempTableFilters,
    handleRemoveAllFilters,
    countAppliedFilters,
    handleApplyFilters,
    mutateExportExcel,
    sortColumns,
    setSortColumns,
    month,
    setMonth,
    year,
    setYear,
  };
};

export default useHydrantSPO;
