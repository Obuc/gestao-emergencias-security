import { useState } from 'react';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Table } from '../../../../../components/Table';
import PopoverTables from '../../../../../components/PopoverTables';
import RemoveItem from '../../../../../components/AppModals/RemoveItem';
import useEqGeneralChecklist from '../../../hooks/EmergencyVehicles/useEqGeneralChecklist';
import EqGeneralChecklistModal from '../../modals/EmergencyVehicles/EqGeneralChecklistModal';
import { IEqGeneralChecklist } from '../../../types/EmergencyVehicles/EquipmentsGeneralChecklist';

const EqGeneralChecklistTable = () => {
  const {
    eq_general_checklist,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,

    mutateRemoveEqGeneralChecklist,
    isLoadingMutateRemoveEqGeneralChecklist,
  } = useEqGeneralChecklist();

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/equipments/general_checklist/${id}`);
  };

  const handleRemoveEq = async () => {
    if (removeItem) {
      await mutateRemoveEqGeneralChecklist(removeItem);
      setRemoveItem(null);
    }
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
                <Table.Th className="pl-8">ID</Table.Th>
                <Table.Th>Site</Table.Th>
                <Table.Th>Tipo Veículo</Table.Th>
                <Table.Th>Placa</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody className="max-h-[28rem] overflow-y-scroll">
              {eq_general_checklist?.pages[0].data.value.length === 0 && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={6} className="text-center text-primary">
                    Nenhum veículo encontrado!
                  </Table.Td>
                </Table.Tr>
              )}

              {isError && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={6} className="text-center text-primary">
                    Ops, ocorreu um erro, recarregue a página e tente novamente!
                  </Table.Td>
                </Table.Tr>
              )}

              {isLoading && (
                <>
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="h-14 px-4" colSpan={6}>
                        <Skeleton height="3.5rem" animation="wave" />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}

              {eq_general_checklist &&
                !isLoading &&
                !isError &&
                eq_general_checklist?.pages.map(
                  (item: any) =>
                    item?.data?.value?.map((item: IEqGeneralChecklist) => (
                      <Table.Tr key={item.Id}>
                        <Table.Td className="pl-8">{item?.Id}</Table.Td>
                        <Table.Td>{item?.site}</Table.Td>
                        <Table.Td>{item?.tipo_veiculo}</Table.Td>
                        <Table.Td>{item?.placa}</Table.Td>
                        <Table.Td>
                          {item?.conforme_check_geral ? (
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

      <EqGeneralChecklistModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemoveEq}
          isLoading={isLoadingMutateRemoveEqGeneralChecklist}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </>
  );
};

export default EqGeneralChecklistTable;
