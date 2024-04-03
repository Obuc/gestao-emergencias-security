import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Table } from '../../../../../components/Table';
import { Select } from '../../../../../components/Select';
import TextField from '../../../../../components/TextField';
import DatePicker from '../../../../../components/DatePicker';
import { appContext } from '../../../../../context/appContext';
import PopoverTables from '../../../../../components/PopoverTables';
import RemoveItem from '../../../../../components/AppModals/RemoveItem';
import useGeneralChecklist from '../../../hooks/EmergencyVehicles/useGeneralChecklist';
import GeneralChecklistModal from '../../modals/EmergencyVehicles/GeneralChecklistModal';
import { IGeneralChecklist, IGeneralChecklistFiltersProps } from '../../../types/EmergencyVehicles/GeneralChecklist';

const GeneralChecklistTable = () => {
  const { tipo_veiculo } = appContext();

  const [generalChecklistFilters, setGeneralChecklistFilters] = useState<IGeneralChecklistFiltersProps>({
    recordId: null,
    vehicle_type: [],
    plate: null,
    responsible: null,
    startDate: null,
    endDate: null,
    conformity: null,
  });

  const {
    general_checklist,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,

    mutateRemoveGeneralChecklist,
    isLoadingMutateRemoveGeneralChecklist,
  } = useGeneralChecklist(generalChecklistFilters);

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/records/general_checklist/${id}?edit=false`);
  };

  const handleEdit = (id: number) => {
    navigate(`/records/general_checklist/${id}?edit=true`);
  };

  const handleRemove = async () => {
    if (removeItem !== null) {
      await mutateRemoveGeneralChecklist(removeItem);
      setRemoveItem(null);
    }
  };

  const handleRemoveAllFilters = () => {
    setGeneralChecklistFilters({
      recordId: null,
      vehicle_type: [],
      plate: null,
      responsible: null,
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
            value={generalChecklistFilters.responsible || ''}
            onChange={(event) => {
              setGeneralChecklistFilters((prev) => ({ ...prev, responsible: event.target.value }));
            }}
          />

          <TextField
            id="recordId"
            name="recordId"
            placeholder="Registro"
            width="w-[9.375rem]"
            value={generalChecklistFilters.recordId || ''}
            onChange={(event) => {
              setGeneralChecklistFilters((prev) => ({ ...prev, recordId: event.target.value }));
            }}
          />

          <TextField
            id="plate"
            name="plate"
            placeholder="Placa"
            width="w-[11.25rem]"
            value={generalChecklistFilters.plate || ''}
            onChange={(event) => {
              setGeneralChecklistFilters((prev) => ({ ...prev, plate: event.target.value }));
            }}
          />

          <Select.Component
            multi
            id="vehicle_type"
            name="vehicle_type"
            variant="outline"
            placeholder="Tipo de Veículo"
            className="w-[12.5rem] max-h-[28.125rem]"
            popperWidth="w-[12.5rem]"
            selectedValues={generalChecklistFilters.vehicle_type}
            onSelectedValuesChange={(newSelectedValues) => {
              setGeneralChecklistFilters((prev) => ({ ...prev, vehicle_type: newSelectedValues }));
            }}
          >
            {tipo_veiculo?.map((item) => (
              <Select.Item key={item.Id} value={item.Title}>
                {item.Title}
              </Select.Item>
            ))}
          </Select.Component>

          <DatePicker
            name="startDate"
            placeholder="Data Inicial"
            width="w-[11.25rem]"
            value={generalChecklistFilters.startDate ? new Date(generalChecklistFilters.startDate) : null}
            onChange={(date: any) => setGeneralChecklistFilters((prev) => ({ ...prev, startDate: date }))}
          />

          {generalChecklistFilters.startDate && (
            <DatePicker
              name="endDate"
              placeholder="Data Final"
              width="w-[11.25rem]"
              value={generalChecklistFilters.endDate ? new Date(generalChecklistFilters.endDate) : null}
              onChange={(date: any) => setGeneralChecklistFilters((prev) => ({ ...prev, endDate: date }))}
            />
          )}

          <Select.Component
            id="conformity"
            name="conformity"
            variant="outline"
            placeholder="Conformidade"
            className="w-[11.25rem] max-h-[28.125rem]"
            popperWidth="w-[11.25rem]"
            value={generalChecklistFilters.conformity ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setGeneralChecklistFilters((prev) => ({ ...prev, conformity: newSelectedValues }));
            }}
          >
            <Select.Item value="Conforme">Conforme</Select.Item>
            <Select.Item value="Não Conforme">Não Conforme</Select.Item>
          </Select.Component>
        </div>

        <button className="flex justify-center items-center gap-2 group" onClick={handleRemoveAllFilters}>
          <span className="text-primary-font font-semibold">LIMPAR FILTROS</span>
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
                <Table.Th>Tipo de Veículo</Table.Th>
                <Table.Th>Placa</Table.Th>
                <Table.Th>Data</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {general_checklist?.pages[0].data.value.length === 0 && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={7} className="text-center text-primary-font">
                    Nenhum registro encontrado!
                  </Table.Td>
                </Table.Tr>
              )}

              {isError && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={7} className="text-center text-primary-font">
                    Ops, ocorreu um erro, recarregue a página e tente novamente!
                  </Table.Td>
                </Table.Tr>
              )}

              {isLoading && (
                <>
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="h-14 px-4" colSpan={7}>
                        <Skeleton height="3.5rem" animation="wave" />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}

              {general_checklist?.pages.map(
                (item: any) =>
                  item?.data?.value?.map((item: IGeneralChecklist) => (
                    <Table.Tr key={item.Id}>
                      <Table.Td className="pl-8">{item?.Id}</Table.Td>
                      <Table.Td>{item?.bombeiro}</Table.Td>
                      <Table.Td>{item?.veiculo?.tipo_veiculo}</Table.Td>
                      <Table.Td>{item?.veiculo?.placa}</Table.Td>
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

      <GeneralChecklistModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemove}
          isLoading={isLoadingMutateRemoveGeneralChecklist}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </div>
  );
};

export default GeneralChecklistTable;
