import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { ValveProps } from '../types/valve.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useValveQrCode = () => {
  const location = useLocation();
  const { crud } = sharepointContext();

  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsValve, setSelectedItemsValve] = useState<ValveProps[]>([]);

  const valveQrCodeData: UseQueryResult<Array<ValveProps>> = useQuery({
    queryKey: ['equipments_valve_data_qrcode_bxo', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,cod_qrcode,predio/Title,cod_equipamento,Modified,excluido,tipo_equipamento/Title,conforme,site/Title,pavimento/Title,local/Title&$expand=site,tipo_equipamento,pavimento,local,predio&$Filter=((tipo_equipamento/Title eq 'Válvulas de Governo') and (site/Title eq 'BXO') and (excluido eq false))`;

      if (filterValue) {
        path += ` and (Id eq ${filterValue}) or substringof('${filterValue}', cod_qrcode) or substringof('${filterValue}', predio/Title) or substringof('${filterValue}', cod_equipamento) or substringof('${filterValue}', pavimento/Title) or substringof('${filterValue}', local/Title)`;
      }

      const resp = await crud.getListItems('equipamentos_diversos', path);

      const dataWithTransformations = await Promise.all(
        resp.map(async (item: any) => {
          return {
            ...item,
            local: item.local?.Title,
            pavimento: item.pavimento?.Title,
            site: item.site?.Title,
            predio: item.predio?.Title,
          };
        }),
      );

      return dataWithTransformations;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled: location.pathname.includes('/bxo/equipments/valve'),
  });

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && valveQrCodeData.data) {
      setSelectedItemsValve(valveQrCodeData.data);
    } else {
      setSelectedItemsValve([]);
    }
  };

  const toggleSelectItem = (item: ValveProps) => {
    setSelectedItemsValve((prevSelected) => {
      if (prevSelected.some((selectedItem) => selectedItem.Id === item.Id)) {
        return prevSelected.filter((selectedItem) => selectedItem.Id !== item.Id);
      } else if (prevSelected.length < 10) {
        return [...prevSelected, item];
      }
      return prevSelected;
    });
  };

  return {
    filterValue,
    setFilterValue,
    pageSize,
    setPageSize,
    generatePdf,
    setGeneratePdf,
    selectedItemsValve,
    valveQrCodeData,
    toggleSelectAll,
    toggleSelectItem,
    selectAll,
  };
};
