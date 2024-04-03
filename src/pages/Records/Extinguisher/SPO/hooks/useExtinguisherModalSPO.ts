import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ExtinguisherModal } from '../types/ExtinguisherSPO';
import { sharepointContext } from '../../../../../context/sharepointContext';
import { useState } from 'react';

const useExtinguisherModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);

  const extinguisherModal = useQuery({
    queryKey: ['extinguisher_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id && pathname === `/records/extinguisher/${params.id}` && user_site === 'SPO') {
        const resp = await crudParent.getListItemsv2(
          'Extintores',
          `?$Select=Id,Title,Created,Responsavel1/Title,codigo,UF,Municipios,Site,Area,Local,Pavimento,LocalEsp,DataVenc,Tipo,Massa,codExtintor/Title,Observacao,OData__x004d_an1,OData__x004d_an2,OData__x0043_ar1,OData__x0043_ar2,OData__x0043_il2,OData__x0043_il1,OData__x0043_il3,OData__x0053_in1,OData__x0053_in2,Obst1,Obst2,OData__x004c_tv1,OData__x004c_tv2&$Expand=Responsavel1,codExtintor&$Filter=(Id eq ${params.id})`,
        );

        const extintor = resp.results[0];

        const extintorValidadeIsoDate = extintor.DataVenc && parseISO(extintor.DataVenc);
        const dataCriadoIsoDate = extintor.Created && parseISO(extintor.Created);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const dataValidade =
          extintorValidadeIsoDate &&
          new Date(extintorValidadeIsoDate.getTime() + extintorValidadeIsoDate.getTimezoneOffset() * 60000);

        return {
          ...extintor,
          Created: dataCriado,
          DataVenc: dataValidade,
          Responsavel1: extintor?.Responsavel1?.Title,
          codExtintor: extintor?.codExtintor?.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/records/extinguisher/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: ExtinguisherModal) => {
      const dataUpdate = {
        OData__x004d_an1: values.OData__x004d_an1,
        OData__x004d_an2: values.OData__x004d_an2,
        OData__x0043_ar1: values.OData__x0043_ar1,
        OData__x0043_ar2: values.OData__x0043_ar2,
        OData__x0043_il2: values.OData__x0043_il2,
        OData__x0043_il1: values.OData__x0043_il1,
        OData__x0043_il3: values.OData__x0043_il3,
        OData__x0053_in1: values.OData__x0053_in1,
        OData__x0053_in2: values.OData__x0053_in2,
        Obst1: values.Obst1,
        Obst2: values.Obst2,
        OData__x004c_tv1: values.OData__x004c_tv1,
        OData__x004c_tv2: values.OData__x004c_tv2,
        Observacao: values.Observacao,
      };

      await crudParent.updateItemList('Extintores', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extinguisher_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['extinguisher_data'] });

      const timeoutId = setTimeout(() => {
        setExtinguisherItem(null);
        navigate('/records/extinguisher');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: ExtinguisherModal = {
    Id: extinguisherModal.data?.Id || 0,
    Title: extinguisherModal.data?.Title || '',
    Created: extinguisherModal.data?.Created || '',
    DataVenc: extinguisherModal.data?.Created || null,
    Responsavel1: extinguisherModal.data?.Responsavel1 || '',
    Local: extinguisherModal.data?.Local || '',
    Pavimento: extinguisherModal.data?.Pavimento || '',
    LocalEsp: extinguisherModal.data?.LocalEsp || '',
    OData__x004d_an1: extinguisherModal.data?.OData__x004d_an1 || false,
    OData__x004d_an2: extinguisherModal.data?.OData__x004d_an2 || false,
    OData__x0043_ar1: extinguisherModal.data?.OData__x0043_ar1 || false,
    OData__x0043_ar2: extinguisherModal.data?.OData__x0043_ar2 || false,
    OData__x0043_il2: extinguisherModal.data?.OData__x0043_il2 || false,
    OData__x0043_il1: extinguisherModal.data?.OData__x0043_il1 || false,
    OData__x0043_il3: extinguisherModal.data?.OData__x0043_il3 || false,
    OData__x0053_in1: extinguisherModal.data?.OData__x0053_in1 || false,
    OData__x0053_in2: extinguisherModal.data?.OData__x0053_in2 || false,
    Obst1: extinguisherModal.data?.Obst1 || false,
    Obst2: extinguisherModal.data?.Obst2 || false,
    OData__x004c_tv1: extinguisherModal.data?.OData__x004c_tv1 || false,
    OData__x004c_tv2: extinguisherModal.data?.OData__x004c_tv2 || false,
    Observacao: extinguisherModal.data?.Observacao || '',
    UF: extinguisherModal.data?.UF || '',
    Municipios: extinguisherModal.data?.Municipios || '',
    Site: extinguisherModal.data?.Site || '',
    Area: extinguisherModal.data?.Area || '',
    Tipo: extinguisherModal.data?.Tipo || '',
    Massa: extinguisherModal.data?.Massa || '',
    codExtintor: extinguisherModal.data?.codExtintor || '',
    codigo: extinguisherModal.data?.codigo || '',
  };

  const handleSubmit = async (values: ExtinguisherModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: ExtinguisherModal) => {
      handleSubmit(values);
    },
  });

  return {
    extinguisherItem,
    setExtinguisherItem,
    extinguisherModal,
    mutateEdit,
    formik,
  };
};

export default useExtinguisherModalSPO;
