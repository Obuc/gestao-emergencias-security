import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { ExtinguisherProps } from '../types/extinguisher.types';

const useExtinguisherQrCode = () => {
  const location = useLocation();
  const { crud } = sharepointContext();

  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsExtinguisher, setSelectedItemsExtinguisher] = useState<ExtinguisherProps[]>([]);

  const extinguisherQrCodeData: UseQueryResult<Array<ExtinguisherProps>> = useQuery({
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
