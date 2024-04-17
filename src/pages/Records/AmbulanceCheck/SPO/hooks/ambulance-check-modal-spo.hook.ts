import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AmbulanceCheckModal } from '../types/ambulance-check.types';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useAmbulanceCheckModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [ambulanceCheckItem, setAmbulanceCheckItem] = useState<boolean | null>(null);

  const ambulanceCheckModal = useQuery({
    queryKey: ['ambulance_check_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id) {
        const resp = await crudParent.getListItemsv2(
          'Passagem_Bombeiro',
          `?$Select=Id,Created,Responsavel1/Title,UF,Municipios,Site,OData__x0056_er1,OData__x0056_er2,OData__x0056_er3,OData__x0056_er4,OData__x0056_er5,OData__x0056_er6,OData__x0056_er7,OData__x0056_er8,OData__x0056_er9,OData__x0056_er10,OData__x0056_er11&$Expand=Responsavel1&$Filter=(Id eq ${params.id})`,
        );

        const ambulanceCheck = resp.results[0];

        const dataCriadoIsoDate = ambulanceCheck.Created && parseISO(ambulanceCheck.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...ambulanceCheck,
          Created: dataCriado,
          Responsavel1: ambulanceCheck?.Responsavel1?.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/records/ambulance_check/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: AmbulanceCheckModal) => {
      const dataUpdate = {
        OData__x0056_er1: values.OData__x0056_er1,
        OData__x0056_er2: values.OData__x0056_er2,
        OData__x0056_er3: values.OData__x0056_er3,
        OData__x0056_er4: values.OData__x0056_er4,
        OData__x0056_er5: values.OData__x0056_er5,
        OData__x0056_er6: values.OData__x0056_er6,
        OData__x0056_er7: values.OData__x0056_er7,
        OData__x0056_er8: values.OData__x0056_er8,
        OData__x0056_er9: values.OData__x0056_er9,
        OData__x0056_er10: values.OData__x0056_er10,
        OData__x0056_er11: values.OData__x0056_er11,

        Observacao: values.Observacao,
      };

      await crudParent.updateItemList('Passagem_Bombeiro', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambulance_check_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['ambulance_check_data_spo'] });

      const timeoutId = setTimeout(() => {
        setAmbulanceCheckItem(null);
        navigate('/records/ambulance_check');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: AmbulanceCheckModal = {
    Id: ambulanceCheckModal.data?.Id || 0,
    Created: ambulanceCheckModal.data?.Created || null,
    Responsavel1: ambulanceCheckModal.data?.Responsavel1 || '',
    UF: ambulanceCheckModal.data?.UF || '',
    Municipios: ambulanceCheckModal.data?.Municipios || '',
    Site: ambulanceCheckModal.data?.Site || '',
    OData__x0056_er1: ambulanceCheckModal.data?.OData__x0056_er1 || false,
    OData__x0056_er2: ambulanceCheckModal.data?.OData__x0056_er2 || false,
    OData__x0056_er3: ambulanceCheckModal.data?.OData__x0056_er3 || false,
    OData__x0056_er4: ambulanceCheckModal.data?.OData__x0056_er4 || false,
    OData__x0056_er5: ambulanceCheckModal.data?.OData__x0056_er5 || false,
    OData__x0056_er6: ambulanceCheckModal.data?.OData__x0056_er6 || false,
    OData__x0056_er7: ambulanceCheckModal.data?.OData__x0056_er7 || false,
    OData__x0056_er8: ambulanceCheckModal.data?.OData__x0056_er8 || false,
    OData__x0056_er9: ambulanceCheckModal.data?.OData__x0056_er9 || false,
    OData__x0056_er10: ambulanceCheckModal.data?.OData__x0056_er10 || false,
    OData__x0056_er11: ambulanceCheckModal.data?.OData__x0056_er11 || false,

    Observacao: ambulanceCheckModal.data?.Observacao || '',
  };

  const handleSubmit = async (values: AmbulanceCheckModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: AmbulanceCheckModal) => {
      handleSubmit(values);
    },
  });

  return {
    ambulanceCheckItem,
    setAmbulanceCheckItem,
    ambulanceCheckModal,
    mutateEdit,
    formik,
  };
};

export default useAmbulanceCheckModalSPO;
