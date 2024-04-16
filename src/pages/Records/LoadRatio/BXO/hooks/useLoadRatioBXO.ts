import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { format, getYear, parseISO } from 'date-fns';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ILoadRatioFiltersProps } from '../types/LoadRatioBXO';
import buildOrderByQuery from '../../../../../utils/buildOrderByQuery';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useLoadRatioBXO = () => {
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = pathname.split('/')[2];

  const [year, setYear] = useState(getYear(new Date()));
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Created', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_load_ratio_bxo');
  const sessionFiltersActionsJSON: ILoadRatioFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    recordId: sessionFiltersActionsJSON?.recordId ? sessionFiltersActionsJSON.recordId : null,
    plate: sessionFiltersActionsJSON?.plate ? sessionFiltersActionsJSON.plate : null,
    responsible: sessionFiltersActionsJSON?.responsible ? sessionFiltersActionsJSON.responsible : null,
    startDate: sessionFiltersActionsJSON?.startDate ? sessionFiltersActionsJSON.startDate : null,
    endDate: sessionFiltersActionsJSON?.endDate ? sessionFiltersActionsJSON.endDate : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
  };

  const [tableFilters, setTableFilters] = useState<ILoadRatioFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<ILoadRatioFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      recordId: null,
      plate: null,
      responsible: null,
      startDate: null,
      endDate: null,
      conformity: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_load_ratio_bxo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.recordId) count++;
    if (tableFilters.plate) count++;
    if (tableFilters.responsible) count++;
    if (tableFilters.startDate) count++;
    if (tableFilters.endDate) count++;
    if (tableFilters.conformity) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_load_ratio_bxo', JSON.stringify(tempTableFilters));
  };

  let caseEquipmentsValue: string;

  switch (equipments_value) {
    case 'scania':
      caseEquipmentsValue = 'Scania';
      break;

    case 's10':
      caseEquipmentsValue = 'S10';
      break;

    case 'mercedes':
      caseEquipmentsValue = 'Mercedes';
      break;

    case 'van':
      caseEquipmentsValue = 'Furgão';
      break;

    case 'iveco':
      caseEquipmentsValue = 'Ambulância Iveco';
      break;

    case 'sprinter':
      caseEquipmentsValue = 'Ambulância Sprinter';
      break;
  }

  const fetch = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,Created,site/Title,bombeiro/Title,tipo_veiculo/Title,tipo_veiculo/url_path,conforme,veiculo_id/placa&$expand=site,bombeiro,tipo_veiculo,veiculo_id&$Top=25&${orderByQuery}&$Filter=(site/Title eq '${user_site}') and (tipo_veiculo/url_path eq '${equipments_value}')`;

    if (year) {
      const startDate = format(new Date(year, 0, 1), "yyyy-MM-dd'T'00:00:00'Z'");
      const endDate = format(new Date(year, 11, 31), "yyyy-MM-dd'T'23:59:59'Z'");

      path += `and (Created ge datetime'${startDate}') and (Created le datetime'${endDate}')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
      path += ` and (conforme ne 'false')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
      path += ` and (conforme eq 'false')`;
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

    if (tableFilters?.plate) {
      path += ` and ( substringof('${tableFilters.plate}', veiculo_id/placa ))`;
    }

    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'registros_relacao_carga', path });

    const dataWithTransformations = await Promise.all(
      response.data.value.map(async (item: any) => {
        const vehicleValues = {
          placa: item?.veiculo_id?.placa,
          tipo_veiculo: item?.tipo_veiculo?.Title,
        };

        const createdIsoDate = parseISO(item?.Created);

        return {
          ...item,
          Created: new Date(createdIsoDate.getTime() + createdIsoDate.getTimezoneOffset() * 60000),
          bombeiro: item?.bombeiro?.Title,
          veiculo: vehicleValues,
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

  const loadRatio = useInfiniteQuery({
    queryKey: ['load_ratio_data_bxo', user_site, tableFilters, sortColumns, year, equipments_value],
    queryFn: fetch,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled:
      (pathname.includes('/records/scania') ||
        pathname.includes('/records/s10') ||
        pathname.includes('/records/mercedes') ||
        pathname.includes('/records/van') ||
        pathname.includes('/records/iveco') ||
        pathname.includes('/records/sprinter')) &&
      user_site === 'BXO',
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        const itemResponse = await crud.getListItemsv2(
          'respostas_relacao_carga',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_relacao_carga', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
      }
      await crud.deleteItemList('registros_relacao_carga', itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['load_ratio_data_bxo', user_site, tableFilters, sortColumns, year, equipments_value],
      });
    },
  });

  const fetchAllRecords = async () => {
    const path = `?$Select=Id,veiculo_idId,site/Title,bombeiro/Title,tipo_veiculo/Title,conforme,observacao&$expand=site,bombeiro,tipo_veiculo&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_veiculo/Title eq '${caseEquipmentsValue}')`;

    const response = await crud.getListItems('registros_relacao_carga', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const vehicleResponse = await crud.getListItemsv2(
          'veiculos_emergencia',
          `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,ultima_inspecao&$expand=site,tipo_veiculo&$Filter=(Id eq ${item.veiculo_idId})`,
        );

        const vehicle = vehicleResponse.results[0] || null;

        return {
          ...item,
          bombeiro: item?.bombeiro?.Title,
          placa: vehicle?.placa,
          site: vehicle?.site?.Title,
          tipo_veiculo: vehicle?.tipo_veiculo?.Title,
          conforme: item?.conforme ? 'CONFORME' : 'NÃO CONFORME',
          ultima_inspecao: vehicle?.ultima_inspecao ? format(new Date(vehicle?.ultima_inspecao), 'dd/MM/yyyy') : '',
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchAllRecords();

      const columns = ['Id', 'bombeiro', 'tipo_veiculo', 'placa', 'ultima_inspecao', 'conforme', 'observacao'];

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
          { wch: 15 },
          { wch: 15 },
          { wch: 30 },
        ];

        dataArray[0][0] = { t: 's', v: 'Texto com\nQuebra de Linha' };

        const firstRowHeight = 30;
        const wsrows = [{ hpx: firstRowHeight }];
        const filterRange = { ref: `A1:G1` };

        ws['!autofilter'] = filterRange;
        ws['!rows'] = wsrows;
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, 'Registros - Veiculos Emergencia');
        XLSX.writeFile(wb, `Registros - Veiculos Emergencia ${caseEquipmentsValue}.xlsx`);
      }
    },
  });

  return {
    loadRatio,
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

export default useLoadRatioBXO;
