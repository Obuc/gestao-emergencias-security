import { useState } from 'react';
import QRCode from 'qrcode.react';
import { Skeleton } from '@mui/material';

import { Table } from '../../../../../components/Table';
import useEqHydrants from '../../../hooks/useEqHydrants';
import Checkbox from '../../../../../components/Checkbox';
import BXOLogo from '../../../../../components/Icons/BXOLogo';
import SPOLogo from '../../../../../components/Icons/SPOLogo';
import { IEqHydrants } from '../../../types/EquipmentsHydrants';

const EqHydrantQRCode = () => {
  const { eqHydrantQrCodeList, isLoadingEqHydrantQrCodeList, isErrorEqHydrantQrCodeList } = useEqHydrants();
  const [selectedItemsHydrantsValve, setSelectedItemsHydrantsValve] = useState<any[]>([]);

  const toggleSelectItem = (item: IEqHydrants) => {
    setSelectedItemsHydrantsValve((prevSelected) => {
      if (prevSelected.some((selectedItem) => selectedItem.Id === item.Id)) {
        return prevSelected.filter((selectedItem) => selectedItem.Id !== item.Id);
      } else if (prevSelected.length < 10) {
        return [...prevSelected, item];
      }
      return prevSelected;
    });
  };

  return (
    <div className="h-full">
      <Table.Root>
        <Table.Thead>
          <Table.Tr className="bg-[#FCFCFC]">
            <Table.Th className="pl-8">{``}</Table.Th>
            <Table.Th>Cód. Equipamento</Table.Th>
            <Table.Th>Predio</Table.Th>
            <Table.Th>Pavimento</Table.Th>
            <Table.Th>Local</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody className="block max-h-[28rem] overflow-y-scroll">
          {eqHydrantQrCodeList?.length === 0 && (
            <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
              <Table.Td colSpan={5} className="text-center text-primary">
                Nenhum hidrante encontrado!
              </Table.Td>
            </Table.Tr>
          )}

          {isErrorEqHydrantQrCodeList && (
            <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
              <Table.Td colSpan={5} className="text-center text-primary">
                Ops, ocorreu um erro, recarregue a página e tente novamente!
              </Table.Td>
            </Table.Tr>
          )}

          {isLoadingEqHydrantQrCodeList && (
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

          {eqHydrantQrCodeList &&
            eqHydrantQrCodeList.map((item) => (
              <Table.Tr key={item.Id}>
                <Table.Td className="pl-8">
                  <Checkbox
                    checked={selectedItemsHydrantsValve.some((selectedItem) => selectedItem.Id === item.Id)}
                    onClick={() => toggleSelectItem(item)}
                  />
                </Table.Td>
                <Table.Td>{item?.cod_qrcode}</Table.Td>
                <Table.Td>{item?.predio}</Table.Td>
                <Table.Td>{item?.pavimento}</Table.Td>
                <Table.Td>{item?.local}</Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table.Root>

      <div className="w-full grid grid-cols-2 justify-center gap-4 p-2" id="qrCodeElement">
        {selectedItemsHydrantsValve.map((value: any) => {
          const qrCodeValue = `Hidrantes;${value?.site};${value?.cod_qrcode}`;

          return (
            <div key={value.Id} className="flex justify-center items-center">
              <div className="flex flex-col justify-center w-[20rem] items-center gap-6 bg-white border-[.0625rem] border-black">
                <div className="uppercase text-lg font-semibold py-4 m-auto bg-bg-home w-full text-center text-white">
                  Gestão de Emergência
                </div>

                <div className="px-2 py-2 gap-3 flex flex-col justify-center items-center">
                  <QRCode renderAs="svg" value={qrCodeValue} size={150} fgColor="#000" bgColor="#fff" />
                  <span className="font-medium text-sm italic">{`Hidrante/${value?.site}/${value?.predio}/${value?.pavimento}`}</span>

                  {value?.site === 'BXO' && <BXOLogo height="50" width="45" />}
                  {value?.site === 'SPO' && <SPOLogo height="50" width="45" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EqHydrantQRCode;
