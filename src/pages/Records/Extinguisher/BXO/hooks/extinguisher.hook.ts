import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endOfMonth, endOfYear, format, getMonth, getYear, parseISO, startOfMonth, startOfYear } from 'date-fns';

import months from '@/utils/month.mock';
import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { sharepointContext } from '@/context/sharepointContext';
import { IExtinguisherFiltersProps } from '../types/extinguisher.types';

export const useExtinguisherBXO = () => {
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Created', direction: 'DESC' }]);
  const [month, setMonth] = useState<{ value: string; label: string } | undefined>(
    months.find((option) => option.value === getMonth(new Date()).toString()),
  );
  const sessionFiltersActions = sessionStorage.getItem('session_filters_extinguisher');
  const sessionFiltersActionsJSON: IExtinguisherFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    responsible: sessionFiltersActionsJSON?.responsible ? sessionFiltersActionsJSON.responsible : null,
    startDate: sessionFiltersActionsJSON?.startDate ? sessionFiltersActionsJSON.startDate : null,
    endDate: sessionFiltersActionsJSON?.endDate ? sessionFiltersActionsJSON.endDate : null,
    expiration: sessionFiltersActionsJSON?.expiration ? sessionFiltersActionsJSON.expiration : null,
    place: sessionFiltersActionsJSON?.place ? sessionFiltersActionsJSON.place : [],
    pavement: sessionFiltersActionsJSON?.pavement ? sessionFiltersActionsJSON.pavement : [],
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
    extinguisherId: sessionFiltersActionsJSON?.extinguisherId ? sessionFiltersActionsJSON.extinguisherId : null,
  };

  const [tableFilters, setTableFilters] = useState<IExtinguisherFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<IExtinguisherFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      responsible: null,
      startDate: null,
      endDate: null,
      expiration: null,
      place: [],
      pavement: [],
      conformity: null,
      extinguisherId: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_extinguisher');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.responsible) count++;
    if (tableFilters.startDate) count++;
    if (tableFilters.endDate) count++;
    if (tableFilters.expiration) count++;
    if (tableFilters.place.length > 0) count++;
    if (tableFilters.pavement.length > 0) count++;
    if (tableFilters.conformity) count++;
    if (tableFilters.extinguisherId) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_extinguisher', JSON.stringify(tempTableFilters));
  };

  const fetchExtinguisher = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,Created,conforme,local,data_pesagem,extintor_id/Id,extintor_id/validade,extintor_id/cod_extintor,pavimento,site/Title,bombeiro_id/Title&$expand=extintor_id,site,bombeiro_id&$Top=25&${orderByQuery}&$Filter=`;

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

    if (tableFilters?.place) {
      for (let i = 0; i < tableFilters.place.length; i++) {
        path += `${i === 0 ? ' and' : ' or'} (local eq '${tableFilters.place[i]}')`;
      }
    }

    if (tableFilters?.pavement) {
      for (let i = 0; i < tableFilters.pavement.length; i++) {
        path += `${i === 0 ? ' and' : ' or'} (pavimento eq '${tableFilters.pavement[i]}')`;
      }
    }

    if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
      path += ` and (conforme ne 'false')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
      path += ` and (conforme eq 'false')`;
    }

    if (tableFilters?.expiration) {
      const expirationDate = tableFilters.expiration;
      const startDate = new Date(expirationDate);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(expirationDate);
      endDate.setUTCHours(23, 59, 59, 999);

      path += ` and (extintor_id/validade ge datetime'${startDate.toISOString()}') and (extintor_id/validade le datetime'${endDate.toISOString()}')`;
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
      path += ` and ( substringof('${tableFilters.responsible}', bombeiro_id/Title ))`;
    }

    if (tableFilters?.extinguisherId) {
      path += ` and ( substringof('${tableFilters.extinguisherId}', extintor_id/cod_extintor ))`;
    }

    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'registros_extintor', path });

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        const extintorValidadeIsoDate = item?.extintor_id?.validade && parseISO(item?.extintor_id?.validade);
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);
        const dataPesagemIsoDate = item.data_pesagem && parseISO(item.data_pesagem);

        const extintorValidade =
          extintorValidadeIsoDate &&
          new Date(extintorValidadeIsoDate.getTime() + extintorValidadeIsoDate.getTimezoneOffset() * 60000);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const dataPesagem =
          dataPesagemIsoDate && new Date(dataPesagemIsoDate.getTime() + dataPesagemIsoDate.getTimezoneOffset() * 60000);

        const extintorValues = {
          Id: item?.extintor_id?.Id,
          pavimento: item?.pavimento,
          local: item?.local,
          cod_extintor: item?.extintor_id?.cod_extintor,
          validade: extintorValidade,
          conforme: item.conforme,
        };

        return {
          ...item,
          Created: dataCriado,
          data_pesagem: dataPesagem,
          bombeiro: item.bombeiro_id?.Title,
          extintor: extintorValues,
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

  const extinguisher = useInfiniteQuery({
    queryKey: ['extinguisher_data', user_site, tableFilters, sortColumns, year, month],
    queryFn: fetchExtinguisher,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: pathname.includes('/bxo/records/extinguisher') && user_site === 'BXO',
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        const itemResponse = await crud.getListItemsv2(
          'respostas_extintor',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_extintor', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
        await crud.deleteItemList('registros_extintor', itemId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['extinguisher_data', user_site, tableFilters],
      });
    },
  });

  const fetchExtinguisherAllRecords = async () => {
    const path = `?$Select=Id,local,extintor_idId,data_pesagem,observacao,novo,pavimento,conforme,bombeiro_id/Title,site/Title&$expand=site,bombeiro_id&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;

    const response = await crud.getListItems('registros_extintor', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const extintorResponse = await crud.getListItemsv2(
          'extintores',
          `?$Select=Id,predio/Title,tipo_extintor/Title,cod_extintor,validade,conforme,cod_qrcode&$expand=predio,tipo_extintor&$Filter=(Id eq ${item.extintor_idId})`,
        );

        const extintor = extintorResponse.results[0] || null;

        return {
          ...item,
          bombeiro: item.bombeiro_id?.Title,
          local: item?.local,
          pavimento: item?.pavimento,
          data_pesagem: item?.data_pesagem ? format(new Date(item?.data_pesagem), 'dd/MM/yyyy') : 'N/A',
          novo: item?.novo ? 'SIM' : 'NÃO',
          tipo_extintor: extintor?.tipo_extintor?.Title,
          cod_extintor: extintor?.cod_extintor,
          predio: extintor?.predio?.Title,
          conforme: item?.conforme ? 'CONFORME' : 'NÃO CONFORME',
          validade: extintor?.validade ? format(new Date(extintor?.validade), 'dd/MM/yyyy') : '',
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchExtinguisherAllRecords();

      const columns = [
        'Id',
        'bombeiro',
        'local',
        'pavimento',
        'data_pesagem',
        'novo',
        'tipo_extintor',
        'cod_extintor',
        'predio',
        'validade',
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
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
        ];

        dataArray[0][0] = { t: 's', v: 'Texto com\nQuebra de Linha' };

        const firstRowHeight = 30;
        const wsrows = [{ hpx: firstRowHeight }];
        const filterRange = { ref: `A1:L1` };

        ws['!autofilter'] = filterRange;
        ws['!rows'] = wsrows;
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, 'Extintores');
        XLSX.writeFile(wb, `Registros - Extintores.xlsx`);
      }
    },
  });

  return {
    extinguisher,
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
