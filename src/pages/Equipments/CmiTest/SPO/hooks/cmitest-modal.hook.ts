import { parseISO } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { CmiTestModalProps } from '../types/cmitest.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useCmiTestModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Predio,LocEsp,Title&$filter=(Id eq ${params.id}) and (Tipo eq 'Bomba')`;
    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', pathModal);
    return resp.results[0];
  };

  const fetchHistory = async (codigo: string) => {
    const pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$filter=(idEquipamento eq ${codigo}) and (item eq 'Bomba')`;

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

  const cmiTestModalData: UseQueryResult<CmiTestModalProps> = useQuery({
    queryKey: ['equipments_cmi_test_data_modal', params.id],
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
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/equipments/cmi_test'),
  });

  const qrCodeValue = `Bomba;SP;São Paulo;SPO - Site São Paulo;${cmiTestModalData.data?.Predio}`;
  // Bomba;SP;São Paulo;SPO;SPO - Site São Paulo;622

  return {
    cmiTestModalData,
    qrCodeValue,
  };
};
