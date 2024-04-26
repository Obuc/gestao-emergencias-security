import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { OeiProps } from '../types/oei.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useOeiQrCode = () => {
  const location = useLocation();
  const { crudParent } = sharepointContext();

  const user_site = localStorage.getItem('user_site');
  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsOei, setSelectedItemsOei] = useState<OeiProps[]>([]);

  const oeiQrCodeData: UseQueryResult<Array<OeiProps>> = useQuery({
    queryKey: ['equipments_oei_data_qrcode_spo', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,Tipo,Predio,LocEsp,Title,Conforme,Excluido&$orderby=Modified desc&$Filter=(Excluido eq 'false') and (Tipo eq 'OEI')`;

      if (filterValue) {
        path += ` and (Id eq ${filterValue}) or (substringof('${filterValue}', Title) or substringof('${filterValue}', Predio) or substringof('${filterValue}', LocEsp))`;
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
    enabled: user_site === 'SPO' && location.pathname.includes('/spo/equipments/oei_operation'),
  });

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && oeiQrCodeData.data) {
      setSelectedItemsOei(oeiQrCodeData.data);
    } else {
      setSelectedItemsOei([]);
    }
  };

  const toggleSelectItem = (item: OeiProps) => {
    setSelectedItemsOei((prevSelected) => {
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
    selectedItemsOei,
    oeiQrCodeData,
    toggleSelectAll,
    toggleSelectItem,
    selectAll,
  };
};
