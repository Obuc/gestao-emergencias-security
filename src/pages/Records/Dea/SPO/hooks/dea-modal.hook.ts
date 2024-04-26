import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DeaModal } from '../types/dea.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useDeaModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [deaItem, setDeaItem] = useState<boolean | null>(null);

  const deaModal = useQuery({
    queryKey: ['dea_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id) {
        const resp = await crudParent.getListItemsv2(
          'Dea',
          `?$Select=Id,Responsavel/Title,CodDea,Site,Area,Created,Sin,Int,Obst,Clb,Val,Pas,Obs,UF,Municipios,Local,LocEsp&$Expand=Responsavel&$Filter=(Id eq ${params.id})`,
        );

        const dea = resp.results[0];

        const dataCriadoIsoDate = dea.Created && parseISO(dea.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...dea,
          Created: dataCriado,
          Responsavel: dea?.Responsavel?.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/spo/records/dea/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: DeaModal) => {
      const dataUpdate = {
        Sin: values.Sin,
        Int: values.Int,
        Obst: values.Obst,
        Clb: values.Clb,
        Val: values.Val,
        Pas: values.Pas,
        Obs: values.Obs,
      };

      await crudParent.updateItemList('Dea', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dea_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['dea_data_spo'] });

      const timeoutId = setTimeout(() => {
        setDeaItem(null);
        navigate('/spo/records/dea');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: DeaModal = {
    Id: deaModal.data?.Id || 0,
    Created: deaModal.data?.Created || null,
    Responsavel: deaModal.data?.Responsavel || '',
    CodDea: deaModal.data?.CodDea || '',
    Sin: deaModal.data?.Sin || false,
    Int: deaModal.data?.Int || false,
    Obst: deaModal.data?.Obst || false,
    Clb: deaModal.data?.Clb || false,
    Val: deaModal.data?.Val || false,
    Pas: deaModal.data?.Pas || false,
    Obs: deaModal.data?.Obs || '',
    UF: deaModal.data?.UF || '',
    Municipios: deaModal.data?.Municipios || '',
    Site: deaModal.data?.Site || '',
    LocEsp: deaModal.data?.LocEsp || '',
    Local: deaModal.data?.Local || '',
    Area: deaModal.data?.Area || '',
  };

  const handleSubmit = async (values: DeaModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: DeaModal) => {
      handleSubmit(values);
    },
  });

  return {
    deaItem,
    setDeaItem,
    deaModal,
    mutateEdit,
    formik,
  };
};
