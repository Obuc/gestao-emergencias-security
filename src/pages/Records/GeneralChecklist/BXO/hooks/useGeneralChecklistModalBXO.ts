import { useState } from 'react';
import { useFormik } from 'formik';
import { parseISO } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../../../context/sharepointContext';
import { IGeneralChecklistModal, IRespostaGeneralChecklist } from '../types/GeneralChecklistBXO';

const useGeneralChecklistModalBXO = () => {
  const params = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { crud } = sharepointContext();
  const queryClient = useQueryClient();

  const [generalChecklistItem, setGeneralChecklistItem] = useState<boolean | null>(null);

  const timeDelayToRedirectPage: number = import.meta.env.VITE_TIME_DELAY_TO_REDIRECT_PAGE;

  const fetchGeneralChecklistData = async () => {
    const pathModal = `?$Select=*,site/Title,bombeiro/Title&$expand=bombeiro,site&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_veiculos_emergencia', pathModal);
    return resp.results[0];
  };

  const fetchVehicleData = async (veiculoId: number) => {
    const vehicleResponse = await crud.getListItemsv2(
      'veiculos_emergencia',
      `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,conforme,excluido&$expand=site,tipo_veiculo&$Filter=(Id eq ${veiculoId})`,
    );
    return vehicleResponse.results[0] || null;
  };

  const fetchResponseGeneralChecklist = async () => {
    const response = await crud.getListItemsv2(
      'respostas_veiculos_emergencia',
      `?$Select=Id,veiculo_idId,pergunta_idId,registro_idId,resposta,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
    );

    const respostasPorCategoria: Record<string, Array<IRespostaGeneralChecklist>> = {};
    response.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const generalChecklistModal = useQuery({
    queryKey: ['general_checklist_data_modal_bxo', params.id],
    queryFn: async () => {
      if (params.id) {
        const generalChecklistData = await fetchGeneralChecklistData();
        const vehicle = await fetchVehicleData(generalChecklistData.veiculo_idId);
        const respostas = await fetchResponseGeneralChecklist();

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
    enabled: params.id !== undefined && pathname.includes('general_checklist'),
  });

  const mutateEdit = useMutation({
    mutationFn: async (values: IGeneralChecklistModal) => {
      const idRecordGeneralChecklist = values.Id;
      const idVehicle = values.veiculo.Id && +values.veiculo.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && generalChecklistModal.data.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = generalChecklistModal.data.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            hasAccording.push(item.resposta);

            if (item.resposta !== itemOriginal.resposta) {
              const postData = {
                resposta: item.resposta,
              };

              await crud.updateItemList('respostas_veiculos_emergencia', item.Id, postData);
            }
          }
        }
      }

      const hasFalseAccording = hasAccording.some((item) => item === false);

      if (hasFalseAccording) {
        await crud.updateItemList('registros_veiculos_emergencia', idRecordGeneralChecklist, {
          conforme: false,
        });
        if (idVehicle) {
          await crud.updateItemList('veiculos_emergencia', idVehicle, {
            conforme: false,
          });
        }
      }

      if (!hasFalseAccording) {
        await crud.updateItemList('registros_veiculos_emergencia', idRecordGeneralChecklist, {
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
      queryClient.invalidateQueries({ queryKey: ['general_checklist_data_modal_bxo', params.id] });
      queryClient.invalidateQueries({ queryKey: ['general_checklist_data_bxo'] });

      const timeoutId = setTimeout(() => {
        setGeneralChecklistItem(null);
        navigate(`/records/general_checklist`);
      }, +timeDelayToRedirectPage);
      return () => clearTimeout(timeoutId);
    },
    onError: () => {
      formik.setSubmitting(false);
    },
  });

  const initialValues: IGeneralChecklistModal = {
    Created: generalChecklistModal.data?.Created || '',
    Id: generalChecklistModal.data?.Id || '',
    bombeiro: generalChecklistModal.data?.bombeiro || '',
    bombeiroId: generalChecklistModal.data?.bombeiroId || null,
    conforme: generalChecklistModal.data?.conforme || null,
    observacao: generalChecklistModal.data?.observacao || '',
    site: generalChecklistModal.data?.site || '',
    siteId: generalChecklistModal.data?.siteId || null,
    veiculo: {
      Id: generalChecklistModal.data?.veiculo?.Id || null,
      placa: generalChecklistModal.data?.veiculo?.placa || '',
      site: generalChecklistModal.data?.veiculo?.site || '',
      tipo_veiculo: generalChecklistModal.data?.veiculo?.tipo_veiculo || '',
    },
    veiculo_idId: generalChecklistModal.data?.tipo_veiculo || null,
    respostas: generalChecklistModal.data?.respostas || {},
  };

  const handleSubmit = async (values: IGeneralChecklistModal) => {
    if (values) {
      await mutateEdit.mutateAsync(values);
    }
  };

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: IGeneralChecklistModal) => {
      handleSubmit(values);
    },
  });

  return {
    generalChecklistModal,
    mutateEdit,
    generalChecklistItem,
    setGeneralChecklistItem,
    formik,
  };
};

export default useGeneralChecklistModalBXO;
