import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import { EqExtinguisherModal, EquipmentsExtinguisher } from '../types/EquipmentsExtinguisher';

const useEqExtinguisher = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const path = `?$Select=Id,cod_qrcode,cod_extintor,excluido,Modified,conforme,site/Title,pavimento/Title,local/Title&$expand=site,pavimento,local&$Orderby=Modified desc&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false')`;
  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'extintores', path });
    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
          local: item.local?.Title,
          pavimento: item.pavimento?.Title,
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
    queryKey:
      equipments_value === 'Extintores'
        ? ['equipments_data', user_site]
        : ['equipments_data', user_site, equipments_value],

    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
  });

  const fetchEqExtinguisherData = async () => {
    if (params.id && equipments_value === 'Extintores') {
      const pathModal = `?$Select=Id,cod_extintor,cod_qrcode,conforme,local/Title,massa/Title,pavimento/Title,predio/Title,site/Title,tipo_extintor/Title,validade,ultima_inspecao&$expand=local,massa,pavimento,predio,site,tipo_extintor&$filter=Id eq ${params.id}`;
      const resp = await crud.getListItemsv2('extintores', pathModal);
      return resp.results[0];
    }
  };

  const fechRecordsExtinguisherData = async (extinguisherId: number) => {
    if (params.id && equipments_value === 'Extintores') {
      const resp = await crud.getListItemsv2(
        'registros_extintor',
        `?$Select=Id,extintor_id/Id,bombeiro_id/Title,cod_extintor,data_pesagem,novo,observacao,status,conforme,Created&$expand=bombeiro_id,extintor_id&$Filter=(extintor_id/Id eq '${extinguisherId}')`,
      );
      return resp.results || null;
    }
  };

  const { data: eqExtinguisherModal, isLoading: isLoadingEqExtinguisherModal }: UseQueryResult<EqExtinguisherModal> =
    useQuery({
      queryKey:
        params.id && equipments_value === 'Extintores'
          ? ['eq_extinguisher_data_modal', params.id, equipments_value]
          : ['eq_extinguisher_data_modal'],
      queryFn: async () => {
        if (params.id && equipments_value === 'Extintores') {
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
    });

  const {
    data: eqExtinguisher,
    isLoading: isLoadingEqExtinguisher,
    isError: isErrorEqExtinguisher,
  }: UseQueryResult<Array<EquipmentsExtinguisher>> = useQuery({
    queryKey: ['eq_extinguisher_data'],
    queryFn: async () => {
      const path = `?$Select=Id,cod_qrcode,predio/Title,tipo_extintor/Title,pavimento/Title,local/Title,site/Title,cod_extintor,conforme&$expand=tipo_extintor,predio,site,pavimento,local&$Filter(site/Title eq '${user_site}')`;
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
  });

  const { mutateAsync: mutateRemoveEquipment, isLoading: isLoadingMutateRemoveEquipment } = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('extintores', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments_data', user_site] });
    },
  });

  const qrCodeExtinguisherValue = `Extintor;${eqExtinguisherModal?.site};${eqExtinguisherModal?.cod_qrcode};${eqExtinguisherModal?.tipo_extintor}`;

  const handleExportExtinguisherToExcel = () => {
    const columns: (keyof EquipmentsExtinguisher)[] = [
      'Id',
      'cod_extintor',
      'local',
      'cod_qrcode',
      'predio',
      'pavimento',
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

      XLSX.utils.book_append_sheet(wb, ws, '');
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
  };
};

export default useEqExtinguisher;
