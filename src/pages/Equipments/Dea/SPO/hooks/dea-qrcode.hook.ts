import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { DeaProps } from '../types/dea.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useDeaQrCode = () => {
  const location = useLocation();
  const { crudParent } = sharepointContext();

  const user_site = localStorage.getItem('user_site');
  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsDea, setSelectedItemsDea] = useState<DeaProps[]>([]);

  const deaQrCodeData: UseQueryResult<Array<DeaProps>> = useQuery({
    queryKey: ['equipments_dea_data_qrcode_spo', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,Modified,Predio,Codigo,LocEsp,Tipo,Title,Conforme,Excluido&$orderby=Modified desc&$Filter=(Excluido eq 'false') and (Tipo eq 'DEA')`;

      if (filterValue) {
        path += ` and (Id eq ${filterValue}) or (substringof('${filterValue}', Title) or substringof('${filterValue}', Codigo) or substringof('${filterValue}', LocEsp) or substringof('${filterValue}', Predio) or substringof('${filterValue}', Conforme))`;
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
    enabled: user_site === 'SPO' && location.pathname.includes('/equipments/dea'),
  });

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && deaQrCodeData.data) {
      setSelectedItemsDea(deaQrCodeData.data);
    } else {
      setSelectedItemsDea([]);
    }
  };

  const toggleSelectItem = (item: DeaProps) => {
    setSelectedItemsDea((prevSelected) => {
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
    selectedItemsDea,
    deaQrCodeData,
    toggleSelectAll,
    toggleSelectItem,
    selectAll,
  };
};
