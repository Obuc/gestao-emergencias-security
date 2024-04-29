import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, parseISO, startOfYear } from 'date-fns';

import { sharepointContext } from '@/context/sharepointContext';
import { DeaHistoryProps, DeaModalProps } from '../types/dea.types';

export const useDeaModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Title,Predio,Codigo,LocEsp&$filter=(Id eq ${params.id}) and (Tipo eq 'DEA')`;
    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', pathModal);
    return resp.results[0];
  };

  const deaModalData: UseQueryResult<DeaModalProps> = useQuery({
    queryKey: ['equipments_dea_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const dea = await fetchEquipments();

        return {
          ...dea,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/spo/equipments/dea'),
  });

  const historyModalData: UseQueryResult<Array<DeaHistoryProps>> = useQuery({
    queryKey: ['equipments_dea_history_modal', deaModalData.data?.Id, year],
    queryFn: async () => {
      if (!deaModalData.data?.Id) {
        return [];
      }

      let pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$top=5000&$orderby=Created desc&$filter=(idEquipamento eq ${deaModalData.data?.Id}) and (item eq 'DEA') `;

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

          const responsavel = item.responsavel && item.responsavel.split('resp')[1];

          return {
            ...item,
            Created: dataCriado,
            responsavel:
              bombeiro.results.find((bombeiro: any) => bombeiro.Id === item.responsavel || bombeiro.Id === responsavel)
                ?.Title ?? '',
          };
        }),
      );

      return dataWithTransformations;
    },
  });

  const qrCodeValue = `DEA;SP;São Paulo;SPO - Site São Paulo;${deaModalData.data?.Predio};${deaModalData.data?.LocEsp};${deaModalData.data?.Codigo};${deaModalData.data?.Title}`;
  // DEA;SP;São Paulo;SPO;SPO - Site São Paulo;Prédio 501;9º Andar;869091;30551

  return {
    deaModalData,
    historyModalData,
    qrCodeValue,
    year,
    setYear,
  };
};
