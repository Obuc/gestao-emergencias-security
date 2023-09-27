import { useState } from 'react';
import QRCode from 'qrcode.react';
import { Skeleton } from '@mui/material';

import { Table } from '../../../../../components/Table';
import Checkbox from '../../../../../components/Checkbox';
import BXOLogo from '../../../../../components/Icons/BXOLogo';
import SPOLogo from '../../../../../components/Icons/SPOLogo';
import useEqLoadRatio from '../../../hooks/EmergencyVehicles/useEqLoadRatio';
import { IEqLoadRatio } from '../../../types/EmergencyVehicles/EquipmentsLoadRatio';

const EqLoadRatioQRCode = () => {
  const { eqVehiclesLoadRatio, isLoadingVehiclesLoadRatio, isErrorEqVehiclesLoadRatio, qrCodeValue } = useEqLoadRatio();
  const [selectedItemsVehicles, setSelectedItemsVehicle] = useState<any[]>([]);

  const toggleSelectItem = (item: IEqLoadRatio) => {
    setSelectedItemsVehicle((prevSelected) => {
      if (prevSelected.some((selectedItem) => selectedItem.Id === item.Id)) {
        return prevSelected.filter((selectedItem) => selectedItem.Id !== item.Id);
      } else if (prevSelected.length < 10) {
        return [...prevSelected, item];
      }
      return prevSelected;
    });
  };

  return (
    <>
      <Table.Root>
        <Table.Thead>
          <Table.Tr className="bg-[#FCFCFC]">
            <Table.Th className="pl-8">{''}</Table.Th>
            <Table.Th>Cód. Veículo</Table.Th>
            <Table.Th>Tipo de Veículo</Table.Th>
            <Table.Th>Placa</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody className="block max-h-[28rem] overflow-y-scroll">
          {eqVehiclesLoadRatio?.length === 0 && (
            <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
              <Table.Td colSpan={4} className="text-center text-primary">
                Nenhum veículo encontrado!
              </Table.Td>
            </Table.Tr>
          )}

          {isErrorEqVehiclesLoadRatio && (
            <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
              <Table.Td colSpan={4} className="text-center text-primary">
                Ops, ocorreu um erro, recarregue a página e tente novamente!
              </Table.Td>
            </Table.Tr>
          )}

          {isLoadingVehiclesLoadRatio && (
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

          {eqVehiclesLoadRatio &&
            eqVehiclesLoadRatio.map((item) => (
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

      <div className="w-full grid grid-cols-2 justify-center gap-4 p-2" id="qrCodeElement">
        {selectedItemsVehicles.map((value: any) => {
          return (
            <div key={value.Id} className="flex justify-center items-center">
              <div className="flex flex-col justify-center w-[20rem] items-center gap-6 bg-white border-[.0625rem] border-black">
                <div className="uppercase text-lg font-semibold py-4 m-auto bg-bg-home w-full text-center text-white">
                  Gestão de Emergência
                </div>

                <div className="px-2 py-2 gap-3 flex flex-col justify-center items-center">
                  <QRCode renderAs="svg" value={qrCodeValue} size={150} fgColor="#000" bgColor="#fff" />
                  <span className="font-medium text-center text-sm italic">{`RelacaoCarga/${value?.site}/${value?.placa}/${value?.tipo_veiculo}`}</span>

                  {value?.site === 'BXO' && <BXOLogo height="50" width="45" />}
                  {value?.site === 'SPO' && <SPOLogo height="50" width="45" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EqLoadRatioQRCode;
