import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { HydrantsDataModal, RespostaHydrants } from '../types/HydrantBXO';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useHydrantModalBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [hydrantItem, setHydrantItem] = useState<boolean | null>(null);

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const fetchHydrantsData = async () => {
    const pathModal = `?$Select=Id,site/Title,hidrante_id/Id,bombeiro/Title,conforme,observacao,Created&$expand=site,hidrante_id,bombeiro&$Filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_hidrantes', pathModal);
    return resp.results[0];
  };

  const fetchHidranteData = async (hidranteId: number) => {
    const response = await crud.getListItemsv2(
      'hidrantes',
      `?$Select=Id,cod_qrcode,site/Title,predio/Title,pavimento/Title,local/Title,cod_hidrante,possui_abrigo,conforme&$expand=site,predio,pavimento,local&$Filter=(Id eq ${hidranteId})`,
    );
    return response.results[0] || null;
  };

  const fetchRespostasHidrante = async () => {
    const response = await crud.getListItemsv2(
      'respostas_hidrantes',
      `?$Select=Id,hidrante_idId,pergunta_idId,registro_idId,resposta,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$Filter=(registro_id/Id eq '${params.id}')`,
    );

    const respostasPorCategoria: Record<string, Array<RespostaHydrants>> = {};
    response.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const hydrantModal = useQuery({
    queryKey: ['hydrants_data_modal_bxo', params.id],
    queryFn: async () => {
      if (params.id) {
        const hydrantsData = await fetchHydrantsData();

        const dataCriadoIsoDate = hydrantsData.Created && parseISO(hydrantsData.Created);

        const dataCriado = dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const hidrante = await fetchHidranteData(hydrantsData.hidrante_id.Id);
        const respostas = await fetchRespostasHidrante();

        const hidranteValues = hidrante
          ? {
              Id: hidrante.Id,
              site: hidrante.site.Title,
              predio: hidrante.predio.Title,
              pavimento: hidrante.pavimento.Title,
              local: hidrante.local.Title,
              cod_hidrante: hidrante.cod_hidrante,
              possui_abrigo: hidrante.possui_abrigo,
              conforme: hidrante.conforme,
              cod_qrcode: hidrante.cod_qrcode,
            }
          : null;

        return {
          ...hydrantsData,
          Created: dataCriado,
          bombeiro: hydrantsData.bombeiro?.Title,
          hidrante: hidranteValues,
          respostas: respostas,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && pathname === `/records/hydrants/${params.id}` && user_site === 'BXO',
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: HydrantsDataModal) => {
      const idRegistroHidrante = values.Id;
      const idHidrante = +values.hidrante.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && hydrantModal.data.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = hydrantModal.data.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            hasAccording.push(item.resposta);

            if (item.resposta !== itemOriginal.resposta) {
              const postData = {
                resposta: item.resposta,
              };

              await crud.updateItemList('respostas_hidrantes', item.Id, postData);
            }
          }
        }
      }

      const hasFalseAccording = hasAccording.some((item) => item === false);

      if (hasFalseAccording) {
        await crud.updateItemList('registros_hidrantes', idRegistroHidrante, {
          conforme: false,
        });
        await crud.updateItemList('hidrantes', idHidrante, {
          conforme: false,
        });
      }

      if (!hasFalseAccording) {
        await crud.updateItemList('registros_hidrantes', idRegistroHidrante, {
          conforme: true,
        });
        await crud.updateItemList('hidrantes', idHidrante, {
          conforme: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hydrants_data_modal_bxo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['hydrants_data_bxo'] });

      const timeoutId = setTimeout(() => {
        setHydrantItem(null);
        navigate('/records/extinguisher');
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: HydrantsDataModal = {
    Id: hydrantModal.data?.Id || 0,
    Created: hydrantModal.data?.Created || '',
    bombeiro: hydrantModal.data?.bombeiro ?? '',
    hidrante: {
      Id: hydrantModal.data?.hidrante?.Id || '',
      site: hydrantModal.data?.hidrante?.site || '',
      predio: hydrantModal.data?.hidrante?.predio || '',
      pavimento: hydrantModal.data?.hidrante?.pavimento || '',
      local: hydrantModal.data?.hidrante?.local || '',
      conforme: hydrantModal.data?.hidrante?.conforme || false,
      cod_qrcode: hydrantModal.data?.hidrante?.cod_qrcode || '',
      cod_hidrante: hydrantModal.data?.hidrante?.cod_hidrante || '',
      possui_abrigo: hydrantModal.data?.hidrante?.possui_abrigo || null,
    },
    respostas: hydrantModal.data?.respostas || {},
    observacao: hydrantModal.data?.observacao || '',
  };

  const handleSubmit = async (values: HydrantsDataModal) => {
    if (values) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: HydrantsDataModal) => {
      handleSubmit(values);
    },
  });

  return {
    hydrantModal,
    mutateEdit,
    hydrantItem,
    setHydrantItem,
    formik,
  };
};

export default useHydrantModalBXO;
