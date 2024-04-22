import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { sharepointContext } from '@/context/sharepointContext';
import { ExtinguisherFiltersProps, ExtinguisherProps } from '../types/extinguisher.types';

const useExtinguisher = () => {
  const { crudParent } = sharepointContext();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Modified', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_equipments_extinguisher_spo');
  const sessionFiltersActionsJSON: ExtinguisherFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    codExtintor: sessionFiltersActionsJSON?.codExtintor ? sessionFiltersActionsJSON.codExtintor : null,
    predio: sessionFiltersActionsJSON?.predio ? sessionFiltersActionsJSON.predio : null,
    pavimento: sessionFiltersActionsJSON?.pavimento ? sessionFiltersActionsJSON.pavimento : null,
    local: sessionFiltersActionsJSON?.local ? sessionFiltersActionsJSON.local : null,
    tipo: sessionFiltersActionsJSON?.tipo ? sessionFiltersActionsJSON.tipo : null,
    conforme: sessionFiltersActionsJSON?.conforme ? sessionFiltersActionsJSON.conforme : null,
    cod_local: sessionFiltersActionsJSON?.cod_local ? sessionFiltersActionsJSON.cod_local : null,
  };

  const [tableFilters, setTableFilters] = useState<ExtinguisherFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<ExtinguisherFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      id: null,
      codExtintor: null,
      predio: null,
      pavimento: null,
      local: null,
      tipo: null,
      conforme: null,
      cod_local: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_equipments_extinguisher_spo');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.id) count++;
    if (tableFilters.codExtintor) count++;
    if (tableFilters.predio) count++;
    if (tableFilters.pavimento) count++;
    if (tableFilters.local) count++;
    if (tableFilters.tipo) count++;
    if (tableFilters.conforme) count++;
    if (tableFilters.cod_local) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_equipments_extinguisher_spo', JSON.stringify(tempTableFilters));
  };

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,Created,Modified,codExtintor,Predio,Pavimento,LocEsp,Tipo,Conforme,Title,Excluido&$Top=25&${orderByQuery}&$Filter=(Excluido eq 'Não' or Excluido eq null)`;

    if (tableFilters?.id) {
      path += ` and ( Id eq '${tableFilters?.id}')`;
    }

    if (tableFilters?.codExtintor) {
      path += ` and ( codExtintor eq '${tableFilters?.codExtintor}')`;
    }

    if (tableFilters?.predio) {
      path += ` and ( Predio eq '${tableFilters?.predio}')`;
    }

    if (tableFilters?.pavimento) {
      path += ` and ( Pavimento eq '${tableFilters?.pavimento}')`;
    }

    if (tableFilters?.local) {
      path += ` and ( LocEsp eq '${tableFilters?.local}')`;
    }

    if (tableFilters?.tipo) {
      path += ` and ( Tipo eq '${tableFilters?.tipo}')`;
    }

    if (tableFilters?.conforme?.value === 'Sim') {
      path += ` and ( Conforme eq 'Sim')`;
    }

    if (tableFilters?.conforme?.value === 'Não') {
      path += ` and ( Conforme eq 'Não')`;
    }

    if (tableFilters?.cod_local) {
      path += ` and ( Title eq '${tableFilters?.cod_local}')`;
    }

    const response = await crudParent.getPaged(
      pageParam ? { nextUrl: pageParam } : { list: 'Extintores_Equipamentos', path },
    );
    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
          Conforme: item.Conforme === 'Sim' || item.Conforme === null ? true : false,
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

  const extinguisherData = useInfiniteQuery({
    queryKey: ['equipments_extinguisher_data_spo', user_site, tableFilters, sortColumns],

    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: user_site === 'SPO' && location.pathname.includes('/equipments/extinguisher'),
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      await crudParent.updateItemList('extintores', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments_extinguisher_data_spo', user_site, tableFilters, sortColumns],
      });
    },
  });

  const fetchAllEquipments = async () => {
    let path = `?$Select=Id,Created,Modified,codExtintor,Predio,Pavimento,LocEsp,Tipo,Conforme,Title,Excluido&$Filter=(Excluido eq 'Não' or Excluido eq null)`;

    const response = await crudParent.getListItems('Extintores_Equipamentos', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        return {
          ...item,
          Conforme: item.Conforme === 'Sim' || item.Conforme === null ? 'Sim' : 'Não',
        };
      }),
    );

    return dataWithTransformations;
  };

  const mutateExportExcel = useMutation({
    mutationFn: async () => {
      const data = await fetchAllEquipments();

      const columns: (keyof ExtinguisherProps)[] = [
        'Id',
        'codExtintor',
        'Predio',
        'Pavimento',
        'LocEsp',
        'Tipo',
        'Conforme',
        'Title',
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

        XLSX.utils.book_append_sheet(wb, ws, 'Extintores');
        XLSX.writeFile(wb, `Equipamentos - Extintores.xlsx`);
      }
    },
  });

  return {
    extinguisherData,
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

export default useExtinguisher;
