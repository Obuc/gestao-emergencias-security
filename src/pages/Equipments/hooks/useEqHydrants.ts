import * as XLSX from 'xlsx';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import { IEqHydrantModal, IEqHydrants, IEqHydrantsFiltersProps } from '../types/EquipmentsHydrants';

const useEqHydrants = (eqHydrantsFilters?: IEqHydrantsFiltersProps) => {
  const { crud } = sharepointContext();
  const params = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');

  let path = `?$Select=Id,site/Title,predio/Title,pavimento/Title,local/Title,cod_hidrante,possui_abrigo,conforme,excluido,Modified&$expand=site,predio,pavimento,local&$Orderby=Modified desc&$Top=100&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false')`;

  if (eqHydrantsFilters?.place) {
    for (let i = 0; i < eqHydrantsFilters.place.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (local/Title eq '${eqHydrantsFilters.place[i]}')`;
    }
  }

  if (eqHydrantsFilters?.pavement) {
    for (let i = 0; i < eqHydrantsFilters.pavement.length; i++) {
      path += `${i === 0 ? ' and' : ' or'} (pavimento/Title eq '${eqHydrantsFilters.pavement[i]}')`;
    }
  }

  if (eqHydrantsFilters?.conformity && eqHydrantsFilters?.conformity === 'Conforme') {
    path += ` and (conforme ne 'false')`;
  }

  if (eqHydrantsFilters?.conformity && eqHydrantsFilters?.conformity !== 'Conforme') {
    path += ` and (conforme eq 'false')`;
  }

  if (eqHydrantsFilters?.hydrantId) {
    path += ` and ( substringof('${eqHydrantsFilters?.hydrantId}', cod_hidrante ))`;
  }

  if (eqHydrantsFilters?.hasShelter && eqHydrantsFilters?.hasShelter === 'Possui Abrigo: Sim') {
    path += ` and ( possui_abrigo ne 'false')`;
  }

  if (eqHydrantsFilters?.hasShelter && eqHydrantsFilters?.hasShelter === 'Possui Abrigo: Não') {
    path += ` and ( possui_abrigo eq 'false')`;
  }

  if (eqHydrantsFilters?.id) {
    path += ` and ( Id eq '${eqHydrantsFilters?.id}')`;
  }

  const fetchEquipments = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'hidrantes', path });
    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
          site: item.site?.Title,
          predio: item.predio?.Title,
          pavimento: item.pavimento?.Title,
          local: item.local?.Title,
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
    data: eqHydrantsData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      'eq_hydrantes_data',
      user_site,
      params.form,
      eqHydrantsFilters?.place,
      eqHydrantsFilters?.pavement,
      eqHydrantsFilters?.conformity,
      eqHydrantsFilters?.hydrantId,
      eqHydrantsFilters?.hasShelter,
      eqHydrantsFilters?.id,
    ],
    queryFn: fetchEquipments,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
    enabled: params.form === 'hydrants' && location.pathname === '/equipments/hydrants',
  });

  const fetchEqHydrantData = async () => {
    const path = `?$Select=Id,site/Title,predio/Title,pavimento/Title,local/Title,cod_hidrante,cod_qrcode,possui_abrigo,conforme,excluido,Modified&$expand=site,predio,pavimento,local&$Orderby=Modified desc&$Top=100&$Filter=(site/Title eq '${user_site}') and (Id eq ${params.id})`;

    const resp = await crud.getListItemsv2('hidrantes', path);
    return resp.results[0];
  };

  const fechRecordsHydrantsData = async (hydrantId: number) => {
    const resp = await crud.getListItemsv2(
      'registros_hidrantes',
      `?$Select=Id,hidrante_id/Id,bombeiro/Title,observacao,conforme,Created&$expand=bombeiro,hidrante_id&$Filter=(hidrante_id/Id eq '${hydrantId}')`,
    );
    return resp.results || null;
  };

  const { data: eqHydrantModal, isLoading: isLoadingEqHydrantModal }: UseQueryResult<IEqHydrantModal> = useQuery({
    queryKey:
      params.id && params.form === 'hydrants' ? ['eq_hydrant_modal', params.id, params.form] : ['eq_hydrant_modal'],
    queryFn: async () => {
      if (params.id && params.form === 'hydrants') {
        const eqHydrantData = await fetchEqHydrantData();
        const recordsHydrantData = eqHydrantData && (await fechRecordsHydrantsData(eqHydrantData.Id));

        return {
          ...eqHydrantData,
          local: eqHydrantData.local.Title,
          pavimento: eqHydrantData.pavimento.Title,
          predio: eqHydrantData.predio.Title,
          site: eqHydrantData.site.Title,
          history: recordsHydrantData,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && params.form === 'hydrants',
  });

  const {
    data: eqHydrantQrCodeList,
    isLoading: isLoadingEqHydrantQrCodeList,
    isError: isErrorEqHydrantQrCodeList,
  }: UseQueryResult<Array<IEqHydrants>> = useQuery({
    queryKey: ['eq_hydrant_qrcode_list'],
    queryFn: async () => {
      const path = `?$Select=Id,site/Title,predio/Title,pavimento/Title,local/Title,cod_hidrante,cod_qrcode,possui_abrigo,conforme,excluido,Modified&$expand=site,predio,pavimento,local&$Orderby=Modified desc&$Top=100&$Filter=(site/Title eq '${user_site}') and (excluido eq 'false')`;

      const resp = await crud.getListItems('hidrantes', path);

      const dataWithTransformations = await Promise.all(
        resp.map(async (item: any) => {
          return {
            ...item,
            local: item.local?.Title,
            pavimento: item.pavimento?.Title,
            site: item.site?.Title,
            predio: item.predio?.Title,
          };
        }),
      );

      return dataWithTransformations;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.form === 'hydrants' && location.pathname === '/equipments/hydrants',
  });

  const { mutateAsync: mutateRemoveEqHydrant, isLoading: isLoadingMutateRemoveEqHydrant } = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('hidrantes', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'eq_hydrantes_data',
          user_site,
          params.form,
          eqHydrantsFilters?.place,
          eqHydrantsFilters?.pavement,
          eqHydrantsFilters?.conformity,
          eqHydrantsFilters?.hydrantId,
          eqHydrantsFilters?.hasShelter,
          eqHydrantsFilters?.id,
        ],
      });
    },
  });

  const qrCodeValue = `Hidrantes;${eqHydrantModal?.site};${eqHydrantModal?.cod_qrcode}`;

  const handleExportEqHydrantsToExcel = () => {
    const columns: (keyof IEqHydrants)[] = [
      'Id',
      'site',
      'pavimento',
      'local',
      'cod_hidrante',
      'possui_abrigo',
      'conforme',
    ];

    const headerRow = columns.map((column) => column.toString());

    const dataFiltered = eqHydrantQrCodeList?.map((item) => {
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
      XLSX.writeFile(wb, `Equipamentos - Hidrantes.xlsx`);
    }
  };

  return {
    eqHydrantsData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,

    eqHydrantModal,
    isLoadingEqHydrantModal,

    mutateRemoveEqHydrant,
    isLoadingMutateRemoveEqHydrant,

    eqHydrantQrCodeList,
    isLoadingEqHydrantQrCodeList,
    isErrorEqHydrantQrCodeList,

    qrCodeValue,
    handleExportEqHydrantsToExcel,
  };
};

export default useEqHydrants;
