import { useState } from 'react';
import { saveAs } from 'file-saver';
import { Skeleton } from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSearch } from '@fortawesome/free-solid-svg-icons';

import Modal from '../../../../../components/Modal';
import { Table } from '../../../../../components/Table';
import Checkbox from '../../../../../components/Checkbox';
import { Button } from '../../../../../components/Button';
import TextField from '../../../../../components/TextField';
import { IEqExtinguisher } from '../../../types/EquipmentsExtinguisher';
import EquipmentsExtinguisherQrcodePdf from './equipments-extinguisher-qrcode-pdf';
import { EquipmentsExtinguisherProps } from '../types/equipments-extinguisher.types';
import useEquipmentsExtinguisherQrCode from '../hooks/equipments-extinguisher-qrcode.hook';

interface EquipmentsExtinguisherQrcodeModalProps {
  open: boolean | null;
  onOpenChange: () => void;
}

const EquipmentsExtinguisherQrcodeModal = ({ open, onOpenChange }: EquipmentsExtinguisherQrcodeModalProps) => {
  const site_value = localStorage.getItem('user_site');

  const { equipmentsExtinguisherQrCode, filterValue, setFilterValue } = useEquipmentsExtinguisherQrCode();

  const [selectAll, setSelectAll] = useState(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [selectedItemsExtinguisher, setSelectedItemsExtinguisher] = useState<EquipmentsExtinguisherProps[]>([]);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && equipmentsExtinguisherQrCode.data) {
      setSelectedItemsExtinguisher(equipmentsExtinguisherQrCode.data);
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
    const blob = await pdf(<EquipmentsExtinguisherQrcodePdf data={selectedItemsExtinguisher} />).toBlob();
    saveAs(blob, `QRCode Extintores - ${site_value}.pdf`);
    setGeneratePdf(false);
  };

  return (
    <Modal className="min-w-[68.75rem]" open={open !== null} onOpenChange={onOpenChange} title={`Gerar QRCodes: Exintor`}>
      <div className="flex flex-col gap-2 px-8 py-6 text-primary-font">
        <span className="text-lg py-4">Selecione abaixo os equipamentos que deseja gerar os QRCodes.</span>

        <div className="mb-4">
          <TextField
            id="id"
            name="id"
            value={filterValue}
            placeholder="Pesquisar"
            width="max-w-[37.5rem]"
            onChange={(event) => setFilterValue(event.target.value)}
            icon={<FontAwesomeIcon icon={faSearch} />}
          />
        </div>

        <div className="w-full">
          <div className="max-h-[28.4375rem] w-full overflow-y-auto relative">
            <Table.Root>
              <Table.Thead>
                <Table.Tr className="bg-[#FCFCFC] border border-[#EEE]">
                  <Table.Th className="pl-8">
                    <Checkbox checked={selectAll} onClick={toggleSelectAll} />
                  </Table.Th>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Cód. Extintor</Table.Th>
                  <Table.Th>Predio</Table.Th>
                  <Table.Th>Local</Table.Th>
                  <Table.Th>Pavimento</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody className="overflow-y-scroll">
                {equipmentsExtinguisherQrCode.data?.length === 0 && (
                  <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                    <Table.Td colSpan={6} className="text-center text-primary-font">
                      Nenhum extintor encontrado!
                    </Table.Td>
                  </Table.Tr>
                )}

                {equipmentsExtinguisherQrCode.isError && (
                  <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                    <Table.Td colSpan={6} className="text-center text-primary-font">
                      Ops, ocorreu um erro, recarregue a página e tente novamente!
                    </Table.Td>
                  </Table.Tr>
                )}

                {equipmentsExtinguisherQrCode.isLoading && (
                  <>
                    {Array.from({ length: 15 }).map((_, index) => (
                      <Table.Tr key={index}>
                        <Table.Td className="h-14 px-4" colSpan={6}>
                          <Skeleton height="3.5rem" animation="wave" />
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </>
                )}

                {equipmentsExtinguisherQrCode.data &&
                  equipmentsExtinguisherQrCode.data.map((item) => (
                    <Table.Tr key={item.Id}>
                      <Table.Td className="pl-8">
                        <Checkbox
                          checked={selectedItemsExtinguisher.some((selectedItem) => selectedItem.Id === item.Id)}
                          onClick={() => toggleSelectItem(item)}
                        />
                      </Table.Td>
                      <Table.Td>{item.Id}</Table.Td>
                      <Table.Td>{item.cod_extintor ?? '-'}</Table.Td>
                      <Table.Td>{item.predio}</Table.Td>
                      <Table.Td>{item.local}</Table.Td>
                      <Table.Td>{item.pavimento}</Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table.Root>
          </div>

          <div className="flex w-full gap-2 pt-14 justify-end items-center">
            <Button.Root
              fill
              onClick={exportToPdf}
              className="min-w-[14.0625rem] h-10"
              disabled={generatePdf || !selectedItemsExtinguisher.length}
            >
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
        </div>
      </div>
    </Modal>
  );
};

export default EquipmentsExtinguisherQrcodeModal;
