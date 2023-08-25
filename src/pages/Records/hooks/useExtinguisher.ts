import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { RespostaExtintor } from '../types/Extinguisher';
import { sharepointContext } from '../../../context/sharepointContext';
import { ExtinguisherDataModal } from '../types/ExtinguisherModalTypes';

const useExtinguisher = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();

  const path = `?$Select=*&$Orderby=Created desc`;
  const fetchExtinguisher = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'registros_extintor', path });
    const dataWithTransformations = await Promise.all(
      response.data.value.map(async (item: any) => {
        const bombeiroResponse = await crud.getListItemsv2(
          'bombeiros',
          `?$Select=Title&$Filter(Id eq ${item.bombeiro_idId})`,
        );
        const extintorResponse = await crud.getListItemsv2(
          'extintores',
          `?$Select=predio/Title,pavimento/Title,local/Title,cod_extintor,validade,conforme,cod_qrcode&$expand=predio,pavimento,local&$Filter(Id eq ${item.extintor_idId})`,
        );

        const bombeiro = bombeiroResponse.results[0] || null;
        const extintor = extintorResponse.results[0] || null;

        const bombeiroValue = bombeiro ? bombeiro.Title : null;
        const extintorValues = extintor
          ? {
              predio: extintor.predio.Title,
              pavimento: extintor.pavimento.Title,
              local: extintor.local.Title,
              cod_extintor: extintor.cod_extintor,
              validade: extintor.validade,
              conforme: extintor.conforme,
            }
          : null;

        return {
          ...item,
          bombeiro: bombeiroValue,
          extintor: extintorValues,
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
    data: extinguisher,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['extinguisher_data'],
    queryFn: fetchExtinguisher,
    getNextPageParam: (lastPage, _) => lastPage.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
  });

  const fetchExtinguisherData = async () => {
    const pathModal = `?$Select=*&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('registros_extintor', pathModal);
    return resp.results[0];
  };

  const fetchBombeiroData = async (bombeiroId: number) => {
    const bombeiroResponse = await crud.getListItemsv2('bombeiros', `?$Select=Title&$Filter(Id eq ${bombeiroId})`);
    return bombeiroResponse.results[0] || null;
  };

  const fetchExtintorData = async (extintorId: number) => {
    const extintorResponse = await crud.getListItemsv2(
      'extintores',
      `?$Select=massa/Title,predio/Title,pavimento/Title,local/Title,site/Title,tipo_extintor/Title,cod_extintor,validade,conforme,massa,cod_qrcode&$expand=massa,predio,pavimento,local,site,tipo_extintor&$Filter(Id eq ${extintorId})`,
    );
    return extintorResponse.results[0] || null;
  };

  const fetchRespostasExtintor = async () => {
    const respostasExtintorResponse = await crud.getListItemsv2(
      'respostas_extintor',
      `?$Select=Id,extintor_idId,pergunta_idId,registro_idId,resposta,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
    );

    const respostasPorCategoria: Record<string, Array<RespostaExtintor>> = {};
    respostasExtintorResponse.results.forEach((resposta: any) => {
      const categoria = resposta.pergunta_id.categoria;
      if (!respostasPorCategoria[categoria]) {
        respostasPorCategoria[categoria] = [];
      }
      respostasPorCategoria[categoria].push(resposta);
    });

    return respostasPorCategoria;
  };

  const { data: extinguisherModal, isLoading: isLoadingExtinguisherModal } = useQuery({
    queryKey: params.id ? ['extinguisher_data_modal', params.id] : ['extinguisher_data_modal'],
    queryFn: async () => {
      if (params.id) {
        const extinguisherData = await fetchExtinguisherData();
        const bombeiro = await fetchBombeiroData(extinguisherData.bombeiro_idId);
        const extintor = await fetchExtintorData(extinguisherData.extintor_idId);
        const respostas = await fetchRespostasExtintor();

        const bombeiroValue = bombeiro ? bombeiro.Title : null;

        const extintorValues = extintor
          ? {
              site: extintor.site.Title,
              predio: extintor.predio.Title,
              pavimento: extintor.pavimento.Title,
              local: extintor.local.Title,
              cod_extintor: extintor.cod_extintor,
              validade: extintor.validade,
              conforme: extintor.conforme,
              massa: extintor.massa.Title,
              cod_qrcode: extintor.cod_qrcode,
              tipo_extintor: extintor.tipo_extintor.Title,
            }
          : null;

        return {
          ...extinguisherData,
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
  });

  // const { data: extinguisherModal, isLoading: isLoadingExtinguisherModal }: UseQueryResult<Extinguisher> = useQuery({
  //   queryKey: params.id ? ['extinguisher_data_modal', params.id] : ['extinguisher_data_modal'],
  //   queryFn: async () => {
  //     if (params.id) {
  //       const pathModal = `?$Select=*&$filter=Id eq ${params.id}`;

  //       const resp = await crud.getListItemsv2('registros_extintor', pathModal);

  //       const bombeiroResponse = await crud.getListItemsv2(
  //         'bombeiros',
  //         `?$Select=Title&$Filter(Id eq ${resp.results[0].bombeiro_idId})`,
  //       );
  //       const extintorResponse = await crud.getListItemsv2(
  //         'extintores',
  //         `?$Select=predio/Title,pavimento/Title,local/Title,site/Title,tipo_extintor/Title,cod_extintor,validade,conforme,massa,cod_qrcode&$expand=predio,pavimento,local,site,tipo_extintor&$Filter(Id eq ${resp.results[0].extintor_idId})`,
  //       );

  //       const respostasExtintorResponse = await crud.getListItemsv2(
  //         'respostas_extintor',
  //         `?$Select=extintor_idId,pergunta_idId,registro_idId,resposta,pergunta_id/Title,pergunta_id/categoria&$expand=pergunta_id&$filter=(registro_idId eq ${params.id})`,
  //       );

  //       const respostasPorCategoria: Record<string, Array<RespostaExtintor>> = {};
  //       respostasExtintorResponse.results.forEach((resposta: any) => {
  //         const categoria = resposta.pergunta_id.categoria;

  //         if (!respostasPorCategoria[categoria]) {
  //           respostasPorCategoria[categoria] = [];
  //         }

  //         respostasPorCategoria[categoria].push(resposta);
  //       });

  //       const bombeiro = bombeiroResponse.results[0] || null;
  //       const extintor = extintorResponse.results[0] || null;

  //       const bombeiroValue = bombeiro ? bombeiro.Title : null;

  //       const extintorValues = extintor
  //         ? {
  //             site: extintor.site.Title,
  //             predio: extintor.predio.Title,
  //             pavimento: extintor.pavimento.Title,
  //             local: extintor.local.Title,
  //             cod_extintor: extintor.cod_extintor,
  //             validade: extintor.validade,
  //             conforme: extintor.conforme,
  //             massa: extintor.massa,
  //             cod_qrcode: extintor.cod_qrcode,
  //             tipo_extintor: extintor.tipo_extintor.Title,
  //           }
  //         : null;

  //       return {
  //         ...resp.results[0],
  //         bombeiro: bombeiroValue,
  //         extintor: extintorValues,
  //         respostas: respostasPorCategoria,
  //       };
  //     } else {
  //       return [];
  //     }
  //   },
  //   staleTime: 5000 * 60, // 5 Minute
  //   refetchOnWindowFocus: false,
  // });

  const { mutateAsync: mutateRemoveExtinguisher, isLoading: IsLoadingMutateRemoveExtinguisher } = useMutation({
    mutationFn: async (itemId: number) => {
      if (itemId) {
        await crud.deleteItemList('Extintores', itemId);
      }
    },
  });

  const { mutateAsync: mutateEditExtinguisher, isLoading: IsLoadingMutateEditExtinguisher } = useMutation({
    mutationFn: async (values: ExtinguisherDataModal) => {
      if (values.Id && values.respostas && extinguisherModal.respostas) {
        for (const categoria in values.respostas) {
          const perguntasRespostas = values.respostas[categoria];
          const perguntasRespostasOriginais = extinguisherModal.respostas[categoria];

          for (let i = 0; i < perguntasRespostas.length; i++) {
            const item = perguntasRespostas[i];
            const itemOriginal = perguntasRespostasOriginais[i];

            if (item.resposta !== itemOriginal.resposta) {
              const postData = {
                resposta: item.resposta,
              };

              await crud.updateItemList('respostas_extintor', item.Id, postData);
            }
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extinguisher_data_modal', params.id] });
    },
  });

  // const { data: perguntasExtintor }: UseQueryResult<Array<PerguntasExtintor>> = useQuery({
  //   queryKey: params.id ? ['respostas_extintor', params.id] : ['respostas_extintor'],
  //   queryFn: async () => {
  //     if (!params.id) return [];

  //     const resp = await crud.getListItemsv2(
  //       'respostas_extintor',
  //       `?$Select=extintor_idId,pergunta_idId,registro_idId,resposta&$filter=(registro_idId eq ${params.id})`,
  //     );

  //     const perguntaResponse = await crud.getListItemsv2('perguntas_extintor', `?$Select=Title,categoria,Id`);

  //     const perguntasMap = perguntaResponse.results.reduce((map: any, pergunta: any) => {
  //       map[pergunta.Id] = pergunta;
  //       return map;
  //     }, {});

  //     const perguntasExtintorComPerguntas = resp.results.map((resposta: any) => {
  //       const pergunta = perguntasMap[resposta.pergunta_idId];
  //       return {
  //         ...resposta,
  //         pergunta,
  //       };
  //     });

  //     return perguntasExtintorComPerguntas;
  //   },
  // });

  return {
    extinguisher,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    extinguisherModal,
    isLoadingExtinguisherModal,
    mutateRemoveExtinguisher,
    IsLoadingMutateRemoveExtinguisher,
    mutateEditExtinguisher,
    IsLoadingMutateEditExtinguisher,
  };
};

export default useExtinguisher;
