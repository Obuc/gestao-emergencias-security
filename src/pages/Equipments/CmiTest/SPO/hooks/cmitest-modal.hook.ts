import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, parseISO, startOfYear } from 'date-fns';

import { sharepointContext } from '@/context/sharepointContext';
import { CmiTestHistoryProps, CmiTestModalProps } from '../types/cmitest.types';

export const useCmiTestModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crudParent } = sharepointContext();
  const user_site = localStorage.getItem('user_site');

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,Predio,LocEsp,Title&$filter=(Id eq ${params.id}) and (Tipo eq 'Bomba')`;
    const resp = await crudParent.getListItemsv2('Diversos_Equipamentos', pathModal);
    return resp.results[0];
  };

  const cmiTestModalData: UseQueryResult<CmiTestModalProps> = useQuery({
    queryKey: ['equipments_cmi_test_data_modal', params.id],
    queryFn: async () => {
      if (params.id) {
        const cmiTestData = await fetchEquipments();

        return {
          ...cmiTestData,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && params.id !== undefined && location.pathname.includes('/spo/equipments/cmi_test'),
  });

  const historyModalData: UseQueryResult<Array<CmiTestHistoryProps>> = useQuery({
    queryKey: ['equipments_cmi_test_history_modal', cmiTestModalData.data?.Id, year],
    queryFn: async () => {
      if (!cmiTestModalData.data?.Id) {
        return [];
      }

      let pathModal = `?$Select=Id,Created,tipo,idEquipamento,responsavel,item,idRegistro,novoCodigo,novaValidade&$top=5000&$orderby=Created desc&$filter=(idEquipamento eq ${cmiTestModalData.data?.Id}) and (item eq 'Bomba') `;

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

  const qrCodeValue = `Bomba;SP;São Paulo;SPO - Site São Paulo;${cmiTestModalData.data?.Predio}`;
  // Bomba;SP;São Paulo;SPO;SPO - Site São Paulo;622

  return {
    cmiTestModalData,
    historyModalData,
    qrCodeValue,
    year,
    setYear,
  };
};
