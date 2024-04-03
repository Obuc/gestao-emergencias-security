import { useState } from 'react';
import { saveAs } from 'file-saver';
import { Skeleton } from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

import { EqQRCodePdf } from '../../pdf/EqQRCodePdf';
import { Table } from '../../../../../components/Table';
import Checkbox from '../../../../../components/Checkbox';
import { Button } from '../../../../../components/Button';
import TextField from '../../../../../components/TextField';
import useEqExtinguisher from '../../../hooks/useEqExtinguisher';
import { IEqExtinguisher } from '../../../types/EquipmentsExtinguisher';

const EqExtinguisherQRCode = () => {
  const site_value = localStorage.getItem('user_site');
  const { eqExtinguisher, isLoadingEqExtinguisher, isErrorEqExtinguisher, filtersQRCode, setFiltersQRCode } =
    useEqExtinguisher();

  const [selectAll, setSelectAll] = useState(false);
  const [selectedItemsExtinguisher, setSelectedItemsExtinguisher] = useState<any[]>([]);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  const [filter, setFilter] = useState<boolean>(false);

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
    <div className="w-full">
      <div className="max-h-[28.4375rem] w-full overflow-y-auto relative">
        <Table.Root>
          <Table.Thead>
            <Table.Tr className="bg-[#FCFCFC] border border-[#EEE]">
              <Table.Th className="pl-8">
                <Checkbox checked={selectAll} onClick={toggleSelectAll} />
              </Table.Th>
              <Table.Th>
                <div className="flex flex-col max-w-[5rem] gap-4 py-4 items-center">
                  Id
                  {filter && (
                    <TextField
                      id="id"
                      name="id"
                      value={filtersQRCode.id ?? ''}
                      onChange={(event) => setFiltersQRCode((prev) => ({ ...prev, id: event.target.value }))}
                    />
                  )}
                </div>
              </Table.Th>
              <Table.Th>
                <div className="flex flex-col max-w-[9.375rem] gap-4 py-4 items-center">
                  Cód. Extintor
                  {filter && (
                    <TextField
                      id="cod_equipamento"
                      name="cod_equipamento"
                      value={filtersQRCode.cod_equipamento ?? ''}
                      onChange={(event) =>
                        setFiltersQRCode((prev) => ({ ...prev, cod_equipamento: event.target.value }))
                      }
                    />
                  )}
                </div>
              </Table.Th>
              <Table.Th>
                <div className="flex flex-col max-w-[7.5rem] gap-4 py-4 items-center">
                  Predio
                  {filter && (
                    <TextField
                      id="predio"
                      name="predio"
                      value={filtersQRCode.predio ?? ''}
                      onChange={(event) => setFiltersQRCode((prev) => ({ ...prev, predio: event.target.value }))}
                    />
                  )}
                </div>
              </Table.Th>
              <Table.Th>
                <div className="flex flex-col max-w-[7.5rem] gap-4 py-4 items-center">
                  Local
                  {filter && (
                    <TextField
                      id="local"
                      name="local"
                      value={filtersQRCode.local ?? ''}
                      onChange={(event) => setFiltersQRCode((prev) => ({ ...prev, local: event.target.value }))}
                    />
                  )}
                </div>
              </Table.Th>
              <Table.Th>
                <div className="flex flex-col max-w-[7.5rem] gap-4 py-4 items-center">
                  Pavimento
                  {filter && (
                    <TextField
                      id="pavimento"
                      name="pavimento"
                      value={filtersQRCode.pavimento ?? ''}
                      onChange={(event) => setFiltersQRCode((prev) => ({ ...prev, pavimento: event.target.value }))}
                    />
                  )}
                </div>
              </Table.Th>
              <Table.Th>
                <FontAwesomeIcon
                  className="cursor-pointer"
                  icon={filter ? faFilterCircleXmark : faFilter}
                  onClick={() => {
                    if (selectAll) {
                      toggleSelectAll();
                    }
                    setFilter((prev) => !prev);
                  }}
                />
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody className="overflow-y-scroll">
            {eqExtinguisher?.length === 0 && (
              <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                <Table.Td colSpan={6} className="text-center text-primary-font">
                  Nenhum extintor encontrado!
                </Table.Td>
              </Table.Tr>
            )}

            {isErrorEqExtinguisher && (
              <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                <Table.Td colSpan={6} className="text-center text-primary-font">
                  Ops, ocorreu um erro, recarregue a página e tente novamente!
                </Table.Td>
              </Table.Tr>
            )}

            {isLoadingEqExtinguisher && (
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

            {eqExtinguisher &&
              eqExtinguisher.map((item) => (
                <Table.Tr key={item.Id}>
                  <Table.Td className="pl-8">
                    <Checkbox
                      checked={selectedItemsExtinguisher.some((selectedItem) => selectedItem.Id === item.Id)}
                      onClick={() => toggleSelectItem(item)}
                    />
                  </Table.Td>
                  <Table.Td className="pl-8">{item.Id}</Table.Td>
                  <Table.Td>{item.cod_extintor ?? '-'}</Table.Td>
                  <Table.Td>{item.predio}</Table.Td>
                  <Table.Td>{item.local}</Table.Td>
                  <Table.Td>{item.pavimento}</Table.Td>
                  <Table.Td>{``}</Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table.Root>
      </div>

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
    </div>
  );
};

export default EqExtinguisherQRCode;
