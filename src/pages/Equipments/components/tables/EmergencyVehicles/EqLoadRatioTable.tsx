import { useState } from 'react';
import { Skeleton } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroller';
import { useNavigate, useParams } from 'react-router-dom';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Table } from '../../../../../components/Table';
import { Select } from '../../../../../components/Select';
import TextField from '../../../../../components/TextField';
import PopoverTables from '../../../../../components/PopoverTables';
import RemoveItem from '../../../../../components/AppModals/RemoveItem';
import useEqLoadRatio from '../../../hooks/EmergencyVehicles/useEqLoadRatio';
import EqLoadRatioModal from '../../modals/EmergencyVehicles/EqLoadRatioModal';
import { IEqLoadRatio, IEqLoadRatioFiltersProps } from '../../../types/EmergencyVehicles/EquipmentsLoadRatio';

const EqLoadRatioTable = () => {
  const [eqLoadRatioFilters, setEqLoadRatioFilters] = useState<IEqLoadRatioFiltersProps>({
    id: '',
    plate: null,
    conformity: null,
  });

  const {
    eq_load_ratio,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    mutateRemoveEqLoadRatio,
    isLoadingMutateRemoveEqLoadRatio,
  } = useEqLoadRatio(eqLoadRatioFilters);

  const params = useParams();
  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/equipments/${params.form}/${id}`);
  };

  const handleRemoveEq = async () => {
    if (removeItem) {
      await mutateRemoveEqLoadRatio(removeItem);
      setRemoveItem(null);
    }
  };

  const handleRemoveAllFilters = () => {
    setEqLoadRatioFilters({
      id: '',
      plate: null,
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
            value={eqLoadRatioFilters.id || ''}
            onChange={(event) => {
              setEqLoadRatioFilters((prev) => ({ ...prev, id: event.target.value }));
            }}
          />

          <TextField
            id="plate"
            name="plate"
            placeholder="Placa"
            width="w-[16.25rem]"
            value={eqLoadRatioFilters.plate || ''}
            onChange={(event) => {
              setEqLoadRatioFilters((prev) => ({ ...prev, plate: event.target.value }));
            }}
          />

          <Select.Component
            id="conformity"
            name="conformity"
            variant="outline"
            placeholder="Conformidade"
            className="w-[12.5rem] max-h-[28.125rem]"
            popperWidth="w-[12.5rem]"
            value={eqLoadRatioFilters.conformity ?? ''}
            onValueChange={(newSelectedValues: any) => {
              setEqLoadRatioFilters((prev) => ({ ...prev, conformity: newSelectedValues }));
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
                <Table.Th>Tipo Veículo</Table.Th>
                <Table.Th>Placa</Table.Th>
                <Table.Th>Conformidade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody className="max-h-[28rem] overflow-y-scroll">
              {eq_load_ratio?.pages[0].data.value.length === 0 && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={6} className="text-center text-primary">
                    Nenhum veículo encontrado!
                  </Table.Td>
                </Table.Tr>
              )}

              {isError && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={6} className="text-center text-primary">
                    Ops, ocorreu um erro, recarregue a página e tente novamente!
                  </Table.Td>
                </Table.Tr>
              )}

              {isLoading && (
                <>
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="h-14 px-4" colSpan={6}>
                        <Skeleton height="3.5rem" animation="wave" />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}

              {eq_load_ratio &&
                !isLoading &&
                !isError &&
                eq_load_ratio?.pages.map(
                  (item: any) =>
                    item?.data?.value?.map((item: IEqLoadRatio) => (
                      <Table.Tr key={item.Id}>
                        <Table.Td className="pl-8">{item?.Id}</Table.Td>
                        <Table.Td>{item?.site}</Table.Td>
                        <Table.Td>{item?.tipo_veiculo}</Table.Td>
                        <Table.Td>{item?.placa}</Table.Td>
                        <Table.Td>
                          {item.conforme ? (
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

      <EqLoadRatioModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemoveEq}
          isLoading={isLoadingMutateRemoveEqLoadRatio}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </div>
  );
};

export default EqLoadRatioTable;
