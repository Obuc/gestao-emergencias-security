import { useState } from 'react';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { Table } from '../../../../components/Table';
import useEquipments from '../../hooks/useEquipments';
import EqExtinguisherModal from '../modals/EqExtinguisherModal';
import PopoverTables from '../../../../components/PopoverTables';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import { EquipmentsExtinguisher } from '../../types/EquipmentsExtinguisher';

const EquipmentsTable = () => {
  const {
    equipments,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isLoadingMutateRemoveEquipment,
    mutateRemoveEquipment,
  } = useEquipments();

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/equipments/${id}`);
  };

  return (
    <>
      <div className="min-[1100px]:max-h-[38rem] min-[1600px]:max-h-[39rem] min-[1800px]:max-h-[41rem] w-full overflow-y-auto">
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetchNextPage()}
          hasMore={hasNextPage}
          useWindow={false}
          loader={<div key="1">Loading...</div>}
        >
          <Table.Root>
            <Table.Thead>
              <Table.Tr className="bg-[#FCFCFC]">
                <Table.Th className="pl-8">Código</Table.Th>
                <Table.Th>Site</Table.Th>
                <Table.Th>Pavimento</Table.Th>
                <Table.Th>Local</Table.Th>
                <Table.Th>N° Extintor</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody className="max-h-[28rem] overflow-y-scroll">
              {equipments?.pages[0].data.value.length === 0 && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={9} className="text-center text-primary">
                    Nenhum registro encontrado!
                  </Table.Td>
                </Table.Tr>
              )}

              {isError && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={9} className="text-center text-primary">
                    Ops, ocorreu um erro, recarregue a página e tente novamente!
                  </Table.Td>
                </Table.Tr>
              )}

              {isLoading && (
                <>
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="h-14 px-4" colSpan={9}>
                        <Skeleton height="3.5rem" animation="wave" />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}

              {equipments &&
                !isLoading &&
                !isError &&
                equipments?.pages.map(
                  (item: any) =>
                    item?.data?.value?.map((item: EquipmentsExtinguisher) => (
                      <Table.Tr key={item.Id}>
                        <Table.Td className="pl-8">{item.cod_qrcode}</Table.Td>
                        <Table.Td>{item?.site}</Table.Td>
                        <Table.Td>{item?.pavimento}</Table.Td>
                        <Table.Td>{item?.local}</Table.Td>
                        <Table.Td>{item.cod_extintor}</Table.Td>
                        <Table.Td>
                          {item.conforme ? (
                            <div className="flex justify-center items-center gap-2 px-4 py-1 rounded-full bg-[#EBFFE2] max-w-[8.4375rem]">
                              <div className="w-3 h-3 rounded-full bg-[#70EC36]" />
                              <span>Conforme</span>
                            </div>
                          ) : (
                            <div className="flex justify-center items-center gap-2 px-4 py-1 rounded-full bg-[#FFDEE4] max-w-[10.625rem]">
                              <FontAwesomeIcon className="text-pink" icon={faXmark} />
                              <span>Não Conforme</span>
                            </div>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <PopoverTables onView={() => handleView(item.Id)} onDelete={() => setRemoveItem(item.Id)} />
                        </Table.Td>
                      </Table.Tr>
                    )),
                )}
            </Table.Tbody>
          </Table.Root>
        </InfiniteScroll>
      </div>

      <EqExtinguisherModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={async () => await mutateRemoveEquipment(removeItem)}
          isLoading={isLoadingMutateRemoveEquipment}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </>
  );
};

export default EquipmentsTable;
