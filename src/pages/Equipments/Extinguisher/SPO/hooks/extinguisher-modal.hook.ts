import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, parseISO, startOfYear } from 'date-fns';

import { sharepointContext } from '@/context/sharepointContext';
import { ExtinguisherHistoryModalProps, ExtinguisherModalProps } from '../types/extinguisher.types';

export const useExtinguisherModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Title,codExtintor,peso_extintor,validadeExtintor,Predio,Pavimento,LocEsp,Tipo&$filter=(Id eq ${params.id})`;
    const resp = await crudParent.getListItemsv2('Extintores_Equipamentos', pathModal);
    return resp.results[0];
  };

  const extinguisherModalData: UseQueryResult<ExtinguisherModalProps> = useQuery({
    queryKey: ['equipments_extinguisher_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const eqExtinguisherData = await fetchEquipments();

        const dataValidadeIsoDate = eqExtinguisherData.validadeExtintor && parseISO(eqExtinguisherData.validadeExtintor);

        const dataValidade =
          dataValidadeIsoDate && new Date(dataValidadeIsoDate.getTime() + dataValidadeIsoDate.getTimezoneOffset() * 60000);

        return {
          ...eqExtinguisherData,
          validadeExtintor: dataValidade,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/spo/equipments/extinguisher'),
  });

  const historyModalData: UseQueryResult<Array<ExtinguisherHistoryModalProps>> = useQuery({
    queryKey: ['equipments_extinguisher_history_modal', extinguisherModalData.data?.Id, year],
    queryFn: async () => {
      if (!extinguisherModalData.data?.Id) {
        return [];
      }

      let pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$top=5000&$orderby=Created desc&$filter=(idEquipamento eq ${extinguisherModalData.data?.Id}) and (item eq 'Extintor') `;

      if (year) {
        const startDate = format(startOfYear(new Date(year, 0, 1)), "yyyy-MM-dd'T'00:00:00'Z'");
        const endDate = format(endOfYear(new Date(year, 11, 31)), "yyyy-MM-dd'T'23:59:59'Z'");

        pathModal += `and (Created ge '${startDate}') and (Created le '${endDate}')`;
      }

      const resp = await crudParent.getListItems('Historico_Equipamentos', pathModal);
      const bombeiro = await crudParent.getListItemsv2('Bombeiros_Cadastrados', `?$Select=Id,Title`);

      const dataWithTransformations = await Promise.all(
        resp?.map(async (item: any) => {
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

  const qrCodeExtinguisherValue = `Extintor;SP;São Paulo;SPO - Site São Paulo;${extinguisherModalData.data?.Predio};${extinguisherModalData.data?.Title};${extinguisherModalData.data?.Tipo};${extinguisherModalData.data?.peso_extintor};${extinguisherModalData.data?.Pavimento};${extinguisherModalData.data?.LocEsp}`;

  return {
    extinguisherModalData,
    historyModalData,
    qrCodeExtinguisherValue,
    year,
    setYear,
  };
};
