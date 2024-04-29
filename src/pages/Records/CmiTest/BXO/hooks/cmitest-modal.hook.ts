import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ResponstaTestCmi, TestCmiDataModal } from '../types/cmitest.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useTestCmiModalBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [testCmiItem, setTestCmiItem] = useState<boolean | null>(null);

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const fetchCmiData = async () => {
    const pathModal = `?$Select=*,bombeiro_id/Title&$expand=bombeiro_id&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_teste_cmi', pathModal);
    return resp.results[0];
  };

  const fetchEquipmentCmiData = async (cmiId: number) => {
    const cmiResponse = await crud.getListItemsv2(
      'equipamentos_diversos',
      `?$Select=Id,predio/Title,site/Title,conforme,cod_qrcode&$expand=predio,site&$Filter=(Id eq ${cmiId})`,
    );
    return cmiResponse.results[0] || null;
  };

  const fetchResponseTestCmi = async () => {
    const response = await crud.getListItemsv2(
      'respostas_teste_cmi',
      `?$Select=Id,cmi_idId,pergunta_idId,registro_idId,resposta,resposta_2,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
    );

    const respostasPorCategoria: Record<string, Array<ResponstaTestCmi>> = {};
    response.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const testCmiModal = useQuery({
    queryKey: ['teste_cmi_data_modal_bxo', params.id],
    queryFn: async () => {
      if (params.id) {
        const cmiData = await fetchCmiData();
        const cmi = await fetchEquipmentCmiData(cmiData.cmi_idId);
        const respostas = await fetchResponseTestCmi();

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
    enabled: params.id !== undefined && pathname === `/bxo/records/cmi_test/${params.id}` && user_site === 'BXO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: TestCmiDataModal) => {
      const idRecordTestCmi = values.Id;
      const idCmi = +values.cmi.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && testCmiModal.data.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = testCmiModal.data.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            hasAccording.push(item.resposta);

            if (item.resposta !== itemOriginal.resposta || item.resposta_2 !== itemOriginal.resposta_2) {
              const postData = {
                resposta: item.resposta,
                resposta_2: item.resposta_2,
              };

              await crud.updateItemList('respostas_teste_cmi', item.Id, postData);
            }
          }
        }
      }

      const hasFalseAccording = hasAccording.some((item) => item === false);

      if (hasFalseAccording) {
        await crud.updateItemList('registros_teste_cmi', idRecordTestCmi, {
          conforme: false,
        });
        await crud.updateItemList('equipamentos_diversos', idCmi, {
          conforme: false,
        });
      }

      if (!hasFalseAccording) {
        await crud.updateItemList('registros_teste_cmi', idRecordTestCmi, {
          conforme: true,
        });
        await crud.updateItemList('equipamentos_diversos', idCmi, {
          conforme: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teste_cmi_data_modal_bxo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['test_cmi_data_bxo'] });

      const timeoutId = setTimeout(() => {
        setTestCmiItem(null);
        navigate('/bxo/records/cmi_test');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: TestCmiDataModal = {
    Created: testCmiModal.data?.Created || '',
    Id: testCmiModal.data?.Id || 0,
    bombeiro: testCmiModal.data?.bombeiro ?? '',
    cmi: {
      Id: testCmiModal.data?.cmi?.Id || '',
      site: testCmiModal.data?.cmi?.site || '',
      predio: testCmiModal.data?.cmi?.predio || '',
      local: testCmiModal.data?.cmi?.local || '',
      validade: testCmiModal.data?.cmi?.validade || '',
      conforme: testCmiModal.data?.cmi?.conforme || false,
      cod_qrcode: testCmiModal.data?.cmi?.cod_qrcode || '',
    },
    respostas: testCmiModal.data?.respostas || {},
    observacao: testCmiModal.data?.observacao || '',
  };

  const handleSubmit = async (values: TestCmiDataModal) => {
    if (values) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: TestCmiDataModal) => {
      handleSubmit(values);
    },
  });

  return {
    testCmiModal,
    mutateEdit,
    testCmiItem,
    setTestCmiItem,
    formik,
  };
};
