import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Table } from '../../../../components/Table';
import { Select } from '../../../../components/Select';
import TextField from '../../../../components/TextField';
import DatePicker from '../../../../components/DatePicker';
import useInspectionCmi from '../../hooks/useInspectionCmi';
import InspectionCmiModal from '../modals/InspectionCmiModal';
import PopoverTables from '../../../../components/PopoverTables';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import { IInspectionCMIFiltersProps, InspectionCMI } from '../../types/InspectionCMI';

const InspectionCmiTable = () => {
  const [inspectionCMIFilters, setInspectionCMIFilters] = useState<IInspectionCMIFiltersProps>({
    responsible: '',
    recordId: null,
    startDate: null,
    endDate: null,
    conformity: null,
  });

  const {
    inspection_cmi,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveInspectionCmi,
    isLoadingMutateRemoveInspectionCmi,
  } = useInspectionCmi(inspectionCMIFilters);

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

  const handleRemoveAllFilters = () => {
    setInspectionCMIFilters({
      responsible: '',
      recordId: null,
      startDate: null,
      endDate: null,
      conformity: null,
    });
  };

  return (
    <div className="h-full">
      <Table.Filter>
        <div className="flex gap-4">
          <TextField
            id="responsible"
            name="responsible"
            placeholder="Responsável"
            width="w-[16.25rem]"
            value={inspectionCMIFilters.responsible || ''}
            onChange={(event) => {
              setInspectionCMIFilters((prev) => ({ ...prev, responsible: event.target.value }));
            }}
          />

          <TextField
            id="recordId"
            name="recordId"
            placeholder="Registro"
            width="w-[9.375rem]"
            value={inspectionCMIFilters.recordId || ''}
            onChange={(event) => {
              setInspectionCMIFilters((prev) => ({ ...prev, recordId: event.target.value }));
            }}
          />

          <DatePicker
            name="startDate"
            placeholder="Data Inicial"
            width="w-[11.25rem]"
            value={inspectionCMIFilters.startDate ? new Date(inspectionCMIFilters.startDate) : null}
            onChange={(date: any) => setInspectionCMIFilters((prev) => ({ ...prev, startDate: date }))}
          />

          {inspectionCMIFilters.startDate && (
            <DatePicker
              name="endDate"
              placeholder="Data Final"
              width="w-[11.25rem]"
              value={inspectionCMIFilters.endDate ? new Date(inspectionCMIFilters.endDate) : null}
              onChange={(date: any) => setInspectionCMIFilters((prev) => ({ ...prev, endDate: date }))}
            />
          )}

          <Select.Component
            id="conformity"
            name="conformity"
            variant="outline"
            placeholder="Conformidade"
            className="w-[11.25rem] max-h-[28.125rem]"
            popperWidth="w-[11.25rem]"
            value={inspectionCMIFilters.conformity ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setInspectionCMIFilters((prev) => ({ ...prev, conformity: newSelectedValues }));
            }}
          >
            <Select.Item value="Conforme">Conforme</Select.Item>
            <Select.Item value="Não Conforme">Não Conforme</Select.Item>
          </Select.Component>
        </div>

        <button className="flex justify-center items-center gap-2 group" onClick={handleRemoveAllFilters}>
          <span className="text-primary font-semibold">LIMPAR FILTROS</span>
          <FontAwesomeIcon icon={faXmark} className="text-pink group-hover:text-pink/80 duration-200" />
        </button>
      </Table.Filter>

      <div
        className="
            min-[1100px]:max-h-[28.4375rem]
            min-[1500px]:max-h-[32.5rem]
            min-[1800px]:max-h-[40rem]
            w-full overflow-y-auto relative"
      >
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
                <Table.Th className="pl-8">Registro</Table.Th>
                <Table.Th>Responsável</Table.Th>
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
                      <Table.Td className="pl-8">{item?.Id}</Table.Td>
                      <Table.Td>{item?.bombeiro_id?.Title}</Table.Td>
                      <Table.Td>{item?.Created ? format(item.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}</Table.Td>
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
    </div>
  );
};

export default InspectionCmiTable;
