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
import PopoverTables from '../../../../../components/PopoverTables';
import RemoveItem from '../../../../../components/AppModals/RemoveItem';
import useLoadRatio from '../../../hooks/EmergencyVehicles/useLoadRatio';
import LoadRatioModal from '../../modals/EmergencyVehicles/LoadRatioModal';
import { ILoadRatioFiltersProps } from '../../../types/EmergencyVehicles/LoadRatio';
import { IGeneralChecklist } from '../../../types/EmergencyVehicles/GeneralChecklist';

const LoadRatioTable = () => {
  const [loadRatioFilters, setLoadRatioFilters] = useState<ILoadRatioFiltersProps>({
    recordId: null,
    plate: null,
    responsible: null,
    startDate: null,
    endDate: null,
    conformity: null,
  });

  const {
    load_ratio,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveLoadRatio,
    isLoadingMutateRemoveLoadRatio,
  } = useLoadRatio(loadRatioFilters);

  const navigate = useNavigate();
  const equipments_value = localStorage.getItem('equipments_value');
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/records/${equipments_value}/${id}?edit=false`);
  };

  const handleEdit = (id: number) => {
    navigate(`/records/${equipments_value}/${id}?edit=true`);
  };

  const handleRemove = async () => {
    if (removeItem !== null) {
      await mutateRemoveLoadRatio(removeItem);
      setRemoveItem(null);
    }
  };

  const handleRemoveAllFilters = () => {
    setLoadRatioFilters({
      recordId: null,
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
            value={loadRatioFilters.responsible || ''}
            onChange={(event) => {
              setLoadRatioFilters((prev) => ({ ...prev, responsible: event.target.value }));
            }}
          />

          <TextField
            id="recordId"
            name="recordId"
            placeholder="Registro"
            width="w-[9.375rem]"
            value={loadRatioFilters.recordId || ''}
            onChange={(event) => {
              setLoadRatioFilters((prev) => ({ ...prev, recordId: event.target.value }));
            }}
          />

          <TextField
            id="plate"
            name="plate"
            placeholder="Placa"
            width="w-[11.25rem]"
            value={loadRatioFilters.plate || ''}
            onChange={(event) => {
              setLoadRatioFilters((prev) => ({ ...prev, plate: event.target.value }));
            }}
          />

          <DatePicker
            name="startDate"
            placeholder="Data Inicial"
            width="w-[11.25rem]"
            value={loadRatioFilters.startDate ? new Date(loadRatioFilters.startDate) : null}
            onChange={(date: any) => setLoadRatioFilters((prev) => ({ ...prev, startDate: date }))}
          />

          {loadRatioFilters.startDate && (
            <DatePicker
              name="endDate"
              placeholder="Data Final"
              width="w-[11.25rem]"
              value={loadRatioFilters.endDate ? new Date(loadRatioFilters.endDate) : null}
              onChange={(date: any) => setLoadRatioFilters((prev) => ({ ...prev, endDate: date }))}
            />
          )}

          <Select.Component
            id="conformity"
            name="conformity"
            variant="outline"
            placeholder="Conformidade"
            className="w-[11.25rem] max-h-[28.125rem]"
            popperWidth="w-[11.25rem]"
            value={loadRatioFilters.conformity ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setLoadRatioFilters((prev) => ({ ...prev, conformity: newSelectedValues }));
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
              {load_ratio?.pages[0].data.value.length === 0 && (
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

              {load_ratio?.pages.map(
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

      <LoadRatioModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemove}
          isLoading={isLoadingMutateRemoveLoadRatio}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </div>
  );
};

export default LoadRatioTable;
