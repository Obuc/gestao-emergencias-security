import { useState } from 'react';

import { Table } from '../../../../components/Table';
import Checkbox from '../../../../components/Checkbox';

interface IEqExtinguisherQRCodeProps<T> {
  data?: Array<T>;
  isLoading: boolean;
}

const EqExtinguisherQRCode = <T extends Record<string, any>>({ data }: IEqExtinguisherQRCodeProps<T>) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItemsExtinguisher, setSelectedItemsExtinguisher] = useState<any[]>([]);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && data) {
      setSelectedItemsExtinguisher(data);
    } else {
      setSelectedItemsExtinguisher([]);
    }
  };

  const toggleSelectItem = (item: T) => {
    setSelectedItemsExtinguisher((prevSelected) =>
      prevSelected.some((selectedItem) => selectedItem.Id === item.Id)
        ? prevSelected.filter((selectedItem) => selectedItem.Id !== item.Id)
        : [...prevSelected, item],
    );
  };

  return (
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
  );
};

export default EqExtinguisherQRCode;
