import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { CmiInspectionProps } from '../types/cmiInspection.types';

export const useCmiInspectionQrCode = () => {
  const location = useLocation();
  const { crud } = sharepointContext();

  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsCmiInspection, setSelectedItemsCmiInspection] = useState<CmiInspectionProps[]>([]);

  const cmiInspectionQrCodeData: UseQueryResult<Array<CmiInspectionProps>> = useQuery({
    queryKey: ['equipments_cmi_test_data_qrcode_bxo', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,cod_qrcode,conforme,Modified,predio/Title,excluido,site/Title,pavimento/Title,tipo_equipamento/Title&$expand=site,pavimento,tipo_equipamento,predio&$Orderby=Modified desc&$Filter=(tipo_equipamento/Title eq 'Inspeção CMI') and (site/Title eq 'BXO') and (excluido eq 'false')`;

      if (filterValue) {
        path += ` and (substringof('${filterValue}', Id) or substringof('${filterValue}', cod_qrcode) or substringof('${filterValue}', predio/Title) or substringof('${filterValue}', pavimento/Title))`;
      }

      const resp = await crud.getListItems('equipamentos_diversos', path);

      const dataWithTransformations = await Promise.all(
        resp.map(async (item: any) => {
          return {
            ...item,
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
    enabled: location.pathname.includes('/equipments/cmi_inspection'),
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
