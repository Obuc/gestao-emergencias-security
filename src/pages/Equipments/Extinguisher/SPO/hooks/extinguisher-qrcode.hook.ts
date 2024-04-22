import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { ExtinguisherProps } from '../types/extinguisher.types';

const useExtinguisherQrCode = () => {
  const location = useLocation();
  const { crudParent } = sharepointContext();

  const user_site = localStorage.getItem('user_site');
  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsExtinguisher, setSelectedItemsExtinguisher] = useState<ExtinguisherProps[]>([]);

  const extinguisherQrCodeData: UseQueryResult<Array<ExtinguisherProps>> = useQuery({
    queryKey: ['equipments_extinguisher_data_qrcode_spo', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,Created,Modified,peso_extintor,codExtintor,Predio,Pavimento,LocEsp,Tipo,Title,Excluido&$Filter=(Excluido eq 'Não')`;

      if (filterValue) {
        path += ` and (substringof('${filterValue}', Id) or substringof('${filterValue}', codExtintor) or substringof('${filterValue}', Predio) or substringof('${filterValue}', Pavimento) or substringof('${filterValue}', LocEsp) or substringof('${filterValue}', Tipo) or substringof('${filterValue}', Title))`;
      }

      const resp = await crudParent.getListItems('Extintores_Equipamentos', path);

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
    enabled: user_site === 'SPO' && location.pathname.includes('/equipments/extinguisher'),
  });

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && extinguisherQrCodeData.data) {
      setSelectedItemsExtinguisher(extinguisherQrCodeData.data);
    } else {
      setSelectedItemsExtinguisher([]);
    }
  };

  const toggleSelectItem = (item: ExtinguisherProps) => {
    setSelectedItemsExtinguisher((prevSelected) => {
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
    selectedItemsExtinguisher,
    extinguisherQrCodeData,
    toggleSelectAll,
    toggleSelectItem,
    selectAll,
  };
};

export default useExtinguisherQrCode;
