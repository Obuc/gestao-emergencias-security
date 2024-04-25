import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, parseISO, startOfYear } from 'date-fns';

import { sharepointContext } from '@/context/sharepointContext';
import { FireAlarmsHistoryProps, FireAlarmsModalProps } from '../types/firealarms.types';

export const useFireAlarmsModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Predio,Title&$filter=(Id eq ${params.id}) and (Tipo eq 'Alarme')`;
    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', pathModal);
    return resp.results[0];
  };

  const fireAlarmsModalData: UseQueryResult<FireAlarmsModalProps> = useQuery({
    queryKey: ['equipments_firealarms_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const fireAlarms = await fetchEquipments();

        return {
          ...fireAlarms,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/equipments/fire_alarms'),
  });

  const historyModalData: UseQueryResult<Array<FireAlarmsHistoryProps>> = useQuery({
    queryKey: ['equipments_firealarms_history_modal', fireAlarmsModalData.data?.Id, year],
    queryFn: async () => {
      if (!fireAlarmsModalData.data?.Id) {
        return [];
      }

      let pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$top=5000&$orderby=Created desc&$filter=(idEquipamento eq ${fireAlarmsModalData.data?.Id}) and (item eq 'Alarme') `;

      if (year) {
        const startDate = format(startOfYear(new Date(year, 0, 1)), "yyyy-MM-dd'T'00:00:00'Z'");
        const endDate = format(endOfYear(new Date(year, 11, 31)), "yyyy-MM-dd'T'23:59:59'Z'");

        pathModal += `and (Created ge '${startDate}') and (Created le '${endDate}')`;
      }

      const resp = await crudParent.getListItemsv2('Historico_Equipamentos', pathModal);
      const bombeiro = await crudParent.getListItemsv2('Bombeiros_Cadastrados', `?$Select=Id,Title`);

      const dataWithTransformations = await Promise.all(
        resp?.results?.map(async (item: any) => {
          const dataCriadoIsoDate = item.Created && parseISO(item.Created);

          const dataCriado =
            dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

          const responsavel = item.responsavel && item.responsavel.split('resp')[1];

          return {
            ...item,
            Created: dataCriado,
            responsavel:
              bombeiro.results.find((bombeiro: any) => bombeiro.Id === item.responsavel || bombeiro.Id === responsavel)
                ?.Title ?? '',
          };
        }),
      );

      return dataWithTransformations;
    },
  });

  const qrCodeValue = `Alarme;SP;São Paulo;SPO - Site São Paulo;${fireAlarmsModalData.data?.Predio};${fireAlarmsModalData.data?.Title}`;
  // Alarme;SP;São Paulo;SPO;SPO - Site São Paulo;401;30428

  return {
    fireAlarmsModalData,
    historyModalData,
    qrCodeValue,
    year,
    setYear,
  };
};
