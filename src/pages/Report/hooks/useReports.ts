import { parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import { Attachments, IReports, IReportsFiltersProps, ITipoLaudo } from '../types/Reports';

const useReports = (reportsFilters?: IReportsFiltersProps) => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  let path = `?$Select=Id,Created,tipo_laudo/Title,site/Title,emissao,revalidado,validade,dias_antecedentes_alerta,excluido,Attachments&$expand=site,tipo_laudo,AttachmentFiles&$Top=100&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false')`;

  if (reportsFilters?.startDate || reportsFilters?.endDate) {
    const startDate = reportsFilters.startDate && new Date(reportsFilters.startDate);
    startDate && startDate.setUTCHours(0, 0, 0, 0);

    const endDate = reportsFilters.endDate && new Date(reportsFilters.endDate);
    endDate && endDate.setUTCHours(23, 59, 59, 999);

    if (startDate) {
      path += ` and (Created ge datetime'${startDate.toISOString()}')`;
    }

    if (endDate) {
      path += ` and (Created le datetime'${endDate.toISOString()}')`;
    }
  }

  if (reportsFilters?.id) {
    path += ` and ( Id eq '${reportsFilters.id}')`;
  }

  if (reportsFilters?.reportType) {
    path += ` and ( tipo_laudo/Title eq '${reportsFilters.reportType}')`;
  }

  if (reportsFilters?.emission) {
    const startEmission = reportsFilters.emission && new Date(reportsFilters.emission);
    startEmission && startEmission.setUTCHours(0, 0, 0, 0);

    const endEmission = reportsFilters.emission && new Date(reportsFilters.emission);
    endEmission && endEmission.setUTCHours(23, 59, 59, 999);

    if (startEmission) {
      path += ` and (emissao ge datetime'${startEmission.toISOString()}')`;
    }

    if (endEmission) {
      path += ` and (emissao le datetime'${endEmission.toISOString()}')`;
    }
  }

  if (reportsFilters?.validity) {
    const startValidity = reportsFilters.validity && new Date(reportsFilters.validity);
    startValidity && startValidity.setUTCHours(0, 0, 0, 0);

    const endValidity = reportsFilters.validity && new Date(reportsFilters.validity);
    endValidity && endValidity.setUTCHours(23, 59, 59, 999);

    if (startValidity) {
      path += ` and (emissao ge datetime'${startValidity.toISOString()}')`;
    }

    if (endValidity) {
      path += ` and (emissao le datetime'${endValidity.toISOString()}')`;
    }
  }

  const fetchReports = async ({ pageParam }: { pageParam?: string }) => {
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

  const {
    data: reports,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      'reports_data',
      user_site,
      reportsFilters?.startDate,
      reportsFilters?.endDate,
      reportsFilters?.id,
      reportsFilters?.reportType,
      reportsFilters?.emission,
      reportsFilters?.validity,
    ],
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
      queryClient.invalidateQueries({
        queryKey: [
          'reports_data',
          user_site,
          reportsFilters?.startDate,
          reportsFilters?.endDate,
          reportsFilters?.id,
          reportsFilters?.reportType,
          reportsFilters?.emission,
          reportsFilters?.validity,
        ],
      });
    },
  });

  const { data: reportModal, isLoading: isLoadingReportModal }: UseQueryResult<IReports> = useQuery({
    queryKey: params.id !== undefined && params.id !== 'new' ? ['report_data_modal', params.id] : ['report_data_modal'],
    queryFn: async () => {
      if (params.id !== undefined && params.id !== 'new') {
        const patch = `?$Select=Id,Created,tipo_laudo/Title,tipo_laudoId,siteId,numero_laudo_revalidado,tipo_laudo/Id,site/Title,emissao,validade,dias_antecedentes_alerta,excluido,Attachments&$expand=site,tipo_laudo,AttachmentFiles&$Orderby=Created desc&$filter=Id eq ${params.id}`;

        const resp = await crud.getListItemsv2('laudos', patch);
        const data = resp.results[0];

        const createdIsoDate = parseISO(data.Created);
        const emissaoIsoDate = parseISO(data.emissao);
        const validadeIsoDate = parseISO(data.validade);

        const dataWithTransformations = {
          ...data,
          AttachmentFiles: data.AttachmentFiles.results,
          Created: new Date(createdIsoDate.getTime() + createdIsoDate.getTimezoneOffset() * 60000),
          emissao: new Date(emissaoIsoDate.getTime() + emissaoIsoDate.getTimezoneOffset() * 60000),
          validade: new Date(validadeIsoDate.getTime() + validadeIsoDate.getTimezoneOffset() * 60000),
        };
        return dataWithTransformations;
      } else {
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  const { data: tipoLaudo, isLoading: isLoadingTipoLaudo }: UseQueryResult<Array<ITipoLaudo>> = useQuery({
    queryKey: ['tipo_laudo'],
    queryFn: async () => {
      const patch = `?$Select=Id,Title,site/Title&$expand=site&$Orderby=Title asc`;

      const resp = await crud.getListItemsv2('tipo_laudo', patch);
      return resp.results;
    },
  });

  const { mutateAsync: mutateReport, isLoading: isLoadingMutateReport } = useMutation({
    mutationFn: async (data: { values: any; isEdit: boolean }) => {
      if (data.values) {
        if (!data.isEdit) {
          const dataNew = {
            dias_antecedentes_alerta: data.values.dias_antecedentes_alerta,
            emissao: data.values.emissao.split('T')[0] + 'T00:00:00Z',
            siteId: data.values.siteId,
            validade: data.values.validade.split('T')[0] + 'T00:00:00Z',
            tipo_laudoId: data.values.tipo_laudoId && +data.values.tipo_laudoId,
            numero_laudo_revalidado: data.values.revalidateValue,
          };
          const resp = await crud.postItemList('laudos', dataNew);
          return resp;
        }

        if (data.isEdit) {
          const dataEdit = {
            dias_antecedentes_alerta: data.values.dias_antecedentes_alerta,
            emissao: data.values.emissao.split('T')[0] + 'T00:00:00Z',
            validade: data.values.validade.split('T')[0] + 'T00:00:00Z',
            tipo_laudoId: data.values.tipo_laudoId && +data.values.tipo_laudoId,
          };
          const resp = await crud.updateItemList('laudos', data.values.Id, dataEdit);
          return resp;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'reports_data',
          user_site,
          reportsFilters?.startDate,
          reportsFilters?.endDate,
          reportsFilters?.id,
          reportsFilters?.reportType,
          reportsFilters?.emission,
          reportsFilters?.validity,
        ],
      });
      queryClient.invalidateQueries({ queryKey: ['report_data_modal', params.id] });
    },
  });

  const { mutateAsync: mutateAddAttachments, isLoading: isLoadingMutateAddAttachments } = useMutation({
    mutationFn: async (data: { attachments?: Array<File>; itemId?: number }) => {
      if (data.attachments && data.itemId) {
        const itemStringId = data.itemId.toString();
        await crud.postAllAttachments('laudos', itemStringId, data.attachments);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'reports_data',
          user_site,
          reportsFilters?.startDate,
          reportsFilters?.endDate,
          reportsFilters?.id,
          reportsFilters?.reportType,
          reportsFilters?.emission,
          reportsFilters?.validity,
        ],
      });
      queryClient.invalidateQueries({ queryKey: ['report_data_modal', params.id] });
    },
  });

  const { mutateAsync: mutateRemoveAttachments, isLoading: isLoadingMutateRemoveAttachments } = useMutation({
    mutationFn: async (data: { attachments?: Array<Attachments>; itemId?: number }) => {
      if (data.attachments && data.itemId) {
        for (const attachment of data.attachments) {
          await crud.deleteAttachmentList('laudos', data.itemId, attachment.FileName);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'reports_data',
          user_site,
          reportsFilters?.startDate,
          reportsFilters?.endDate,
          reportsFilters?.id,
          reportsFilters?.reportType,
          reportsFilters?.emission,
          reportsFilters?.validity,
        ],
      });
      queryClient.invalidateQueries({ queryKey: ['report_data_modal', params.id] });
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
    tipoLaudo,
    isLoadingTipoLaudo,
    mutateReport,
    isLoadingMutateReport,
    mutateRemoveAttachments,
    mutateAddAttachments,
    isLoadingMutateRemoveAttachments,
    isLoadingMutateAddAttachments,
  };
};

export default useReports;
