import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { OeiModal } from '../types/oei.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useOeiModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [oeiItem, setOeiItem] = useState<boolean | null>(null);

  const oeiModal = useQuery({
    queryKey: ['oei_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id) {
        const resp = await crudParent.getListItemsv2(
          'Operacao_OEI',
          `?$Select=Id,Created,Responsavel1/Title,UF,Municipios,Site,Area,Local,OData__x004c_oc1,OData__x0046_cn1,OData__x0046_cn2,OData__x0046_cn3,OData__x0046_cn4,OData__x0049_nt1,OData__x0049_nt2,Observacao&$Expand=Responsavel1&$Filter=(Id eq ${params.id})`,
        );

        const oei = resp.results[0];

        const dataCriadoIsoDate = oei.Created && parseISO(oei.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...oei,
          Created: dataCriado,
          Responsavel1: oei?.Responsavel1?.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/spo/records/oei_operation/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: OeiModal) => {
      const dataUpdate = {
        OData__x004c_oc1: values.OData__x004c_oc1,
        OData__x0046_cn1: values.OData__x0046_cn1,
        OData__x0046_cn2: values.OData__x0046_cn2,
        OData__x0046_cn3: values.OData__x0046_cn3,
        OData__x0046_cn4: values.OData__x0046_cn4,
        OData__x0049_nt1: values.OData__x0049_nt1,
        OData__x0049_nt2: values.OData__x0049_nt2,
        Observacao: values.Observacao,
      };

      await crudParent.updateItemList('Operacao_OEI', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oei_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['oei_data_spo'] });

      const timeoutId = setTimeout(() => {
        setOeiItem(null);
        navigate('/spo/records/oei_operation');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: OeiModal = {
    Id: oeiModal.data?.Id || 0,
    Created: oeiModal.data?.Created || null,
    Responsavel1: oeiModal.data?.Responsavel1 || '',
    OData__x004c_oc1: oeiModal.data?.OData__x004c_oc1 || false,
    OData__x0046_cn1: oeiModal.data?.OData__x0046_cn1 || false,
    OData__x0046_cn2: oeiModal.data?.OData__x0046_cn2 || false,
    OData__x0046_cn3: oeiModal.data?.OData__x0046_cn3 || false,
    OData__x0046_cn4: oeiModal.data?.OData__x0046_cn4 || false,
    OData__x0049_nt1: oeiModal.data?.OData__x0049_nt1 || false,
    OData__x0049_nt2: oeiModal.data?.OData__x0049_nt2 || false,
    UF: oeiModal.data?.UF || '',
    Municipios: oeiModal.data?.Municipios || '',
    Site: oeiModal.data?.Site || '',
    Local: oeiModal.data?.Local || '',
    Area: oeiModal.data?.Area || '',
    Observacao: oeiModal.data?.Observacao || '',
  };

  const handleSubmit = async (values: OeiModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: OeiModal) => {
      handleSubmit(values);
    },
  });

  return {
    oeiItem,
    setOeiItem,
    oeiModal,
    mutateEdit,
    formik,
  };
};
