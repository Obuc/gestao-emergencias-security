import { parseISO } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { ValveModalProps } from '../types/valve.types';
import { sharepointContext } from '@/context/sharepointContext';

const useValveModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Codigo,Predio,LocEsp,Title&$filter=(Id eq ${params.id}) and (Tipo eq 'Valvula')`;
    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', pathModal);
    return resp.results[0];
  };

  const fetchHistory = async (codigo: string) => {
    const pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$orderby=Created desc&$filter=(idEquipamento eq ${codigo}) and (item eq 'Valvula')`;

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

  const valveModalData: UseQueryResult<ValveModalProps> = useQuery({
    queryKey: ['equipments_valve_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const valveData = await fetchEquipments();
        const history = valveData && (await fetchHistory(valveData.Id));

        return {
          ...valveData,
          history: history,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/equipments/valve'),
  });

  const qrCodeValue = `Valvula;SP;São Paulo;SPO - Site São Paulo;${valveModalData.data?.Predio};${valveModalData.data?.Codigo};${valveModalData.data?.LocEsp};${valveModalData.data?.Title}`;
  // Valvula;SP;São Paulo;SPO;SPO - Covestro;301;20;escada - falta alavanca;30019

  return {
    valveModalData,
    qrCodeValue,
  };
};

export default useValveModal;
