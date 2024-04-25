import { parseISO } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { AmbulanceCheckModalProps } from '../types/ambulancecheck.types';

export const useAmbulanceCheckModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Title&$filter=(Id eq ${params.id}) and (Tipo eq 'Ambulancia')`;
    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', pathModal);
    return resp.results[0];
  };

  const fetchHistory = async (codigo: string) => {
    const pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$orderby=Created desc&$filter=(idEquipamento eq ${codigo}) and (item eq 'Ambulancia')`;

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

  const ambulanceCheckModalData: UseQueryResult<AmbulanceCheckModalProps> = useQuery({
    queryKey: ['equipments_ambulancecheck_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const ambulanceCheck = await fetchEquipments();
        const history = ambulanceCheck && (await fetchHistory(ambulanceCheck.Id));

        return {
          ...ambulanceCheck,
          history: history,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/equipments/ambulance_check'),
  });

  const qrCodeValue = `Ambulancia;SP;São Paulo;SPO - Site São Paulo;${ambulanceCheckModalData.data?.Title}`;

  return {
    ambulanceCheckModalData,
    qrCodeValue,
  };
};
