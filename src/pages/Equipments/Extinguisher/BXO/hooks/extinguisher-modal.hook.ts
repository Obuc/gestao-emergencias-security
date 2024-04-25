import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { endOfYear, format, getYear, startOfYear } from 'date-fns';

import { sharepointContext } from '@/context/sharepointContext';
import { ExtinguisherHistoryModalProps, ExtinguisherModalProps } from '../types/extinguisher.types';

const useExtinguisherModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crud } = sharepointContext();

  const [year, setYear] = useState(getYear(new Date()));

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,cod_extintor,cod_qrcode,conforme,local/Title,massa/Title,pavimento/Title,predio/Title,site/Title,tipo_extintor/Title,validade,ultima_inspecao&$expand=local,massa,pavimento,predio,site,tipo_extintor&$filter=Id eq ${params.id}`;

    const resp = await crud.getListItemsv2('extintores', pathModal);

    return resp.results[0];
  };

  const extinguisherModalData: UseQueryResult<ExtinguisherModalProps> = useQuery({
    queryKey: ['equipments_extinguisher_data_modal', params.id, params.form],
    queryFn: async () => {
      if (params.id) {
        const eqExtinguisherData = await fetchEquipments();

        return {
          ...eqExtinguisherData,
          local: eqExtinguisherData.local.Title,
          massa: eqExtinguisherData.massa.Title,
          pavimento: eqExtinguisherData.pavimento.Title,
          predio: eqExtinguisherData.predio.Title,
          site: eqExtinguisherData.site.Title,
          tipo_extintor: eqExtinguisherData.tipo_extintor.Title,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && location.pathname.includes('/equipments/extinguisher'),
  });

  const historyModalData: UseQueryResult<Array<ExtinguisherHistoryModalProps>> = useQuery({
    queryKey: ['equipments_extinguisher_history_modal_bxo', extinguisherModalData.data?.Id, year],
    queryFn: async () => {
      if (!extinguisherModalData.data?.Id) {
        return [];
      }

      let pathModal = `?$Select=Id,extintor_id/Id,bombeiro_id/Title,cod_extintor,data_pesagem,novo,observacao,status,conforme,Created&$top=5000&$orderby=Created desc&$expand=bombeiro_id,extintor_id&$Filter=(extintor_id/Id eq '${extinguisherModalData.data?.Id}') `;

      if (year) {
        const startDate = format(startOfYear(new Date(year, 0, 1)), "yyyy-MM-dd'T'00:00:00'Z'");
        const endDate = format(endOfYear(new Date(year, 11, 31)), "yyyy-MM-dd'T'23:59:59'Z'");

        pathModal += `and (Created ge '${startDate}') and (Created le '${endDate}')`;
      }

      const resp = await crud.getListItems('registros_extintor', pathModal);
      return resp;
    },
  });

  const qrCodeExtinguisherValue = `Extintor;${extinguisherModalData.data?.site};${extinguisherModalData.data?.cod_qrcode};${extinguisherModalData.data?.tipo_extintor}`;

  return {
    extinguisherModalData,
    historyModalData,
    qrCodeExtinguisherValue,
    year,
    setYear,
  };
};

export default useExtinguisherModal;
