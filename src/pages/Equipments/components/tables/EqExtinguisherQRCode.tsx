import { useState } from 'react';
import QRCode from 'qrcode.react';

import { Table } from '../../../../components/Table';
import Checkbox from '../../../../components/Checkbox';
import BXOLogo from '../../../../components/Icons/BXOLogo';

interface IEqExtinguisherQRCodeProps<T> {
  data?: Array<T>;
  isLoading: boolean;
}

const EqExtinguisherQRCode = <T extends Record<string, any>>({ data }: IEqExtinguisherQRCodeProps<T>) => {
  // const [selectAll, setSelectAll] = useState(false);
  const [selectedItemsExtinguisher, setSelectedItemsExtinguisher] = useState<any[]>([]);

  // const toggleSelectAll = () => {
  //   setSelectAll(!selectAll);
  //   if (!selectAll && data) {
  //     setSelectedItemsExtinguisher(data);
  //   } else {
  //     setSelectedItemsExtinguisher([]);
  //   }
  // };

  const toggleSelectItem = (item: T) => {
    // setSelectedItemsExtinguisher((prevSelected) =>
    //   prevSelected.some((selectedItem) => selectedItem.Id === item.Id)
    //     ? prevSelected.filter((selectedItem) => selectedItem.Id !== item.Id)
    //     : [...prevSelected, item],
    // );

    setSelectedItemsExtinguisher((prevSelected) => {
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
            <Table.Th className="pl-8">{/* <Checkbox checked={selectAll} onClick={toggleSelectAll} /> */}</Table.Th>
            <Table.Th>Cód. Equipamento</Table.Th>
            <Table.Th>Predio</Table.Th>
            <Table.Th>Local</Table.Th>
            <Table.Th>Pavimento</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody className="block max-h-[28rem] overflow-y-scroll">
          {data &&
            data.map((item) => (
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

      <div className="w-full grid grid-cols-2 justify-center gap-4 p-2" id="qrCodeElement">
        {selectedItemsExtinguisher.map((qrCodeValue: any) => {
          const value = `Extintor;${qrCodeValue?.site};${qrCodeValue?.cod_qrcode}`;

          return (
            <div key={qrCodeValue.Id} className="flex justify-center items-center">
              <div className="flex flex-col justify-center w-[20rem] items-center gap-6 bg-white border-[.0625rem] border-black">
                <div className="uppercase text-lg font-semibold py-4 m-auto bg-bg-home w-full text-center text-white">
                  Gestão de Emergência
                </div>

                <div className="px-2 py-2 gap-3 flex flex-col justify-center items-center">
                  <QRCode
                    renderAs="svg"
                    value={value}
                    size={150}
                    fgColor="#000"
                    bgColor="#fff"
                    // imageSettings={{
                    //   src: LogoBXO,
                    //   height: 55,
                    //   width: 50,
                    //   excavate: true,
                    // }}
                  />
                  <span className="font-medium text-sm italic">{`Extintor/${qrCodeValue?.predio}/${qrCodeValue?.pavimento}/${qrCodeValue?.local}/${qrCodeValue.tipo_extintor}`}</span>

                  <BXOLogo height="50" width="45" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EqExtinguisherQRCode;
