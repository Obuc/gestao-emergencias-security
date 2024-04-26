import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { ExtinguisherAnswers, ExtinguisherDataModal } from '../types/extinguisher.types';

export const useExtinguisherModalBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const fetchExtinguisherData = async () => {
    const pathModal = `?$Select=*&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_extintor', pathModal);
    return resp.results[0];
  };

  const fetchBombeiroData = async (bombeiroId: number) => {
    const bombeiroResponse = await crud.getListItemsv2('bombeiros', `?$Select=Title&$Filter=(Id eq ${bombeiroId})`);
    return bombeiroResponse.results[0] || null;
  };

  const fetchExtintorData = async (extintorId: number) => {
    const extintorResponse = await crud.getListItemsv2(
      'extintores',
      `?$Select=Id,massa/Title,predio/Title,pavimento/Title,local/Title,site/Title,tipo_extintor/Title,cod_extintor,validade,conforme,massa,cod_qrcode&$expand=massa,predio,pavimento,local,site,tipo_extintor&$Filter=(Id eq ${extintorId})`,
    );
    return extintorResponse.results[0] || null;
  };

  const fetchRespostasExtintor = async () => {
    const respostasExtintorResponse = await crud.getListItemsv2(
      'respostas_extintor',
      `?$Select=Id,extintor_idId,pergunta_idId,registro_idId,resposta,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
    );

    const respostasPorCategoria: Record<string, Array<ExtinguisherAnswers>> = {};
    respostasExtintorResponse.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const extinguisherModal = useQuery({
    queryKey: ['extinguisher_data_modal', params.id],
    queryFn: async () => {
      if (params.id && pathname === `/bxo/records/extinguisher/${params.id}`) {
        const extinguisherData = await fetchExtinguisherData();

        const bombeiro = await fetchBombeiroData(extinguisherData.bombeiro_idId);
        const extintor = await fetchExtintorData(extinguisherData.extintor_idId);
        const respostas = await fetchRespostasExtintor();

        const extintorValidadeIsoDate = extintor.validade && parseISO(extintor.validade);
        const dataCriadoIsoDate = extinguisherData.Created && parseISO(extinguisherData.Created);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const extintorValidade =
          extintorValidadeIsoDate &&
          new Date(extintorValidadeIsoDate.getTime() + extintorValidadeIsoDate.getTimezoneOffset() * 60000);

        const bombeiroValue = bombeiro ? bombeiro.Title : null;

        const extintorValues = extintor
          ? {
              Id: extintor.Id,
              site: extintor.site.Title,
              predio: extintor.predio.Title,
              pavimento: extintor.pavimento.Title,
              local: extintor.local.Title,
              cod_extintor: extintor.cod_extintor,
              validade: extintorValidade,
              conforme: extintor.conforme,
              massa: extintor.massa.Title,
              cod_qrcode: extintor.cod_qrcode,
              tipo_extintor: extintor.tipo_extintor.Title,
            }
          : null;

        return {
          ...extinguisherData,
          Created: dataCriado,
          bombeiro: bombeiroValue,
          extintor: extintorValues,
          respostas: respostas,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/bxo/records/extinguisher/${params.id}` && user_site === 'BXO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: ExtinguisherDataModal) => {
      const idRegistrosExtintor = values.Id;
      const idExtintor = +values.extintor.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && extinguisherModal.data.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = extinguisherModal.data.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            hasAccording.push(item.resposta);

            if (item.resposta !== itemOriginal.resposta) {
              const postData = {
                resposta: item.resposta,
              };

              await crud.updateItemList('respostas_extintor', item.Id, postData);
            }
          }
        }
      }

      const hasFalseAccording = hasAccording.some((item) => item === false);

      if (hasFalseAccording) {
        await crud.updateItemList('registros_extintor', idRegistrosExtintor, {
          conforme: false,
        });
        await crud.updateItemList('extintores', idExtintor, {
          conforme: false,
        });
      }

      if (!hasFalseAccording) {
        await crud.updateItemList('registros_extintor', idRegistrosExtintor, {
          conforme: true,
        });
        await crud.updateItemList('extintores', idExtintor, {
          conforme: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extinguisher_data_modal', params.id] });
      queryClient.invalidateQueries({ queryKey: ['extinguisher_data'] });

      const timeoutId = setTimeout(() => {
        setExtinguisherItem(null);
        navigate('/bxo/records/extinguisher');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: ExtinguisherDataModal = {
    Created: extinguisherModal.data?.Created || '',
    Id: extinguisherModal.data?.Id || 0,
    bombeiro: extinguisherModal.data?.bombeiro ?? '',
    data_pesagem: extinguisherModal.data?.data_pesagem || '',
    extintor: {
      Id: extinguisherModal.data?.extintor?.Id || '',
      site: extinguisherModal.data?.extintor?.site || '',
      predio: extinguisherModal.data?.extintor?.predio || '',
      pavimento: extinguisherModal.data?.extintor?.pavimento || '',
      local: extinguisherModal.data?.extintor?.local || '',
      cod_extintor: extinguisherModal.data?.extintor?.cod_extintor || '',
      validade: extinguisherModal.data?.extintor?.validade || '',
      conforme: extinguisherModal.data?.extintor?.conforme || false,
      massa: extinguisherModal.data?.extintor?.massa || '',
      cod_qrcode: extinguisherModal.data?.extintor?.cod_qrcode || '',
      tipo_extintor: extinguisherModal.data?.extintor?.tipo_extintor || '',
    },
    respostas: extinguisherModal.data?.respostas || {},
    novo: extinguisherModal.data?.novo || false,
    observacao: extinguisherModal.data?.observacao || '',
  };

  const handleSubmit = async (values: ExtinguisherDataModal) => {
    if (values && params.id) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: ExtinguisherDataModal) => {
      handleSubmit(values);
    },
  });

  return {
    extinguisherModal,
    mutateEdit,
    extinguisherItem,
    setExtinguisherItem,
    formik,
  };
};
