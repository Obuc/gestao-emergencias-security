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

export const useExtinguisherSPO = () => {
  const { pathname } = useLocation();
  const { crud, crudParent } = sharepointContext();
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
    weighingDate: sessionFiltersActionsJSON?.weighingDate ? sessionFiltersActionsJSON.weighingDate : null,
    placeSPO: sessionFiltersActionsJSON?.placeSPO ? sessionFiltersActionsJSON.placeSPO : null,
    pavementSPO: sessionFiltersActionsJSON?.pavementSPO ? sessionFiltersActionsJSON.pavementSPO : null,
    specificLocationSPO: sessionFiltersActionsJSON?.specificLocationSPO
      ? sessionFiltersActionsJSON.specificLocationSPO
      : null,
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
      weighingDate: null,
      placeSPO: null,
      pavementSPO: null,
      specificLocationSPO: null,
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
    if (tableFilters.weighingDate) count++;
    if (tableFilters.placeSPO) count++;
    if (tableFilters.pavementSPO) count++;
    if (tableFilters.specificLocationSPO) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_extinguisher', JSON.stringify(tempTableFilters));
  };

  const fetchExtinguisher = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,Created,Responsavel1/Title,DataVenc,DataPesagem,Title,Local,Pavimento,LocalEsp,OData__x004d_an1,OData__x004d_an2,OData__x0043_ar1,OData__x0043_ar2,OData__x0043_il2,OData__x0043_il1,OData__x0043_il3,OData__x0053_in1,OData__x0053_in2,OData__x004c_tv1,OData__x004c_tv2,Obst1,Obst2&$Expand=Responsavel1&$Top=25&${orderByQuery}&$Filter=`;

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

    if (tableFilters?.expiration) {
      const expirationDate = tableFilters.expiration;
      const startDate = new Date(expirationDate);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(expirationDate);
      endDate.setUTCHours(23, 59, 59, 999);

      path += ` and (DataVenc ge datetime'${startDate.toISOString()}') and (DataVenc le datetime'${endDate.toISOString()}')`;
    }

    if (tableFilters?.weighingDate) {
      const weighingDate = tableFilters.weighingDate;
      const startDate = new Date(weighingDate);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(weighingDate);
      endDate.setUTCHours(23, 59, 59, 999);

      path += ` and (DataPesagem ge datetime'${startDate.toISOString()}') and (DataPesagem le datetime'${endDate.toISOString()}')`;
    }

    if (tableFilters?.extinguisherId) {
      path += ` and ( substringof('${tableFilters.extinguisherId}', Title ))`;
    }

    if (tableFilters?.placeSPO) {
      path += ` and ( substringof('${tableFilters.placeSPO}', Local ))`;
    }

    if (tableFilters?.pavementSPO) {
      path += ` and ( substringof('${tableFilters.pavementSPO}', Pavimento ))`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
      path += ` or ((OData__x004d_an1 eq true) and (OData__x004d_an2 eq true) and (OData__x0043_ar1 eq true) and (OData__x0043_ar2 eq true) and (OData__x0043_il2 eq true) and (OData__x0043_il1 eq true) and (OData__x0043_il3 eq true) and (OData__x0053_in1 eq true) and (OData__x0053_in2 eq true) and (OData__x004c_tv1 eq true) and (OData__x004c_tv2 eq true) and (Obst1 eq true) and (Obst2 eq true))`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
      path += ` and (OData__x004d_an1 eq 'true') or (OData__x004d_an2 eq 'true') or (OData__x0043_ar1 eq 'true') or (OData__x0043_ar2 eq 'true') or (OData__x0043_il2 eq 'true') or (OData__x0043_il1 eq 'true') or (OData__x0043_il3 eq 'true') or (OData__x0053_in1 eq 'true') or (OData__x0053_in2 eq 'true') or (OData__x004c_tv1 eq 'true') or (OData__x004c_tv2 eq 'true') or (Obst1 eq 'true') or (Obst2 eq 'true'))`;
    }

    const response = await crudParent.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'Extintores', path });

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);
        const dataVencIsoDate = item.DataVenc && parseISO(item.DataVenc);
        const dataPesagemIsoDate = item.DataPesagem && parseISO(item.DataPesagem);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const dataVenc =
          dataVencIsoDate && new Date(dataVencIsoDate.getTime() + dataVencIsoDate.getTimezoneOffset() * 60000);

        const dataPesagem =
          dataPesagemIsoDate && new Date(dataPesagemIsoDate.getTime() + dataPesagemIsoDate.getTimezoneOffset() * 60000);

        return {
          ...item,
          Created: dataCriado,
          DataVenc: dataVenc,
          DataPesagem: dataPesagem,
          Responsavel1: item?.Responsavel1?.Title,
          conforme:
            item.OData__x004d_an1 &&
            item.OData__x004d_an2 &&
            item.OData__x0043_ar1 &&
            item.OData__x0043_ar2 &&
            item.OData__x0043_il2 &&
            item.OData__x0043_il1 &&
            item.OData__x0043_il3 &&
            item.OData__x0053_in1 &&
            item.OData__x0053_in2 &&
            item.Obst1 &&
            item.Obst2 &&
            item.OData__x004c_tv1 &&
            item.OData__x004c_tv2,
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
    enabled: pathname.includes('/spo/records/extinguisher') && user_site === 'SPO',
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        await crud.deleteItemList('Extintores', itemId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['extinguisher_data', user_site, tableFilters, sortColumns, year, month],
      });
    },
  });

  const fetchExtinguisherAllRecords = async () => {
    const path = `?$Select=Id,codExtintor/peso_extintor,codExtintor/Tipo,Created,Responsavel1/Title,DataVenc,DataPesagem,Title,Local,Pavimento,LocalEsp,OData__x004d_an1,OData__x004d_an2,OData__x0043_ar1,OData__x0043_ar2,OData__x0043_il2,OData__x0043_il1,OData__x0043_il3,OData__x0053_in1,OData__x0053_in2,OData__x004c_tv1,OData__x004c_tv2,Obst1,Obst2&$Expand=Responsavel1,codExtintor&$Orderby=Created desc`;

    const response = await crudParent.getListItems('Extintores', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);
        const dataVencIsoDate = item.DataVenc && parseISO(item.DataVenc);
        const dataPesagemIsoDate = item.DataPesagem && parseISO(item.DataPesagem);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const dataVenc =
          dataVencIsoDate && new Date(dataVencIsoDate.getTime() + dataVencIsoDate.getTimezoneOffset() * 60000);

        const dataPesagem =
          dataPesagemIsoDate && new Date(dataPesagemIsoDate.getTime() + dataPesagemIsoDate.getTimezoneOffset() * 60000);

        return {
          ...item,
          Created: dataCriado,
          DataVenc: dataVenc,
          DataPesagem: dataPesagem,
          Responsavel1: item?.Responsavel1?.Title,
          Peso: item?.codExtintor?.peso_extintor,
          Tipo: item?.codExtintor?.Tipo,
          conforme:
            item.OData__x004d_an1 &&
            item.OData__x004d_an2 &&
            item.OData__x0043_ar1 &&
            item.OData__x0043_ar2 &&
            item.OData__x0043_il2 &&
            item.OData__x0043_il1 &&
            item.OData__x0043_il3 &&
            item.OData__x0053_in1 &&
            item.OData__x0053_in2 &&
            item.Obst1 &&
            item.Obst2 &&
            item.OData__x004c_tv1 &&
            item.OData__x004c_tv2
              ? 'CONFORME'
              : 'NÃO CONFORME',
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchExtinguisherAllRecords();

      const columns = [
        'Responsavel1',
        'Created',
        'DataVenc',
        'DataPesagem',
        'Title',
        'Local',
        'Pavimento',
        'LocalEsp',
        'Peso',
        'Tipo',
        'conforme',
      ];

      const columnHeaders = [
        'Responsável',
        'Data de Criação',
        'Data de Vencimento',
        'Data de Pesagem',
        'Código',
        'Prédio',
        'Pavimento',
        'Localização Específica',
        'Peso (kg)',
        'Tipo de Extintor',
        'Conforme',
      ];

      const headerRow = columnHeaders.map((header) => header.toString());

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
          { wch: 20 }, // Responsável
          { wch: 18 }, // Data de Criação
          { wch: 20 }, // Data de Vencimento
          { wch: 18 }, // Data de Pesagem
          { wch: 15 }, // Código
          { wch: 18 }, // Prédio
          { wch: 15 }, // Pavimento
          { wch: 30 }, // Localização Específica
          { wch: 12 }, // Peso (kg)
          { wch: 20 }, // Tipo de Extintor
          { wch: 15 }, // Conforme
        ];

        const firstRowHeight = 30;
        const wsrows = [{ hpx: firstRowHeight }];
        const filterRange = { ref: `A1:K1` };

        ws['!autofilter'] = filterRange;
        ws['!rows'] = wsrows;
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, 'Extintores');
        XLSX.writeFile(wb, `SPO - Registros - Extintores.xlsx`);
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
