import { parseISO } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { FireAlarmsModalProps } from '../types/firealarms.types';

export const useFireAlarmsModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Predio,Title&$filter=(Id eq ${params.id}) and (Tipo eq 'Alarme')`;
    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', pathModal);
    return resp.results[0];
  };

  const fetchHistory = async (codigo: string) => {
    const pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$filter=(idEquipamento eq ${codigo}) and (item eq 'Alarme')`;

    const resp = await crudParent.getListItemsv2('Historico_Equipamentos', pathModal);

    const dataWithTransformations = await Promise.all(
      resp?.results?.map(async (item: any) => {
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const responsavel = item.responsavel && item.responsavel.split('resp')[1];

        const bombeiro = await crudParent.getListItemsv2(
          'Bombeiros_Cadastrados',
          `?$Select=Id,Title&$filter=(Id eq ${responsavel || item.responsavel})`,
        );

        return {
          ...item,
          Created: dataCriado,
          responsavel: bombeiro.results[0].Title,
        };
      }),
    );

    return dataWithTransformations;
  };

  const fireAlarmsModalData: UseQueryResult<FireAlarmsModalProps> = useQuery({
    queryKey: ['equipments_firealarms_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const fireAlarms = await fetchEquipments();
        const history = fireAlarms && (await fetchHistory(fireAlarms.Id));

        return {
          ...fireAlarms,
          history: history,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/equipments/fire_alarms'),
  });

  const qrCodeValue = `Alarme;SP;São Paulo;SPO - Site São Paulo;${fireAlarmsModalData.data?.Predio};${fireAlarmsModalData.data?.Title}`;
  // Alarme;SP;São Paulo;SPO;SPO - Site São Paulo;401;30428

  return {
    fireAlarmsModalData,
    qrCodeValue,
  };
};
