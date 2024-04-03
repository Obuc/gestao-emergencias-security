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
import useExtinguisher from '../../hooks/useExtinguisher';
import DatePicker from '../../../../components/DatePicker';
import ExtinguisherModal from '../modals/ExtinguisherModal';
import { appContext } from '../../../../context/appContext';
import PopoverTables from '../../../../components/PopoverTables';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import { Extinguisher, IExtinguisherFiltersProps } from '../../types/Extinguisher';

const ExtinguisherTable = () => {
  const { local, pavimento } = appContext();

  const [extinguisherFilters, setExtinguisherFilters] = useState<IExtinguisherFiltersProps>({
    responsible: '',
    startDate: null,
    endDate: null,
    expiration: null,
    place: [],
    pavement: [],
    conformity: null,
    extinguisherId: null,
  });

  const {
    extinguisher,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    mutateRemoveExtinguisher,
    isLoadingMutateRemoveExtinguisher,
  } = useExtinguisher(extinguisherFilters);

  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/records/extinguisher/${id}?edit=false`);
  };

  const handleEdit = (id: number) => {
    navigate(`/records/extinguisher/${id}?edit=true`);
  };

  const handleRemove = async () => {
    if (removeItem) {
      await mutateRemoveExtinguisher(removeItem);
      setRemoveItem(null);
    }
  };

  const handleRemoveAllFilters = () => {
    setExtinguisherFilters({
      responsible: '',
      startDate: null,
      endDate: null,
      expiration: null,
      place: [],
      pavement: [],
      conformity: null,
      extinguisherId: null,
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
            value={extinguisherFilters.responsible || ''}
            onChange={(event) => {
              setExtinguisherFilters((prev) => ({ ...prev, responsible: event.target.value }));
            }}
          />

          <DatePicker
            name="startDate"
            placeholder="Data Inicial"
            width="w-[11.25rem]"
            value={extinguisherFilters.startDate ? new Date(extinguisherFilters.startDate) : null}
            onChange={(date: any) => setExtinguisherFilters((prev) => ({ ...prev, startDate: date }))}
          />

          {extinguisherFilters.startDate && (
            <DatePicker
              name="endDate"
              placeholder="Data Final"
              width="w-[11.25rem]"
              value={extinguisherFilters.endDate ? new Date(extinguisherFilters.endDate) : null}
              onChange={(date: any) => setExtinguisherFilters((prev) => ({ ...prev, endDate: date }))}
            />
          )}

          <DatePicker
            name="expiration"
            placeholder="Validade"
            width="w-[11.25rem]"
            value={extinguisherFilters.expiration ? new Date(extinguisherFilters.expiration) : null}
            onChange={(date: any) => setExtinguisherFilters((prev) => ({ ...prev, expiration: date }))}
          />

          <TextField
            id="extinguisherId"
            name="extinguisherId"
            placeholder="Cód. Extintor"
            width="w-[9.375rem]"
            value={extinguisherFilters.extinguisherId || ''}
            onChange={(event) => {
              setExtinguisherFilters((prev) => ({ ...prev, extinguisherId: event.target.value }));
            }}
          />

          <Select.Component
            multi
            id="place"
            name="place"
            variant="outline"
            placeholder="Local"
            className="w-[11.25rem] max-h-[28.125rem]"
            selectedValues={extinguisherFilters.place}
            onSelectedValuesChange={(newSelectedValues: any) => {
              setExtinguisherFilters((prev) => ({ ...prev, place: newSelectedValues }));
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
            selectedValues={extinguisherFilters.pavement}
            onSelectedValuesChange={(newSelectedValues) => {
              setExtinguisherFilters((prev) => ({ ...prev, pavement: newSelectedValues }));
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
            value={extinguisherFilters.conformity ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setExtinguisherFilters((prev) => ({ ...prev, conformity: newSelectedValues }));
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
                <Table.Th>Data</Table.Th>
                <Table.Th>Validade</Table.Th>
                <Table.Th>Data Pesagem</Table.Th>
                <Table.Th>Cód Extintor</Table.Th>
                <Table.Th>Local</Table.Th>
                <Table.Th>Pavimento</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{``}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {extinguisher?.pages[0].data.value.length === 0 && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={10} className="text-center text-primary-font">
                    Nenhum registro encontrado!
                  </Table.Td>
                </Table.Tr>
              )}

              {isError && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={10} className="text-center text-primary-font">
                    Ops, ocorreu um erro, recarregue a página e tente novamente!
                  </Table.Td>
                </Table.Tr>
              )}

              {isLoading && (
                <>
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="h-14 px-4" colSpan={10}>
                        <Skeleton height="3.5rem" animation="wave" />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}

              {extinguisher?.pages.map(
                (item: any) =>
                  item?.data?.value?.map((item: Extinguisher) => (
                    <Table.Tr key={item.Id}>
                      <Table.Td className="pl-8">{item?.Id}</Table.Td>
                      <Table.Td>{item?.bombeiro}</Table.Td>
                      <Table.Td>{item?.Created ? format(item.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}</Table.Td>
                      <Table.Td>
                        {item?.extintor?.validade
                          ? format(item.extintor.validade, 'dd MMM yyyy', { locale: ptBR })
                          : 'N/A'}
                      </Table.Td>
                      <Table.Td>
                        {item?.data_pesagem ? format(item.data_pesagem, 'dd MMM yyyy', { locale: ptBR }) : 'N/A'}
                      </Table.Td>
                      <Table.Td>{item?.extintor?.cod_extintor}</Table.Td>
                      <Table.Td>{item?.extintor?.local}</Table.Td>
                      <Table.Td>{item?.extintor?.pavimento}</Table.Td>
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

      <ExtinguisherModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemove}
          isLoading={isLoadingMutateRemoveExtinguisher}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </div>
  );
};

export default ExtinguisherTable;
