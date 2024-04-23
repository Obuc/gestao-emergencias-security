import { useLocation, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { ExtinguisherModalProps } from '../types/extinguisher.types';

const useExtinguisherModal = () => {
  const params = useParams();
  const location = useLocation();
  const { crud } = sharepointContext();

  const fetchEquipments = async () => {
    const pathModal = `?$Select=Id,cod_extintor,cod_qrcode,conforme,local/Title,massa/Title,pavimento/Title,predio/Title,site/Title,tipo_extintor/Title,validade,ultima_inspecao&$expand=local,massa,pavimento,predio,site,tipo_extintor&$filter=Id eq ${params.id}`;
    const resp = await crud.getListItemsv2('extintores', pathModal);
    return resp.results[0];
  };

  const fechRecords = async (extinguisherId: number) => {
    const resp = await crud.getListItemsv2(
      'registros_extintor',
      `?$Select=Id,extintor_id/Id,bombeiro_id/Title,cod_extintor,data_pesagem,novo,observacao,status,conforme,Created&$expand=bombeiro_id,extintor_id&$Filter=(extintor_id/Id eq '${extinguisherId}')`,
    );
    return resp.results || null;
  };

  const extinguisherModalData: UseQueryResult<ExtinguisherModalProps> = useQuery({
    queryKey: ['equipments_extinguisher_data_modal', params.id, params.form],
    queryFn: async () => {
      if (params.id) {
        const eqExtinguisherData = await fetchEquipments();

        const recordsExtinguisherData = eqExtinguisherData && (await fechRecords(eqExtinguisherData.Id));

        return {
          ...eqExtinguisherData,
          local: eqExtinguisherData.local.Title,
          massa: eqExtinguisherData.massa.Title,
          pavimento: eqExtinguisherData.pavimento.Title,
          predio: eqExtinguisherData.predio.Title,
          site: eqExtinguisherData.site.Title,
          tipo_extintor: eqExtinguisherData.tipo_extintor.Title,
          history: recordsExtinguisherData,
        };
      } else {
        return [];
      }
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: params.id !== undefined && location.pathname.includes('/equipments/extinguisher'),
  });

  const qrCodeExtinguisherValue = `Extintor;${extinguisherModalData.data?.site};${extinguisherModalData.data?.cod_qrcode};${extinguisherModalData.data?.tipo_extintor}`;

  return {
    extinguisherModalData,
    qrCodeExtinguisherValue,
  };
};

export default useExtinguisherModal;
