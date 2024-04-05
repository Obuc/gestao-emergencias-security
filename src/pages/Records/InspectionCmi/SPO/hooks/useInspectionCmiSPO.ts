import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { format, getYear, parseISO } from 'date-fns';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '../../../../../utils/buildOrderByQuery';
import { IInspectionCmiFiltersProps } from '../types/InspectionCmiSPO';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useInspectionCmiSPO = () => {
  const { pathname } = useLocation();
  const { crud, crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Created', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_inspection_cmi_spo');
  const sessionFiltersActionsJSON: IInspectionCmiFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    responsible: sessionFiltersActionsJSON?.responsible ? sessionFiltersActionsJSON.responsible : null,
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    startDate: sessionFiltersActionsJSON?.startDate ? sessionFiltersActionsJSON.startDate : null,
    endDate: sessionFiltersActionsJSON?.endDate ? sessionFiltersActionsJSON.endDate : null,
    place: sessionFiltersActionsJSON?.place ? sessionFiltersActionsJSON.place : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
  };

  const [tableFilters, setTableFilters] = useState<IInspectionCmiFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<IInspectionCmiFiltersProps>(initialFiltersValues);

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
    sessionStorage.removeItem('session_filters_inspection_cmi_spo');
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
    sessionStorage.setItem('session_filters_inspection_cmi_spo', JSON.stringify(tempTableFilters));
  };

  const fetch = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,Created,Responsavel1/Title,Local,OData__x0050_e1,OData__x0050_e2,OData__x0050_e3,OData__x0050_e4,OData__x0050_e5,OData__x0052_es1,OData__x0052_es2,OData__x0052_es3,OData__x0052_es4,OData__x0052_es5,OData__x0052_es6,OData__x0052_es7,OData__x0042_i1,OData__x0042_i2,OData__x0042_i3,OData__x0042_i4,OData__x0042_i5,OData__x0042_i6,OData__x0044_iv1,OData__x0044_iv2,OData__x0044_iv3,OData__x0044_iv4,OData__x0044_iv5,OData__x0044_iv6,OData__x0047_er1,OData__x0047_er2,OData__x0047_er3,OData__x0047_er4,OData__x0043_b1,OData__x0043_b2,OData__x0043_b3,OData__x0043_b4,OData__x0043_b5&$Expand=Responsavel1&$Top=25&${orderByQuery}&$Filter=(Id ge 0)`;

    if (year) {
      const startDate = format(new Date(year, 0, 1), "yyyy-MM-dd'T'00:00:00'Z'");
      const endDate = format(new Date(year, 11, 31), "yyyy-MM-dd'T'23:59:59'Z'");

      path += `and (Created ge datetime'${startDate}') and (Created le datetime'${endDate}')`;
    }

    if (tableFilters?.responsible) {
      path += ` and ( substringof('${tableFilters.responsible}', Responsavel1/Title ))`;
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

    // if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
    //   path += ` or ((OData__x004d_an1 eq true) and (OData__x004d_an2 eq true) and (OData__x0043_ar1 eq true) and (OData__x0043_ar2 eq true) and (OData__x0043_il2 eq true) and (OData__x0043_il1 eq true) and (OData__x0043_il3 eq true) and (OData__x0053_in1 eq true) and (OData__x0053_in2 eq true) and (OData__x004c_tv1 eq true) and (OData__x004c_tv2 eq true) and (Obst1 eq true) and (Obst2 eq true))`;
    // }

    // if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
    //   path += ` and (OData__x004d_an1 eq 'true') or (OData__x004d_an2 eq 'true') or (OData__x0043_ar1 eq 'true') or (OData__x0043_ar2 eq 'true') or (OData__x0043_il2 eq 'true') or (OData__x0043_il1 eq 'true') or (OData__x0043_il3 eq 'true') or (OData__x0053_in1 eq 'true') or (OData__x0053_in2 eq 'true') or (OData__x004c_tv1 eq 'true') or (OData__x004c_tv2 eq 'true') or (Obst1 eq 'true') or (Obst2 eq 'true'))`;
    // }

    const response = await crudParent.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'Casa_de_Bombas', path });

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
            item.OData__x0050_e1 &&
            item.OData__x0050_e2 &&
            item.OData__x0050_e3 &&
            item.OData__x0050_e4 &&
            item.OData__x0050_e5 &&
            item.OData__x0052_es1 &&
            item.OData__x0052_es2 &&
            item.OData__x0052_es3 &&
            item.OData__x0052_es4 &&
            item.OData__x0052_es5 &&
            item.OData__x0052_es6 &&
            item.OData__x0052_es7 &&
            item.OData__x0042_i1 &&
            item.OData__x0042_i2 &&
            item.OData__x0042_i3 &&
            item.OData__x0042_i4 &&
            item.OData__x0042_i5 &&
            item.OData__x0042_i6 &&
            item.OData__x0044_iv1 &&
            item.OData__x0044_iv2 &&
            item.OData__x0044_iv3 &&
            item.OData__x0044_iv4 &&
            item.OData__x0044_iv5 &&
            item.OData__x0044_iv6 &&
            item.OData__x0047_er1 &&
            item.OData__x0047_er2 &&
            item.OData__x0047_er3 &&
            item.OData__x0047_er4 &&
            item.OData__x0043_b1 &&
            item.OData__x0043_b2 &&
            item.OData__x0043_b3 &&
            item.OData__x0043_b4 &&
            item.OData__x0043_b5,
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

  const cmiInspection = useInfiniteQuery({
    queryKey: ['cmi_inspection_data_spo', user_site, tableFilters, sortColumns, year],
    queryFn: fetch,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: pathname.includes('/records/cmi_inspection') && user_site === 'SPO',
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        await crud.deleteItemList('Casa_de_Bombas', itemId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cmi_inspection_data_spo', user_site, tableFilters, sortColumns, year],
      });
    },
  });

  const fetchAllRecords = async () => {
    const path = `?$Select=Id,Created,Responsavel1/Title,Local,OData__x0050_e1,OData__x0050_e2,OData__x0050_e3,OData__x0050_e4,OData__x0050_e5,OData__x0052_es1,OData__x0052_es2,OData__x0052_es3,OData__x0052_es4,OData__x0052_es5,OData__x0052_es6,OData__x0052_es7,OData__x0042_i1,OData__x0042_i2,OData__x0042_i3,OData__x0042_i4,OData__x0042_i5,OData__x0042_i6,OData__x0044_iv1,OData__x0044_iv2,OData__x0044_iv3,OData__x0044_iv4,OData__x0044_iv5,OData__x0044_iv6,OData__x0047_er1,OData__x0047_er2,OData__x0047_er3,OData__x0047_er4,OData__x0043_b1,OData__x0043_b2,OData__x0043_b3,OData__x0043_b4,OData__x0043_b5&$Expand=Responsavel1&$Orderby=Created desc`;

    const response = await crudParent.getListItems('Casa_de_Bombas', path);

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
            item.OData__x0050_e1 &&
            item.OData__x0050_e2 &&
            item.OData__x0050_e3 &&
            item.OData__x0050_e4 &&
            item.OData__x0050_e5 &&
            item.OData__x0052_es1 &&
            item.OData__x0052_es2 &&
            item.OData__x0052_es3 &&
            item.OData__x0052_es4 &&
            item.OData__x0052_es5 &&
            item.OData__x0052_es6 &&
            item.OData__x0052_es7 &&
            item.OData__x0042_i1 &&
            item.OData__x0042_i2 &&
            item.OData__x0042_i3 &&
            item.OData__x0042_i4 &&
            item.OData__x0042_i5 &&
            item.OData__x0042_i6 &&
            item.OData__x0044_iv1 &&
            item.OData__x0044_iv2 &&
            item.OData__x0044_iv3 &&
            item.OData__x0044_iv4 &&
            item.OData__x0044_iv5 &&
            item.OData__x0044_iv6 &&
            item.OData__x0047_er1 &&
            item.OData__x0047_er2 &&
            item.OData__x0047_er3 &&
            item.OData__x0047_er4 &&
            item.OData__x0043_b1 &&
            item.OData__x0043_b2 &&
            item.OData__x0043_b3 &&
            item.OData__x0043_b4 &&
            item.OData__x0043_b5
              ? 'CONFORME'
              : 'NÃO CONFORME',
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchAllRecords();

      const columns = ['Responsavel1', 'Id', 'Local', 'Created', 'conforme'];

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

        const wscols = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 }];

        dataArray[0][0] = { t: 's', v: 'Texto com\nQuebra de Linha' };

        const firstRowHeight = 30;
        const wsrows = [{ hpx: firstRowHeight }];
        const filterRange = { ref: `A1:E1` };

        ws['!autofilter'] = filterRange;
        ws['!rows'] = wsrows;
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, 'Inspeção CMI');
        XLSX.writeFile(wb, `SPO - Registros - Inspeção CMI.xlsx`);
      }
    },
  });

  return {
    cmiInspection,
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

export default useInspectionCmiSPO;
