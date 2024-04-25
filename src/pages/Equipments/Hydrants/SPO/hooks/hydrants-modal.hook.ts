import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, parseISO, startOfYear } from 'date-fns';

import { sharepointContext } from '@/context/sharepointContext';
import { HydrantsHistoryProps, HydrantsModalProps } from '../types/hydrants.types';

const useHydrantModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Title,Modified,ultimaInsp,numero_hidrante,NumMangueiras,NumLacre,Predio,Pavimento,LocEsp,diametro,comprimento&$filter=(Id eq ${params.id})`;
    const resp = await crudParent.getListItemsv2('Hidrantes_Equipamentos', pathModal);
    return resp.results[0];
  };

  const hydrantModalData: UseQueryResult<HydrantsModalProps> = useQuery({
    queryKey: ['equipments_hydrant_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const hydrantData = await fetchEquipments();

        return {
          ...hydrantData,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/equipments/hydrant'),
  });

  const historyModalData: UseQueryResult<Array<HydrantsHistoryProps>> = useQuery({
    queryKey: ['equipments_extinguisher_history_modal', hydrantModalData.data?.Id, year],
    queryFn: async () => {
      if (!hydrantModalData.data?.Id) {
        return [];
      }

      let pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$top=5000&$orderby=Created desc&$filter=(idEquipamento eq ${hydrantModalData.data?.Id}) and (item eq 'Hidrante') `;

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

  const qrCodeValue = `Hidrante;SP;São Paulo;SPO - Site São Paulo;${hydrantModalData.data?.Predio};;;${hydrantModalData.data?.diametro};${hydrantModalData.data?.comprimento};${hydrantModalData.data?.Pavimento};${hydrantModalData.data?.LocEsp};${hydrantModalData.data?.NumLacre};${hydrantModalData.data?.Title}`;

  return {
    hydrantModalData,
    historyModalData,
    qrCodeValue,
    year,
    setYear,
  };
};

export default useHydrantModal;
