import { parseISO } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { DeaModalProps } from '../types/dea.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useDeaModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Title,Predio,Codigo,LocEsp&$filter=(Id eq ${params.id}) and (Tipo eq 'DEA')`;
    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', pathModal);
    return resp.results[0];
  };

  const fetchHistory = async (codigo: string) => {
    const pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$orderby=Created desc&$filter=(idEquipamento eq ${codigo}) and (item eq 'DEA')`;

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

  const deaModalData: UseQueryResult<DeaModalProps> = useQuery({
    queryKey: ['equipments_dea_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const dea = await fetchEquipments();
        const history = dea && (await fetchHistory(dea.Id));

        return {
          ...dea,
          history: history,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/equipments/dea'),
  });

  const qrCodeValue = `DEA;SP;São Paulo;SPO - Site São Paulo;${deaModalData.data?.Predio};${deaModalData.data?.LocEsp};${deaModalData.data?.Codigo};${deaModalData.data?.Title}`;
  // DEA;SP;São Paulo;SPO;SPO - Site São Paulo;Prédio 501;9º Andar;869091;30551

  return {
    deaModalData,
    qrCodeValue,
  };
};
