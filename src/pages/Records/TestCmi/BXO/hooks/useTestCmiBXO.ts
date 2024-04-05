import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { format, getYear, parseISO } from 'date-fns';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ITestCMIFiltersProps } from '../types/TestCmiBXO';
import buildOrderByQuery from '../../../../../utils/buildOrderByQuery';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useTestCmiBXO = () => {
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Created', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_test_cmi_bxo');
  const sessionFiltersActionsJSON: ITestCMIFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    responsible: sessionFiltersActionsJSON?.responsible ? sessionFiltersActionsJSON.responsible : null,
    startDate: sessionFiltersActionsJSON?.startDate ? sessionFiltersActionsJSON.startDate : null,
    endDate: sessionFiltersActionsJSON?.endDate ? sessionFiltersActionsJSON.endDate : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
    recordId: sessionFiltersActionsJSON?.recordId ? sessionFiltersActionsJSON.recordId : null,
  };

  const [tableFilters, setTableFilters] = useState<ITestCMIFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<ITestCMIFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      responsible: null,
      startDate: null,
      endDate: null,
      conformity: null,
      recordId: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_test_cmi_bxo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.responsible) count++;
    if (tableFilters.startDate) count++;
    if (tableFilters.endDate) count++;
    if (tableFilters.conformity) count++;
    if (tableFilters.recordId) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_test_cmi_bxo', JSON.stringify(tempTableFilters));
  };

  const fetch = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,cmi_idId,site/Title,bombeiro_id/Title,Created,conforme&$expand=site,bombeiro_id&$Top=25&${orderByQuery}&$Filter=(site/Title eq 'BXO')`;

    if (year) {
      const startDate = format(new Date(year, 0, 1), "yyyy-MM-dd'T'00:00:00'Z'");
      const endDate = format(new Date(year, 11, 31), "yyyy-MM-dd'T'23:59:59'Z'");

      path += `and (Created ge datetime'${startDate}') and (Created le datetime'${endDate}')`;
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

    if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
      path += ` and (conforme ne 'false')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
      path += ` and (conforme eq 'false')`;
    }

    if (tableFilters?.responsible) {
      path += ` and ( substringof('${tableFilters.responsible}', bombeiro_id/Title ))`;
    }

    if (tableFilters?.responsible) {
      path += ` and ( Id eq '${tableFilters?.recordId}')`;
    }

    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'registros_teste_cmi', path });

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...item,
          Created: dataCriado,
          bombeiro: item.bombeiro_id?.Title,
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

  const testCmi = useInfiniteQuery({
    queryKey: ['test_cmi_data_bxo', user_site, tableFilters, sortColumns, year],
    queryFn: fetch,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: pathname.includes('/records/cmi_test') && user_site === 'BXO',
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        const itemResponse = await crud.getListItemsv2(
          'respostas_teste_cmi',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_teste_cmi', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
      }
      await crud.deleteItemList('registros_teste_cmi', itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['test_cmi_data_bxo', user_site, tableFilters, sortColumns, year],
      });
    },
  });

  const fetchAllRecords = async () => {
    const path = `?$Select=Id,site/Title,cmi_idId,bombeiro_id/Title,conforme,observacao&$expand=site,bombeiro_id&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;
    const response = await crud.getListItems('registros_teste_cmi', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const cmiResponse = await crud.getListItemsv2(
          'equipamentos_diversos',
          `?$Select=Id,predio/Title,ultima_inspecao&$expand=predio&$Filter=(Id eq ${item.cmi_idId})`,
        );
        const cmi = cmiResponse.results[0] || null;

        return {
          ...item,
          bombeiro: item.bombeiro_id?.Title,
          predio: cmi?.predio.Title,
          conforme: item?.conforme ? 'CONFORME' : 'NÃO CONFORME',
          ultima_inspecao: cmi?.ultima_inspecao ? format(new Date(cmi?.ultima_inspecao), 'dd/MM/yyyy') : '',
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchAllRecords();

      const columns = ['Id', 'bombeiro', 'predio', 'ultima_inspecao', 'conforme', 'observacao'];

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

        const wscols = [{ wch: 10 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 30 }];

        dataArray[0][0] = { t: 's', v: 'Texto com\nQuebra de Linha' };

        const firstRowHeight = 30;
        const wsrows = [{ hpx: firstRowHeight }];
        const filterRange = { ref: `A1:F1` };

        ws['!autofilter'] = filterRange;
        ws['!rows'] = wsrows;
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, 'Testes CMI');
        XLSX.writeFile(wb, `Registros BXO - Teste CMI.xlsx`);
      }
    },
  });

  return {
    testCmi,
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

export default useTestCmiBXO;
