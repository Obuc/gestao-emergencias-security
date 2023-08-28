import { useState } from 'react';
import Checkbox from '../../../../components/Checkbox';
import { Table } from '../../../../components/Table';
import useEquipments from '../../hooks/useEquipments';
import { EquipmentsExtinguisher } from '../../types/EquipmentsExtinguisher';

interface IEqExtinguisherQRCodeProps {
  selectedItems: EquipmentsExtinguisher[];
  setSelectedItems: React.Dispatch<React.SetStateAction<EquipmentsExtinguisher[]>>;
}

const EqExtinguisherQRCode = ({ selectedItems, setSelectedItems }: IEqExtinguisherQRCodeProps) => {
  const { eqExtinguisher } = useEquipments();

  const [selectAll, setSelectAll] = useState(false);
  // const [selectedItems, setSelectedItems] = useState<EquipmentsExtinguisher[]>([]);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && eqExtinguisher) {
      setSelectedItems(eqExtinguisher);
    } else {
      setSelectedItems([]);
    }
  };

  const toggleSelectItem = (item: EquipmentsExtinguisher) => {
    setSelectedItems((prevSelected) =>
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
        {eqExtinguisher &&
          eqExtinguisher.map((item) => (
            <Table.Tr key={item.Id}>
              <Table.Td className="pl-8">
                <Checkbox
                  checked={selectedItems.some((selectedItem) => selectedItem.Id === item.Id)}
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
