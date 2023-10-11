import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Table } from '../../../../components/Table';
import { InspectionCMI } from '../../types/InspectionCMI';
import useInspectionCmi from '../../hooks/useInspectionCmi';
import InspectionCmiModal from '../modals/InspectionCmiModal';
import PopoverTables from '../../../../components/PopoverTables';
import RemoveItem from '../../../../components/AppModals/RemoveItem';

const InspectionCmiTable = () => {
  const {
    inspection_cmi,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveInspectionCmi,
    isLoadingMutateRemoveInspectionCmi,
  } = useInspectionCmi();

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/records/cmi_inspection/${id}?edit=false`);
  };

  const handleEdit = (id: number) => {
    navigate(`/records/cmi_inspection/${id}?edit=true`);
  };

  const handleRemove = async () => {
    if (removeItem !== null) {
      await mutateRemoveInspectionCmi(removeItem);
      setRemoveItem(null);
    }
  };

  return (
    <>
      <div className="min-[1100px]:max-h-[38rem] relative min-[1600px]:max-h-[39rem] min-[1800px]:max-h-[44rem] w-full overflow-y-auto">
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
                <Table.Th>Prédio</Table.Th>
                <Table.Th>Data Registro</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {inspection_cmi?.pages[0].data.value.length === 0 && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={5} className="text-center text-primary">
                    Nenhum registro encontrado!
                  </Table.Td>
                </Table.Tr>
              )}

              {isError && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={5} className="text-center text-primary">
                    Ops, ocorreu um erro, recarregue a página e tente novamente!
                  </Table.Td>
                </Table.Tr>
              )}

              {isLoading && (
                <>
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="h-14 px-4" colSpan={5}>
                        <Skeleton height="3.5rem" animation="wave" />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}

              {inspection_cmi?.pages.map(
                (item: any) =>
                  item?.data?.value?.map((item: InspectionCMI) => (
                    <Table.Tr key={item.Id}>
                      <Table.Td className="pl-8">{item.bombeiro_id.Title}</Table.Td>
                      <Table.Td>{item.cmi.predio}</Table.Td>
                      <Table.Td>{item.Created ? format(item.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}</Table.Td>
                      <Table.Td>
                        {item?.conforme ? (
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

      <InspectionCmiModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemove}
          isLoading={isLoadingMutateRemoveInspectionCmi}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </>
  );
};

export default InspectionCmiTable;
