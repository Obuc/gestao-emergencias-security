import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import HydrantModal from '../modals/HydrantModal';
import useHydrants from '../../hooks/useHydrants';
import { Table } from '../../../../components/Table';
import { Select } from '../../../../components/Select';
import TextField from '../../../../components/TextField';
import DatePicker from '../../../../components/DatePicker';
import { appContext } from '../../../../context/appContext';
import PopoverTables from '../../../../components/PopoverTables';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import { Hydrants, IHydrantsFiltersProps } from '../../types/Hydrants';

const HydrantsTable = () => {
  const { local, pavimento } = appContext();

  const [hydrantsFilters, setHydrantsFilters] = useState<IHydrantsFiltersProps>({
    responsible: '',
    startDate: null,
    endDate: null,
    codHydrant: null,
    place: [],
    pavement: [],
    conformity: null,
    recordId: null,
  });

  const {
    hydrants,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveHydrants,
    isLoadingMutateRemoveHydrants,
  } = useHydrants(hydrantsFilters);

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/records/hydrants/${id}?edit=false`);
  };

  const handleEdit = (id: number) => {
    navigate(`/records/hydrants/${id}?edit=true`);
  };

  const handleRemove = async () => {
    if (removeItem) {
      await mutateRemoveHydrants(removeItem);
      setRemoveItem(null);
    }
  };

  const handleRemoveAllFilters = () => {
    setHydrantsFilters({
      responsible: '',
      startDate: null,
      endDate: null,
      codHydrant: null,
      place: [],
      pavement: [],
      conformity: null,
      recordId: null,
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
            value={hydrantsFilters.responsible || ''}
            onChange={(event) => {
              setHydrantsFilters((prev) => ({ ...prev, responsible: event.target.value }));
            }}
          />

          <TextField
            id="recordId"
            name="recordId"
            placeholder="Registro"
            width="w-[9.375rem]"
            value={hydrantsFilters.recordId || ''}
            onChange={(event) => {
              setHydrantsFilters((prev) => ({ ...prev, recordId: event.target.value }));
            }}
          />

          <DatePicker
            name="startDate"
            placeholder="Data Inicial"
            width="w-[11.25rem]"
            value={hydrantsFilters.startDate ? new Date(hydrantsFilters.startDate) : null}
            onChange={(date: any) => setHydrantsFilters((prev) => ({ ...prev, startDate: date }))}
          />

          {hydrantsFilters.startDate && (
            <DatePicker
              name="endDate"
              placeholder="Data Final"
              width="w-[11.25rem]"
              value={hydrantsFilters.endDate ? new Date(hydrantsFilters.endDate) : null}
              onChange={(date: any) => setHydrantsFilters((prev) => ({ ...prev, endDate: date }))}
            />
          )}

          <TextField
            id="codHydrant"
            name="codHydrant"
            placeholder="Cód. Hidrante"
            width="w-[11.25rem]"
            value={hydrantsFilters.codHydrant || ''}
            onChange={(event) => {
              setHydrantsFilters((prev) => ({ ...prev, codHydrant: event.target.value }));
            }}
          />

          <Select.Component
            multi
            id="place"
            name="place"
            variant="outline"
            placeholder="Local"
            className="w-[11.25rem] max-h-[28.125rem]"
            selectedValues={hydrantsFilters.place}
            onSelectedValuesChange={(newSelectedValues) => {
              setHydrantsFilters((prev) => ({ ...prev, place: newSelectedValues }));
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
            id="pavement"
            name="pavement"
            variant="outline"
            placeholder="Pavimento"
            className="w-[11.25rem] max-h-[28.125rem]"
            popperWidth="w-[11.25rem]"
            selectedValues={hydrantsFilters.pavement}
            onSelectedValuesChange={(newSelectedValues) => {
              setHydrantsFilters((prev) => ({ ...prev, pavement: newSelectedValues }));
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
            className="w-[11.25rem] max-h-[28.125rem]"
            popperWidth="w-[11.25rem]"
            value={hydrantsFilters.conformity ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setHydrantsFilters((prev) => ({ ...prev, conformity: newSelectedValues }));
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
                <Table.Th className="pl-8">Registro</Table.Th>
                <Table.Th>Responsável</Table.Th>
                <Table.Th>Data</Table.Th>
                <Table.Th>Cód Hidrante</Table.Th>
                <Table.Th>Local</Table.Th>
                <Table.Th>Pavimento</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{``}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {hydrants?.pages[0].data.value.length === 0 && (
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

              {hydrants?.pages.map(
                (item: any) =>
                  item?.data?.value?.map((item: Hydrants) => (
                    <Table.Tr key={item.Id}>
                      <Table.Td className="pl-8">{item?.Id}</Table.Td>
                      <Table.Td>{item?.bombeiro}</Table.Td>
                      <Table.Td>{item?.Created ? format(item?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}</Table.Td>
                      <Table.Td>{item?.hidrante?.cod_hidrante}</Table.Td>
                      <Table.Td className="pr-4">{item?.hidrante?.local}</Table.Td>
                      <Table.Td>{item?.hidrante?.pavimento}</Table.Td>
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

      <HydrantModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemove}
          isLoading={isLoadingMutateRemoveHydrants}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </div>
  );
};

export default HydrantsTable;
