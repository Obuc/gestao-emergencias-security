import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { sharepointContext } from '@/context/sharepointContext';
import { GeneralChecklistProps } from '../types/general-checklist.types';

export const useGeneralChecklistQrCode = () => {
  const location = useLocation();
  const { crud } = sharepointContext();

  const [filterValue, setFilterValue] = useState<string | undefined>('');
  const [pageSize, setPageSize] = useState<{ label: string; value: string } | null>({ label: 'A4', value: 'A4' });

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsGeneralChecklist, setSelectedItemsGeneralChecklist] = useState<GeneralChecklistProps[]>([]);

  const generalChecklistQrCodeData: UseQueryResult<Array<GeneralChecklistProps>> = useQuery({
    queryKey: ['equipments_general_checklist_data_qrcode', filterValue],
    queryFn: async () => {
      let path = `?$Select=Id,cod_qrcode,Modified,site/Title,tipo_veiculo/Title,placa,ultima_inspecao,conforme_check_geral,excluido_check_geral&$Top=25&$expand=site,tipo_veiculo&$Filter=(site/Title eq 'BXO')`;

      if (filterValue) {
        path += ` and substringof('${filterValue}', Id) or substringof('${filterValue}', tipo_veiculo/Title) or substringof('${filterValue}', placa) or substringof('${filterValue}', cod_qrcode)`;
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
    enabled: location.pathname.includes('/equipments/general_checklist'),
  });

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && generalChecklistQrCodeData.data) {
      setSelectedItemsGeneralChecklist(generalChecklistQrCodeData.data);
    } else {
      setSelectedItemsGeneralChecklist([]);
    }
  };

  const toggleSelectItem = (item: GeneralChecklistProps) => {
    setSelectedItemsGeneralChecklist((prevSelected) => {
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
    selectedItemsGeneralChecklist,
    generalChecklistQrCodeData,
    toggleSelectAll,
    toggleSelectItem,
    selectAll,
  };
};
