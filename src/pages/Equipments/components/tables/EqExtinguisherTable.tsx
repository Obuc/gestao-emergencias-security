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
import useEqExtinguisher from '../../hooks/useEqExtinguisher';
import EqExtinguisherModal from '../modals/EqExtinguisherModal';
import PopoverTables from '../../../../components/PopoverTables';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import { IEqExtinguisher, IEqExtinguisherFiltersProps } from '../../types/EquipmentsExtinguisher';

const EqExtinguisherTable = () => {
  const [eqExtinguisherFilters, setEqExtinguisherFilters] = useState<IEqExtinguisherFiltersProps>({
    id: '',
    pavement: [],
    place: [],
    extinguisherType: [],
    extinguisherId: null,
    conformity: null,
  });

  const {
    equipments,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isLoadingMutateRemoveEquipment,
    mutateRemoveEquipment,
  } = useEqExtinguisher(eqExtinguisherFilters);

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);
  const { local, pavimento, tipo_extintor } = appContext();

  const handleView = (id: number) => {
    navigate(`/equipments/extinguisher/${id}`);
  };

  const handleRemove = async () => {
    if (removeItem) {
      await mutateRemoveEquipment(removeItem);
      setRemoveItem(null);
    }
  };

  const handleRemoveAllFilters = () => {
    setEqExtinguisherFilters({
      id: '',
      pavement: [],
      place: [],
      extinguisherType: [],
      extinguisherId: null,
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
            value={eqExtinguisherFilters.id || ''}
            onChange={(event) => {
              setEqExtinguisherFilters((prev) => ({ ...prev, id: event.target.value }));
            }}
          />

          <TextField
            id="extinguisherId"
            name="extinguisherId"
            placeholder="Cód. Extintor"
            width="w-[9.375rem]"
            value={eqExtinguisherFilters.extinguisherId || ''}
            onChange={(event) => {
              setEqExtinguisherFilters((prev) => ({ ...prev, extinguisherId: event.target.value }));
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
            selectedValues={eqExtinguisherFilters.pavement}
            onSelectedValuesChange={(newSelectedValues) => {
              setEqExtinguisherFilters((prev) => ({ ...prev, pavement: newSelectedValues }));
            }}
          >
            {pavimento?.map((pavimento) => (
              <Select.Item key={pavimento.Id} value={pavimento.Title}>
                {pavimento.Title}
              </Select.Item>
            ))}
          </Select.Component>

          <Select.Component
            multi
            id="place"
            name="place"
            variant="outline"
            placeholder="Local"
            className="w-[12.5rem] max-h-[28.125rem]"
            selectedValues={eqExtinguisherFilters.place}
            onSelectedValuesChange={(newSelectedValues: any) => {
              setEqExtinguisherFilters((prev) => ({ ...prev, place: newSelectedValues }));
            }}
          >
            {local?.map((local) => (
              <Select.Item key={local.Id} value={local.Title}>
                {local.Title}
              </Select.Item>
            ))}
          </Select.Component>

          <Select.Component
            multi
            id="extinguisherType"
            name="extinguisherType"
            variant="outline"
            placeholder="Tipo Extintor"
            className="w-[12.5rem] max-h-[28.125rem]"
            popperWidth="w-[12.5rem]"
            selectedValues={eqExtinguisherFilters.extinguisherType}
            onSelectedValuesChange={(newSelectedValues: any) => {
              setEqExtinguisherFilters((prev) => ({ ...prev, extinguisherType: newSelectedValues }));
            }}
          >
            {tipo_extintor?.map((local) => (
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
            className="w-[12.5rem] max-h-[28.125rem]"
            popperWidth="w-[12.5rem]"
            value={eqExtinguisherFilters.conformity ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setEqExtinguisherFilters((prev) => ({ ...prev, conformity: newSelectedValues }));
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
                <Table.Th>Local</Table.Th>
                <Table.Th>Tipo Extintor</Table.Th>
                <Table.Th>N° Extintor</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody className="max-h-[28rem] overflow-y-scroll">
              {equipments?.pages[0].data.value.length === 0 && (
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

              {equipments &&
                !isLoading &&
                !isError &&
                equipments?.pages.map(
                  (item: any) =>
                    item?.data?.value?.map((item: IEqExtinguisher) => (
                      <Table.Tr key={item.Id}>
                        <Table.Td className="pl-8">{item?.Id}</Table.Td>
                        <Table.Td>{item?.site}</Table.Td>
                        <Table.Td>{item?.pavimento}</Table.Td>
                        <Table.Td>{item?.local}</Table.Td>
                        <Table.Td>{item?.tipo_extintor}</Table.Td>
                        <Table.Td>{item?.cod_extintor}</Table.Td>
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

      <EqExtinguisherModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemove}
          isLoading={isLoadingMutateRemoveEquipment}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </div>
  );
};

export default EqExtinguisherTable;
