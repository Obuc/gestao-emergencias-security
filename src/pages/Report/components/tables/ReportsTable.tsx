import { useState } from 'react';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import { IReports } from '../../types/Reports';
import useReports from '../../hooks/useReports';
import { Table } from '../../../../components/Table';
import PopoverTables from '../../../../components/PopoverTables';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import ReportsModal from '../modals/ReportsModal';

const ReportsTable = () => {
  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const { reports, fetchNextPage, hasNextPage, isError, isLoading, mutateRemoveReport, isLoadingMutateRemoveReport } =
    useReports();

  const handleView = (id: number) => {
    navigate(`/reports/${id}?edit=false`);
  };

  const handleEdit = (id: number) => {
    navigate(`/reports/${id}?edit=true`);
  };

  const handleRemove = async () => {
    if (removeItem) {
      await mutateRemoveReport(removeItem);
      setRemoveItem(null);
    }
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
                <Table.Th className="pl-8">Id</Table.Th>
                <Table.Th>Data</Table.Th>
                <Table.Th>Tipo de Laudo</Table.Th>
                <Table.Th>Documento</Table.Th>
                <Table.Th>Emissão Laudo</Table.Th>
                <Table.Th>Validade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {reports?.pages[0].data.value.length === 0 && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={7} className="text-center text-primary">
                    Nenhum laudo encontrado!
                  </Table.Td>
                </Table.Tr>
              )}

              {isError && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={7} className="text-center text-primary">
                    Ops, ocorreu um erro, recarregue a página e tente novamente!
                  </Table.Td>
                </Table.Tr>
              )}

              {isLoading && (
                <>
                  {Array.from({ length: 15 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="h-14 px-4" colSpan={7}>
                        <Skeleton height="3.5rem" animation="wave" />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}

              {reports?.pages.map(
                (item: any) =>
                  item?.data?.value?.map((item: IReports) => (
                    <Table.Tr key={item.Id}>
                      <Table.Td className="pl-8">{item.Id}</Table.Td>
                      <Table.Td>{format(parseISO(item.Created), 'dd MMM yyyy', { locale: ptBR })}</Table.Td>
                      <Table.Td>{item.tipo_laudo.Title}</Table.Td>
                      <Table.Td>
                        <a
                          className="flex items-center text-[#303030] gap-2"
                          href={item.AttachmentFiles[0].ServerRelativeUrl}
                          target="_blank"
                        >
                          <span>Abrir</span>

                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </a>
                      </Table.Td>
                      <Table.Td>{format(parseISO(item.emissao), 'dd MMM yyyy', { locale: ptBR })}</Table.Td>
                      <Table.Td>{format(parseISO(item.validade), 'dd MMM yyyy', { locale: ptBR })}</Table.Td>

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

      <ReportsModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemove}
          isLoading={isLoadingMutateRemoveReport}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </>
  );
};

export default ReportsTable;
