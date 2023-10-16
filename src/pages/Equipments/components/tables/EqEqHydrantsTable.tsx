import { useState } from 'react';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Table } from '../../../../components/Table';
import useEqHydrants from '../../hooks/useEqHydrants';
import { Select } from '../../../../components/Select';
import TextField from '../../../../components/TextField';
import EqHydrantsModal from '../modals/EqHydrantsModal';
import { appContext } from '../../../../context/appContext';
import PopoverTables from '../../../../components/PopoverTables';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import { IEqHydrants, IEqHydrantsFiltersProps } from '../../types/EquipmentsHydrants';

const EqEqHydrantsTable = () => {
  const [eqHydrantsFilters, setEqHydrantsFilters] = useState<IEqHydrantsFiltersProps>({
    id: '',
    pavement: [],
    place: [],
    hydrantId: null,
    conformity: null,
    hasShelter: '',
  });

  const {
    eqHydrantsData,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    mutateRemoveEqHydrant,
    isLoadingMutateRemoveEqHydrant,
  } = useEqHydrants(eqHydrantsFilters);

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);
  const { local, pavimento } = appContext();

  const handleView = (id: number) => {
    navigate(`/equipments/hydrants/${id}`);
  };

  const handleRemoveAllFilters = () => {
    setEqHydrantsFilters({
      id: '',
      pavement: [],
      place: [],
      hydrantId: null,
      conformity: null,
      hasShelter: '',
    });
  };

  const handleRemove = async () => {
    if (removeItem) {
      await mutateRemoveEqHydrant(removeItem);
      setRemoveItem(null);
    }
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
            value={eqHydrantsFilters.id || ''}
            onChange={(event) => {
              setEqHydrantsFilters((prev) => ({ ...prev, id: event.target.value }));
            }}
          />

          <TextField
            id="hydrantId"
            name="hydrantId"
            placeholder="Cód. Hidrante"
            width="w-[9.375rem]"
            value={eqHydrantsFilters.hydrantId || ''}
            onChange={(event) => {
              setEqHydrantsFilters((prev) => ({ ...prev, hydrantId: event.target.value }));
            }}
          />

          <Select.Component
            multi
            id="pavement"
            name="pavement"
            variant="outline"
            placeholder="Pavimento"
            className="max-h-[28.125rem]"
            selectedValues={eqHydrantsFilters.pavement}
            onSelectedValuesChange={(newSelectedValues) => {
              setEqHydrantsFilters((prev) => ({ ...prev, pavement: newSelectedValues }));
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
            className="max-h-[28.125rem]"
            selectedValues={eqHydrantsFilters.place}
            onSelectedValuesChange={(newSelectedValues: any) => {
              setEqHydrantsFilters((prev) => ({ ...prev, place: newSelectedValues }));
            }}
          >
            {local?.map((local) => (
              <Select.Item key={local.Id} value={local.Title}>
                {local.Title}
              </Select.Item>
            ))}
          </Select.Component>

          <Select.Component
            id="hasShelter"
            name="hasShelter"
            variant="outline"
            placeholder="Possui Abrigo"
            className="w-[14.375rem] max-h-[28.125rem]"
            value={eqHydrantsFilters.hasShelter ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setEqHydrantsFilters((prev) => ({ ...prev, hasShelter: newSelectedValues }));
            }}
          >
            <Select.Item value="Possui Abrigo: Sim">Sim</Select.Item>
            <Select.Item value="Possui Abrigo: Não">Não</Select.Item>
          </Select.Component>

          <Select.Component
            id="conformity"
            name="conformity"
            variant="outline"
            placeholder="Conformidade"
            className="w-[11.25rem] max-h-[28.125rem]"
            value={eqHydrantsFilters.conformity ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setEqHydrantsFilters((prev) => ({ ...prev, conformity: newSelectedValues }));
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
                <Table.Th>N° Hidrante</Table.Th>
                <Table.Th>Possui Abrigo</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody className="max-h-[28rem] overflow-y-scroll">
              {eqHydrantsData?.pages[0].data.value.length === 0 && (
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

              {eqHydrantsData &&
                !isLoading &&
                !isError &&
                eqHydrantsData?.pages.map(
                  (item: any) =>
                    item?.data?.value?.map((item: IEqHydrants) => (
                      <Table.Tr key={item.Id}>
                        <Table.Td className="pl-8">{item?.Id}</Table.Td>
                        <Table.Td>{item?.site}</Table.Td>
                        <Table.Td>{item?.pavimento}</Table.Td>
                        <Table.Td className="pr-6">{item?.local}</Table.Td>
                        <Table.Td>{item?.cod_hidrante}</Table.Td>
                        <Table.Td>{item?.possui_abrigo ? 'Sim' : 'Não'}</Table.Td>

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

      <EqHydrantsModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemove}
          isLoading={isLoadingMutateRemoveEqHydrant}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </div>
  );
};

export default EqEqHydrantsTable;
