import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, parseISO, startOfYear } from 'date-fns';

import { sharepointContext } from '@/context/sharepointContext';
import { ValveHistoryProps, ValveModalProps } from '../types/valve.types';

const useValveModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Codigo,Predio,LocEsp,Title&$filter=(Id eq ${params.id}) and (Tipo eq 'Valvula')`;
    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', pathModal);
    return resp.results[0];
  };

  const valveModalData: UseQueryResult<ValveModalProps> = useQuery({
    queryKey: ['equipments_valve_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const valveData = await fetchEquipments();

        return {
          ...valveData,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/spo/equipments/valve'),
  });

  const historyModalData: UseQueryResult<Array<ValveHistoryProps>> = useQuery({
    queryKey: ['equipments_valve_history_modal', valveModalData.data?.Id, year],
    queryFn: async () => {
      if (!valveModalData.data?.Id) {
        return [];
      }

      let pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$top=5000&$orderby=Created desc&$filter=(idEquipamento eq ${valveModalData.data?.Id}) and (item eq 'Valvula') `;

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

          return {
            ...item,
            Created: dataCriado,
            responsavel: bombeiro.results.find((bombeiro: any) => bombeiro.Id === item.responsavel)?.Title ?? '',
          };
        }),
      );

      return dataWithTransformations;
    },
  });

  const qrCodeValue = `Valvula;SP;São Paulo;SPO - Site São Paulo;${valveModalData.data?.Predio};${valveModalData.data?.Codigo};${valveModalData.data?.LocEsp};${valveModalData.data?.Title}`;
  // Valvula;SP;São Paulo;SPO;SPO - Covestro;301;20;escada - falta alavanca;30019

  return {
    valveModalData,
    historyModalData,
    qrCodeValue,
    year,
    setYear,
  };
};

export default useValveModal;
