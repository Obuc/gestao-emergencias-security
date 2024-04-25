import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { HydrantProps } from '../types/hydrants.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useHydrantQrCode = () => {
  const location = useLocation();
  const { crud } = sharepointContext();

  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsHydrant, setSelectedItemsHydrant] = useState<HydrantProps[]>([]);

  const hydrantQrCodeData: UseQueryResult<Array<HydrantProps>> = useQuery({
    queryKey: ['equipments_hydrant_data_qrcode_bxo', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,site/Title,predio/Title,pavimento/Title,local/Title,cod_hidrante,cod_qrcode,possui_abrigo,conforme,excluido,Modified&$expand=site,predio,pavimento,local&$Filter=(site/Title eq 'BXO')`;

      if (filterValue) {
        path += ` and (Id eq ${filterValue}) or substringof('${filterValue}', cod_hidrante) or substringof('${filterValue}', predio/Title) or substringof('${filterValue}', local/Title) or substringof('${filterValue}', pavimento/Title) or substringof('${filterValue}', cod_qrcode)`;
      }

      const resp = await crud.getListItems('hidrantes', path);

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
    enabled: location.pathname.includes('/equipments/hydrant'),
  });

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && hydrantQrCodeData.data) {
      setSelectedItemsHydrant(hydrantQrCodeData.data);
    } else {
      setSelectedItemsHydrant([]);
    }
  };

  const toggleSelectItem = (item: HydrantProps) => {
    setSelectedItemsHydrant((prevSelected) => {
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
    selectedItemsHydrant,
    hydrantQrCodeData,
    toggleSelectAll,
    toggleSelectItem,
    selectAll,
  };
};
