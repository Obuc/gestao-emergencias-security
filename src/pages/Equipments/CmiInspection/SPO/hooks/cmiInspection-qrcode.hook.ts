import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { CmiInspectionProps } from '../types/cmiInspection.types';

export const useCmiInspectionQrCode = () => {
  const location = useLocation();
  const { crudParent } = sharepointContext();

  const user_site = localStorage.getItem('user_site');
  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsCmiInspection, setSelectedItemsCmiInspection] = useState<CmiInspectionProps[]>([]);

  const cmiInspectionQrCodeData: UseQueryResult<Array<CmiInspectionProps>> = useQuery({
    queryKey: ['equipments_cmi_inspection_data_qrcode_spo', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,Tipo,Predio,Title,Conforme,Excluido&$orderby=Modified desc&$Filter=(Excluido eq 'false') and (Tipo eq 'Casa')`;

      if (filterValue) {
        path += ` and (substringof('${filterValue}', Title) or substringof('${filterValue}', Predio))`;
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
    enabled: user_site === 'SPO' && location.pathname.includes('/spo/equipments/cmi_inspection'),
  });

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && cmiInspectionQrCodeData.data) {
      setSelectedItemsCmiInspection(cmiInspectionQrCodeData.data);
    } else {
      setSelectedItemsCmiInspection([]);
    }
  };

  const toggleSelectItem = (item: CmiInspectionProps) => {
    setSelectedItemsCmiInspection((prevSelected) => {
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
    selectedItemsCmiInspection,
    cmiInspectionQrCodeData,
    toggleSelectAll,
    toggleSelectItem,
    selectAll,
  };
};
