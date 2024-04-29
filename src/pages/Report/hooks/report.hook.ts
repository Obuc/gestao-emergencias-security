import { useState } from 'react';
import { parseISO } from 'date-fns';
import { SortColumn } from 'react-data-grid';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { IReportsFiltersProps } from '../types/report.types';
import { sharepointContext } from '@/context/sharepointContext';
import buildOrderByQuery from '../../../utils/buildOrderByQuery';

export const useReports = () => {
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{ columnKey: 'Created', direction: 'DESC' }]);

  const sessionFiltersActions = sessionStorage.getItem('session_filters_extinguisher');
  const sessionFiltersActionsJSON: IReportsFiltersProps = sessionFiltersActions && JSON.parse(sessionFiltersActions);

  const initialFiltersValues = {
    id: sessionFiltersActionsJSON?.id ? sessionFiltersActionsJSON.id : null,
    startDate: sessionFiltersActionsJSON?.startDate ? sessionFiltersActionsJSON.startDate : null,
    endDate: sessionFiltersActionsJSON?.endDate ? sessionFiltersActionsJSON.endDate : null,
    emission: sessionFiltersActionsJSON?.emission ? sessionFiltersActionsJSON.emission : null,
    validity: sessionFiltersActionsJSON?.validity ? sessionFiltersActionsJSON.validity : null,
    reportType: sessionFiltersActionsJSON?.reportType ? sessionFiltersActionsJSON.reportType : null,
  };

  const [tableFilters, setTableFilters] = useState<IReportsFiltersProps>(initialFiltersValues);
  const [tempTableFilters, setTempTableFilters] = useState<IReportsFiltersProps>(initialFiltersValues);

  const handleRemoveAllFilters = () => {
    const filters = {
      id: null,
      startDate: null,
      endDate: null,
      emission: null,
      validity: null,
      reportType: null,
    };

    setTableFilters(filters);
    setTempTableFilters(filters);
    sessionStorage.removeItem('session_filters_extinguisher');
  };

  const countAppliedFilters = () => {
    let count = 0;
    if (tableFilters.id) count++;
    if (tableFilters.startDate) count++;
    if (tableFilters.endDate) count++;
    if (tableFilters.emission) count++;
    if (tableFilters.validity) count++;
    if (tableFilters.reportType) count++;

    return count;
  };

  const handleApplyFilters = () => {
    setTableFilters(tempTableFilters);
    sessionStorage.setItem('session_filters_extinguisher', JSON.stringify(tempTableFilters));
  };

  const fetchReports = async ({ pageParam }: { pageParam?: string }) => {
    const orderByQuery = buildOrderByQuery(sortColumns);

    let path = `?$Select=Id,Created,tipo_laudo/Title,site/Title,emissao,revalidado,validade,dias_antecedentes_alerta,excluido,Attachments&$expand=site,tipo_laudo,AttachmentFiles&$Top=100&${orderByQuery}&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false')`;

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

    if (tableFilters?.id) {
      path += ` and ( Id eq '${tableFilters.id}')`;
    }

    if (tableFilters?.reportType) {
      path += ` and ( tipo_laudo/Title eq '${tableFilters.reportType.label}')`;
    }

    if (tableFilters?.emission) {
      const startEmission = tableFilters.emission && new Date(tableFilters.emission);
      startEmission && startEmission.setUTCHours(0, 0, 0, 0);

      const endEmission = tableFilters.emission && new Date(tableFilters.emission);
      endEmission && endEmission.setUTCHours(23, 59, 59, 999);

      if (startEmission) {
        path += ` and (emissao ge datetime'${startEmission.toISOString()}')`;
      }

      if (endEmission) {
        path += ` and (emissao le datetime'${endEmission.toISOString()}')`;
      }
    }

    if (tableFilters?.validity) {
      const startValidity = tableFilters.validity && new Date(tableFilters.validity);
      startValidity && startValidity.setUTCHours(0, 0, 0, 0);

      const endValidity = tableFilters.validity && new Date(tableFilters.validity);
      endValidity && endValidity.setUTCHours(23, 59, 59, 999);

      if (startValidity) {
        path += ` and (emissao ge datetime'${startValidity.toISOString()}')`;
      }

      if (endValidity) {
        path += ` and (emissao le datetime'${endValidity.toISOString()}')`;
      }
    }

    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'laudos', path });

    const dataWithTransformations = await Promise.all(
      response.data.value.map(async (item: any) => {
        const createdIsoDate = parseISO(item.Created);
        const emissaoIsoDate = parseISO(item.emissao);
        const validadeIsoDate = parseISO(item.validade);

        return {
          ...item,
          Created: new Date(createdIsoDate.getTime() + createdIsoDate.getTimezoneOffset() * 60000),
          emissao: new Date(emissaoIsoDate.getTime() + emissaoIsoDate.getTimezoneOffset() * 60000),
          validade: new Date(validadeIsoDate.getTime() + validadeIsoDate.getTimezoneOffset() * 60000),
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

  const reportData = useInfiniteQuery({
    queryKey: ['reports_data', user_site, tableFilters, sortColumns],
    queryFn: fetchReports,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
  });

  const mutateRemove = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        await crud.updateItemList('laudos', itemId, { excluido: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reports_data', user_site, tableFilters, sortColumns],
      });
    },
  });

  return {
    reportData,
    mutateRemove,
    tempTableFilters,
    setTempTableFilters,
    handleRemoveAllFilters,
    countAppliedFilters,
    handleApplyFilters,
    sortColumns,
    setSortColumns,
  };
};
