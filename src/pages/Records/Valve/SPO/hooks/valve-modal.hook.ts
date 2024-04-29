import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { GovernanceValveModal } from '../types/valve.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useValveModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [governanceValveItem, setGovernanceValveItem] = useState<boolean | null>(null);

  const governanceValveModal = useQuery({
    queryKey: ['governance_valve_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id && pathname === `/spo/records/valve/${params.id}` && user_site === 'SPO') {
        const resp = await crudParent.getListItemsv2(
          'Valvulas_de_Governo',
          `?$Select=Id,Created,Responsavel1/Title,OData__x0054_mp1,OData__x0054_mp2,OData__x0046_cn1,OData__x0046_cn2,OData__x0046_cn3,OData__x0046_cn4,OData__x004c_cr1,OData__x0053_in1,OData__x004c_cr2,OData__x004f_bs1,Obst2,Observacao,UF,Municipios,Site,Local,Area,codigo,Title&$Expand=Responsavel1&$Filter=(Id eq ${params.id})`,
        );

        const governanceValve = resp.results[0];

        const dataCriadoIsoDate = governanceValve.Created && parseISO(governanceValve.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...governanceValve,
          Created: dataCriado,
          Responsavel1: governanceValve?.Responsavel1?.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/spo/records/valve/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: GovernanceValveModal) => {
      const dataUpdate = {
        OData__x0054_mp1: values.OData__x0054_mp1,
        OData__x0054_mp2: values.OData__x0054_mp2,
        OData__x0046_cn1: values.OData__x0046_cn1,
        OData__x0046_cn2: values.OData__x0046_cn2,
        OData__x0046_cn3: values.OData__x0046_cn3,
        OData__x0046_cn4: values.OData__x0046_cn4,
        OData__x0053_in1: values.OData__x0053_in1,
        OData__x004c_cr1: values.OData__x004c_cr1,
        OData__x004c_cr2: values.OData__x004c_cr2,
        OData__x004f_bs1: values.OData__x004f_bs1,
        Obst2: values.Obst2,
        Observacao: values.Observacao,
      };

      await crudParent.updateItemList('Valvulas_de_Governo', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance_valve_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['governance_valve_data_spo'] });

      const timeoutId = setTimeout(() => {
        setGovernanceValveItem(null);
        navigate('/spo/records/valves');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: GovernanceValveModal = {
    Id: governanceValveModal.data?.Id || 0,
    Created: governanceValveModal.data?.Created || null,
    Responsavel1: governanceValveModal.data?.Responsavel1 || '',
    OData__x0054_mp1: governanceValveModal.data?.OData__x0054_mp1 || false,
    OData__x0054_mp2: governanceValveModal.data?.OData__x0054_mp2 || false,
    OData__x0046_cn1: governanceValveModal.data?.OData__x0046_cn1 || false,
    OData__x0046_cn2: governanceValveModal.data?.OData__x0046_cn2 || false,
    OData__x0046_cn3: governanceValveModal.data?.OData__x0046_cn3 || false,
    OData__x0046_cn4: governanceValveModal.data?.OData__x0046_cn4 || false,
    OData__x0053_in1: governanceValveModal.data?.OData__x0053_in1 || false,
    OData__x004c_cr1: governanceValveModal.data?.OData__x004c_cr1 || false,
    OData__x004c_cr2: governanceValveModal.data?.OData__x004c_cr2 || false,
    OData__x004f_bs1: governanceValveModal.data?.OData__x004f_bs1 || false,
    Obst2: governanceValveModal.data?.Obst2 || false,
    Observacao: governanceValveModal.data?.Observacao || '',
    UF: governanceValveModal.data?.UF || '',
    Municipios: governanceValveModal.data?.Municipios || '',
    Site: governanceValveModal.data?.Site || '',
    Local: governanceValveModal.data?.Local || '',
    Area: governanceValveModal.data?.Area || '',
    codigo: governanceValveModal.data?.codigo || '',
    Title: governanceValveModal.data?.Title || '',
  };

  const handleSubmit = async (values: GovernanceValveModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: GovernanceValveModal) => {
      handleSubmit(values);
    },
  });

  return {
    governanceValveItem,
    setGovernanceValveItem,
    governanceValveModal,
    mutateEdit,
    formik,
  };
};
