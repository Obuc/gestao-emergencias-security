import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { GovernanceValve, RespostaValvulas } from '../types/valve.types';

export const useValveModalBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [governanceValveItem, setGovernanceValveItem] = useState<boolean | null>(null);

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const fetchGovernaceValveModalData = async () => {
    const pathModal = `?$Select=*,bombeiro_id/Title&$expand=bombeiro_id&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_valvula_governo', pathModal);
    return resp.results[0];
  };

  const fetchGovernaceValveData = async (valveId: number) => {
    const response = await crud.getListItemsv2(
      'equipamentos_diversos',
      `?$Select=Id,tipo_equipamento/Title,predio/Title,site/Title,pavimento/Title,local/Title,cod_equipamento,conforme,cod_qrcode,excluido&$expand=predio,pavimento,local,tipo_equipamento,site&$Filter=((Id eq ${valveId}) and (tipo_equipamento/Title eq 'Válvulas de Governo'))`,
    );
    return response.results[0] || null;
  };

  const fetchRespostasValvulas = async () => {
    const response = await crud.getListItemsv2(
      'respostas_valvula_governo',
      `?$Select=Id,valvula_idId,pergunta_idId,registro_idId,resposta,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
    );

    const respostasPorCategoria: Record<string, Array<RespostaValvulas>> = {};
    response.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const governaceValveModal = useQuery({
    queryKey: ['governace_valve_modal_bxo', params.id],
    queryFn: async () => {
      if (params.id) {
        const governaceValveModalData = await fetchGovernaceValveModalData();
        const valvula = await fetchGovernaceValveData(governaceValveModalData.valvula_idId);
        const respostas = await fetchRespostasValvulas();

        const dataCriadoIsoDate = governaceValveModalData.Created && parseISO(governaceValveModalData.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const valvulaValues = valvula
          ? {
              Id: valvula.Id,
              site: valvula.site.Title,
              predio: valvula.predio.Title,
              pavimento: valvula.pavimento.Title,
              local: valvula.local.Title,
              validade: valvula.validade,
              conforme: valvula.conforme,
              cod_qrcode: valvula.cod_qrcode,
              cod_equipamento: valvula.cod_equipamento,
            }
          : null;

        return {
          ...governaceValveModalData,
          Created: dataCriado,
          bombeiro: governaceValveModalData.bombeiro_id.Title,
          valvula: valvulaValues,
          respostas: respostas,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/bxo/records/valve/${params.id}` && user_site === 'BXO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: GovernanceValve) => {
      const idRegistrosValvulaGoverno = values.Id;
      const idValvulaGoverno = +values.valvula.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && governaceValveModal.data.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = governaceValveModal.data.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            hasAccording.push(item.resposta);

            if (item.resposta !== itemOriginal.resposta) {
              const postData = {
                resposta: item.resposta,
              };

              await crud.updateItemList('respostas_valvula_governo', item.Id, postData);
            }
          }
        }

        const hasFalseAccording = hasAccording.some((item) => item === false);

        if (hasFalseAccording) {
          await crud.updateItemList('registros_valvula_governo', idRegistrosValvulaGoverno, {
            conforme: false,
          });
          await crud.updateItemList('equipamentos_diversos', idValvulaGoverno, {
            conforme: false,
          });
        }

        if (!hasFalseAccording) {
          await crud.updateItemList('registros_valvula_governo', idRegistrosValvulaGoverno, {
            conforme: true,
          });
          await crud.updateItemList('equipamentos_diversos', idValvulaGoverno, {
            conforme: true,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governace_valve_modal_bxo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['governance_valve_data_bxo'] });

      const timeoutId = setTimeout(() => {
        setGovernanceValveItem(null);
        navigate('/bxo/records/valve');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: GovernanceValve = {
    Created: governaceValveModal.data?.Created || '',
    Id: governaceValveModal.data?.Id || 0,
    bombeiro: governaceValveModal.data?.bombeiro ?? '',
    conforme: governaceValveModal.data?.conforme ?? '',
    valvula: {
      Id: governaceValveModal.data?.valvula?.Id || '',
      site: governaceValveModal.data?.valvula?.site || '',
      predio: governaceValveModal.data?.valvula?.predio || '',
      pavimento: governaceValveModal.data?.valvula?.pavimento || '',
      local: governaceValveModal.data?.valvula?.local || '',
      conforme: governaceValveModal.data?.valvula?.conforme || false,
      cod_qrcode: governaceValveModal.data?.valvula?.cod_qrcode || '',
      cod_equipamento: governaceValveModal.data?.valvula?.cod_equipamento || '',
    },
    respostas: governaceValveModal.data?.respostas || {},
    observacao: governaceValveModal.data?.observacao || '',
  };

  const handleSubmit = async (values: GovernanceValve) => {
    if (values) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: GovernanceValve) => {
      handleSubmit(values);
    },
  });

  return {
    governaceValveModal,
    mutateEdit,
    governanceValveItem,
    setGovernanceValveItem,
    formik,
  };
};
