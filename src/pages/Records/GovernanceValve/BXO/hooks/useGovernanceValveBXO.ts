import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { format, getYear, parseISO } from 'date-fns';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '../../../../../utils/buildOrderByQuery';
import { IGovernanceValveFiltersProps } from '../types/GovernanceValveBXO';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useGovernanceValveBXO = () => {
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Created', direction: 'DESC' }]);
  // const [month, setMonth] = useState<{ value: string; label: string } | undefined>(
  //   months.find((option) => option.value === getMonth(new Date()).toString()),
  // );
  const sessionFiltersActions = sessionStorage.getItem('session_filters_governance_valve_bxo');
  const sessionFiltersActionsJSON: IGovernanceValveFiltersProps =
    sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    responsible: sessionFiltersActionsJSON?.responsible ? sessionFiltersActionsJSON.responsible : null,
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    valveNumber: sessionFiltersActionsJSON?.valveNumber ? sessionFiltersActionsJSON.valveNumber : null,
    property: sessionFiltersActionsJSON?.property ? sessionFiltersActionsJSON.property : null,
    startDate: sessionFiltersActionsJSON?.startDate ? sessionFiltersActionsJSON.startDate : null,
    endDate: sessionFiltersActionsJSON?.endDate ? sessionFiltersActionsJSON.endDate : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
  };

  const [tableFilters, setTableFilters] = useState<IGovernanceValveFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<IGovernanceValveFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      responsible: null,
      id: null,
      valveNumber: null,
      property: null,
      startDate: null,
      endDate: null,
      conformity: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_governance_valve_bxo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.responsible) count++;
    if (tableFilters.id) count++;
    if (tableFilters.valveNumber) count++;
    if (tableFilters.property) count++;
    if (tableFilters.startDate) count++;
    if (tableFilters.endDate) count++;
    if (tableFilters.conformity) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_governance_valve_bxo', JSON.stringify(tempTableFilters));
  };

  const fetchGovernanceValve = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,predio,Created,site/Title,valvula_id/cod_equipamento,valvula_id/Id,bombeiro_id/Title,conforme,observacao,data_legado&$expand=site,valvula_id,bombeiro_id&$Top=25&${orderByQuery}&$Filter=(site/Title eq 'BXO')`;

    if (year) {
      const startDate = format(new Date(year, 0, 1), "yyyy-MM-dd'T'00:00:00'Z'");
      const endDate = format(new Date(year, 11, 31), "yyyy-MM-dd'T'23:59:59'Z'");

      path += `and (Created ge datetime'${startDate}') and (Created le datetime'${endDate}')`;
    }

    // if (month?.value) {
    //   const startOfMonthDate = startOfMonth(new Date(year, +month.value));
    //   const endOfMonthDate = endOfMonth(new Date(year, +month.value));

    //   path += `(Created ge datetime'${format(
    //     startOfMonthDate,
    //     "yyyy-MM-dd'T'HH:mm:ssxxx",
    //   )}') and (Created le datetime'${format(endOfMonthDate, "yyyy-MM-dd'T'HH:mm:ssxxx")}')`;
    // }

    if (tableFilters?.responsible) {
      path += ` and ( substringof('${tableFilters.responsible}', bombeiro_id/Title ))`;
    }

    if (tableFilters?.id) {
      path += ` and (Id eq '${tableFilters.id}')`;
    }

    if (tableFilters?.valveNumber) {
      path += ` and ( valvula_id/cod_equipamento eq '${tableFilters.valveNumber}')`;
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

    if (tableFilters?.property) {
      path += ` and ( substringof('${tableFilters.property.label}', predio ))`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
      path += ` and (conforme ne 'false')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
      path += ` and (conforme eq 'false')`;
    }

    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'registros_valvula_governo', path });

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const valvulaValues = {
          predio: item?.predio,
          cod_equipamento: item?.valvula_id?.cod_equipamento,
        };

        return {
          ...item,
          Created: dataCriado,
          bombeiro: item.bombeiro_id.Title,
          valvula: valvulaValues,
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

  const governancevalve = useInfiniteQuery({
    queryKey: ['governance_valve_data_bxo', user_site, tableFilters, sortColumns, year],
    queryFn: fetchGovernanceValve,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: pathname.includes('/records/valves') && user_site === 'BXO',
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        const itemResponse = await crud.getListItemsv2(
          'respostas_valvula_governo',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_valvula_governo', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
        await crud.deleteItemList('registros_valvula_governo', itemId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['governance_valve_data_bxo', user_site, tableFilters, sortColumns, year],
      });
    },
  });

  const fetchHydrantsAllRecords = async () => {
    const path = `?$Select=Id,site/Title,valvula_id/Id,bombeiro_id/Title,conforme,observacao,data_legado&$expand=site,valvula_id,bombeiro_id&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;
    const response = await crud.getListItems('registros_valvula_governo', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const valvulaResponse = await crud.getListItemsv2(
          'equipamentos_diversos',
          `?$Select=Id,ultima_inspecao,predio/Title,pavimento/Title,local/Title,cod_equipamento&$expand=predio,pavimento,local&$Filter=((Id eq ${item.valvula_id.Id}) and (tipo_equipamento/Title eq 'Válvulas de Governo'))`,
        );

        const valvula = valvulaResponse.results[0] || null;

        return {
          ...item,
          bombeiro: item.bombeiro_id?.Title,
          predio: valvula.predio.Title,
          cod_equipamento: valvula.cod_equipamento,
          pavimento: valvula.pavimento.Title,
          local: valvula.local.Title,
          conforme: item.conforme ? 'CONFORME' : 'NÃO CONFORME',
          ultima_inspecao: valvula?.ultima_inspecao ? format(new Date(valvula?.ultima_inspecao), 'dd/MM/yyyy') : '',
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchHydrantsAllRecords();

      const columns = ['Id', 'bombeiro', 'predio', 'cod_equipamento', 'pavimento', 'local', 'conforme', 'ultima_inspecao'];

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
          { wch: 10 },
          { wch: 30 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 30 },
          { wch: 15 },
          { wch: 15 },
        ];

        dataArray[0][0] = { t: 's', v: 'Texto com\nQuebra de Linha' };

        const firstRowHeight = 30;
        const wsrows = [{ hpx: firstRowHeight }];
        const filterRange = { ref: `A1:H1` };

        ws['!autofilter'] = filterRange;
        ws['!rows'] = wsrows;
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, 'Valvulas de Governo');
        XLSX.writeFile(wb, `Registros BXO - Valvula de Governo.xlsx`);
      }
    },
  });

  return {
    governancevalve,
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

export default useGovernanceValveBXO;
