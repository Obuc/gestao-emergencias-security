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
import PopoverTables from '../../../../components/PopoverTables';
import useEqGovernanceValve from '../../hooks/useEqGovernanceValve';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import EqGovernanceValveModal from '../modals/EqGovernanceValveModal';
import { IEqGovernanceValve, IEqGovernanceValveFiltersProps } from '../../types/EquipmentsGovernanceValve';

const EqEqGovernanceValve = () => {
  const [eqGovernancevalveFilters, setEqGovernancevalveFilters] = useState<IEqGovernanceValveFiltersProps>({
    id: '',
    pavement: [],
    place: [],
    valveId: null,
    conformity: null,
  });

  const {
    governanceValve,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    mutateRemoveEqGovernanceValve,
    isLoadingMutateRemoveEqGovernanceValve,
  } = useEqGovernanceValve(eqGovernancevalveFilters);

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);
  const { local, pavimento } = appContext();

  const handleView = (id: number) => {
    navigate(`/equipments/valves/${id}`);
  };

  const handleRemoveAllFilters = () => {
    setEqGovernancevalveFilters({
      id: '',
      pavement: [],
      place: [],
      valveId: null,
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
            value={eqGovernancevalveFilters.id || ''}
            onChange={(event) => {
              setEqGovernancevalveFilters((prev) => ({ ...prev, id: event.target.value }));
            }}
          />

          <TextField
            id="valveId"
            name="valveId"
            placeholder="Cód. Válvula"
            width="w-[9.375rem]"
            value={eqGovernancevalveFilters.valveId || ''}
            onChange={(event) => {
              setEqGovernancevalveFilters((prev) => ({ ...prev, valveId: event.target.value }));
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
            selectedValues={eqGovernancevalveFilters.pavement}
            onSelectedValuesChange={(newSelectedValues) => {
              setEqGovernancevalveFilters((prev) => ({ ...prev, pavement: newSelectedValues }));
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
            selectedValues={eqGovernancevalveFilters.place}
            onSelectedValuesChange={(newSelectedValues: any) => {
              setEqGovernancevalveFilters((prev) => ({ ...prev, place: newSelectedValues }));
            }}
          >
            {local?.map((local) => (
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
            value={eqGovernancevalveFilters.conformity ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setEqGovernancevalveFilters((prev) => ({ ...prev, conformity: newSelectedValues }));
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
                <Table.Th className="pl-8">ID</Table.Th>
                <Table.Th>Site</Table.Th>
                <Table.Th>Pavimento</Table.Th>
                <Table.Th>Local</Table.Th>
                <Table.Th>N° Válvula</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody className="max-h-[28rem] overflow-y-scroll">
              {governanceValve?.pages[0].data.value.length === 0 && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={7} className="text-center text-primary">
                    Nenhum registro encontrado!
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
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="h-14 px-4" colSpan={7}>
                        <Skeleton height="3.5rem" animation="wave" />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}

              {governanceValve &&
                !isLoading &&
                !isError &&
                governanceValve?.pages.map(
                  (item: any) =>
                    item?.data?.value?.map((item: IEqGovernanceValve) => (
                      <Table.Tr key={item.Id}>
                        <Table.Td className="pl-8">{item?.Id}</Table.Td>
                        <Table.Td>{item?.site}</Table.Td>
                        <Table.Td>{item?.pavimento}</Table.Td>
                        <Table.Td>{item?.local}</Table.Td>
                        <Table.Td>{item?.cod_equipamento}</Table.Td>
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

      <EqGovernanceValveModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={async () => await mutateRemoveEqGovernanceValve(removeItem)}
          isLoading={isLoadingMutateRemoveEqGovernanceValve}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </div>
  );
};

export default EqEqGovernanceValve;
