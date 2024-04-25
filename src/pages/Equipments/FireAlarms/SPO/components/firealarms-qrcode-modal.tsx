import { saveAs } from 'file-saver';
import { Skeleton } from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import { StandardPageSize } from '@react-pdf/types/page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSearch } from '@fortawesome/free-solid-svg-icons';

import Modal from '@/components/Modal';
import { Table } from '@/components/Table';
import Checkbox from '@/components/Checkbox';
import { Button } from '@/components/Button';
import TextField from '@/components/TextField';
import { pageSizeData } from '@/utils/pageData.mock';
import { FireAlarmsQrcodePdf } from './firealarms-qrcode-pdf';
import { SelectAutoComplete } from '@/components/SelectAutocomplete';
import { useFireAlarmsQrCode } from '../hooks/firealarms-qrcode.hook';

interface OeiQrcodeModalProps {
  open: boolean | null;
  onOpenChange: () => void;
}

export const FireAlarmsQrcodeModal = ({ open, onOpenChange }: OeiQrcodeModalProps) => {
  const site_value = localStorage.getItem('user_site');

  const {
    filterValue,
    setFilterValue,
    pageSize,
    setPageSize,
    generatePdf,
    setGeneratePdf,
    selectedItemsFireAlarms,
    fireAlarmsQrCodeData,
    toggleSelectAll,
    toggleSelectItem,
    selectAll,
  } = useFireAlarmsQrCode();

  const exportToPdf = async () => {
    if (!pageSize) return;

    setGeneratePdf(true);
    const blob = await pdf(
      <FireAlarmsQrcodePdf data={selectedItemsFireAlarms} pageSize={pageSize.value as StandardPageSize} />,
    ).toBlob();
    saveAs(blob, `QRCode Alarmes de Incêndio - ${site_value}.pdf`);
    setGeneratePdf(false);
  };

  return (
    <Modal
      className="min-w-[68.75rem]"
      open={open !== null}
      onOpenChange={onOpenChange}
      title={`Gerar QRCodes: Alarmes de Incêndio`}
    >
      <div className="flex flex-col gap-2 px-8 py-6 text-primary-font">
        <span className="text-lg py-4">Selecione abaixo os equipamentos que deseja gerar os QRCodes.</span>

        <div className="mb-4 flex gap-3">
          <TextField
            id="search_box"
            name="search_box"
            value={filterValue}
            placeholder="Pesquisar"
            onChange={(event) => setFilterValue(event.target.value)}
            icon={<FontAwesomeIcon icon={faSearch} />}
          />

          <SelectAutoComplete.Fixed
            id="pageSize"
            name="pageSize"
            placeholder="Selecione o tamanho da folha"
            isSearchable
            value={pageSize ? pageSize : null}
            options={pageSizeData}
            onChange={(value: any) => {
              setPageSize(value);
            }}
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
                  <Table.Th>Código</Table.Th>
                  <Table.Th>Predio</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody className="overflow-y-scroll">
                {fireAlarmsQrCodeData.data?.length === 0 && (
                  <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                    <Table.Td colSpan={4} className="text-center text-primary-font">
                      Nenhum extintor encontrado!
                    </Table.Td>
                  </Table.Tr>
                )}

                {fireAlarmsQrCodeData.isError && (
                  <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                    <Table.Td colSpan={4} className="text-center text-primary-font">
                      Ops, ocorreu um erro, recarregue a página e tente novamente!
                    </Table.Td>
                  </Table.Tr>
                )}

                {fireAlarmsQrCodeData.isLoading && (
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

                {fireAlarmsQrCodeData.data &&
                  fireAlarmsQrCodeData.data.map((item) => (
                    <Table.Tr key={item.Id + (item.Title ? item.Title : '0')}>
                      <Table.Td className="pl-8">
                        <Checkbox
                          checked={selectedItemsFireAlarms.some((selectedItem) => selectedItem.Id === item.Id)}
                          onClick={() => toggleSelectItem(item)}
                        />
                      </Table.Td>
                      <Table.Td>{item.Id}</Table.Td>
                      <Table.Td>{item.Title ?? '-'}</Table.Td>
                      <Table.Td>{item.Predio ?? '-'}</Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table.Root>
          </div>

          <div className="flex w-full gap-2 pt-14 justify-end items-center">
            <Button.Root
              fill
              onClick={exportToPdf}
              className="min-w-[12rem] h-10"
              disabled={generatePdf || !selectedItemsFireAlarms.length || pageSize === null}
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