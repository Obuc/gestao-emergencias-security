import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { InspectionCmiModal, ResponstaInspectionCMI } from '../types/cmi-inspection.types';

export const useInspectionCmiModalBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [inspectionCmi, setInspectionCmi] = useState<boolean | null>(null);

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const fetchCmiData = async () => {
    const pathModal = `?$Select=*,bombeiro_id/Title&$expand=bombeiro_id&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_inspecao_cmi', pathModal);
    return resp.results[0];
  };

  const fetchEquipmentCmiData = async (cmiId: number) => {
    const cmiResponse = await crud.getListItemsv2(
      'equipamentos_diversos',
      `?$Select=Id,predio/Title,site/Title,conforme,cod_qrcode&$expand=predio,site&$Filter=(Id eq ${cmiId})`,
    );
    return cmiResponse.results[0] || null;
  };

  const fetchResponseInspectionCmi = async () => {
    const response = await crud.getListItemsv2(
      'respostas_inspecao_cmi',
      `?$Select=Id,cmi_idId,pergunta_idId,registro_idId,resposta,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
    );

    const respostasPorCategoria: Record<string, Array<ResponstaInspectionCMI>> = {};
    response.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const inspectionCmiModal = useQuery({
    queryKey: ['inspection_cmi_data_modal_bxo', params.id],
    queryFn: async () => {
      if (params.id) {
        const cmiData = await fetchCmiData();
        const cmi = await fetchEquipmentCmiData(cmiData.cmi_idId);
        const respostas = await fetchResponseInspectionCmi();

        const dataCriadoIsoDate = cmiData.Created && parseISO(cmiData.Created);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const cmiValues = cmi
          ? {
              Id: cmi.Id,
              site: cmi.site.Title,
              predio: cmi.predio.Title,
              conforme: cmi.conforme,
              cod_qrcode: cmi.cod_qrcode,
            }
          : null;

        return {
          ...cmiData,
          Created: dataCriado,
          bombeiro: cmiData.bombeiro_id?.Title,
          cmi: cmiValues,
          respostas: respostas,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/bxo/records/cmi_inspection/${params.id}` && user_site === 'BXO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: InspectionCmiModal) => {
      const idRecordTestCmi = values.Id;
      const idCmi = +values.cmi.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && inspectionCmiModal.data.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = inspectionCmiModal.data.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            hasAccording.push(item.resposta);

            if (item.resposta !== itemOriginal.resposta) {
              const postData = {
                resposta: item.resposta,
              };

              await crud.updateItemList('respostas_inspecao_cmi', item.Id, postData);
            }
          }
        }
      }

      const hasFalseAccording = hasAccording.some((item) => item === false);

      if (hasFalseAccording) {
        await crud.updateItemList('registros_inspecao_cmi', idRecordTestCmi, {
          conforme: false,
        });
        await crud.updateItemList('equipamentos_diversos', idCmi, {
          conforme: false,
        });
      }

      if (!hasFalseAccording) {
        await crud.updateItemList('registros_inspecao_cmi', idRecordTestCmi, {
          conforme: true,
        });
        await crud.updateItemList('equipamentos_diversos', idCmi, {
          conforme: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection_cmi_data_modal_bxo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['inspection_cmi_data_bxo'] });

      const timeoutId = setTimeout(() => {
        setInspectionCmi(null);
        navigate('/bxo/records/cmi_inspection');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: InspectionCmiModal = {
    Created: inspectionCmiModal.data?.Created || '',
    Id: inspectionCmiModal.data?.Id || 0,
    bombeiro: inspectionCmiModal.data?.bombeiro ?? '',
    cmi: {
      Id: inspectionCmiModal.data?.cmi?.Id || '',
      site: inspectionCmiModal.data?.cmi?.site || '',
      predio: inspectionCmiModal.data?.cmi?.predio || '',
      local: inspectionCmiModal.data?.cmi?.local || '',
      validade: inspectionCmiModal.data?.cmi?.validade || '',
      conforme: inspectionCmiModal.data?.cmi?.conforme || false,
      cod_qrcode: inspectionCmiModal.data?.cmi?.cod_qrcode || '',
    },
    respostas: inspectionCmiModal.data?.respostas || {},
    novo: inspectionCmiModal.data?.novo || false,
    observacao: inspectionCmiModal.data?.observacao || '',
  };

  const handleSubmit = async (values: InspectionCmiModal) => {
    if (values) {
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
    inspectionCmiModal,
    mutateEdit,
    inspectionCmi,
    setInspectionCmi,
    formik,
  };
};
