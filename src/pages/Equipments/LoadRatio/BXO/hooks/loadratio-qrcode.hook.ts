import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { LoadRatioProps } from '../types/loadratio.types';
import { sharepointContext } from '@/context/sharepointContext';

export const useLoadRatioQrCode = () => {
  const { pathname } = useLocation();
  const { crud } = sharepointContext();
  const equipments_value = pathname.split('/')[3];
  const user_site = localStorage.getItem('user_site');

  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsLoadRatio, setSelectedItemsLoadRatio] = useState<LoadRatioProps[]>([]);

  const loadRatioQrCodeData: UseQueryResult<Array<LoadRatioProps>> = useQuery({
    queryKey: ['equipments_load_ratio_data_qrcode_bxo', filterValue, equipments_value],
    queryFn: async () => {
      let path = `?$Select=Id,cod_qrcode,site/Title,tipo_veiculo/Title,tipo_veiculo/url_path,placa,ultima_inspecao,conforme,excluido&$expand=site,tipo_veiculo&$Filter=(site/Title eq 'BXO') and (excluido eq 'false') and (tipo_veiculo/url_path eq '${equipments_value}')`;

      if (filterValue) {
        path += ` and (substringof('${filterValue}', Id) or substringof('${filterValue}', cod_qrcode) or substringof('${filterValue}', tipo_veiculo/Title) or substringof('${filterValue}', placa))`;
      }

      const resp = await crud.getListItems('veiculos_emergencia', path);

      const dataWithTransformations = await Promise.all(
        resp.map(async (item: any) => {
          return {
            ...item,
            tipo_veiculo: item.tipo_veiculo?.Title,
            site: item.site?.Title,
          };
        }),
      );

      return dataWithTransformations;
    },
    staleTime: 5000 * 60, // 5 Minute
    refetchOnWindowFocus: false,
    enabled:
      (pathname.includes('/bxo/equipments/scania') ||
        pathname.includes('/bxo/equipments/s10') ||
        pathname.includes('/bxo/equipments/mercedes') ||
        pathname.includes('/bxo/equipments/van') ||
        pathname.includes('/bxo/equipments/iveco') ||
        pathname.includes('/bxo/equipments/sprinter')) &&
      user_site === 'BXO',
  });

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && loadRatioQrCodeData.data) {
      setSelectedItemsLoadRatio(loadRatioQrCodeData.data);
    } else {
      setSelectedItemsLoadRatio([]);
    }
  };

  const toggleSelectItem = (item: LoadRatioProps) => {
    setSelectedItemsLoadRatio((prevSelected) => {
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
    selectedItemsLoadRatio,
    loadRatioQrCodeData,
    toggleSelectAll,
    toggleSelectItem,
    selectAll,
  };
};
