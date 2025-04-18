import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Column, SortColumn } from 'react-data-grid';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UseInfiniteQueryResult, UseMutationResult } from '@tanstack/react-query';

import Toast from '@/components/Toast';
import isAtBottom from '@/utils/isAtBottom';
import { SpillKitModal } from './spill-kit-modal';
import CustomDataGrid from '@/components/DataGrid';
import PopoverTables from '@/components/PopoverTables';
import { SpillKitProps } from '../types/spill-kit.types';
import RemoveItem from '@/components/AppModals/RemoveItem';
import DataGridLoadMore from '@/components/DataGrid/DataGridLoadMore';

interface SpillKitTableProps {
  spillKitData: UseInfiniteQueryResult<any, unknown>;
  mutateRemove: UseMutationResult<void, unknown, number, unknown>;
  sortColumns: readonly SortColumn[];
  setSortColumns: React.Dispatch<React.SetStateAction<readonly SortColumn[]>>;
}

export const SpillKitTable = ({ spillKitData, mutateRemove, setSortColumns, sortColumns }: SpillKitTableProps) => {
  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/spo/equipments/spill_kit/${id}`);
  };

  const handleRemove = async () => {
    if (removeItem) {
      await mutateRemove.mutateAsync(removeItem);
      setRemoveItem(null);
    }
  };

  const columns: readonly Column<SpillKitProps>[] = [
    { key: 'Id', name: '#', resizable: true },
    { key: 'Predio', name: 'Prédio', resizable: true },
    { key: 'Pavimento', name: 'Pavimento', resizable: true },
    { key: 'LocEsp', name: 'Local', resizable: true },
    { key: 'Title', name: 'Código Local', resizable: true },
    { key: 'Conforme', name: 'Conformidade', resizable: true },

    { key: 'buttons', name: 'Ações', resizable: true, sortable: false },
  ];

  const mappedRows =
    spillKitData.data?.pages.flatMap(
      (page) =>
        page?.data?.value?.map((item: SpillKitProps) => ({
          Id: <div className="pl-4">{item.Id}</div>,
          Predio: item?.Predio ? item.Predio : '',
          Pavimento: item?.Pavimento ? item.Pavimento : '',
          LocEsp: item?.LocEsp ? item.LocEsp : '',
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
    spillKitData.fetchNextPage();
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

        {spillKitData.isFetchingNextPage && <DataGridLoadMore />}
      </div>

      <SpillKitModal />

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
