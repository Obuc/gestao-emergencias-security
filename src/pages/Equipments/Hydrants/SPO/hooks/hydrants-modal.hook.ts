import { parseISO } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { HydrantsModalProps } from '../types/hydrants.types';
import { sharepointContext } from '@/context/sharepointContext';

const useHydrantModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Title,Modified,ultimaInsp,numero_hidrante,NumMangueiras,NumLacre,Predio,Pavimento,LocEsp,diametro,comprimento&$filter=(Id eq ${params.id})`;
    const resp = await crudParent.getListItemsv2('Hidrantes_Equipamentos', pathModal);
    return resp.results[0];
  };

  const fetchHistory = async (codigo: string) => {
    const pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$filter=(idEquipamento eq ${codigo}) and (item eq 'Hidrante')`;

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

  const hydrantModalData: UseQueryResult<HydrantsModalProps> = useQuery({
    queryKey: ['equipments_hydrant_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const hydrantData = await fetchEquipments();
        const history = hydrantData && (await fetchHistory(hydrantData.Id));

        return {
          ...hydrantData,
          history: history,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/equipments/hydrant'),
  });

  const qrCodeValue = `Hidrante;SP;São Paulo;SPO - Site São Paulo;${hydrantModalData.data?.Predio};;;${hydrantModalData.data?.diametro};${hydrantModalData.data?.comprimento};${hydrantModalData.data?.Pavimento};${hydrantModalData.data?.LocEsp};${hydrantModalData.data?.NumLacre};${hydrantModalData.data?.Title}`;

  return {
    hydrantModalData,
    qrCodeValue,
  };
};

export default useHydrantModal;
