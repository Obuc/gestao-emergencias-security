import * as XLSX from 'xlsx';
import { useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import buildOrderByQuery from '@/utils/buildOrderByQuery';
import { sharepointContext } from '@/context/sharepointContext';
import { ExtinguisherFiltersProps, ExtinguisherProps } from '../types/extinguisher.types';

export const useExtinguisher = () => {
  const { crud } = sharepointContext();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Modified', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_equipments_extinguisher');
  const sessionFiltersActionsJSON: ExtinguisherFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    pavement: sessionFiltersActionsJSON?.pavement ? sessionFiltersActionsJSON.pavement : null,
    place: sessionFiltersActionsJSON?.place ? sessionFiltersActionsJSON.place : [],
    extinguisherType: sessionFiltersActionsJSON?.extinguisherType ? sessionFiltersActionsJSON.extinguisherType : null,
    extinguisherId: sessionFiltersActionsJSON?.extinguisherId ? sessionFiltersActionsJSON.extinguisherId : null,
    conformity: sessionFiltersActionsJSON?.conformity ? sessionFiltersActionsJSON.conformity : null,
  };

  const [tableFilters, setTableFilters] = useState<ExtinguisherFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<ExtinguisherFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      id: null,
      pavement: null,
      place: [],
      extinguisherType: null,
      extinguisherId: null,
      conformity: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_equipments_extinguisher');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.id) count++;
    if (tableFilters.pavement) count++;
    if (tableFilters.place.length > 0) count++;
    if (tableFilters.extinguisherType) count++;
    if (tableFilters.extinguisherId) count++;
    if (tableFilters.conformity) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_equipments_extinguisher', JSON.stringify(tempTableFilters));
  };

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,cod_qrcode,cod_extintor,excluido,Modified,conforme,site/Title,pavimento/Title,local/Title,tipo_extintor/Title&$expand=site,pavimento,tipo_extintor,local&$Top=25&${orderByQuery}&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false')`;

    if (tableFilters?.id) {
      path += ` and ( Id eq '${tableFilters?.id}')`;
    }

    if (tableFilters?.extinguisherId) {
      path += ` and ( substringof('${tableFilters?.extinguisherId}', cod_extintor ))`;
    }

    if (tableFilters?.pavement) {
      path += ` and (pavimento/Title eq '${tableFilters?.pavement.label}')`;
    }

    if (tableFilters?.place.length > 0) {
      for (let i = 0; i < tableFilters.place.length; i++) {
        path += `${i === 0 ? ' and' : ' or'} (local/Title eq '${tableFilters.place[i].label}')`;
      }
    }

    if (tableFilters?.extinguisherType) {
      path += ` and (tipo_extintor/Title eq '${tableFilters?.extinguisherType?.label}')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity === 'Conforme') {
      path += ` and (conforme ne 'false')`;
    }

    if (tableFilters?.conformity && tableFilters?.conformity !== 'Conforme') {
      path += ` and (conforme eq 'false')`;
    }

    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'extintores', path });
    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
          local: item.local?.Title,
          pavimento: item.pavimento?.Title,
          tipo_extintor: item.tipo_extintor?.Title,
          site: item.site?.Title,
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
    queryKey: ['equipments_extinguisher_data', user_site, tableFilters, sortColumns],

    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: user_site === 'BXO' && location.pathname.includes('/equipments/extinguisher'),
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('extintores', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments_extinguisher_data', user_site, tableFilters, sortColumns],
      });
    },
  });

  const fetchAllEquipments = async () => {
    let path = `?$Select=Id,cod_qrcode,predio/Title,tipo_extintor/Title,pavimento/Title,local/Title,site/Title,cod_extintor,conforme&$expand=tipo_extintor,predio,site,pavimento,local&$Filter=(site/Title eq 'BXO')`;

    const response = await crud.getListItems('extintores', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        return {
          ...item,
          local: item.local?.Title,
          pavimento: item.pavimento?.Title,
          site: item.site?.Title,
          predio: item.predio?.Title,
          tipo_extintor: item.tipo_extintor?.Title,
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
        'pavimento',
        'local',
        'predio',
        'cod_extintor',
        'tipo_extintor',
        'conforme',
        'site',
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
