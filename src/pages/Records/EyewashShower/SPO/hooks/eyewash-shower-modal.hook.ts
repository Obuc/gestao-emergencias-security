import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { EyewashShowerModal } from '../types/eyewash-shower.types';

export const useEyewashShowerModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [eyewashShowerItem, setEyewashShowerItem] = useState<boolean | null>(null);

  const eyewashShowerModal = useQuery({
    queryKey: ['eyewash_shower_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id) {
        const resp = await crudParent.getListItemsv2(
          'Chuveiro Lava Olhos',
          `?$Select=Id,Created,Responsavel/Title,Local,Sin,Obs,Insp,Press,Agua,Observacao,UF,Municipios,Site,Local,Area&$Expand=Responsavel&$Filter=(Id eq ${params.id})`,
        );

        const response = resp.results[0];

        const dataCriadoIsoDate = response.Created && parseISO(response.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...response,
          Created: dataCriado,
          Responsavel: response?.Responsavel?.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/spo/records/eyewash_shower/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: EyewashShowerModal) => {
      const dataUpdate = {
        Sin: values.Sin,
        Obs: values.Obs,
        Insp: values.Insp,
        Press: values.Press,
        Agua: values.Agua,
        Observacao: values.Observacao,
      };

      await crudParent.updateItemList('Chuveiro Lava Olhos', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eyewash_shower_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['eyewash_shower_data_spo'] });

      const timeoutId = setTimeout(() => {
        setEyewashShowerItem(null);
        navigate('/spo/records/eyewash_shower');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: EyewashShowerModal = {
    Id: eyewashShowerModal.data?.Id || 0,
    Created: eyewashShowerModal.data?.Created || null,
    Responsavel: eyewashShowerModal.data?.Responsavel || '',

    Sin: eyewashShowerModal.data?.Sin || false,
    Obs: eyewashShowerModal.data?.Obs || false,
    Insp: eyewashShowerModal.data?.Insp || false,
    Press: eyewashShowerModal.data?.Press || false,
    Agua: eyewashShowerModal.data?.Agua || false,

    Observacao: eyewashShowerModal.data?.Observacao || '',
    UF: eyewashShowerModal.data?.UF || '',
    Municipios: eyewashShowerModal.data?.Municipios || '',
    Site: eyewashShowerModal.data?.Site || '',
    Local: eyewashShowerModal.data?.Local || '',
    Area: eyewashShowerModal.data?.Area || '',
  };

  const handleSubmit = async (values: EyewashShowerModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: EyewashShowerModal) => {
      handleSubmit(values);
    },
  });

  return {
    eyewashShowerItem,
    setEyewashShowerItem,
    eyewashShowerModal,
    mutateEdit,
    formik,
  };
};
