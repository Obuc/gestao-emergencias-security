import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ILoadRatioModal, IRespostaLoadRatio } from '../types/LoadRatioBXO';
import { sharepointContext } from '../../../../../context/sharepointContext';

const useLoadRatioModalBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const [testCmiItem, setTestCmiItem] = useState<boolean | null>(null);

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const fetchLoadRatioData = async () => {
    const pathModal = `?$Select=*,site/Title,bombeiro/Title&$expand=bombeiro,site&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_relacao_carga', pathModal);
    return resp.results[0];
  };

  const fetchVehicleData = async (veiculoId: number) => {
    const vehicleResponse = await crud.getListItemsv2(
      'veiculos_emergencia',
      `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,conforme,excluido&$expand=site,tipo_veiculo&$Filter=(Id eq ${veiculoId})`,
    );
    return vehicleResponse.results[0] || null;
  };

  const fetchResponseLoadRatio = async () => {
    const response = await crud.getListItemsv2(
      'respostas_relacao_carga',
      `?$Select=Id,veiculo_idId,pergunta_idId,registro_idId,resposta,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
    );

    const respostasPorCategoria: Record<string, Array<IRespostaLoadRatio>> = {};
    response.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const loadRatioModal = useQuery({
    queryKey: ['load_ratio_data_modal_bxo', params.id, params.form, user_site],
    queryFn: async () => {
      if (params.id) {
        const generalChecklistData = await fetchLoadRatioData();
        const vehicle = await fetchVehicleData(generalChecklistData.veiculo_idId);
        const respostas = await fetchResponseLoadRatio();

        const createdIsoDate = parseISO(generalChecklistData.Created);

        const vehicleValue = vehicle
          ? {
              Id: vehicle.Id,
              placa: vehicle.placa,
              site: vehicle.site?.Title,
              tipo_veiculo: vehicle.tipo_veiculo?.Title,
            }
          : null;

        return {
          ...generalChecklistData,
          Created: new Date(createdIsoDate.getTime() + createdIsoDate.getTimezoneOffset() * 60000),
          site: generalChecklistData.site?.Title,
          bombeiro: generalChecklistData.bombeiro?.Title,
          veiculo: vehicleValue,
          respostas: respostas,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled:
      params.id !== undefined &&
      (pathname.includes('/records/scania') ||
        pathname.includes('/records/s10') ||
        pathname.includes('/records/mercedes') ||
        pathname.includes('/records/van') ||
        pathname.includes('/records/iveco') ||
        pathname.includes('/records/sprinter')) &&
      user_site === 'BXO',
  });
  const mutateEdit = useMutation({
    mutationFn: async (values: ILoadRatioModal) => {
      const idRecordLoadRatio = values.Id;
      const idVehicle = values.veiculo.Id && +values.veiculo.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && loadRatioModal.data.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = loadRatioModal.data.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            hasAccording.push(item.resposta);

            if (item.resposta !== itemOriginal.resposta) {
              const postData = {
                resposta: item.resposta,
              };

              await crud.updateItemList('respostas_relacao_carga', item.Id, postData);
            }
          }
        }
      }

      const hasFalseAccording = hasAccording.some((item) => item === false);

      if (hasFalseAccording) {
        await crud.updateItemList('registros_relacao_carga', idRecordLoadRatio, {
          conforme: false,
        });
        if (idVehicle) {
          await crud.updateItemList('veiculos_emergencia', idVehicle, {
            conforme: false,
          });
        }
      }

      if (!hasFalseAccording) {
        await crud.updateItemList('registros_relacao_carga', idRecordLoadRatio, {
          conforme: true,
        });
        if (idVehicle) {
          await crud.updateItemList('veiculos_emergencia', idVehicle, {
            conforme: true,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['load_ratio_data_modal_bxo', params.id, params.form, user_site] });
      queryClient.invalidateQueries({ queryKey: ['load_ratio_data_bxo'] });

      const timeoutId = setTimeout(() => {
        setTestCmiItem(null);
        navigate(`/records/${equipments_value}`);
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: ILoadRatioModal = {
    Created: loadRatioModal.data?.Created || '',
    Id: loadRatioModal.data?.Id || '',
    bombeiro: loadRatioModal.data?.bombeiro || '',
    bombeiroId: loadRatioModal.data?.bombeiroId || null,
    conforme: loadRatioModal.data?.conforme || null,
    observacao: loadRatioModal.data?.observacao || '',
    site: loadRatioModal.data?.site || '',
    siteId: loadRatioModal.data?.siteId || null,
    veiculo: {
      Id: loadRatioModal.data?.veiculo?.Id || null,
      placa: loadRatioModal.data?.veiculo?.placa || '',
      site: loadRatioModal.data?.veiculo?.site || '',
      tipo_veiculo: loadRatioModal.data?.veiculo?.tipo_veiculo || '',
    },
    veiculo_idId: loadRatioModal.data?.tipo_veiculo || null,
    respostas: loadRatioModal.data?.respostas || {},
  };

  const handleSubmit = async (values: ILoadRatioModal) => {
    if (values) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: ILoadRatioModal) => {
      handleSubmit(values);
    },
  });

  return {
    loadRatioModal,
    mutateEdit,
    testCmiItem,
    setTestCmiItem,
    formik,
  };
};

export default useLoadRatioModalBXO;
