import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '../../../../../context/sharepointContext';
import { EquipmentsExtinguisherProps } from '../types/equipments-extinguisher.types';

const useEquipmentsExtinguisherQrCode = () => {
  const location = useLocation();
  const { crud } = sharepointContext();

  const [filterValue, setFilterValue] = useState<string | undefined>('');

  const equipmentsExtinguisherQrCode: UseQueryResult<Array<EquipmentsExtinguisherProps>> = useQuery({
    queryKey: ['equipments_extinguisher_data_qrcode', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,cod_qrcode,predio/Title,tipo_extintor/Title,pavimento/Title,local/Title,site/Title,cod_extintor,conforme&$expand=tipo_extintor,predio,site,pavimento,local&$Filter=(site/Title eq 'BXO')`;

      if (filterValue) {
        path += ` and (substringof('${filterValue}', Id) or substringof('${filterValue}', cod_extintor) or substringof('${filterValue}', predio/Title) or substringof('${filterValue}', local/Title) or substringof('${filterValue}', pavimento/Title))`;
      }

      const resp = await crud.getListItems('extintores', path);

      const dataWithTransformations = await Promise.all(
        resp.map(async (item: any) => {
          return {
            ...item,
            local: item.local?.Title,
            pavimento: item.pavimento?.Title,
            site: item.site?.Title,
            predio: item.predio?.Title,
            tipo_extintor: item.tipo_extintor?.Title,
          };
        }),
      );

      return dataWithTransformations;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: location.pathname.includes('/equipments/extinguisher'),
  });

  return {
    filterValue,
    setFilterValue,
    equipmentsExtinguisherQrCode,
  };
};

export default useEquipmentsExtinguisherQrCode;
