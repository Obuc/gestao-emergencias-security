import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { SpillKitProps } from '../types/spill-kit.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useSpillKitQrCode = () => {
  const location = useLocation();
  const { crudParent } = sharepointContext();

  const user_site = localStorage.getItem('user_site');
  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsSpillKit, setSelectedItemsSpillKit] = useState<SpillKitProps[]>([]);

  const cmiInspectionQrCodeData: UseQueryResult<Array<SpillKitProps>> = useQuery({
    queryKey: ['equipments_spill_kit_data_qrcode_spo', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,Tipo,Predio,Pavimento,Title,Conforme,Excluido&$orderby=Modified desc&$Filter=(Excluido eq 'false') and (Tipo eq 'Kit Químicos')`;

      if (filterValue) {
        path += ` and (substringof('${filterValue}', Title) or substringof('${filterValue}', Predio) or substringof('${filterValue}', Pavimento) or (Id eq '${filterValue}'))`;
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
    enabled: user_site === 'SPO' && location.pathname.includes('/spo/equipments/spill_kit'),
  });

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && cmiInspectionQrCodeData.data) {
      setSelectedItemsSpillKit(cmiInspectionQrCodeData.data);
    } else {
      setSelectedItemsSpillKit([]);
    }
  };

  const toggleSelectItem = (item: SpillKitProps) => {
    setSelectedItemsSpillKit((prevSelected) => {
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
    selectedItemsSpillKit,
    cmiInspectionQrCodeData,
    toggleSelectAll,
    toggleSelectItem,
    selectAll,
  };
};
