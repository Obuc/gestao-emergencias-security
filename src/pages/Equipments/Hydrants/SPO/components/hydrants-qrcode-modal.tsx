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
import HydrantQrcodePdf from './hydrants-qrcode-pdf';
import useHydrantQrCode from '../hooks/hydrants-qrcode.hook';
import { SelectAutoComplete } from '@/components/SelectAutocomplete';

interface HydrantQrcodeModalProps {
  open: boolean | null;
  onOpenChange: () => void;
}

const HydrantQrcodeModal = ({ open, onOpenChange }: HydrantQrcodeModalProps) => {
  const site_value = localStorage.getItem('user_site');

  const {
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
  } = useHydrantQrCode();

  const exportToPdf = async () => {
    if (!pageSize) return;

    setGeneratePdf(true);
    const blob = await pdf(
      <HydrantQrcodePdf data={selectedItemsHydrant} pageSize={pageSize.value as StandardPageSize} />,
    ).toBlob();
    saveAs(blob, `QRCode Hidrantes - ${site_value}.pdf`);
    setGeneratePdf(false);
  };

  return (
    <Modal className="min-w-[68.75rem]" open={open !== null} onOpenChange={onOpenChange} title={`Gerar QRCodes: Hidrantes`}>
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
                  <Table.Th>Cód. Hidrante</Table.Th>
                  <Table.Th>Predio</Table.Th>
                  <Table.Th>Local</Table.Th>
                  <Table.Th>Pavimento</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody className="overflow-y-scroll">
                {hydrantsQrCodeData.data?.length === 0 && (
                  <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                    <Table.Td colSpan={6} className="text-center text-primary-font">
                      Nenhum extintor encontrado!
                    </Table.Td>
                  </Table.Tr>
                )}

                {hydrantsQrCodeData.isError && (
                  <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                    <Table.Td colSpan={6} className="text-center text-primary-font">
                      Ops, ocorreu um erro, recarregue a página e tente novamente!
                    </Table.Td>
                  </Table.Tr>
                )}

                {hydrantsQrCodeData.isLoading && (
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

                {hydrantsQrCodeData.data &&
                  hydrantsQrCodeData.data.map((item) => (
                    <Table.Tr key={item.Id + (item.numero_hidrante ? item.numero_hidrante : '0')}>
                      <Table.Td className="pl-8">
                        <Checkbox
                          checked={selectedItemsHydrant.some((selectedItem) => selectedItem.Id === item.Id)}
                          onClick={() => toggleSelectItem(item)}
                        />
                      </Table.Td>
                      <Table.Td>{item.Id}</Table.Td>
                      <Table.Td>{item.Title ?? '-'}</Table.Td>
                      <Table.Td>{item.Predio}</Table.Td>
                      <Table.Td>{item.LocEsp}</Table.Td>
                      <Table.Td>{item.Pavimento}</Table.Td>
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
              disabled={generatePdf || !selectedItemsHydrant.length || pageSize === null}
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

export default HydrantQrcodeModal;
