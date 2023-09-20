import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sharepointContext } from '../../../context/sharepointContext';
import { EqInspectionCmiModal, EquipmentsInspectionCmi } from '../types/EquipmentsInspectionCmi';
import { useState } from 'react';

const useEqInspectionCmi = () => {
  const { crud } = sharepointContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const [isLoadinghandleExportEqInspectionCmiToExcel, setIsLoadinghandleExportEqInspectionCmiToExcel] =
    useState<boolean>(false);

  const path = `?$Select=Id,cod_qrcode,conforme,excluido,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,tipo_equipamento&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq '${equipments_value}') and (excluido eq 'false')`;

  const fetchEqInspectionCmi = async ({ pageParam }: { pageParam?: string }) => {
    const response = await crud.getPaged(pageParam ? { nextUrl: pageParam } : { list: 'equipamentos_diversos', path });
    const dataWithTransformations = await Promise.all(
      response?.data?.value?.map(async (item: any) => {
        return {
          ...item,
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
    queryKey: ['equipments_data_inspection_cmi', user_site],
    queryFn: fetchEqInspectionCmi,
    getNextPageParam: (lastPage, _) => lastPage?.data['odata.nextLink'] ?? undefined,
    staleTime: 1000 * 60,
  });

  const fetchEqCmiData = async () => {
    if (params.id && equipments_value === 'Inspeção CMI') {
      const path = `?$Select=Id,cod_qrcode,conforme,predio/Title,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,predio,tipo_equipamento&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq '${equipments_value}') and (excluido eq 'false')`;

      const resp = await crud.getListItemsv2('equipamentos_diversos', path);
      return resp.results[0];
    }
  };

  const fechRecordsTestCmiData = async (cmiId: number) => {
    if (params.id && equipments_value === 'Inspeção CMI') {
      const resp = await crud.getListItemsv2(
        'registros_inspecao_cmi',
        `?$Select=Id,cmi_idId,cmi_id/Id,bombeiro_id/Title,observacao,conforme,Created&$expand=bombeiro_id,cmi_id&$Filter=(cmi_id/Id eq '${cmiId}')`,
      );
      return resp.results || null;
    }
  };

  const { data: eqInspectionCmiModal, isLoading: isLoadingeEInspectionCmiModal }: UseQueryResult<EqInspectionCmiModal> =
    useQuery({
      queryKey: params.id ? ['eq_inspection_cmi_data_modal', params.id] : ['eq_inspection_cmi_data_modal'],
      queryFn: async () => {
        if (params.id && equipments_value === 'Inspeção CMI') {
          const eqInspectionCmiData = await fetchEqCmiData();
          const recordsTestCmi = eqInspectionCmiData && (await fechRecordsTestCmiData(eqInspectionCmiData.Id));

          return {
            ...eqInspectionCmiData,
            pavimento: eqInspectionCmiData.pavimento.Title,
            predio: eqInspectionCmiData.predio.Title,
            tipo_equipamento: eqInspectionCmiData.tipo_equipamento.Title,
            site: eqInspectionCmiData.site.Title,
            history: recordsTestCmi,
          };
        } else {
          return [];
        }
      },
      staleTime: 5000 * 60, // 5 Minute
      refetchOnWindowFocus: false,
    });

  const { data: eqInspectionCmi, isLoading: isLoadingEqInspectionCmi }: UseQueryResult<Array<EquipmentsInspectionCmi>> =
    useQuery({
      queryKey: ['eq_inspection_cmi_data'],
      queryFn: async () => {
        const path = `?$Select=Id,cod_qrcode,conforme,predio/Title,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,predio,tipo_equipamento&$Orderby=Created desc&$Filter=(site/Title eq '${user_site}') and (tipo_equipamento/Title eq '${equipments_value}') and (excluido eq 'false')`;

        const resp = await crud.getListItems('equipamentos_diversos', path);

        const dataWithTransformations = await Promise.all(
          resp.map(async (item: any) => {
            return {
              ...item,
              pavimento: item.pavimento?.Title,
              site: item.site?.Title,
              predio: item.predio?.Title,
              tipo_equipamento: item.tipo_equipamento?.Title,
            };
          }),
        );

        return dataWithTransformations;
      },
      staleTime: 5000 * 60, // 5 Minute
      refetchOnWindowFocus: false,
    });

  const {
    mutateAsync: mutateRemoveEqInspectionCmi,
    isLoading: isLoadingMutateRemoveEqInspectionCmi,
    isError: isErrorEqInspectionCmi,
  } = useMutation({
    mutationFn: async (itemId: number) => {
      await crud.updateItemList('equipamentos_diversos', itemId, { excluido: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments_data_inspection_cmi', user_site] });
    },
  });

  const qrCodeValue =
    eqInspectionCmiModal?.site === 'BXO'
      ? `TesteCMIBXO;${eqInspectionCmiModal?.site};${eqInspectionCmiModal?.cod_qrcode}`
      : `Bomba;${eqInspectionCmiModal?.site};${eqInspectionCmiModal?.cod_qrcode}`;

  const handleExportEqInspectionCmiToExcel = () => {
    setIsLoadinghandleExportEqInspectionCmiToExcel(true);

    const columns: (keyof EquipmentsInspectionCmi)[] = ['Id', 'cod_qrcode', 'predio', 'pavimento', 'conforme', 'site'];

    const headerRow = columns.map((column) => column.toString());

    const dataFiltered = eqInspectionCmi?.map((item) => {
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
      XLSX.writeFile(wb, `Equipamentos - Inspeção CMI.xlsx`);
    }

    setIsLoadinghandleExportEqInspectionCmiToExcel(false);
  };

  return {
    equipments,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveEqInspectionCmi,
    isLoadingMutateRemoveEqInspectionCmi,

    eqInspectionCmiModal,
    isLoadingeEInspectionCmiModal,

    eqInspectionCmi,
    isLoadingEqInspectionCmi,
    isErrorEqInspectionCmi,

    qrCodeValue,
    handleExportEqInspectionCmiToExcel,
    isLoadinghandleExportEqInspectionCmiToExcel,
  };
};

export default useEqInspectionCmi;
