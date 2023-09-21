import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import { IReports } from '../types/Reports';

const useReports = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const path = `?$Select=Id,Created,tipo_laudo/Title,site/Title,emissao,validade,dias_antecedentes_alerta,excluido,Attachments&$expand=site,tipo_laudo,AttachmentFiles&$Top=100&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false')`;

  const fetchReports = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'laudos', path });
    return response;
  };

  const {
    data: reports,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['reports_data', user_site],
    queryFn: fetchReports,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
  });

  const { mutateAsync: mutateRemoveReport, isLoading: isLoadingMutateRemoveReport } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        await crud.updateItemList('laudos', itemId, { excluido: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports_data', user_site] });
    },
  });

  const { data: reportModal, isLoading: isLoadingReportModal }: UseQueryResult<IReports> = useQuery({
    queryKey: params.id ? ['report_data_modal', params.id] : ['report_data_modal'],
    queryFn: async () => {
      if (params.id) {
        const patch = `?$Select=Id,Created,tipo_laudo/Title,site/Title,emissao,validade,dias_antecedentes_alerta,excluido,Attachments&$expand=site,tipo_laudo,AttachmentFiles&$Top=100&$Orderby=Created desc&$filter=Id eq ${params.id}`;

        const resp = await crud.getListItemsv2('laudos', patch);
        const data = resp.results[0];

        const dataWithTransformations = {
          ...data,
          AttachmentFiles: {
            ...resp.results[0].AttachmentFiles.results,
          },
        };

        return dataWithTransformations;
      } else {
        return [];
      }
    },
  });

  return {
    reports,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveReport,
    isLoadingMutateRemoveReport,
    reportModal,
    isLoadingReportModal,
  };
};

export default useReports;
