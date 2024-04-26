import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, startOfYear } from 'date-fns';

import { sharepointContext } from '@/context/sharepointContext';
import { LoadRatioHistoryModalProps, LoadRatioModalProps } from '../types/loadratio.types';

export const useLoadRatioModal = () => {
  const params = useParams();
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const user_site = localStorage.getItem('user_site');
  const equipments_value = pathname.split('/')[3];

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const path = `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme&$expand=site,tipo_veiculo&$Filter=(Id eq ${params.id})`;

    const resp = await crud.getListItemsv2('veiculos_emergencia', path);
    return resp.results[0];
  };

  const loadRatioModalData: UseQueryResult<LoadRatioModalProps> = useQuery({
    queryKey: ['equipments_load_ratio_data_modal_bxo', params.id, equipments_value],
    queryFn: async () => {
      if (params.id) {
        const data = await fetchEquipments();

        return {
          ...data,
          tipo_veiculo: data.tipo_veiculo?.Title,
          site: data.site?.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled:
      params.id !== undefined &&
      (pathname.includes('/bxo/equipments/scania') ||
        pathname.includes('/bxo/equipments/s10') ||
        pathname.includes('/bxo/equipments/mercedes') ||
        pathname.includes('/bxo/equipments/van') ||
        pathname.includes('/bxo/equipments/iveco') ||
        pathname.includes('/bxo/equipments/sprinter')) &&
      user_site === 'BXO',
  });

  const historyModalData: UseQueryResult<Array<LoadRatioHistoryModalProps>> = useQuery({
    queryKey: ['equipments_load_ratio_history_modal_bxo', loadRatioModalData.data?.Id, year],
    queryFn: async () => {
      if (!loadRatioModalData.data?.Id) {
        return [];
      }

      let path = `?$Select=Id,veiculo_idId,Created,site/Title,veiculo_id/Id,bombeiro/Title,conforme,observacao&$expand=site,veiculo_id,bombeiro&$top=5000&$orderby=Created desc&$&$Filter=(veiculo_id/Id eq '${loadRatioModalData.data?.Id}')`;

      if (year) {
        const startDate = format(startOfYear(new Date(year, 0, 1)), "yyyy-MM-dd'T'00:00:00'Z'");
        const endDate = format(endOfYear(new Date(year, 11, 31)), "yyyy-MM-dd'T'23:59:59'Z'");

        path += `and (Created ge '${startDate}') and (Created le '${endDate}')`;
      }

      const resp = await crud.getListItems('registros_relacao_carga', path);
      return resp;
    },
  });

  return {
    loadRatioModalData,
    historyModalData,
    year,
    setYear,
  };
};
