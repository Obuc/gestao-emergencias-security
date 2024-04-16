import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AlarmsModal } from '../types/alarms.types';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useAlarmsModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [alarmsItem, setAlarmsItem] = useState<boolean | null>(null);

  const alarmsModal = useQuery({
    queryKey: ['alarms_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id) {
        const resp = await crudParent.getListItemsv2(
          'Alarmes_de_Incendio',
          `?$Select=Id,Created,Responsavel1/Title,UF,Municipios,Site,Area,Local,Sirene,Luminoso,Observacao&$Expand=Responsavel1&$Filter=(Id eq ${params.id})`,
        );

        const alarms = resp.results[0];

        const dataCriadoIsoDate = alarms.Created && parseISO(alarms.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...alarms,
          Created: dataCriado,
          Responsavel1: alarms?.Responsavel1?.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/records/fire_alarms/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: AlarmsModal) => {
      const dataUpdate = {
        Sirene: values.Sirene,
        Luminoso: values.Luminoso,
        Observacao: values.Observacao,
      };

      await crudParent.updateItemList('Alarmes_de_Incendio', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarms_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['alarms_data_spo'] });

      const timeoutId = setTimeout(() => {
        setAlarmsItem(null);
        navigate('/records/fire_alarms');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: AlarmsModal = {
    Id: alarmsModal.data?.Id || 0,
    Created: alarmsModal.data?.Created || null,
    Responsavel1: alarmsModal.data?.Responsavel1 || '',
    Sirene: alarmsModal.data?.Sirene || false,
    Luminoso: alarmsModal.data?.Luminoso || false,
    UF: alarmsModal.data?.UF || '',
    Municipios: alarmsModal.data?.Municipios || '',
    Site: alarmsModal.data?.Site || '',
    Local: alarmsModal.data?.Local || '',
    Area: alarmsModal.data?.Area || '',
    Observacao: alarmsModal.data?.Observacao || '',
  };

  const handleSubmit = async (values: AlarmsModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: AlarmsModal) => {
      handleSubmit(values);
    },
  });

  return {
    alarmsItem,
    setAlarmsItem,
    alarmsModal,
    mutateEdit,
    formik,
  };
};

export default useAlarmsModalSPO;
