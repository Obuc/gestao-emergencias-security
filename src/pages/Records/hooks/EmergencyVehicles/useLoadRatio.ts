import * as XLSX from 'xlsx';
import { useState } from 'react';
import { parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../../context/sharepointContext';
import { ILoadRatioModal, IRespostaLoadRatio } from '../../types/EmergencyVehicles/LoadRatio';

const useLoadRatio = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const isVehicleValue =
    equipments_value === 'Scania' ||
    equipments_value === 'S10' ||
    equipments_value === 'Mercedes' ||
    equipments_value === 'Furgão' ||
    equipments_value === 'Ambulância Iveco' ||
    equipments_value === 'Ambulância Sprinter';

  const [isLoadingLoadRatioExportToExcel, setIsLoadingLoadRatioExportToExcel] = useState<boolean>(false);

  const fechLoadRatio = async ({ pageParam }: { pageParam?: string }) => {
    const path = `?$Select=*,site/Title,bombeiro/Title,tipo_veiculo/Title&$expand=site,bombeiro,tipo_veiculo&$Top=100&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_veiculo/Title eq '${equipments_value}')`;
    const response = await crud.getPaged(
      pageParam ? { nextUrl: pageParam } : { list: 'registros_relacao_carga', path },
    );

    const dataWithTransformations = await Promise.all(
      response.data.value.map(async (item: any) => {
        const vehicleResponse = await crud.getListItemsv2(
          'veiculos_emergencia',
          `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,conforme,excluido&$expand=site,tipo_veiculo&$Filter=(Id eq ${item.veiculo_idId})`,
        );

        const vehicle = vehicleResponse.results[0] || null;

        const vehicleValues = vehicle
          ? {
              Id: vehicle.Id,
              placa: vehicle.placa,
              site: vehicle.site?.Title,
              tipo_veiculo: vehicle.tipo_veiculo?.Title,
            }
          : null;

        const createdIsoDate = parseISO(item.Created);

        return {
          ...item,
          Created: new Date(createdIsoDate.getTime() + createdIsoDate.getTimezoneOffset() * 60000),
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
    data: load_ratio,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['load_ratio_data', user_site, equipments_value],
    queryFn: fechLoadRatio,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: isVehicleValue,
  });

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

  const { data: loadRatioDataModal, isLoading: isLoadingLoadRatioDataModal } = useQuery({
    queryKey: params.id ? ['load_ratio_data_modal', params.id, equipments_value] : ['load_ratio_data_modal'],
    queryFn: async () => {
      if (params.id && isVehicleValue) {
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
    enabled: params.id !== undefined && isVehicleValue,
  });

  const { mutateAsync: mutateRemoveLoadRatio, isLoading: isLoadingMutateRemoveLoadRatio } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        const itemResponse = await crud.getListItemsv2(
          'respostas_relacao_carga',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_relacao_carga', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
      }
      await crud.deleteItemList('registros_relacao_carga', itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['load_ratio_data', user_site, equipments_value] });
    },
  });

  const { mutateAsync: mutateEditLoadRatio, isLoading: isLoadingMutateEditLoadRatio } = useMutation({
    mutationFn: async (values: ILoadRatioModal) => {
      const idRecordLoadRatio = values.Id;
      const idVehicle = values.veiculo.Id && +values.veiculo.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && loadRatioDataModal.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = loadRatioDataModal.respostas[categoria];

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
      queryClient.invalidateQueries({ queryKey: ['load_ratio_data_modal', params.id, equipments_value] });
      queryClient.invalidateQueries({ queryKey: ['load_ratio_data', user_site, equipments_value] });
    },
  });

  const fetchGeneralChecklistAllRecords = async () => {
    const path = `?$Select=*,site/Title,bombeiro/Title,tipo_veiculo/Title&$expand=site,bombeiro,tipo_veiculo&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_veiculo/Title eq '${equipments_value}')`;

    const response = await crud.getListItems('registros_relacao_carga', path);

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

  const handleExportLoadRatioToExcel = async () => {
    setIsLoadingLoadRatioExportToExcel(true);

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
      XLSX.writeFile(wb, `Registros - Veiculos Emergencia ${equipments_value}.xlsx`);
    }

    setIsLoadingLoadRatioExportToExcel(false);
  };

  return {
    load_ratio,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,

    loadRatioDataModal,
    isLoadingLoadRatioDataModal,

    mutateRemoveLoadRatio,
    isLoadingMutateRemoveLoadRatio,

    mutateEditLoadRatio,
    isLoadingMutateEditLoadRatio,

    isLoadingLoadRatioExportToExcel,
    handleExportLoadRatioToExcel,
  };
};

export default useLoadRatio;
