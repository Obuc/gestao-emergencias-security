import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { HydrantModal } from '../types/hydrant.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useHydrantModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [hydrantItem, setHydrantItem] = useState<boolean | null>(null);

  const hydrantModal = useQuery({
    queryKey: ['hydrant_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id && pathname === `/spo/records/hydrant/${params.id}` && user_site === 'SPO') {
        const resp = await crudParent.getListItemsv2(
          'Hidrantes',
          `?$Select=Id,Created,Responsavel1/Title,Title,CodLacre,CodMangueira,Local,Pavimento,LocalEsp,OData__x0048_id1,OData__x0048_id2,OData__x0041_bg1,OData__x0041_bg2,OData__x0053_nl1,OData__x0053_nl2,Obst1,Obst2,OData__x004c_cr1,OData__x004c_cr2,Insp1,Insp2,UF,Municipios,Site,Area,Diametro,Comprimento,codigo,Observacao&$Expand=Responsavel1&$Filter=(Id eq ${params.id})`,
        );

        const hydrant = resp.results[0];

        const dataCriadoIsoDate = hydrant.Created && parseISO(hydrant.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...hydrant,
          Created: dataCriado,
          Responsavel1: hydrant?.Responsavel1?.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/spo/records/hydrant/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: HydrantModal) => {
      const dataUpdate = {
        OData__x0048_id1: values.OData__x0048_id1,
        OData__x0048_id2: values.OData__x0048_id2,
        OData__x0041_bg1: values.OData__x0041_bg1,
        OData__x0041_bg2: values.OData__x0041_bg2,
        OData__x0053_nl1: values.OData__x0053_nl1,
        OData__x0053_nl2: values.OData__x0053_nl2,
        Obst1: values.Obst1,
        Obst2: values.Obst2,
        OData__x004c_cr1: values.OData__x004c_cr1,
        OData__x004c_cr2: values.OData__x004c_cr2,
        Insp1: values.Insp1,
        Insp2: values.Insp2,
        Observacao: values.Observacao,
      };

      await crudParent.updateItemList('Hidrantes', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hydrant_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['hydrant_data_spo'] });

      const timeoutId = setTimeout(() => {
        setHydrantItem(null);
        navigate('/spo/records/hydrant');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: HydrantModal = {
    Id: hydrantModal.data?.Id || 0,
    Created: hydrantModal.data?.Created || null,
    Responsavel1: hydrantModal.data?.Responsavel1 || '',
    Title: hydrantModal.data?.Title || '',
    CodLacre: hydrantModal.data?.CodLacre || '',
    CodMangueira: hydrantModal.data?.CodMangueira || '',
    Local: hydrantModal.data?.Local || '',
    Pavimento: hydrantModal.data?.Pavimento || '',
    LocalEsp: hydrantModal.data?.LocalEsp || '',
    OData__x0048_id1: hydrantModal.data?.OData__x0048_id1 || false,
    OData__x0048_id2: hydrantModal.data?.OData__x0048_id2 || false,
    OData__x0041_bg1: hydrantModal.data?.OData__x0041_bg1 || false,
    OData__x0041_bg2: hydrantModal.data?.OData__x0041_bg2 || false,
    OData__x0053_nl1: hydrantModal.data?.OData__x0053_nl1 || false,
    OData__x0053_nl2: hydrantModal.data?.OData__x0053_nl2 || false,
    Obst1: hydrantModal.data?.Obst1 || false,
    Obst2: hydrantModal.data?.Obst2 || false,
    OData__x004c_cr1: hydrantModal.data?.OData__x004c_cr1 || false,
    OData__x004c_cr2: hydrantModal.data?.OData__x004c_cr2 || false,
    Insp1: hydrantModal.data?.Insp1 || false,
    Insp2: hydrantModal.data?.Insp2 || false,
    UF: hydrantModal.data?.UF || '',
    Municipios: hydrantModal.data?.Municipios || '',
    Site: hydrantModal.data?.Site || '',
    Area: hydrantModal.data?.Area || '',
    Diametro: hydrantModal.data?.Diametro || '',
    Comprimento: hydrantModal.data?.Comprimento || '',
    codigo: hydrantModal.data?.codigo || '',
    Observacao: hydrantModal.data?.Observacao || '',
  };

  const handleSubmit = async (values: HydrantModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: HydrantModal) => {
      handleSubmit(values);
    },
  });

  return {
    hydrantItem,
    setHydrantItem,
    hydrantModal,
    mutateEdit,
    formik,
  };
};
