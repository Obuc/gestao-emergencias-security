import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { format, getYear, parseISO } from 'date-fns';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { IHydrantsFiltersProps } from '../types/HydrantBXO';
import buildOrderByQuery from '../../../../../utils/buildOrderByQuery';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useHydrantBXO = () => {
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Created', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_hydrant_bxo');
  const sessionFiltersActionsJSON: IHydrantsFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    responsible: sessionFiltersActionsJSON?.responsible ? sessionFiltersActionsJSON.responsible : null,
    startDate: sessionFiltersActionsJSON?.startDate ? sessionFiltersActionsJSON.startDate : null,
    endDate: sessionFiltersActionsJSON?.endDate ? sessionFiltersActionsJSON.endDate : null,
    codHydrant: sessionFiltersActionsJSON?.codHydrant ? sessionFiltersActionsJSON.codHydrant : null,
    place: sessionFiltersActionsJSON?.place ? sessionFiltersActionsJSON.place : null,
    pavement: sessionFiltersActionsJSON?.pavement ? sessionFiltersActionsJSON.pavement : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
    recordId: sessionFiltersActionsJSON?.recordId ? sessionFiltersActionsJSON.recordId : null,
  };

  const [tableFilters, setTableFilters] = useState<IHydrantsFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<IHydrantsFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      responsible: null,
      startDate: null,
      endDate: null,
      codHydrant: null,
      place: null,
      pavement: null,
      conformity: null,
      recordId: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_hydrant_bxo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.responsible) count++;
    if (tableFilters.startDate) count++;
    if (tableFilters.endDate) count++;
    if (tableFilters.codHydrant) count++;
    if (tableFilters.place) count++;
    if (tableFilters.pavement) count++;
    if (tableFilters.conformity) count++;
    if (tableFilters.recordId) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_hydrant_bxo', JSON.stringify(tempTableFilters));
  };

  const fetchHydrants = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,local,pavimento,site/Title,hidrante_id/Id,hidrante_id/cod_hidrante,bombeiro/Title,conforme,observacao,Created&$expand=site,hidrante_id,bombeiro&$Top=25&${orderByQuery}&$Filter=(site/Title eq 'BXO')`;

    if (year) {
      const startDate = format(new Date(year, 0, 1), "yyyy-MM-dd'T'00:00:00'Z'");
      const endDate = format(new Date(year, 11, 31), "yyyy-MM-dd'T'23:59:59'Z'");

      path += `and (Created ge datetime'${startDate}') and (Created le datetime'${endDate}')`;
    }

    if (tableFilters?.place) {
      path += ` and ( substringof('${tableFilters.place.label}', local ))`;
    }

    if (tableFilters?.pavement) {
      path += ` and ( substringof('${tableFilters.pavement.label}', pavimento ))`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
      path += ` and (conforme ne 'false')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
      path += ` and (conforme eq 'false')`;
    }

    if (tableFilters?.codHydrant) {
      path += ` and (hidrante_id/cod_hidrante eq '${tableFilters.codHydrant}')`;
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

    if (tableFilters?.responsible) {
      path += ` and ( substringof('${tableFilters.responsible}', bombeiro/Title ))`;
    }

    if (tableFilters?.recordId) {
      path += ` and ( Id eq '${tableFilters.recordId}')`;
    }

    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'registros_hidrantes', path });

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const hidranteValues = {
          cod_hidrante: item?.hidrante_id?.cod_hidrante,
          pavimento: item?.pavimento,
          local: item?.local,
        };

        return {
          ...item,
          Created: dataCriado,
          bombeiro: item.bombeiro?.Title,
          hidrante: hidranteValues,
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
    queryKey: ['hydrants_data_bxo', user_site, tableFilters, sortColumns, year],
    queryFn: fetchHydrants,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: pathname.includes('/records/hydrants') && user_site === 'BXO',
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        const itemResponse = await crud.getListItemsv2(
          'respostas_hidrantes',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_hidrantes', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
        await crud.deleteItemList('registros_hidrantes', itemId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hydrants_data_bxo', user_site, tableFilters, sortColumns, year],
      });
    },
  });

  const fetchHydrantsAllRecords = async () => {
    const path = `?$Select=Id,site/Title,hidrante_id/Id,bombeiro/Title,conforme,observacao&$expand=site,hidrante_id,bombeiro&$Filter=(site/Title eq '${user_site}')`;
    const response = await crud.getListItems('registros_hidrantes', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const hydrantsResponse = await crud.getListItemsv2(
          'hidrantes',
          `?$Select=Id,cod_hidrante,predio/Title,possui_abrigo,ultima_inspecao,pavimento/Title,local/Title&$expand=predio,pavimento,local&$Filter=(Id eq '${item.hidrante_id.Id}')`,
        );

        const hidrante = hydrantsResponse.results[0] || null;

        return {
          ...item,
          bombeiro: item.bombeiro?.Title,
          hidrante_id: hidrante?.Id,
          predio: hidrante?.predio?.Title,
          pavimento: hidrante?.pavimento?.Title,
          local: hidrante?.local?.Title,
          possui_abrigo: hidrante?.possui_abrigo ? 'SIM' : 'NÃO',
          ultima_inspecao: hidrante?.ultima_inspecao ? format(new Date(hidrante?.ultima_inspecao), 'dd/MM/yyyy') : '',
          cod_hidrante: hidrante?.cod_hidrante,
          conforme: item?.conforme ? 'CONFORME' : 'NÃO CONFORME',
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchHydrantsAllRecords();

      const columns = [
        'Id',
        'bombeiro',
        'predio',
        'pavimento',
        'local',
        'cod_hidrante',
        'possui_abrigo',
        'ultima_inspecao',
        'conforme',
        'observacao',
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

        const wscols = [
          { wch: 10 },
          { wch: 30 },
          { wch: 15 },
          { wch: 15 },
          { wch: 30 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 30 },
        ];

        dataArray[0][0] = { t: 's', v: 'Texto com\nQuebra de Linha' };

        const firstRowHeight = 30;
        const wsrows = [{ hpx: firstRowHeight }];
        const filterRange = { ref: `A1:J1` };

        ws['!autofilter'] = filterRange;
        ws['!rows'] = wsrows;
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, 'Hidrantes');
        XLSX.writeFile(wb, `Registros BXO - Hidrantes.xlsx`);
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
    year,
    setYear,
  };
};

export default useHydrantBXO;
