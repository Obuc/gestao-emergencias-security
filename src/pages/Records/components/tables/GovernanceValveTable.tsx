import { useState } from 'react';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { Table } from '../../../../components/Table';
import { GovernanceValve } from '../../types/GovernanceValve';
import useGovernanceValve from '../../hooks/useGovernanceValve';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PopoverTables from '../../../../components/PopoverTables';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import GovernanceValveModal from '../modals/GovernanceValveModal';

const GovernanceValveTable = () => {
  const {
    governaceValve,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,

    mutateRemoveExtinguisher,
    IsLoadingMutateRemoveExtinguisher,
  } = useGovernanceValve();

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/records/${id}?edit=false`);
  };

  const handleEdit = (id: number) => {
    navigate(`/records/${id}?edit=true`);
  };

  return (
    <>
      <div className="min-[1100px]:max-h-[34rem] relative min-[1600px]:max-h-[39rem] min-[1800px]:max-h-[41rem] w-full overflow-y-auto">
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
                <Table.Th className="pl-8">Responsável</Table.Th>
                <Table.Th>N° Registro</Table.Th>
                <Table.Th>N° Válvula</Table.Th>
                <Table.Th>Prédio</Table.Th>
                <Table.Th>Data</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {governaceValve?.pages[0].data.value.length === 0 && (
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

              {governaceValve?.pages.map(
                (item: any) =>
                  item?.data?.value?.map((item: GovernanceValve) => (
                    <Table.Tr key={item.Id}>
                      <Table.Td className="pl-8">{item.bombeiro}</Table.Td>
                      <Table.Td>{item.Id}</Table.Td>
                      <Table.Td>{item.valvula.cod_equipamento}</Table.Td>
                      <Table.Td>{item.valvula.predio}</Table.Td>
                      <Table.Td>
                        {/* {item.data_legado
                          ? format(parseISO(item.data_legado), 'dd MMM yyyy', { locale: ptBR })
                          : format(parseISO(item.Created), 'dd MMM yyyy', { locale: ptBR })} */}
                      </Table.Td>
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
                        <PopoverTables
                          onView={() => handleView(item.Id)}
                          onDelete={() => setRemoveItem(item.Id)}
                          onEdit={() => handleEdit(item.Id)}
                        />
                      </Table.Td>
                    </Table.Tr>
                  )),
              )}
            </Table.Tbody>
          </Table.Root>
        </InfiniteScroll>
      </div>

      <GovernanceValveModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={async () => await mutateRemoveExtinguisher(removeItem)}
          isLoading={IsLoadingMutateRemoveExtinguisher}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </>
  );
};

export default GovernanceValveTable;
