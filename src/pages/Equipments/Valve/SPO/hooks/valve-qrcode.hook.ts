import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { ValveProps } from '../types/valve.types';
import { sharepointContext } from '@/context/sharepointContext';

const useValveQrCode = () => {
  const location = useLocation();
  const { crudParent } = sharepointContext();

  const user_site = localStorage.getItem('user_site');
  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsValve, setSelectedItemsValve] = useState<ValveProps[]>([]);

  const valveQrCodeData: UseQueryResult<Array<ValveProps>> = useQuery({
    queryKey: ['equipments_valve_data_qrcode_spo', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,Tipo,Codigo,Predio,LocEsp,Title,Conforme,Excluido&$orderby=Modified desc&$Filter=(Excluido eq 'false') and (Tipo eq 'Valvula')`;

      if (filterValue) {
        path += ` and (substringof('${filterValue}', Title) or substringof('${filterValue}', Codigo) or substringof('${filterValue}', Predio) or substringof('${filterValue}', LocEsp))`;
      }

      const resp = await crudParent.getListItems('Diversos_Equipamentos', path);

      const dataWithTransformations = await Promise.all(
        resp.map(async (item: any) => {
          return {
            ...item,
          };
        }),
      );

      return dataWithTransformations;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: user_site === 'SPO' && location.pathname.includes('/equipments/valve'),
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

export default useValveQrCode;
