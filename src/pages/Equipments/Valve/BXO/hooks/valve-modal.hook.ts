import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, startOfYear } from 'date-fns';

import { ValveHistoryProps, ValveModal } from '../types/valve.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useValveModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crud } = sharepointContext();

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,cod_qrcode,site/Title,predio/Title,pavimento/Title,local/Title,tipo_equipamento/Title,cod_equipamento,conforme&$expand=site,predio,pavimento,local,tipo_equipamento&$Filter=((tipo_equipamento/Title eq 'Válvulas de Governo') and (Id eq ${params.id}) and (site/Title eq 'BXO'))`;

    const resp = await crud.getListItemsv2('equipamentos_diversos', pathModal);

    return resp.results[0];
  };

  const valveModalData: UseQueryResult<ValveModal> = useQuery({
    queryKey: ['equipments_valve_data_modal_bxo', params.id, params.form],
    queryFn: async () => {
      if (params.id) {
        const data = await fetchEquipments();

        return {
          ...data,
          local: data.local.Title,
          pavimento: data.pavimento.Title,
          predio: data.predio.Title,
          site: data.site.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && location.pathname.includes('/bxo/equipments/valve'),
  });

  const historyModalData: UseQueryResult<Array<ValveHistoryProps>> = useQuery({
    queryKey: ['equipments_valve_history_modal_bxo', valveModalData.data?.Id, year],
    queryFn: async () => {
      if (!valveModalData.data?.Id) {
        return [];
      }

      let pathModal = `?$Select=Id,valvula_id/Id,bombeiro_id/Title,observacao,conforme,Created,data_legado&$expand=bombeiro_id,valvula_id&$Filter=(valvula_id/Id eq '${valveModalData.data?.Id}') `;

      if (year) {
        const startDate = format(startOfYear(new Date(year, 0, 1)), "yyyy-MM-dd'T'00:00:00'Z'");
        const endDate = format(endOfYear(new Date(year, 11, 31)), "yyyy-MM-dd'T'23:59:59'Z'");

        pathModal += `and (Created ge '${startDate}') and (Created le '${endDate}')`;
      }

      const resp = await crud.getListItems('registros_valvula_governo', pathModal);
      return resp;
    },
  });

  return {
    valveModalData,
    historyModalData,
    year,
    setYear,
  };
};
