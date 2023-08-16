import React from 'react';
import { ptBR } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

import { Table } from '../../../../components/Table';
import ExtinguisherModal from '../modals/ExtinguisherModal';
import useExtinguisher, { Extinguisher } from '../../hooks/useExtinguisher';

const ExtinguisherTable = () => {
  const { extinguisher, fetchNextPage, hasNextPage } = useExtinguisher();

  const navigate = useNavigate();

  const handleRowModal = (id: number) => {
    navigate(`/records/${id}`);
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

      <div className="min-[1100px]:h-[35.6rem] min-[1600px]:h-[41rem] min-[1800px]:h-[46rem] w-full overflow-y-scroll">
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetchNextPage()}
          hasMore={hasNextPage}
          useWindow={false}
          loader={<div>Loading...</div>}
        >
          <Table.Root>
            <Table.Tbody>
              {extinguisher?.pages.map((item, index) => (
                <React.Fragment key={index}>
                  {item?.data?.value?.map((item: Extinguisher) => (
                    <Table.Tr
                      onClick={() => handleRowModal(item.Id)}
                      key={item.Id}
                      className="hover:bg-[#E9F0F3] hover:cursor-pointer duration-200"
                    >
                      <Table.Td className="pl-8">{item.Responsavel1.Title}</Table.Td>
                      <Table.Td>{format(parseISO(item.Created), 'dd MMM yyyy', { locale: ptBR })}</Table.Td>
                      <Table.Td>
                        {item.DataVenc ? format(parseISO(item.DataVenc), 'dd MMM yyyy', { locale: ptBR }) : 'N/A'}
                      </Table.Td>
                      <Table.Td>
                        {item.DataPesagem ? format(parseISO(item.DataPesagem), 'dd MMM yyyy', { locale: ptBR }) : 'N/A'}
                      </Table.Td>
                      <Table.Td>{item.Title}</Table.Td>
                      <Table.Td>{item.Local}</Table.Td>
                      <Table.Td>{item.Pavimento}</Table.Td>
                      <Table.Td>{item.Site}</Table.Td>
                      <Table.Td>{item.Status}</Table.Td>
                      <Table.Td>{''}</Table.Td>
                    </Table.Tr>
                  ))}
                </React.Fragment>
              ))}
            </Table.Tbody>
          </Table.Root>
        </InfiniteScroll>
      </div>

      {/* {extinguisherItem && (
        )} */}
      <ExtinguisherModal />
    </>
  );
};

export default ExtinguisherTable;
