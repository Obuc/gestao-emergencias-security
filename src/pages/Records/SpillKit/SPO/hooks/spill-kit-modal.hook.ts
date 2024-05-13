import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { SpillKitModal } from '../types/spill-kit.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useSpillKitModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [spillKitItem, setSpillKitItem] = useState<boolean | null>(null);

  const spillKitModal = useQuery({
    queryKey: ['spill_kit_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id) {
        const resp = await crudParent.getListItemsv2(
          'Kit_Derramamento_Quimico',
          `?$Select=Id,Created,Responsavel/Title,Local,Sin,Obs,Lacre,Compl,Validade,Observacao,UF,Municipios,Site,Local,Area&$Expand=Responsavel&$Filter=(Id eq ${params.id})`,
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
    enabled: params.id !== undefined && pathname === `/spo/records/spill_kit/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: SpillKitModal) => {
      const dataUpdate = {
        Sin: values.Sin,
        Obs: values.Obs,
        Lacre: values.Lacre,
        Compl: values.Compl,
        Validade: values.Validade,
        Observacao: values.Observacao,
      };

      await crudParent.updateItemList('Kit_Derramamento_Quimico', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spill_kit_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['spill_kit_data_spo'] });

      const timeoutId = setTimeout(() => {
        setSpillKitItem(null);
        navigate('/spo/records/spill_kit');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: SpillKitModal = {
    Id: spillKitModal.data?.Id || 0,
    Created: spillKitModal.data?.Created || null,
    Responsavel: spillKitModal.data?.Responsavel || '',

    Sin: spillKitModal.data?.Sin || false,
    Obs: spillKitModal.data?.Obs || false,
    Lacre: spillKitModal.data?.Lacre || false,
    Compl: spillKitModal.data?.Compl || false,
    Validade: spillKitModal.data?.Validade || false,

    Observacao: spillKitModal.data?.Observacao || '',
    UF: spillKitModal.data?.UF || '',
    Municipios: spillKitModal.data?.Municipios || '',
    Site: spillKitModal.data?.Site || '',
    Local: spillKitModal.data?.Local || '',
    Area: spillKitModal.data?.Area || '',
  };

  const handleSubmit = async (values: SpillKitModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: SpillKitModal) => {
      handleSubmit(values);
    },
  });

  return {
    spillKitItem,
    setSpillKitItem,
    spillKitModal,
    mutateEdit,
    formik,
  };
};
