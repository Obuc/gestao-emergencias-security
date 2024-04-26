import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Column, SortColumn } from 'react-data-grid';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Toast from '@/components/Toast';
import isAtBottom from '@/utils/isAtBottom';
import CustomDataGrid from '@/components/DataGrid';
import { ExtinguisherModal } from './extinguisher-modal';
import PopoverTables from '@/components/PopoverTables';
import RemoveItem from '@/components/AppModals/RemoveItem';
import { ExtinguisherProps } from '../types/extinguisher.types';
import DataGridLoadMore from '@/components/DataGrid/DataGridLoadMore';
import { UseInfiniteQueryResult, UseMutationResult } from '@tanstack/react-query';

interface ExtinguisherTableProps {
  extinguisherData: UseInfiniteQueryResult<any, unknown>;
  mutateRemove: UseMutationResult<void, unknown, number, unknown>;
  sortColumns: readonly SortColumn[];
  setSortColumns: React.Dispatch<React.SetStateAction<readonly SortColumn[]>>;
}

export const ExtinguisherTable = ({
  extinguisherData,
  mutateRemove,
  setSortColumns,
  sortColumns,
}: ExtinguisherTableProps) => {
  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/spo/equipments/extinguisher/${id}`);
  };

  const handleRemove = async () => {
    if (removeItem) {
      await mutateRemove.mutateAsync(removeItem);
      setRemoveItem(null);
    }
  };

  const columns: readonly Column<ExtinguisherProps>[] = [
    { key: 'Id', name: '#', resizable: true },
    { key: 'codExtintor', name: 'Código', resizable: true },
    { key: 'Predio', name: 'Prédio', resizable: true },
    { key: 'Pavimento', name: 'Pavimento', resizable: true },
    { key: 'LocEsp', name: 'Local', resizable: true, width: 260 },
    { key: 'Tipo', name: 'Tipo', resizable: true },
    { key: 'Title', name: 'Código Local', resizable: true },
    { key: 'Conforme', name: 'Conformidade', resizable: true },

    { key: 'buttons', name: 'Ações', resizable: true, sortable: false },
  ];

  const mappedRows =
    extinguisherData.data?.pages.flatMap(
      (page) =>
        page?.data?.value?.map((item: ExtinguisherProps) => ({
          Id: <div className="pl-4">{item.Id}</div>,
          codExtintor: item?.codExtintor ? item.codExtintor : '',
          Predio: item?.Predio ? item.Predio : '',
          Pavimento: item?.Pavimento ? item.Pavimento : '',
          LocEsp: item?.LocEsp ? item.LocEsp : '',
          Tipo: item?.Tipo ? item.Tipo : '',
          Title: item?.Title ? item.Title : '',

          Conforme: (
            <div className="flex items-center h-full w-full">
              {item?.Conforme ? (
                <div className="flex justify-center items-center gap-2 px-4 py-1 rounded-full bg-[#EBFFE2] h-10 max-w-[8.4375rem]">
                  <div className="w-3 h-3 rounded-full bg-[#70EC36]" />
                  <span>Conforme</span>
                </div>
              ) : (
                <div className="flex justify-center items-center gap-2 px-4 py-1 rounded-full bg-[#FFDEE4] h-10 max-w-[10.625rem]">
                  <FontAwesomeIcon className="text-pink" icon={faXmark} />
                  <span>Não Conforme</span>
                </div>
              )}
            </div>
          ),

          buttons: (
            <div className="w-full flex justify-center items-center h-full">
              <PopoverTables onView={() => handleView(item.Id)} onDelete={() => setRemoveItem(item.Id)} />
            </div>
          ),
        })),
    ) || [];

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    if (!isAtBottom(event)) return;
    extinguisherData.fetchNextPage();
  };

  return (
    <>
      <div className="relative">
        <CustomDataGrid
          columns={columns.map((column) => ({
            ...column,
            headerCellClass: `${
              column.key === 'Id' && 'pl-4'
            } flex items-center text-primary-font-font font-medium text-lg bg-[#F9F9F9]`,
          }))}
          mappedRows={mappedRows}
          handleScroll={handleScroll}
          sortColumns={sortColumns}
          setSortColumns={setSortColumns}
        />

        {extinguisherData.isFetchingNextPage && <DataGridLoadMore />}
      </div>

      <ExtinguisherModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemove}
          isLoading={mutateRemove.isLoading}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}

      {mutateRemove.isError && (
        <Toast type="error" open={mutateRemove.isError} onOpenChange={mutateRemove.reset}>
          O sistema encontrou um erro ao tentar excluir o registro. Por favor, contate o suporte para obter ajuda.
        </Toast>
      )}

      {mutateRemove.isSuccess && (
        <Toast type="success" open={mutateRemove.isSuccess} onOpenChange={mutateRemove.reset}>
          O registro foi removido com sucesso do sistema. Operação concluída.
        </Toast>
      )}
    </>
  );
};
