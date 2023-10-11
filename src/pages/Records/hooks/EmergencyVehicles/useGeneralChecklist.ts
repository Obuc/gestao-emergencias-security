import * as XLSX from 'xlsx';
import { useState } from 'react';
import { parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../../context/sharepointContext';
import { IGeneralChecklistModal, IRespostaGeneralChecklist } from '../../types/EmergencyVehicles/GeneralChecklist';

const useGeneralChecklist = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [isLoadingGeneralChecklistExportToExcel, setIsLoadingGeneralChecklistExportToExcel] = useState<boolean>(false);

  const path = `?$Select=Id,veiculo_idId,site/Title,bombeiro/Title&$expand=site,bombeiro&$Top=100&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;
  const fechGeneralChecklist = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(
      pageParam ? { nextUrl: pageParam } : { list: 'registros_veiculos_emergencia', path },
    );

    const dataWithTransformations = await Promise.all(
      response.data.value.map(async (item: any) => {
        const vehicleResponse = await crud.getListItemsv2(
          'veiculos_emergencia',
          `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,conforme,excluido&$expand=site,tipo_veiculo&$Filter=(Id eq ${item.veiculo_idId})`,
        );

        const dataCriadoIsoDate = item.Created && parseISO(item.Created);
        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const vehicle = vehicleResponse.results[0] || null;

        const vehicleValues = vehicle
          ? {
              Id: vehicle.Id,
              placa: vehicle.placa,
              site: vehicle.site?.Title,
              tipo_veiculo: vehicle.tipo_veiculo?.Title,
            }
          : null;

        return {
          ...item,
          Created: dataCriado,
          bombeiro: item.bombeiro?.Title,
          veiculo: vehicleValues,
        };
      }),
    );

    return {
      ...response,
      data: {
        ...response.data,
        value: dataWithTransformations,
      },
    };
  };

  const {
    data: general_checklist,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['general_checklist_data', user_site],
    queryFn: fechGeneralChecklist,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: params.form === 'general_checklist',
  });

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

  const { data: generalChecklistDataModal, isLoading: isLoadingGeneralChecklistDataModal } = useQuery({
    queryKey: params.id ? ['general_checklist_data_modal', params.id] : ['general_checklist_data_modal'],
    queryFn: async () => {
      if (params.id && params.form === 'general_checklist') {
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
    enabled: params.id !== undefined && params.form === 'general_checklist',
  });

  const { mutateAsync: mutateRemoveGeneralChecklist, isLoading: isLoadingMutateRemoveGeneralChecklist } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        const itemResponse = await crud.getListItemsv2(
          'respostas_veiculos_emergencia',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_veiculos_emergencia', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
      }
      await crud.deleteItemList('registros_veiculos_emergencia', itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['general_checklist_data', user_site] });
    },
  });

  const { mutateAsync: mutateEditTGeneralChecklist, isLoading: isLoadingEditTGeneralChecklist } = useMutation({
    mutationFn: async (values: IGeneralChecklistModal) => {
      const idRecordGeneralChecklist = values.Id;
      const idVehicle = values.veiculo.Id && +values.veiculo.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && generalChecklistDataModal.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = generalChecklistDataModal.respostas[categoria];

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
      queryClient.invalidateQueries({ queryKey: ['general_checklist_data_modal', params.id] });
      queryClient.invalidateQueries({ queryKey: ['general_checklist_data', user_site] });
    },
  });

  const fetchGeneralChecklistAllRecords = async () => {
    const path = `?$Select=*,site/Title,bombeiro/Title&$expand=site,bombeiro&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}')`;
    const response = await crud.getListItems('registros_veiculos_emergencia', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const vehicleResponse = await crud.getListItemsv2(
          'veiculos_emergencia',
          `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,conforme,excluido&$expand=site,tipo_veiculo&$Filter=(Id eq ${item.veiculo_idId})`,
        );

        const vehicle = vehicleResponse.results[0] || null;

        return {
          ...item,
          bombeiro: item.bombeiro?.Title,
          veiculo_id: vehicle.Id,
          placa: vehicle.placa,
          site: vehicle.site?.Title,
          tipo_veiculo: vehicle.tipo_veiculo?.Title,
        };
      }),
    );

    return dataWithTransformations;
  };

  const handleExportGeneralChecklistToExcel = async () => {
    setIsLoadingGeneralChecklistExportToExcel(true);

    const data = await fetchGeneralChecklistAllRecords();

    const columns = ['Id', 'bombeiro', 'veiculo_id', 'placa', 'site', 'tipo_veiculo', 'conforme'];

    const headerRow = columns.map((column) => column.toString());

    const dataFiltered = data?.map((item) => {
      const newItem: { [key: string]: any } = {};
      columns.forEach((column) => {
        newItem[column] = item[column];
      });
      return newItem;
    });

    if (dataFiltered) {
      const dataArray = [headerRow, ...dataFiltered.map((item) => columns.map((column) => item[column]))];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(dataArray);

      XLSX.utils.book_append_sheet(wb, ws, '');
      XLSX.writeFile(wb, `Registros - Veiculos Emergencia Checklist Geral.xlsx`);
    }

    setIsLoadingGeneralChecklistExportToExcel(false);
  };

  return {
    general_checklist,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,

    generalChecklistDataModal,
    isLoadingGeneralChecklistDataModal,

    mutateRemoveGeneralChecklist,
    isLoadingMutateRemoveGeneralChecklist,

    mutateEditTGeneralChecklist,
    isLoadingEditTGeneralChecklist,

    isLoadingGeneralChecklistExportToExcel,
    handleExportGeneralChecklistToExcel,
  };
};

export default useGeneralChecklist;
