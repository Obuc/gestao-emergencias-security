import { useState } from 'react';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, format } from 'date-fns';
import { Column, SortColumn } from 'react-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { UseInfiniteQueryResult, UseMutationResult } from '@tanstack/react-query';

import Toast from '@/components/Toast';
import Tooltip from '@/components/Tooltip';
import isAtBottom from '@/utils/isAtBottom';
import { ReportsModal } from './report-modal';
import { IReports } from '../types/report.types';
import CustomDataGrid from '@/components/DataGrid';
import PopoverTables from '@/components/PopoverTables';
import RemoveItem from '@/components/AppModals/RemoveItem';
import DataGridLoadMore from '@/components/DataGrid/DataGridLoadMore';

interface IReportsTableProps {
  reportData: UseInfiniteQueryResult<any, unknown>;
  mutateRemove: UseMutationResult<void, unknown, number, unknown>;
  sortColumns: readonly SortColumn[];
  setSortColumns: React.Dispatch<React.SetStateAction<readonly SortColumn[]>>;
}

export const ReportsTable = ({ reportData, mutateRemove, setSortColumns, sortColumns }: IReportsTableProps) => {
  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const now = new Date();
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const localSite = localStorage.getItem('user_site');
  const localSiteLowerCase = localSite?.toLocaleLowerCase();

  const handleView = (id: number) => {
    navigate(`/${localSiteLowerCase}/reports/${id}?edit=false`);
  };

  const handleEdit = (id: number) => {
    navigate(`/${localSiteLowerCase}/reports/${id}?edit=true`);
  };

  const handleRemove = async () => {
    try {
      if (removeItem) {
        await mutateRemove.mutateAsync(removeItem);
      }
    } catch (error) {
    } finally {
      setRemoveItem(null);
    }
  };

  const columns: readonly Column<IReports>[] = [
    { key: 'Id', name: '#', resizable: true, width: 80 },
    { key: 'Created', name: 'Data', resizable: true, width: 100 },
    { key: 'tipo_laudo/Title', name: 'Tipo de Laudo', resizable: true, width: 520 },
    { key: 'Documento', name: 'Documento', resizable: true, sortable: false },
    { key: 'emissao', name: 'Emissão Laudo', resizable: true },
    { key: 'validade', name: 'Validade', resizable: true },

    { key: 'buttons', name: 'Ações', resizable: true, sortable: false },
  ];

  const mappedRows =
    reportData.data?.pages.flatMap(
      (page) =>
        page?.data?.value?.map((item: IReports) => {
          const dateValidade = item.validade && new Date(item.validade);

          const daysAdvance = item.dias_antecedentes_alerta;
          const isExpired = dateValidade ? differenceInDays(dateValidade, nowDate) : null;
          const daysToExpire = dateValidade ? differenceInDays(dateValidade, nowDate) : null;
          const isAlert = daysToExpire !== null && daysToExpire <= daysAdvance && daysToExpire >= 0;

          return {
            Id: <div className="pl-4">{item.Id}</div>,
            Created: item.Created && format(item.Created, 'dd MMM yyyy', { locale: ptBR }),
            'tipo_laudo/Title': item.tipo_laudo.Title,
            Documento: item.AttachmentFiles[0] && (
              <a
                className="flex items-center text-[#303030] gap-2 group"
                href={'https://bayergroup.sharepoint.com' + item.AttachmentFiles[0].ServerRelativeUrl}
                target="_blank"
              >
                <Tooltip label="Visualizar documento">
                  <span className="group-hover:border-b">Abrir</span>
                </Tooltip>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            ),

            emissao: item.emissao && format(item.emissao, 'dd MMM yyyy', { locale: ptBR }),

            validade: (
              <Tooltip
                label={
                  isExpired !== null && !item.revalidado
                    ? isExpired < 0
                      ? 'Laudo vencido!'
                      : daysToExpire === 0
                      ? 'Laudo vence hoje!'
                      : isAlert
                      ? `Dias restantes para o vencimento do laudo: ${daysToExpire}`
                      : 'Laudo dentro do prazo de validade!'
                    : 'Prazo de validade do Laudo'
                }
              >
                <span
                  data-alert={isAlert !== null && !item.revalidado && isAlert}
                  data-expired={isExpired !== null && !item.revalidado && isExpired < 0}
                  className="p-4 cursor-default data-[alert=true]:bg-[#FFEE57] data-[alert=true]:text-[#303030] data-[expired=true]:bg-[#FF3162]/20 data-[expired=true]:text-[#FF3162]"
                >
                  {item.validade && format(item.validade, 'dd MMM yyyy', { locale: ptBR })}
                </span>
              </Tooltip>
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
          };
        }),
    ) || [];

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    if (!isAtBottom(event)) return;
    reportData.fetchNextPage();
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

        {reportData.isFetchingNextPage && <DataGridLoadMore />}
      </div>

      <ReportsModal />

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
