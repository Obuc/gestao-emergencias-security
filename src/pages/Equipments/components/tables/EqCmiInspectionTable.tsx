import { useState } from 'react';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Table } from '../../../../components/Table';
import { Select } from '../../../../components/Select';
import TextField from '../../../../components/TextField';
import { appContext } from '../../../../context/appContext';
import useEqInspectionCmi from '../../hooks/useEqInspectionCmi';
import PopoverTables from '../../../../components/PopoverTables';
import EqCmiInspectionModal from '../modals/EqCmiInspectionModal';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import { IEqInspectionCmi, IEqInspectionCmiFiltersProps } from '../../types/EquipmentsInspectionCmi';

const EqCmiInspectionTable = () => {
  const [eqCMIInspectionFilters, setEqCMIInspectionFilters] = useState<IEqInspectionCmiFiltersProps>({
    id: '',
    pavement: [],
    conformity: null,
  });

  const {
    equipments,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    mutateRemoveEqInspectionCmi,
    isLoadingMutateRemoveEqInspectionCmi,
  } = useEqInspectionCmi(eqCMIInspectionFilters);

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);
  const { pavimento } = appContext();

  const handleView = (id: number) => {
    navigate(`/equipments/cmi_inspection/${id}`);
  };

  const handleRemoveEq = async () => {
    if (removeItem) {
      await mutateRemoveEqInspectionCmi(removeItem);
      setRemoveItem(null);
    }
  };

  const handleRemoveAllFilters = () => {
    setEqCMIInspectionFilters({
      id: '',
      pavement: [],
      conformity: null,
    });
  };

  return (
    <div className="h-full">
      <Table.Filter>
        <div className="flex gap-4">
          <TextField
            id="id"
            name="id"
            placeholder="ID"
            width="w-[16.25rem]"
            value={eqCMIInspectionFilters.id || ''}
            onChange={(event) => {
              setEqCMIInspectionFilters((prev) => ({ ...prev, id: event.target.value }));
            }}
          />

          <Select.Component
            multi
            id="pavement"
            name="pavement"
            variant="outline"
            placeholder="Pavimento"
            className="w-[12.5rem] max-h-[28.125rem]"
            popperWidth="w-[12.5rem]"
            selectedValues={eqCMIInspectionFilters.pavement}
            onSelectedValuesChange={(newSelectedValues) => {
              setEqCMIInspectionFilters((prev) => ({ ...prev, pavement: newSelectedValues }));
            }}
          >
            {pavimento?.map((pavimento) => (
              <Select.Item key={pavimento.Id} value={pavimento.Title}>
                {pavimento.Title}
              </Select.Item>
            ))}
          </Select.Component>

          <Select.Component
            id="conformity"
            name="conformity"
            variant="outline"
            placeholder="Conformidade"
            className="w-[12.5rem] max-h-[28.125rem]"
            popperWidth="w-[12.5rem]"
            value={eqCMIInspectionFilters.conformity ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setEqCMIInspectionFilters((prev) => ({ ...prev, conformity: newSelectedValues }));
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

      <div className="min-[1100px]:max-h-[33.125rem] relative min-[1600px]:max-h-[39.6875rem] min-[1800px]:max-h-[39.6875rem] w-full overflow-y-auto">
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
                <Table.Th>Pavimento</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody className="max-h-[28rem] overflow-y-scroll">
              {equipments?.pages[0].data.value.length === 0 && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={5} className="text-center text-primary">
                    Nenhum equipamento encontrado!
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
                  {Array.from({ length: 15 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="h-14 px-4" colSpan={5}>
                        <Skeleton height="3.5rem" animation="wave" />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}

              {equipments &&
                !isLoading &&
                !isError &&
                equipments?.pages.map(
                  (item: any) =>
                    item?.data?.value?.map((item: IEqInspectionCmi) => (
                      <Table.Tr key={item.Id}>
                        <Table.Td className="pl-8">{item?.Id}</Table.Td>
                        <Table.Td>{item?.site}</Table.Td>
                        <Table.Td>{item?.pavimento}</Table.Td>
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
                          <PopoverTables onView={() => handleView(item.Id)} onDelete={() => setRemoveItem(item.Id)} />
                        </Table.Td>
                      </Table.Tr>
                    )),
                )}
            </Table.Tbody>
          </Table.Root>
        </InfiniteScroll>
      </div>

      <EqCmiInspectionModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemoveEq}
          isLoading={isLoadingMutateRemoveEqInspectionCmi}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </div>
  );
};

export default EqCmiInspectionTable;
