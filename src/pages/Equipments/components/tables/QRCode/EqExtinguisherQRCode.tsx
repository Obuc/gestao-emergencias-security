import { useState } from 'react';
import { saveAs } from 'file-saver';
import { Skeleton } from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { EqQRCodePdf } from '../../pdf/EqQRCodePdf';
import { Table } from '../../../../../components/Table';
import Checkbox from '../../../../../components/Checkbox';
import { Button } from '../../../../../components/Button';
import useEqExtinguisher from '../../../hooks/useEqExtinguisher';
import { IEqExtinguisher } from '../../../types/EquipmentsExtinguisher';

const EqExtinguisherQRCode = () => {
  const site_value = localStorage.getItem('user_site');
  const { eqExtinguisher, isLoadingEqExtinguisher, isErrorEqExtinguisher } = useEqExtinguisher();

  const [selectAll, setSelectAll] = useState(false);
  const [selectedItemsExtinguisher, setSelectedItemsExtinguisher] = useState<any[]>([]);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && eqExtinguisher) {
      setSelectedItemsExtinguisher(eqExtinguisher);
    } else {
      setSelectedItemsExtinguisher([]);
    }
  };

  const toggleSelectItem = (item: IEqExtinguisher) => {
    setSelectedItemsExtinguisher((prevSelected) => {
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
      <EqQRCodePdf
        data={selectedItemsExtinguisher}
        qrCodeValueEquipment="Extintor"
        qrCodeValueDescription="Extintor"
      />,
    ).toBlob();
    saveAs(blob, `QRCode Extintores - ${site_value}.pdf`);
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
            <Table.Th>Cód. Equipamento</Table.Th>
            <Table.Th>Predio</Table.Th>
            <Table.Th>Local</Table.Th>
            <Table.Th>Pavimento</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody className="block max-h-[28rem] overflow-y-scroll">
          {eqExtinguisher?.length === 0 && (
            <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
              <Table.Td colSpan={5} className="text-center text-primary">
                Nenhum extintor encontrado!
              </Table.Td>
            </Table.Tr>
          )}

          {isErrorEqExtinguisher && (
            <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
              <Table.Td colSpan={5} className="text-center text-primary">
                Ops, ocorreu um erro, recarregue a página e tente novamente!
              </Table.Td>
            </Table.Tr>
          )}

          {isLoadingEqExtinguisher && (
            <>
              {Array.from({ length: 15 }).map((_, index) => (
                <Table.Tr key={index}>
                  <Table.Td className="h-14 px-4" colSpan={5}>
                    <Skeleton height="3.5rem" animation="wave" />
                  </Table.Td>
                </Table.Tr>
              ))}
            </>
          )}

          {eqExtinguisher &&
            eqExtinguisher.map((item) => (
              <Table.Tr key={item.Id}>
                <Table.Td className="pl-8">
                  <Checkbox
                    checked={selectedItemsExtinguisher.some((selectedItem) => selectedItem.Id === item.Id)}
                    onClick={() => toggleSelectItem(item)}
                  />
                </Table.Td>
                <Table.Td className="pl-8">{item.cod_qrcode}</Table.Td>
                <Table.Td>{item.predio}</Table.Td>
                <Table.Td>{item.local}</Table.Td>
                <Table.Td>{item.pavimento}</Table.Td>
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

export default EqExtinguisherQRCode;
