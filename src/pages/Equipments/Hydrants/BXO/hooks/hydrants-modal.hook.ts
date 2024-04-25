import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, startOfYear } from 'date-fns';

import { sharepointContext } from '@/context/sharepointContext';
import { HydrantModal, HydrantsHistoryProps } from '../types/hydrants.types';

export const useHydrantModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crud } = sharepointContext();

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,site/Title,predio/Title,pavimento/Title,local/Title,cod_hidrante,cod_qrcode,possui_abrigo,conforme,excluido,Modified&$expand=site,predio,pavimento,local&$filter=Id eq ${params.id}`;

    const resp = await crud.getListItemsv2('hidrantes', pathModal);

    return resp.results[0];
  };

  const hydrantModalData: UseQueryResult<HydrantModal> = useQuery({
    queryKey: ['equipments_hydrant_data_modal_bxo', params.id, params.form],
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
    enabled: params.id !== undefined && location.pathname.includes('/equipments/hydrant'),
  });

  const historyModalData: UseQueryResult<Array<HydrantsHistoryProps>> = useQuery({
    queryKey: ['equipments_hydrant_history_modal_bxo', hydrantModalData.data?.Id, year],
    queryFn: async () => {
      if (!hydrantModalData.data?.Id) {
        return [];
      }

      let pathModal = `?$Select=Id,hidrante_id/Id,bombeiro/Title,observacao,conforme,Created&$expand=bombeiro,hidrante_id&$Filter=(hidrante_id/Id eq '${hydrantModalData.data?.Id}') `;

      if (year) {
        const startDate = format(startOfYear(new Date(year, 0, 1)), "yyyy-MM-dd'T'00:00:00'Z'");
        const endDate = format(endOfYear(new Date(year, 11, 31)), "yyyy-MM-dd'T'23:59:59'Z'");

        pathModal += `and (Created ge '${startDate}') and (Created le '${endDate}')`;
      }

      const resp = await crud.getListItems('registros_hidrantes', pathModal);
      return resp;
    },
  });

  return {
    hydrantModalData,
    historyModalData,
    year,
    setYear,
  };
};
