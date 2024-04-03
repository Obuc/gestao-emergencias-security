import * as XLSX from 'xlsx';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import {
  IEqExintguisherFiltersQRCodeProps,
  IEqExtinguisher,
  IEqExtinguisherFiltersProps,
  IEqExtinguisherModal,
} from '../types/EquipmentsExtinguisher';

const useEqExtinguisher = (eqExtinguisherFilters?: IEqExtinguisherFiltersProps) => {
  const { crud } = sharepointContext();
  const params = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  const [filtersQRCode, setFiltersQRCode] = useState<IEqExintguisherFiltersQRCodeProps>({
    id: null,
    cod_equipamento: null,
    predio: null,
    local: null,
    pavimento: null,
  });

  let path = `?$Select=Id,cod_qrcode,cod_extintor,excluido,Modified,conforme,site/Title,pavimento/Title,local/Title,tipo_extintor/Title&$expand=site,pavimento,tipo_extintor,local&$Orderby=Modified desc&$Top=25&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false')`;

  if (eqExtinguisherFilters?.place) {
    for (let i = 0; i < eqExtinguisherFilters.place.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (local/Title eq '${eqExtinguisherFilters.place[i]}')`;
    }
  }

  if (eqExtinguisherFilters?.pavement) {
    for (let i = 0; i < eqExtinguisherFilters.pavement.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (pavimento/Title eq '${eqExtinguisherFilters.pavement[i]}')`;
    }
  }

  if (eqExtinguisherFilters?.extinguisherType) {
    for (let i = 0; i < eqExtinguisherFilters?.extinguisherType.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (tipo_extintor/Title eq '${eqExtinguisherFilters?.extinguisherType[i]}')`;
    }
  }

  if (eqExtinguisherFilters?.conformity && eqExtinguisherFilters?.conformity === 'Conforme') {
    path += ` and (conforme ne 'false')`;
  }

  if (eqExtinguisherFilters?.conformity && eqExtinguisherFilters?.conformity !== 'Conforme') {
    path += ` and (conforme eq 'false')`;
  }

  if (eqExtinguisherFilters?.extinguisherId) {
    path += ` and ( substringof('${eqExtinguisherFilters?.extinguisherId}', cod_extintor ))`;
  }

  if (eqExtinguisherFilters?.id) {
    path += ` and ( Id eq '${eqExtinguisherFilters?.id}')`;
  }

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'extintores', path });
    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
          local: item.local?.Title,
          pavimento: item.pavimento?.Title,
          tipo_extintor: item.tipo_extintor?.Title,
          site: item.site?.Title,
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
    data: equipments,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      'equipments_data',
      user_site,
      params.form,
      eqExtinguisherFilters?.place,
      eqExtinguisherFilters?.pavement,
      eqExtinguisherFilters?.extinguisherType,
      eqExtinguisherFilters?.conformity,
      eqExtinguisherFilters?.extinguisherId,
      eqExtinguisherFilters?.id,
    ],

    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: params.form === 'extinguisher' && location.pathname === '/equipments/extinguisher',
  });

  const fetchEqExtinguisherData = async () => {
    const pathModal = `?$Select=Id,cod_extintor,cod_qrcode,conforme,local/Title,massa/Title,pavimento/Title,predio/Title,site/Title,tipo_extintor/Title,validade,ultima_inspecao&$expand=local,massa,pavimento,predio,site,tipo_extintor&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('extintores', pathModal);
    return resp.results[0];
  };

  const fechRecordsExtinguisherData = async (extinguisherId: number) => {
    const resp = await crud.getListItemsv2(
      'registros_extintor',
      `?$Select=Id,extintor_id/Id,bombeiro_id/Title,cod_extintor,data_pesagem,novo,observacao,status,conforme,Created&$expand=bombeiro_id,extintor_id&$Filter=(extintor_id/Id eq '${extinguisherId}')`,
    );
    return resp.results || null;
  };

  const { data: eqExtinguisherModal, isLoading: isLoadingEqExtinguisherModal }: UseQueryResult<IEqExtinguisherModal> =
    useQuery({
      queryKey:
        params.id && params.form === 'extinguisher'
          ? ['eq_extinguisher_data_modal', params.id, params.form]
          : ['eq_extinguisher_data_modal'],
      queryFn: async () => {
        if (params.id) {
          const eqExtinguisherData = await fetchEqExtinguisherData();

          const recordsExtinguisherData =
            eqExtinguisherData && (await fechRecordsExtinguisherData(eqExtinguisherData.Id));

          return {
            ...eqExtinguisherData,
            local: eqExtinguisherData.local.Title,
            massa: eqExtinguisherData.massa.Title,
            pavimento: eqExtinguisherData.pavimento.Title,
            predio: eqExtinguisherData.predio.Title,
            site: eqExtinguisherData.site.Title,
            tipo_extintor: eqExtinguisherData.tipo_extintor.Title,
            history: recordsExtinguisherData,
          };
        } else {
          return [];
        }
      },
      staleTime: 5000 * 60, // 5 Minute
      refetchOnWindowFocus: false,
      enabled: params.id !== undefined && params.form === 'extinguisher',
    });

  const {
    data: eqExtinguisher,
    isLoading: isLoadingEqExtinguisher,
    isError: isErrorEqExtinguisher,
  }: UseQueryResult<Array<IEqExtinguisher>> = useQuery({
    queryKey: ['eq_extinguisher_data', filtersQRCode],
    queryFn: async () => {
      let path = `?$Select=Id,cod_qrcode,predio/Title,tipo_extintor/Title,pavimento/Title,local/Title,site/Title,cod_extintor,conforme&$expand=tipo_extintor,predio,site,pavimento,local&$Filter=(site/Title eq '${user_site}')`;

      if (filtersQRCode?.id) {
        path += ` and ( substringof('${filtersQRCode?.id}', Id ))`;
      }

      if (filtersQRCode?.cod_equipamento) {
        path += ` and ( substringof('${filtersQRCode?.cod_equipamento}', cod_extintor ))`;
      }

      if (filtersQRCode?.predio) {
        path += ` and ( substringof('${filtersQRCode?.predio}', predio/Title ))`;
      }

      if (filtersQRCode?.local) {
        path += ` and ( substringof('${filtersQRCode?.local}', local/Title ))`;
      }

      if (filtersQRCode?.pavimento) {
        path += ` and ( substringof('${filtersQRCode?.pavimento}', pavimento/Title ))`;
      }

      const resp = await crud.getListItems('extintores', path);

      const dataWithTransformations = await Promise.all(
        resp.map(async (item: any) => {
          return {
            ...item,
            local: item.local?.Title,
            pavimento: item.pavimento?.Title,
            site: item.site?.Title,
            predio: item.predio?.Title,
            tipo_extintor: item.tipo_extintor?.Title,
          };
        }),
      );

      return dataWithTransformations;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: location.pathname === '/equipments/extinguisher',
  });

  // const data = useQuery({
  //   queryKey: ['eq_extinguisher_data_2', filtersQRCode],
  //   queryFn: async () => {
  //     // let path = `?$Select=*&$Filter=((Id ge '3699') and (Id ne '3891'))`; // Extintor SPO
  //     // let path = `?$Select=*&$Filter=((Id ge '299') and (Id ne '318'))`; // Hidrante SPO
  //     let path = `?$Select=*&$Filter=((Id ge '261') and (Id ne '276'))`; // Porta SPO
  //     // let path = `?$Select=*&$Filter=(Id eq '260')`; // Casa de Bombas

  //     const resp = await crudParent.getListItems('Hidrantes_Equipamentos', path);

  //     // const dataWithTransformations = await Promise.all(
  //     //   resp.map(async (item: any) => {
  //     //     return {
  //     //       ...item,
  //     //       local: item.local?.Title,
  //     //       pavimento: item.pavimento?.Title,
  //     //       site: item.site?.Title,
  //     //       predio: item.predio?.Title,
  //     //       tipo_extintor: item.tipo_extintor?.Title,
  //     //     };
  //     //   }),
  //     // );

  //     return resp;
  //   },
  //   staleTime: 5000 * 60, // 5 Minute
  //   refetchOnWindowFocus: false,
  //   enabled: location.pathname === '/equipments/extinguisher',
  // });

  const { mutateAsync: mutateRemoveEquipment, isLoading: isLoadingMutateRemoveEquipment } = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('extintores', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'equipments_data',
          user_site,
          params.form,
          eqExtinguisherFilters?.place,
          eqExtinguisherFilters?.pavement,
          eqExtinguisherFilters?.extinguisherType,
          eqExtinguisherFilters?.conformity,
          eqExtinguisherFilters?.extinguisherId,
          eqExtinguisherFilters?.id,
        ],
      });
    },
  });

  const qrCodeExtinguisherValue = `Extintor;${eqExtinguisherModal?.site};${eqExtinguisherModal?.cod_qrcode};${eqExtinguisherModal?.tipo_extintor}`;

  const handleExportExtinguisherToExcel = () => {
    const columns: (keyof IEqExtinguisher)[] = [
      'Id',
      'pavimento',
      'local',
      'predio',
      'cod_extintor',
      'tipo_extintor',
      'conforme',
      'site',
    ];

    const headerRow = columns.map((column) => column.toString());

    const dataFiltered = eqExtinguisher?.map((item) => {
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

      XLSX.utils.book_append_sheet(wb, ws, 'Extintores');
      XLSX.writeFile(wb, `Equipamentos - Extintores.xlsx`);
    }
  };

  return {
    equipments,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveEquipment,
    isLoadingMutateRemoveEquipment,
    eqExtinguisherModal,
    isLoadingEqExtinguisherModal,
    eqExtinguisher,
    isLoadingEqExtinguisher,
    isErrorEqExtinguisher,
    qrCodeExtinguisherValue,
    handleExportExtinguisherToExcel,

    filtersQRCode,
    setFiltersQRCode,
  };
};

export default useEqExtinguisher;
