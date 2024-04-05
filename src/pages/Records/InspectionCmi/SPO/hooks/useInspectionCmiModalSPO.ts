import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { InspectionCmiModal } from '../types/InspectionCmiSPO';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useInspectionCmiModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const { crudParent } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [inspectionCmiItem, setInspectionCmiItem] = useState<boolean | null>(null);

  const cmiInspectionModal = useQuery({
    queryKey: ['cmi_inspection_data_modal_spo', params.id],
    queryFn: async () => {
      if (params.id) {
        const resp = await crudParent.getListItemsv2(
          '	Casa_de_Bombas',
          `?$Select=Id,Created,Responsavel1/Title,OData__x0050_e1,OData__x0050_e2,OData__x0050_e3,OData__x0050_e4,OData__x0050_e5,OData__x0052_es1,OData__x0052_es2,OData__x0052_es3,OData__x0052_es4,OData__x0052_es5,OData__x0052_es6,OData__x0052_es7,OData__x0042_i1,OData__x0042_i2,OData__x0042_i3,OData__x0042_i4,OData__x0042_i5,OData__x0042_i6,OData__x0044_iv1,OData__x0044_iv2,OData__x0044_iv3,OData__x0044_iv4,OData__x0044_iv5,OData__x0044_iv6,OData__x0047_er1,OData__x0047_er2,OData__x0047_er3,OData__x0047_er4,OData__x0043_b1,OData__x0043_b2,OData__x0043_b3,OData__x0043_b4,OData__x0043_b5,Observacao,UF,Municipios,Site,Local,Area,codigo,Title&$Expand=Responsavel1&$Filter=(Id eq ${params.id})`,
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
    enabled: params.id !== undefined && pathname === `/records/cmi_inspection/${params.id}` && user_site === 'SPO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: InspectionCmiModal) => {
      const dataUpdate = {
        OData__x0050_e1: values.OData__x0050_e1,
        OData__x0050_e2: values.OData__x0050_e2,
        OData__x0050_e3: values.OData__x0050_e3,
        OData__x0050_e4: values.OData__x0050_e4,
        OData__x0050_e5: values.OData__x0050_e5,
        OData__x0052_es1: values.OData__x0052_es1,
        OData__x0052_es2: values.OData__x0052_es2,
        OData__x0052_es3: values.OData__x0052_es3,
        OData__x0052_es4: values.OData__x0052_es4,
        OData__x0052_es5: values.OData__x0052_es5,
        OData__x0052_es6: values.OData__x0052_es6,
        OData__x0052_es7: values.OData__x0052_es7,
        OData__x0042_i1: values.OData__x0042_i1,
        OData__x0042_i2: values.OData__x0042_i2,
        OData__x0042_i3: values.OData__x0042_i3,
        OData__x0042_i4: values.OData__x0042_i4,
        OData__x0042_i5: values.OData__x0042_i5,
        OData__x0042_i6: values.OData__x0042_i6,
        OData__x0044_iv1: values.OData__x0044_iv1,
        OData__x0044_iv2: values.OData__x0044_iv2,
        OData__x0044_iv3: values.OData__x0044_iv3,
        OData__x0044_iv4: values.OData__x0044_iv4,
        OData__x0044_iv5: values.OData__x0044_iv5,
        OData__x0044_iv6: values.OData__x0044_iv6,
        OData__x0047_er1: values.OData__x0047_er1,
        OData__x0047_er2: values.OData__x0047_er2,
        OData__x0047_er3: values.OData__x0047_er3,
        OData__x0047_er4: values.OData__x0047_er4,
        OData__x0043_b1: values.OData__x0043_b1,
        OData__x0043_b2: values.OData__x0043_b2,
        OData__x0043_b3: values.OData__x0043_b3,
        OData__x0043_b4: values.OData__x0043_b4,
        OData__x0043_b5: values.OData__x0043_b5,
        Observacao: values.Observacao,
      };

      await crudParent.updateItemList('Casa_de_Bombas', values.Id, dataUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cmi_inspection_data_modal_spo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['cmi_inspection_data_spo'] });

      const timeoutId = setTimeout(() => {
        setInspectionCmiItem(null);
        navigate('/records/cmi_inspection');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: InspectionCmiModal = {
    Id: cmiInspectionModal.data?.Id || 0,
    Created: cmiInspectionModal.data?.Created || null,
    Responsavel1: cmiInspectionModal.data?.Responsavel1 || '',

    OData__x0050_e1: cmiInspectionModal.data?.OData__x0050_e1 || false,
    OData__x0050_e2: cmiInspectionModal.data?.OData__x0050_e2 || false,
    OData__x0050_e3: cmiInspectionModal.data?.OData__x0050_e3 || false,
    OData__x0050_e4: cmiInspectionModal.data?.OData__x0050_e4 || false,
    OData__x0050_e5: cmiInspectionModal.data?.OData__x0050_e5 || false,
    OData__x0052_es1: cmiInspectionModal.data?.OData__x0052_es1 || false,
    OData__x0052_es2: cmiInspectionModal.data?.OData__x0052_es2 || false,
    OData__x0052_es3: cmiInspectionModal.data?.OData__x0052_es3 || false,
    OData__x0052_es4: cmiInspectionModal.data?.OData__x0052_es4 || false,
    OData__x0052_es5: cmiInspectionModal.data?.OData__x0052_es5 || false,
    OData__x0052_es6: cmiInspectionModal.data?.OData__x0052_es6 || false,
    OData__x0052_es7: cmiInspectionModal.data?.OData__x0052_es7 || false,
    OData__x0042_i1: cmiInspectionModal.data?.OData__x0042_i1 || false,
    OData__x0042_i2: cmiInspectionModal.data?.OData__x0042_i2 || false,
    OData__x0042_i3: cmiInspectionModal.data?.OData__x0042_i3 || false,
    OData__x0042_i4: cmiInspectionModal.data?.OData__x0042_i4 || false,
    OData__x0042_i5: cmiInspectionModal.data?.OData__x0042_i5 || false,
    OData__x0042_i6: cmiInspectionModal.data?.OData__x0042_i6 || false,
    OData__x0044_iv1: cmiInspectionModal.data?.OData__x0044_iv1 || false,
    OData__x0044_iv2: cmiInspectionModal.data?.OData__x0044_iv2 || false,
    OData__x0044_iv3: cmiInspectionModal.data?.OData__x0044_iv3 || false,
    OData__x0044_iv4: cmiInspectionModal.data?.OData__x0044_iv4 || false,
    OData__x0044_iv5: cmiInspectionModal.data?.OData__x0044_iv5 || false,
    OData__x0044_iv6: cmiInspectionModal.data?.OData__x0044_iv6 || false,
    OData__x0047_er1: cmiInspectionModal.data?.OData__x0047_er1 || false,
    OData__x0047_er2: cmiInspectionModal.data?.OData__x0047_er2 || false,
    OData__x0047_er3: cmiInspectionModal.data?.OData__x0047_er3 || false,
    OData__x0047_er4: cmiInspectionModal.data?.OData__x0047_er4 || false,
    OData__x0043_b1: cmiInspectionModal.data?.OData__x0043_b1 || false,
    OData__x0043_b2: cmiInspectionModal.data?.OData__x0043_b2 || false,
    OData__x0043_b3: cmiInspectionModal.data?.OData__x0043_b3 || false,
    OData__x0043_b4: cmiInspectionModal.data?.OData__x0043_b4 || false,
    OData__x0043_b5: cmiInspectionModal.data?.OData__x0043_b5 || false,

    Observacao: cmiInspectionModal.data?.Observacao || '',
    UF: cmiInspectionModal.data?.UF || '',
    Municipios: cmiInspectionModal.data?.Municipios || '',
    Site: cmiInspectionModal.data?.Site || '',
    Local: cmiInspectionModal.data?.Local || '',
    Area: cmiInspectionModal.data?.Area || '',
  };

  const handleSubmit = async (values: InspectionCmiModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: InspectionCmiModal) => {
      handleSubmit(values);
    },
  });

  return {
    inspectionCmiItem,
    setInspectionCmiItem,
    cmiInspectionModal,
    mutateEdit,
    formik,
  };
};

export default useInspectionCmiModalSPO;
