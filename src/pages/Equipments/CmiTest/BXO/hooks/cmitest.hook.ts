import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { sharepointContext } from '@/context/sharepointContext';
import { CmiTestFiltersProps, CmiTestProps } from '../types/cmitest.types';

export const useCmiTest = () => {
  const { crud } = sharepointContext();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Modified', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_equipments_cmitest_bxo');
  const sessionFiltersActionsJSON: CmiTestFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    pavement: sessionFiltersActionsJSON?.pavement ? sessionFiltersActionsJSON.pavement : null,
    cod_qrcode: sessionFiltersActionsJSON?.cod_qrcode ? sessionFiltersActionsJSON.cod_qrcode : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
    predio: sessionFiltersActionsJSON?.predio ? sessionFiltersActionsJSON.predio : null,
  };

  const [tableFilters, setTableFilters] = useState<CmiTestFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<CmiTestFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      id: null,
      pavement: null,
      cod_qrcode: null,
      conformity: null,
      predio: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_equipments_cmitest_bxo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.id) count++;
    if (tableFilters.pavement) count++;
    if (tableFilters.cod_qrcode) count++;
    if (tableFilters.conformity) count++;
    if (tableFilters.predio) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_equipments_cmitest_bxo', JSON.stringify(tempTableFilters));
  };

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,cod_qrcode,predio/Title,conforme,Modified,excluido,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,tipo_equipamento,predio&$Orderby=Modified desc&$Top=25&${orderByQuery}&$Filter=(site/Title eq 'BXO') and (tipo_equipamento/Title eq 'Teste CMI') and (excluido eq 'false')`;

    if (tableFilters?.pavement?.value) {
      path += ` and (pavimento/Title eq '${tableFilters?.pavement?.label}')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
      path += ` and (conforme ne 'false')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
      path += ` and (conforme eq 'false')`;
    }

    if (tableFilters?.cod_qrcode) {
      path += ` and ( substringof('${tableFilters?.cod_qrcode}', cod_qrcode ))`;
    }

    if (tableFilters?.predio) {
      path += ` and ( substringof('${tableFilters?.predio}', predio/Title ))`;
    }

    if (tableFilters?.id) {
      path += ` and ( Id eq '${tableFilters?.id}')`;
    }

    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'equipamentos_diversos', path });
    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
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

  const cmiTestData = useInfiniteQuery({
    queryKey: ['equipments_cmi_test_data_bxo', user_site, tableFilters, sortColumns],
    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: user_site === 'BXO' && location.pathname.includes('/equipments/cmi_test'),
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('equipamentos_diversos', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments_cmi_test_data_bxo', user_site, tableFilters, sortColumns],
      });
    },
  });

  const fetchAllEquipments = async () => {
    let path = `?$Select=Id,cod_qrcode,conforme,predio/Title,Modified,excluido,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,tipo_equipamento,predio&$Orderby=Modified desc&$Filter=(site/Title eq 'BXO') and (tipo_equipamento/Title eq 'Teste CMI') and (excluido eq 'false')`;

    const response = await crud.getListItems('equipamentos_diversos', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        return {
          ...item,
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

      const columns: (keyof CmiTestProps)[] = ['Id', 'site', 'predio', 'pavimento', 'cod_qrcode', 'conforme'];

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
        XLSX.writeFile(wb, `Equipamentos - Teste CMI.xlsx`);
      }
    },
  });

  return {
    cmiTestData,
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
