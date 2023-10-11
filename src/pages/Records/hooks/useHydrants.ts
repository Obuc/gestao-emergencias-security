import * as XLSX from 'xlsx';
import { useState } from 'react';
import { parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import { HydrantsDataModal, RespostaHydrants } from './../types/Hydrants';

const useHydrants = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const [isLoadingHydrantsExportToExcel, setIsLoadingHydrantsExportToExcel] = useState<boolean>(false);

  let path = `?$Select=Id,site/Title,hidrante_id/Id,bombeiro/Title,conforme,observacao,Created&$expand=site,hidrante_id,bombeiro&$Filter=(site/Title eq '${user_site}')`;

  // if (extinguisherFilters?.place) {
  //   for (let i = 0; i < extinguisherFilters.place.length; i++) {
  //     path += `${i === 0 ? ' and' : ' or'} (local eq '${extinguisherFilters.place[i]}')`;
  //   }
  // }

  // if (extinguisherFilters?.pavement) {
  //   for (let i = 0; i < extinguisherFilters.pavement.length; i++) {
  //     path += `${i === 0 ? ' and' : ' or'} (pavimento eq '${extinguisherFilters.pavement[i]}')`;
  //   }
  // }

  // if (extinguisherFilters?.conformity && extinguisherFilters?.conformity === 'Conforme') {
  //   path += ` and (conforme ne 'false')`;
  // }

  // if (extinguisherFilters?.conformity && extinguisherFilters?.conformity !== 'Conforme') {
  //   path += ` and (conforme eq 'false')`;
  // }

  // if (extinguisherFilters?.expiration) {
  //   const expirationDate = extinguisherFilters.expiration;
  //   const startDate = new Date(expirationDate);
  //   startDate.setUTCHours(0, 0, 0, 0);

  //   const endDate = new Date(expirationDate);
  //   endDate.setUTCHours(23, 59, 59, 999);

  //   path += ` and (extintor_id/validade ge datetime'${startDate.toISOString()}') and (extintor_id/validade le datetime'${endDate.toISOString()}')`;
  // }

  // if (extinguisherFilters?.startDate || extinguisherFilters?.endDate) {
  //   const startDate = extinguisherFilters.startDate && new Date(extinguisherFilters.startDate);
  //   startDate && startDate.setUTCHours(0, 0, 0, 0);

  //   const endDate = extinguisherFilters.endDate && new Date(extinguisherFilters.endDate);
  //   endDate && endDate.setUTCHours(23, 59, 59, 999);

  //   if (startDate) {
  //     path += ` and (Created ge datetime'${startDate.toISOString()}')`;
  //   }

  //   if (endDate) {
  //     path += ` and (Created le datetime'${endDate.toISOString()}')`;
  //   }
  // }

  // if (extinguisherFilters?.responsible) {
  //   path += ` and ( substringof('${extinguisherFilters.responsible}', bombeiro_id/Title ))`;
  // }

  const fetchHydrants = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'registros_hidrantes', path });

    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        const hydrantsResponse = await crud.getListItemsv2(
          'hidrantes',
          `?$Select=Id,cod_hidrante,predio/Title,pavimento/Title,local/Title&$expand=predio,pavimento,local&$Filter=(Id eq '${item.hidrante_id.Id}')`,
        );

        const hidrante = hydrantsResponse.results[0] || null;
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const hidranteValues = hidrante
          ? {
              Id: hidrante.Id,
              predio: hidrante.predio.Title,
              cod_hidrante: hidrante.cod_hidrante,
              pavimento: hidrante.pavimento.Title,
              local: hidrante.local.Title,
            }
          : null;

        return {
          ...item,
          Created: dataCriado,
          bombeiro: item.bombeiro?.Title,
          hidrante: hidranteValues,
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
    data: hydrants,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['hydrants_data', user_site],
    queryFn: fetchHydrants,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: equipments_value === 'Hidrantes',
  });

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

  const { data: hydrantsDataModal, isLoading: isLoadingHydrantsDataModal } = useQuery({
    queryKey: params.id ? ['hydrants_data_modal', params.id] : ['hydrants_data_modal'],
    queryFn: async () => {
      if (params.id && equipments_value === 'Hidrantes') {
        const hydrantsData = await fetchHydrantsData();

        const dataCriadoIsoDate = hydrantsData.Created && parseISO(hydrantsData.Created);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

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
    enabled: params.id !== undefined && equipments_value === 'Hidrantes',
  });

  const { mutateAsync: mutateRemoveHydrants, isLoading: isLoadingMutateRemoveHydrants } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        const itemResponse = await crud.getListItemsv2(
          'respostas_hidrantes',
          `?$Select=Id,registro_id/Id&$expand=registro_id&$Filter=(registro_id/Id eq ${itemId})`,
        );

        if (itemResponse.results.length > 0) {
          for (const item of itemResponse.results) {
            const itemIdToDelete = item.Id;
            await crud.deleteItemList('respostas_hidrantes', itemIdToDelete);
          }
        } else {
          console.log('Nenhum item encontrado para excluir.');
        }
      }
      await crud.deleteItemList('registros_hidrantes', itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hydrants_data', user_site],
      });
    },
  });

  const { mutateAsync: mutateEditHydrant, isLoading: isLoadingMutateEditHydrant } = useMutation({
    mutationFn: async (values: HydrantsDataModal) => {
      const idRegistroHidrante = values.Id;
      const idHidrante = +values.hidrante.Id;

      let hasAccording = [];

      if (values.Id && values.respostas && hydrantsDataModal.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = hydrantsDataModal.respostas[categoria];

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
      queryClient.invalidateQueries({ queryKey: ['hydrants_data_modal', params.id] });
      queryClient.invalidateQueries({
        queryKey: ['hydrants_data', user_site],
      });
    },
  });

  const fetchHydrantsAllRecords = async () => {
    const path = `?$Select=Id,site/Title,hidrante_id/Id,bombeiro/Title,conforme,observacao,Created&$expand=site,hidrante_id,bombeiro&$Filter=(site/Title eq '${user_site}')`;
    const response = await crud.getListItems('registros_hidrantes', path);

    const dataWithTransformations = await Promise.all(
      response.map(async (item: any) => {
        const hydrantsResponse = await crud.getListItemsv2(
          'hidrantes',
          `?$Select=Id,cod_hidrante,predio/Title,pavimento/Title,local/Title&$expand=predio,pavimento,local&$Filter=(Id eq '${item.hidrante_id.Id}')`,
        );

        const hidrante = hydrantsResponse.results[0] || null;

        return {
          ...item,
          bombeiro: item.bombeiro_id?.Title,
          hidrante_id: hidrante?.Id,
          predio: hidrante?.predio,
          pavimento: hidrante?.pavimento,
          local: hidrante?.local,
        };
      }),
    );

    return dataWithTransformations;
  };

  const handleExportHydrantsToExcel = async () => {
    setIsLoadingHydrantsExportToExcel(true);

    const data = await fetchHydrantsAllRecords();

    const columns = ['Id', 'bombeiro', 'hidrante_id', 'predio', 'pavimento', 'local', 'cod_hidrante', 'conforme'];

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
      XLSX.writeFile(wb, `Registros - Hidrantes.xlsx`);
    }

    setIsLoadingHydrantsExportToExcel(false);
  };

  return {
    hydrants,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    hydrantsDataModal,
    isLoadingHydrantsDataModal,
    mutateRemoveHydrants,
    isLoadingMutateRemoveHydrants,
    mutateEditHydrant,
    isLoadingMutateEditHydrant,

    handleExportHydrantsToExcel,
    isLoadingHydrantsExportToExcel,
  };
};

export default useHydrants;
