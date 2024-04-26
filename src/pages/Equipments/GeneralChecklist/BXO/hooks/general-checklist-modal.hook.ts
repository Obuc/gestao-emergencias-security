import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, startOfYear } from 'date-fns';

import { sharepointContext } from '@/context/sharepointContext';
import { GeneralChecklistHistoryModalProps, GeneralChecklistModalProps } from '../types/general-checklist.types';

export const useGeneralChecklistModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crud } = sharepointContext();

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme_check_geral,excluido&$expand=site,tipo_veiculo&$Filter=(Id eq ${params.id})`;

    const resp = await crud.getListItemsv2('veiculos_emergencia', pathModal);
    return resp.results[0];
  };

  const generalChecklistModalData: UseQueryResult<GeneralChecklistModalProps> = useQuery({
    queryKey: ['equipments_general_checklist_data_modal', params.id, params.form],
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
    enabled: params.id !== undefined && location.pathname.includes('/bxo/equipments/general_checklist'),
  });

  const historyModalData: UseQueryResult<Array<GeneralChecklistHistoryModalProps>> = useQuery({
    queryKey: ['equipments_general_checklist_history_modal_bxo', generalChecklistModalData.data?.Id, year],
    queryFn: async () => {
      if (!generalChecklistModalData.data?.Id) {
        return [];
      }

      let pathModal = `?$Select=Id,veiculo_idId,Created,site/Title,veiculo_id/Id,bombeiro/Title,conforme,observacao&$expand=site,veiculo_id,bombeiro&$Filter=(veiculo_id/Id eq '${generalChecklistModalData.data?.Id}') `;

      if (year) {
        const startDate = format(startOfYear(new Date(year, 0, 1)), "yyyy-MM-dd'T'00:00:00'Z'");
        const endDate = format(endOfYear(new Date(year, 11, 31)), "yyyy-MM-dd'T'23:59:59'Z'");

        pathModal += `and (Created ge '${startDate}') and (Created le '${endDate}')`;
      }

      const resp = await crud.getListItems('registros_veiculos_emergencia', pathModal);
      return resp;
    },
  });

  return {
    generalChecklistModalData,
    historyModalData,
    year,
    setYear,
  };
};
