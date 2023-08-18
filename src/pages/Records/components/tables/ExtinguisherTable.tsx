import React, { useState } from 'react';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@mui/material';
import { format, parseISO } from 'date-fns';
import InfiniteScroll from 'react-infinite-scroller';
import { useNavigate, useParams } from 'react-router-dom';

import { Table } from '../../../../components/Table';
import ExtinguisherModal from '../modals/ExtinguisherModal';
import PopoverTables from '../../../../components/PopoverTables';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import useExtinguisher, { Extinguisher } from '../../hooks/useExtinguisher';

const ExtinguisherTable = () => {
  const {
    extinguisher,
    fetchNextPage,
    hasNextPage,
    isLoading,
    mutateRemoveExtinguisher,
    IsLoadingMutateRemoveExtinguisher,
  } = useExtinguisher();

  const params = useParams();
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
      <Table.Root>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="pl-8">Responsável</Table.Th>
            <Table.Th>Data</Table.Th>
            <Table.Th>Validade</Table.Th>
            <Table.Th>Data Pesagem</Table.Th>
            <Table.Th>Cód Extintor</Table.Th>
            <Table.Th>Local</Table.Th>
            <Table.Th>Pavimento</Table.Th>
            <Table.Th>Conformidade</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>{''}</Table.Th>
          </Table.Tr>
        </Table.Thead>
      </Table.Root>

      <div className="min-[1100px]:max-h-[35.6rem] min-[1600px]:max-h-[38rem] min-[1800px]:max-h-[36rem] w-full overflow-y-auto">
        {!isLoading && (
          <InfiniteScroll
            pageStart={0}
            loadMore={() => fetchNextPage()}
            hasMore={hasNextPage}
            useWindow={false}
            loader={<div key="1">Loading...</div>}
          >
            <Table.Root>
              <Table.Tbody>
                {!extinguisher?.pages[0].data.value.lengh && (
                  <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                    <Table.Td colSpan={9}>Nenhum registro encontrado!</Table.Td>
                  </Table.Tr>
                )}

                {extinguisher?.pages.map(
                  (item) =>
                    item?.data?.value?.map((item: Extinguisher) => (
                      <Table.Tr key={item.Id} className="hover:bg-[#E9F0F3] hover:cursor-pointer duration-200">
                        <Table.Td className="pl-8">{item.Responsavel1.Title}</Table.Td>
                        <Table.Td>{format(parseISO(item.Created), 'dd MMM yyyy', { locale: ptBR })}</Table.Td>
                        <Table.Td>
                          {item.DataVenc ? format(parseISO(item.DataVenc), 'dd MMM yyyy', { locale: ptBR }) : 'N/A'}
                        </Table.Td>
                        <Table.Td>
                          {item.DataPesagem
                            ? format(parseISO(item.DataPesagem), 'dd MMM yyyy', { locale: ptBR })
                            : 'N/A'}
                        </Table.Td>
                        <Table.Td>{item.Title}</Table.Td>
                        <Table.Td>{item.Local}</Table.Td>
                        <Table.Td>{item.Pavimento}</Table.Td>
                        <Table.Td>{item.Site}</Table.Td>
                        <Table.Td>{item.Status}</Table.Td>
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
        )}
      </div>

      {/* {isLoadingExtinguisherModal && (
        <div className="h-screen justify-center items-center">
          <Spinner />
        </div>
      )} */}

      {/* {!isLoadingExtinguisherModal && params.id && <ExtinguisherModal />} */}

      <ExtinguisherModal />

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

export default ExtinguisherTable;
