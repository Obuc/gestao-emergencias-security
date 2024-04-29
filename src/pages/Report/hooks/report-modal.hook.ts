import * as yup from 'yup';
import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useNavigate, useParams as useParamsRouterDom, useSearchParams } from 'react-router-dom';
import { UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useParams from '@/hooks/useParams';
import { arraysAreEqual } from '@/utils/arraysAreEqual';
import { Attachments, IReports } from '../types/report.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useReportModal = () => {
  const params = useParamsRouterDom();
  const queryClient = useQueryClient();
  const { crud } = sharepointContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [reporItem, setReportItem] = useState<boolean | null>(null);

  const { sites } = useParams();
  const localSite = localStorage.getItem('user_site');

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const reportModal: UseQueryResult<IReports> = useQuery({
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

  const mutateReport = useMutation({
    mutationFn: async (data: { values: any; isEdit: boolean }) => {
      if (data.values) {
        if (!data.isEdit) {
          const dataNew = {
            dias_antecedentes_alerta: data.values.dias_antecedentes_alerta,
            emissao: data.values.emissao.toISOString().split('T')[0] + 'T00:00:00Z',
            siteId: data.values.siteId,
            validade: data.values.validade.toISOString().split('T')[0] + 'T00:00:00Z',
            tipo_laudoId: data.values.tipo_laudoId && +data.values.tipo_laudoId,
            numero_laudo_revalidado: data.values.revalidateValue,
          };
          const resp = await crud.postItemList('laudos', dataNew);
          return resp;
        }

        if (data.isEdit) {
          const dataEdit = {
            dias_antecedentes_alerta: data.values.dias_antecedentes_alerta,
            emissao: data.values.emissao.toISOString().split('T')[0] + 'T00:00:00Z',
            validade: data.values.validade.toISOString().split('T')[0] + 'T00:00:00Z',
            tipo_laudoId: data.values.tipo_laudoId && +data.values.tipo_laudoId,
          };
          const resp = await crud.updateItemList('laudos', data.values.Id, dataEdit);
          return resp;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports_data'] });
      queryClient.invalidateQueries({ queryKey: ['report_data_modal', params.id] });

      const timeoutId = setTimeout(() => {
        setReportItem(null);
        navigate(`/${localSite?.toLocaleLowerCase()}/reports`);
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const mutateAddAttachments = useMutation({
    mutationFn: async (data: { attachments?: Array<File>; itemId?: number }) => {
      if (data.attachments && data.itemId) {
        const itemStringId = data.itemId.toString();
        await crud.postAllAttachments('laudos', itemStringId, data.attachments);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports_data'] });
      queryClient.invalidateQueries({ queryKey: ['report_data_modal', params.id] });
    },
  });

  const mutateRemoveAttachments = useMutation({
    mutationFn: async (data: { attachments?: Array<Attachments>; itemId?: number }) => {
      if (data.attachments && data.itemId) {
        for (const attachment of data.attachments) {
          await crud.deleteAttachmentList('laudos', data.itemId, attachment.FileName);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports_data'] });
      queryClient.invalidateQueries({ queryKey: ['report_data_modal', params.id] });
    },
  });

  const validationSchema = yup.object().shape({
    emissao: yup.string().required(),
    validade: yup.string().required(),
    dias_antecedentes_alerta: yup.number().min(1).required(),
    tipo_laudoId: yup.number().min(1).required(),

    AttachmentFiles: yup.array().of(yup.object()),

    isRevalidate: yup.string(),
    revalidateValue: yup
      .number()
      .test('is-required', 'Este campo é obrigatório quando isRevalidate é verdadeiro', function (value) {
        const isRevalidate = this.parent.isRevalidate;
        if (isRevalidate === 'true') {
          console.log(value);
          return value !== undefined && value > 0;
        }
        return true;
      }),

    file: yup.array().test('hasFile', 'Pelo menos 1 anexo é necessário', function (value) {
      const { AttachmentFiles } = this.parent;
      if (!AttachmentFiles || AttachmentFiles.length === 0) {
        return value && value.length > 0;
      }
      return true;
    }),
  });

  interface IReportsModal extends Partial<IReports> {
    isRevalidate: string;
    revalidateValue: number | null;
  }

  const initialValues: IReportsModal = {
    Attachments: params.id !== 'new' ? reportModal.data?.Attachments || false : false,
    AttachmentFiles: params.id !== 'new' ? reportModal.data?.AttachmentFiles || [] : [],
    Created: params.id !== 'new' ? reportModal.data?.Created || null : null,
    dias_antecedentes_alerta: params.id !== 'new' ? reportModal.data?.dias_antecedentes_alerta || 0 : 0,
    emissao: params.id !== 'new' ? reportModal.data?.emissao || null : null,
    excluido: params.id !== 'new' ? reportModal.data?.excluido || false : false,
    Id: params.id !== 'new' ? reportModal.data?.Id || 0 : 0,
    site: params.id !== 'new' ? reportModal.data?.site || { Title: '' } : { Title: '' },
    tipo_laudo: params.id !== 'new' ? reportModal.data?.tipo_laudo || { Title: '', Id: 0 } : { Title: '', Id: 0 },
    validade: params.id !== 'new' ? reportModal.data?.validade || null : null,
    tipo_laudoId: params.id !== 'new' ? reportModal.data?.tipo_laudoId || null : null,
    siteId:
      params.id !== 'new'
        ? reportModal.data?.siteId || null
        : sites.data?.find((site) => site.Title === localSite)?.Id || null,

    revalidado: params.id !== 'new' ? reportModal.data?.revalidado || false : false,

    numero_laudo_revalidado: params.id !== 'new' ? reportModal.data?.numero_laudo_revalidado || null : null,

    file: [],
    isRevalidate: 'false',
    revalidateValue: 0,
  };

  const handleSubmit = async (values: IReportsModal) => {
    if (values) {
      const isFormEdit = searchParams.get('edit') === 'true';

      const newData = await mutateReport.mutateAsync({ values, isEdit: isFormEdit });

      if (values.file && values.file?.length > 0 && newData.Id) {
        await mutateAddAttachments.mutateAsync({ attachments: values.file, itemId: newData.Id });
      }
      // Lógica para excluir anexos
      const isAttachmentFilesChanged =
        values.AttachmentFiles && !arraysAreEqual(values.AttachmentFiles, reportModal.data?.AttachmentFiles || []);
      if (isAttachmentFilesChanged) {
        await mutateRemoveAttachments.mutateAsync({
          attachments: reportModal.data?.AttachmentFiles,
          itemId: reportModal.data?.Id,
        });
      }
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values: IReportsModal) => {
      handleSubmit(values);
    },
  });

  return {
    formik,
    reportModal,
    mutateReport,
    mutateAddAttachments,
    mutateRemoveAttachments,
    reporItem,
    setReportItem,
  };
};
