import { parseISO } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { ExtinguisherModalProps } from '../types/extinguisher.types';

const useExtinguisherModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Title,codExtintor,peso_extintor,validadeExtintor,Predio,Pavimento,LocEsp,Tipo&$filter=(Id eq ${params.id})`;
    const resp = await crudParent.getListItemsv2('Extintores_Equipamentos', pathModal);
    return resp.results[0];
  };

  const fetchHistory = async (codigo: string) => {
    const pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$filter=(idEquipamento eq ${codigo}) and (item eq 'Extintor')`;

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

  const extinguisherModalData: UseQueryResult<ExtinguisherModalProps> = useQuery({
    queryKey: ['equipments_extinguisher_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const eqExtinguisherData = await fetchEquipments();
        const extinguisherHistory = eqExtinguisherData && (await fetchHistory(eqExtinguisherData.Id));

        const dataValidadeIsoDate = eqExtinguisherData.validadeExtintor && parseISO(eqExtinguisherData.validadeExtintor);

        const dataValidade =
          dataValidadeIsoDate && new Date(dataValidadeIsoDate.getTime() + dataValidadeIsoDate.getTimezoneOffset() * 60000);

        return {
          ...eqExtinguisherData,
          validadeExtintor: dataValidade,
          history: extinguisherHistory,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/equipments/extinguisher'),
  });

  const qrCodeExtinguisherValue = `Extintor;SP;São Paulo;SPO - Site São Paulo;${extinguisherModalData.data?.Predio};${extinguisherModalData.data?.Title};${extinguisherModalData.data?.Tipo};${extinguisherModalData.data?.peso_extintor};${extinguisherModalData.data?.Pavimento};${extinguisherModalData.data?.LocEsp}`;

  return {
    extinguisherModalData,
    qrCodeExtinguisherValue,
  };
};

export default useExtinguisherModal;
