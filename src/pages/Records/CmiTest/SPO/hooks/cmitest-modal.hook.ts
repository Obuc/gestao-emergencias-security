import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { TestCmiModal } from '../types/cmitest.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useTestCmiModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [testCmiItem, setTestCmiItem] = useState<boolean | null>(null);

  const cmiTestModal = useQuery({
    queryKey: ['cmi_test_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id) {
        const resp = await crudParent.getListItemsv2(
          '	Bombas_de_Incendio',
          `?$Select=Id,Created,Responsavel1/Title,OData__x0042_j11,OData__x0042_j12,OData__x0042_j13,OData__x0042_j14,OData__x0042_j21,OData__x0042_j22,OData__x0042_j23,OData__x0042_j24,OData__x0042_p11,OData__x0042_p12,OData__x0042_p13,OData__x0042_p14,OData__x0042_p15,OData__x0042_p21,OData__x0042_p22,OData__x0042_p23,OData__x0042_p24,OData__x0042_p25,OData__x0042_b11,OData__x0042_b12,OData__x0042_b13,OData__x0042_b21,OData__x0042_b22,OData__x0042_b23,OData__x0047_er1,OData__x0047_er2,Observacao,UF,Municipios,Site,Local,Area&$Expand=Responsavel1&$Filter=(Id eq ${params.id})`,
        );

        const cmiInspection = resp.results[0];

        const dataCriadoIsoDate = cmiInspection.Created && parseISO(cmiInspection.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        return {
          ...cmiInspection,
          Created: dataCriado,
          Responsavel1: cmiInspection?.Responsavel1?.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/spo/records/cmi_test/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: TestCmiModal) => {
      const dataUpdate = {
        OData__x0042_j11: values.OData__x0042_j11,
        OData__x0042_j12: values.OData__x0042_j12,
        OData__x0042_j13: values.OData__x0042_j13,
        OData__x0042_j14: values.OData__x0042_j14,
        OData__x0042_j21: values.OData__x0042_j21,
        OData__x0042_j22: values.OData__x0042_j22,
        OData__x0042_j23: values.OData__x0042_j23,
        OData__x0042_j24: values.OData__x0042_j24,
        OData__x0042_p11: values.OData__x0042_p11,
        OData__x0042_p12: values.OData__x0042_p12,
        OData__x0042_p13: values.OData__x0042_p13,
        OData__x0042_p14: values.OData__x0042_p14,
        OData__x0042_p15: values.OData__x0042_p15,
        OData__x0042_p21: values.OData__x0042_p21,
        OData__x0042_p22: values.OData__x0042_p22,
        OData__x0042_p23: values.OData__x0042_p23,
        OData__x0042_p24: values.OData__x0042_p24,
        OData__x0042_p25: values.OData__x0042_p25,
        OData__x0042_b11: values.OData__x0042_b11,
        OData__x0042_b12: values.OData__x0042_b12,
        OData__x0042_b13: values.OData__x0042_b13,
        OData__x0042_b21: values.OData__x0042_b21,
        OData__x0042_b22: values.OData__x0042_b22,
        OData__x0042_b23: values.OData__x0042_b23,
        OData__x0047_er1: values.OData__x0047_er1,
        OData__x0047_er2: values.OData__x0047_er2,
        Observacao: values.Observacao,
      };

      await crudParent.updateItemList('Bombas_de_Incendio', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cmi_test_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['cmi_test_data_spo'] });

      const timeoutId = setTimeout(() => {
        setTestCmiItem(null);
        navigate('/spo/records/cmi_test');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: TestCmiModal = {
    Id: cmiTestModal.data?.Id || 0,
    Created: cmiTestModal.data?.Created || null,
    Responsavel1: cmiTestModal.data?.Responsavel1 || '',
    OData__x0042_j11: cmiTestModal.data?.OData__x0042_j11 || '',
    OData__x0042_j12: cmiTestModal.data?.OData__x0042_j12 || '',
    OData__x0042_j13: cmiTestModal.data?.OData__x0042_j13 || '',
    OData__x0042_j14: cmiTestModal.data?.OData__x0042_j14 || false,
    OData__x0042_j21: cmiTestModal.data?.OData__x0042_j21 || '',
    OData__x0042_j22: cmiTestModal.data?.OData__x0042_j22 || '',
    OData__x0042_j23: cmiTestModal.data?.OData__x0042_j23 || '',
    OData__x0042_j24: cmiTestModal.data?.OData__x0042_j24 || false,
    OData__x0042_p11: cmiTestModal.data?.OData__x0042_p11 || '',
    OData__x0042_p12: cmiTestModal.data?.OData__x0042_p12 || '',
    OData__x0042_p13: cmiTestModal.data?.OData__x0042_p13 || '',
    OData__x0042_p14: cmiTestModal.data?.OData__x0042_p14 || '',
    OData__x0042_p15: cmiTestModal.data?.OData__x0042_p15 || '',
    OData__x0042_p21: cmiTestModal.data?.OData__x0042_p21 || '',
    OData__x0042_p22: cmiTestModal.data?.OData__x0042_p22 || '',
    OData__x0042_p23: cmiTestModal.data?.OData__x0042_p23 || '',
    OData__x0042_p24: cmiTestModal.data?.OData__x0042_p24 || '',
    OData__x0042_p25: cmiTestModal.data?.OData__x0042_p25 || '',
    OData__x0042_b11: cmiTestModal.data?.OData__x0042_b11 || '',
    OData__x0042_b12: cmiTestModal.data?.OData__x0042_b12 || '',
    OData__x0042_b13: cmiTestModal.data?.OData__x0042_b13 || '',
    OData__x0042_b21: cmiTestModal.data?.OData__x0042_b21 || '',
    OData__x0042_b22: cmiTestModal.data?.OData__x0042_b22 || '',
    OData__x0042_b23: cmiTestModal.data?.OData__x0042_b23 || '',
    OData__x0047_er1: cmiTestModal.data?.OData__x0047_er1 || false,
    OData__x0047_er2: cmiTestModal.data?.OData__x0047_er2 || false,
    Observacao: cmiTestModal.data?.Observacao || '',
    UF: cmiTestModal.data?.UF || '',
    Municipios: cmiTestModal.data?.Municipios || '',
    Site: cmiTestModal.data?.Site || '',
    Local: cmiTestModal.data?.Local || '',
    Area: cmiTestModal.data?.Area || '',
  };

  const handleSubmit = async (values: TestCmiModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: TestCmiModal) => {
      handleSubmit(values);
    },
  });

  return {
    testCmiItem,
    setTestCmiItem,
    cmiTestModal,
    mutateEdit,
    formik,
  };
};
