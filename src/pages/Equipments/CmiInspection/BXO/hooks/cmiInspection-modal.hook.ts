import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, startOfYear } from 'date-fns';

import { sharepointContext } from '@/context/sharepointContext';
import { CmiInspectionHistoryProps, CmiInspectionModal } from '../types/cmiInspection.types';

export const useCmiInspectionModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crud } = sharepointContext();

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,cod_qrcode,conforme,predio/Title,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,predio,tipo_equipamento&$Orderby=Created desc&$Filter=(site/Title eq 'BXO') and (tipo_equipamento/Title eq 'Inspeção CMI') and (excluido eq 'false') and (Id eq '${params.id}')`;

    const resp = await crud.getListItemsv2('equipamentos_diversos', pathModal);
    return resp.results[0];
  };

  const cmiInspectionModalData: UseQueryResult<CmiInspectionModal> = useQuery({
    queryKey: ['equipments_cmi_inspection_data_modal_bxo', params.id, params.form],
    queryFn: async () => {
      if (params.id) {
        const data = await fetchEquipments();

        return {
          ...data,
          pavimento: data.pavimento.Title,
          predio: data.predio.Title,
          site: data.site.Title,
          tipo_equipamento: data.tipo_equipamento.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && location.pathname.includes('/equipments/cmi_inspection'),
  });

  const historyModalData: UseQueryResult<Array<CmiInspectionHistoryProps>> = useQuery({
    queryKey: ['equipments_cmi_inspection_history_modal_bxo', cmiInspectionModalData.data?.Id, year],
    queryFn: async () => {
      if (!cmiInspectionModalData.data?.Id) {
        return [];
      }

      let pathModal = `?$Select=Id,cmi_idId,cmi_id/Id,bombeiro_id/Title,observacao,conforme,Created&$expand=bombeiro_id,cmi_id&$Filter=(cmi_id/Id eq '${cmiInspectionModalData.data?.Id}') `;

      if (year) {
        const startDate = format(startOfYear(new Date(year, 0, 1)), "yyyy-MM-dd'T'00:00:00'Z'");
        const endDate = format(endOfYear(new Date(year, 11, 31)), "yyyy-MM-dd'T'23:59:59'Z'");

        pathModal += `and (Created ge '${startDate}') and (Created le '${endDate}')`;
      }

      const resp = await crud.getListItems('registros_inspecao_cmi', pathModal);
      return resp;
    },
  });

  return {
    cmiInspectionModalData,
    historyModalData,
    year,
    setYear,
  };
};
