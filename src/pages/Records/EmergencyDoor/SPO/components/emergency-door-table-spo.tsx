import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Column, SortColumn } from 'react-data-grid';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UseInfiniteQueryResult, UseMutationResult } from '@tanstack/react-query';

import Toast from '../../../../../components/Toast';
import isAtBottom from '../../../../../utils/isAtBottom';
import EmergencyDoorModalSPO from './emergency-door-modal-spo';
import { EmergencyDoor } from '../types/emergency-door.types';
import CustomDataGrid from '../../../../../components/DataGrid';
import PopoverTables from '../../../../../components/PopoverTables';
import RemoveItem from '../../../../../components/AppModals/RemoveItem';
import DataGridLoadMore from '../../../../../components/DataGrid/DataGridLoadMore';

interface ITableProps {
  emergencyDoor: UseInfiniteQueryResult<any, unknown>;
  mutateRemove: UseMutationResult<void, unknown, number, unknown>;
  sortColumns: readonly SortColumn[];
  setSortColumns: React.Dispatch<React.SetStateAction<readonly SortColumn[]>>;
}

const EmergencyDoorTableSPO = ({ emergencyDoor, mutateRemove, setSortColumns, sortColumns }: ITableProps) => {
  const navigate = useNavigate();

  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const handleView = (Id: number) => {
    navigate(`/records/emergency_doors/${Id}?edit=false`);
  };

  const handleEdit = (Id: number) => {
    navigate(`/records/emergency_doors/${Id}?edit=true`);
  };

  const handleRemoveItem = async () => {
    try {
      if (removeItem) {
        await mutateRemove.mutateAsync(removeItem);
      }
    } catch (error) {
    } finally {
      setRemoveItem(null);
    }
  };

  const columns: readonly Column<EmergencyDoor>[] = [
    { key: 'Responsavel1', name: 'Responsável', resizable: true, width: 300 },
    { key: 'Id', name: 'N° Registro', resizable: true },
    { key: 'Local', name: 'Local', resizable: true },
    { key: 'LocalEsp', name: 'Local Específico', resizable: true },
    { key: 'Created', name: 'Data', resizable: true },
    { key: 'conforme', name: 'conforme', resizable: true },

    { key: 'buttons', name: 'Ações', resizable: true, sortable: false },
  ];

  const mappedRows =
    emergencyDoor.data?.pages.flatMap(
      (page) =>
        page?.data?.value?.map((item: EmergencyDoor) => ({
          Responsavel1: item?.Responsavel1 ? (
            <div className="pl-4">{item.Responsavel1}</div>
          ) : (
            <div className="pl-4">Sem informação responsável</div>
          ),
          Id: item?.Id,
          Local: item?.Local,
          LocalEsp: item?.LocalEsp,
          Created: item?.Created ? format(item?.Created, 'dd MMM yyyy', { locale: ptBR }) : '',

          conforme: (
            <div className="flex items-center h-full w-full">
              {item?.conforme ? (
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
              <PopoverTables
                onView={() => handleView(item.Id)}
                onEdit={() => handleEdit(item.Id)}
                onDelete={() => setRemoveItem(item.Id)}
              />
            </div>
          ),
        })),
    ) || [];

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    if (!isAtBottom(event)) return;
    emergencyDoor.fetchNextPage();
  };

  return (
    <>
      <div className="relative">
        <CustomDataGrid
          columns={columns.map((column) => ({
            ...column,
            headerCellClass: `${
              column.key === 'Responsavel1' && 'pl-4'
            } flex items-center text-primary-font-font font-medium text-lg bg-[#F9F9F9]`,
          }))}
          mappedRows={mappedRows}
          handleScroll={handleScroll}
          sortColumns={sortColumns}
          setSortColumns={setSortColumns}
        />

        {emergencyDoor.isFetchingNextPage && <DataGridLoadMore />}
      </div>

      <EmergencyDoorModalSPO />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemoveItem}
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

export default EmergencyDoorTableSPO;
