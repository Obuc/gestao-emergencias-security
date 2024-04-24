import { parseISO } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { OeiModalProps } from '../types/oei.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useOeiModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Predio,LocEsp,Title&$filter=(Id eq ${params.id}) and (Tipo eq 'OEI')`;
    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', pathModal);
    return resp.results[0];
  };

  const fetchHistory = async (codigo: string) => {
    const pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$filter=(idEquipamento eq ${codigo}) and (item eq 'Oei')`;

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

  const oeiModalData: UseQueryResult<OeiModalProps> = useQuery({
    queryKey: ['equipments_oei_data_modal', params.id],
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
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/equipments/oei_operation'),
  });

  const qrCodeValue = `OEI;SP;São Paulo;SPO - Site São Paulo;${oeiModalData.data?.Predio};${oeiModalData.data?.LocEsp};${oeiModalData.data?.Title}`;
  // OEI;SP;São Paulo;SP;SPO - Site São Paulo;104;1;30509

  return {
    oeiModalData,
    qrCodeValue,
  };
};
