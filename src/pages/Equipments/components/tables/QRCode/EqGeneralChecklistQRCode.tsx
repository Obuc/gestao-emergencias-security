import { useState } from 'react';
import { saveAs } from 'file-saver';
import { Skeleton } from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { Table } from '../../../../../components/Table';
import { Button } from '../../../../../components/Button';
import Checkbox from '../../../../../components/Checkbox';
import { EqVehiclesQRCodePdf } from '../../pdf/EqVehiclesQRCodePdf';
import useEqGeneralChecklist from '../../../hooks/EmergencyVehicles/useEqGeneralChecklist';
import { IEqGeneralChecklist } from '../../../types/EmergencyVehicles/EquipmentsGeneralChecklist';

const EqGeneralChecklistQRCode = () => {
  const site_value = localStorage.getItem('user_site');

  const { eqVehiclesGeneralChecklist, isLoadingVehiclesGeneralChecklist, isErrorEqVehiclesGeneralChecklist } =
    useEqGeneralChecklist();

  const [selectAll, setSelectAll] = useState(false);
  const [selectedItemsVehicles, setSelectedItemsVehicle] = useState<any[]>([]);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && eqVehiclesGeneralChecklist) {
      setSelectedItemsVehicle(eqVehiclesGeneralChecklist);
    } else {
      setSelectedItemsVehicle([]);
    }
  };

  const toggleSelectItem = (item: IEqGeneralChecklist) => {
    setSelectedItemsVehicle((prevSelected) => {
      if (prevSelected.some((selectedItem) => selectedItem.Id === item.Id)) {
        return prevSelected.filter((selectedItem) => selectedItem.Id !== item.Id);
      } else if (prevSelected.length < 10) {
        return [...prevSelected, item];
      }
      return prevSelected;
    });
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);
    const blob = await pdf(
      <EqVehiclesQRCodePdf
        data={selectedItemsVehicles}
        qrCodeValueEquipment="VeiculosCheckGeral"
        qrCodeValueDescription="Geral"
      />,
    ).toBlob();
    saveAs(blob, `QRCode Checklist Geral - ${site_value}.pdf`);
    setGeneratePdf(false);
  };

  return (
    <>
      <Table.Root>
        <Table.Thead>
          <Table.Tr className="bg-[#FCFCFC]">
            <Table.Th className="pl-8">
              <Checkbox checked={selectAll} onClick={toggleSelectAll} />
            </Table.Th>
            <Table.Th>Cód. Veículo</Table.Th>
            <Table.Th>Tipo de Veículo</Table.Th>
            <Table.Th>Placa</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody className="block max-h-[28rem] overflow-y-scroll">
          {eqVehiclesGeneralChecklist?.length === 0 && (
            <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
              <Table.Td colSpan={4} className="text-center text-primary-font">
                Nenhum veículo encontrado!
              </Table.Td>
            </Table.Tr>
          )}

          {isErrorEqVehiclesGeneralChecklist && (
            <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
              <Table.Td colSpan={4} className="text-center text-primary-font">
                Ops, ocorreu um erro, recarregue a página e tente novamente!
              </Table.Td>
            </Table.Tr>
          )}

          {isLoadingVehiclesGeneralChecklist && (
            <>
              {Array.from({ length: 15 }).map((_, index) => (
                <Table.Tr key={index}>
                  <Table.Td className="h-14 px-4" colSpan={4}>
                    <Skeleton height="3.5rem" animation="wave" />
                  </Table.Td>
                </Table.Tr>
              ))}
            </>
          )}

          {eqVehiclesGeneralChecklist &&
            eqVehiclesGeneralChecklist.map((item) => (
              <Table.Tr key={item.Id}>
                <Table.Td className="pl-8">
                  <Checkbox
                    checked={selectedItemsVehicles.some((selectedItem) => selectedItem.Id === item.Id)}
                    onClick={() => toggleSelectItem(item)}
                  />
                </Table.Td>
                <Table.Td>{item.cod_qrcode}</Table.Td>
                <Table.Td>{item.tipo_veiculo}</Table.Td>
                <Table.Td>{item.placa}</Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table.Root>

      <div className="flex w-full gap-2 pt-14 justify-end items-center">
        <Button.Root fill onClick={exportToPdf} className="min-w-[14.0625rem] h-10" disabled={generatePdf}>
          {generatePdf ? (
            <Button.Spinner />
          ) : (
            <>
              <Button.Label>Exportar para PDF</Button.Label>
              <Button.Icon icon={faDownload} />
            </>
          )}
        </Button.Root>
      </div>
    </>
  );
};

export default EqGeneralChecklistQRCode;
