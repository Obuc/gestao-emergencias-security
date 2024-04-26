import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { HydrantsProps } from '../types/hydrants.types';
import { sharepointContext } from '@/context/sharepointContext';

const useHydrantQrCode = () => {
  const location = useLocation();
  const { crudParent } = sharepointContext();

  const user_site = localStorage.getItem('user_site');
  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsHydrant, setSelectedItemsHydrant] = useState<HydrantsProps[]>([]);

  const hydrantsQrCodeData: UseQueryResult<Array<HydrantsProps>> = useQuery({
    queryKey: ['equipments_hydrants_data_qrcode_spo', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,Title,Modified,ultimaInsp,numero_hidrante,NumMangueiras,NumLacre,Predio,Pavimento,LocEsp,Conforme,diametro,Excluido&$orderby=Modified desc&$Filter=(Excluido eq 'Não')`;

      if (filterValue) {
        path += ` and (substringof('${filterValue}', Title) or substringof('${filterValue}', numero_hidrante) or substringof('${filterValue}', Predio) or substringof('${filterValue}', Pavimento) or substringof('${filterValue}', LocEsp))`;
      }

      const resp = await crudParent.getListItems('Hidrantes_Equipamentos', path);

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
    enabled: user_site === 'SPO' && location.pathname.includes('/spo/equipments/hydrant'),
  });

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && hydrantsQrCodeData.data) {
      setSelectedItemsHydrant(hydrantsQrCodeData.data);
    } else {
      setSelectedItemsHydrant([]);
    }
  };

  const toggleSelectItem = (item: HydrantsProps) => {
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
    hydrantsQrCodeData,
    toggleSelectAll,
    toggleSelectItem,
    selectAll,
  };
};

export default useHydrantQrCode;
