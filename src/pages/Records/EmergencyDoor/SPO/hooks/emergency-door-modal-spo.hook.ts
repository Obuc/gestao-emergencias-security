import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { EmergencyDoorModal } from '../types/emergency-door.types';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useEmergencyDoorModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [emergencyDoorItem, setEmergencyDoorItem] = useState<boolean | null>(null);

  const emergencyDoorModal = useQuery({
    queryKey: ['emergency_door_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id) {
        const resp = await crudParent.getListItemsv2(
          'Portas_de_Emergencia',
          `?$Select=Id,Created,Responsavel1/Title,UF,Municipios,Site,Area,Local,LocalEsp,Obst,Func,Reparo,Abertura,Observacao&$Expand=Responsavel1&$Filter=(Id eq ${params.id})`,
        );

        const emergencyDoor = resp.results[0];

        const dataCriadoIsoDate = emergencyDoor.Created && parseISO(emergencyDoor.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...emergencyDoor,
          Created: dataCriado,
          Responsavel1: emergencyDoor?.Responsavel1?.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/records/emergency_doors/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: EmergencyDoorModal) => {
      const dataUpdate = {
        Obst: values.Obst,
        Func: values.Func,
        Reparo: values.Reparo,
        Abertura: values.Abertura,

        Observacao: values.Observacao,
      };

      await crudParent.updateItemList('Portas_de_Emergencia', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency_door_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['emergency_door_data_spo'] });

      const timeoutId = setTimeout(() => {
        setEmergencyDoorItem(null);
        navigate('/records/emergency_doors');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: EmergencyDoorModal = {
    Id: emergencyDoorModal.data?.Id || 0,
    Created: emergencyDoorModal.data?.Created || null,
    Responsavel1: emergencyDoorModal.data?.Responsavel1 || '',
    UF: emergencyDoorModal.data?.UF || '',
    Municipios: emergencyDoorModal.data?.Municipios || '',
    Site: emergencyDoorModal.data?.Site || '',
    Local: emergencyDoorModal.data?.Local || '',
    LocalEsp: emergencyDoorModal.data?.LocalEsp || '',
    Area: emergencyDoorModal.data?.Area || '',
    Obst: emergencyDoorModal.data?.Obst || false,
    Func: emergencyDoorModal.data?.Func || false,
    Reparo: emergencyDoorModal.data?.Reparo || false,
    Abertura: emergencyDoorModal.data?.Abertura || false,
    Observacao: emergencyDoorModal.data?.Observacao || '',
  };

  const handleSubmit = async (values: EmergencyDoorModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: EmergencyDoorModal) => {
      handleSubmit(values);
    },
  });

  return {
    emergencyDoorItem,
    setEmergencyDoorItem,
    emergencyDoorModal,
    mutateEdit,
    formik,
  };
};

export default useEmergencyDoorModalSPO;
