import { parseISO } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { EmergencyDoorsModalProps } from '../types/emergencydoors.types';

export const useEmergencyDoorsModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Predio,Pavimento,Title&$filter=(Id eq ${params.id}) and (Tipo eq 'Porta')`;
    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', pathModal);
    return resp.results[0];
  };

  const fetchHistory = async (codigo: string) => {
    const pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$filter=(idEquipamento eq ${codigo}) and (item eq 'Porta')`;

    const resp = await crudParent.getListItemsv2('Historico_Equipamentos', pathModal);

    const dataWithTransformations = await Promise.all(
      resp?.results?.map(async (item: any) => {
        const dataCriadoIsoDate = item.Created && parseISO(item.Created);

        const dataCriado =
          dataCriadoIsoDate && new Date(dataCriadoIsoDate.getTime() + dataCriadoIsoDate.getTimezoneOffset() * 60000);

        const bombeiro = await crudParent.getListItemsv2(
          'Bombeiros_Cadastrados',
          `?$Select=Id,Title&$filter=(Id eq ${item.responsavel})`,
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

  const emergencyDoorsModalData: UseQueryResult<EmergencyDoorsModalProps> = useQuery({
    queryKey: ['equipments_emergencydoors_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const emergencyDoor = await fetchEquipments();
        const history = emergencyDoor && (await fetchHistory(emergencyDoor.Id));

        return {
          ...emergencyDoor,
          history: history,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/equipments/emergency_doors'),
  });

  const qrCodeValue = `Porta;SP;São Paulo;SPO - Site São Paulo;${emergencyDoorsModalData.data?.Predio};${emergencyDoorsModalData.data?.Pavimento};;${emergencyDoorsModalData.data?.Title}`;
  // Porta;SP;São Paulo;SPO;SPO - Site São Paulo;609;1º andar;;30347

  return {
    emergencyDoorsModalData,
    qrCodeValue,
  };
};
