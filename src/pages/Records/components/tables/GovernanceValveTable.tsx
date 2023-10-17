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
import { appContext } from '../../../../context/appContext';
import useGovernanceValve from '../../hooks/useGovernanceValve';
import PopoverTables from '../../../../components/PopoverTables';
import GovernanceValveModal from '../modals/GovernanceValveModal';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import { GovernanceValve, IGovernanceValveFiltersProps } from '../../types/GovernanceValve';

const GovernanceValveTable = () => {
  const { predio } = appContext();

  const [governanceValveFilters, setGovernanceValveFilters] = useState<IGovernanceValveFiltersProps>({
    responsible: '',
    id: null,
    valveNumber: null,
    property: [],
    startDate: null,
    endDate: null,
    conformity: null,
  });

  const {
    governaceValve,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveGovernanceValve,
    isLoadingMutateRemoveGovernanceValve,
  } = useGovernanceValve(governanceValveFilters);

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/records/valves/${id}?edit=false`);
  };

  const handleEdit = (id: number) => {
    navigate(`/records/valves/${id}?edit=true`);
  };

  const handleRemove = async () => {
    if (removeItem) {
      mutateRemoveGovernanceValve(removeItem);
      setRemoveItem(null);
    }
  };

  const handleRemoveAllFilters = () => {
    setGovernanceValveFilters({
      responsible: '',
      id: null,
      valveNumber: null,
      startDate: null,
      endDate: null,
      property: [],
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
            value={governanceValveFilters.responsible || ''}
            onChange={(event) => {
              setGovernanceValveFilters((prev) => ({ ...prev, responsible: event.target.value }));
            }}
          />

          <TextField
            id="id"
            name="id"
            placeholder="N° Registro"
            width="w-[11.25rem]"
            value={governanceValveFilters.id || ''}
            onChange={(event) => {
              setGovernanceValveFilters((prev) => ({ ...prev, id: event.target.value }));
            }}
          />

          <TextField
            id="valveNumber"
            name="valveNumber"
            placeholder="N° Válvula"
            width="w-[11.25rem]"
            value={governanceValveFilters.valveNumber || ''}
            onChange={(event) => {
              setGovernanceValveFilters((prev) => ({ ...prev, valveNumber: event.target.value }));
            }}
          />

          <DatePicker
            name="startDate"
            placeholder="Data Inicial"
            width="w-[11.25rem]"
            value={governanceValveFilters.startDate ? new Date(governanceValveFilters.startDate) : null}
            onChange={(date: any) => setGovernanceValveFilters((prev) => ({ ...prev, startDate: date }))}
          />

          {governanceValveFilters.startDate && (
            <DatePicker
              name="endDate"
              placeholder="Data Final"
              width="w-[11.25rem]"
              value={governanceValveFilters.endDate ? new Date(governanceValveFilters.endDate) : null}
              onChange={(date: any) => setGovernanceValveFilters((prev) => ({ ...prev, endDate: date }))}
            />
          )}

          <Select.Component
            multi
            id="property"
            name="property"
            variant="outline"
            placeholder="Prédio"
            className="w-[11.25rem] max-h-[28.125rem]"
            popperWidth="w-[11.25rem]"
            selectedValues={governanceValveFilters.property}
            onSelectedValuesChange={(newSelectedValues) => {
              setGovernanceValveFilters((prev) => ({ ...prev, property: newSelectedValues }));
            }}
          >
            {predio?.map((local) => (
              <Select.Item key={local.Id} value={local.Title}>
                {local.Title}
              </Select.Item>
            ))}
          </Select.Component>

          <Select.Component
            id="conformity"
            name="conformity"
            variant="outline"
            placeholder="Conformidade"
            className="w-[11.25rem] max-h-[28.125rem]"
            popperWidth="w-[11.25rem]"
            value={governanceValveFilters.conformity ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setGovernanceValveFilters((prev) => ({ ...prev, conformity: newSelectedValues }));
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
                  <Table.Td colSpan={8} className="text-center text-primary">
                    Nenhum registro encontrado!
                  </Table.Td>
                </Table.Tr>
              )}

              {isError && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={8} className="text-center text-primary">
                    Ops, ocorreu um erro, recarregue a página e tente novamente!
                  </Table.Td>
                </Table.Tr>
              )}

              {isLoading && (
                <>
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="h-14 px-4" colSpan={8}>
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
                      <Table.Td className="pl-8">{item?.Id}</Table.Td>
                      <Table.Td>{item?.bombeiro}</Table.Td>
                      <Table.Td>{item?.Id}</Table.Td>
                      <Table.Td>{item?.valvula?.cod_equipamento}</Table.Td>
                      <Table.Td>{item?.valvula?.predio}</Table.Td>
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

      <GovernanceValveModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemove}
          isLoading={isLoadingMutateRemoveGovernanceValve}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </div>
  );
};

export default GovernanceValveTable;
