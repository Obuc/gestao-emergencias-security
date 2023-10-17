import { useState } from 'react';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { differenceInDays, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faXmark } from '@fortawesome/free-solid-svg-icons';

import useReports from '../../hooks/useReports';
import ReportsModal from '../modals/ReportsModal';
import { Table } from '../../../../components/Table';
import Tooltip from '../../../../components/Tooltip';
import { Select } from '../../../../components/Select';
import TextField from '../../../../components/TextField';
import DatePicker from '../../../../components/DatePicker';
import PopoverTables from '../../../../components/PopoverTables';
import RemoveItem from '../../../../components/AppModals/RemoveItem';
import { IReports, IReportsFiltersProps } from '../../types/Reports';

const ReportsTable = () => {
  const navigate = useNavigate();
  const [removeItem, setRemoveItem] = useState<number | null>(null);

  const now = new Date();
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [reportsFilters, setReportsFilters] = useState<IReportsFiltersProps>({
    id: '',
    startDate: null,
    endDate: null,
    emission: null,
    validity: null,
    reportType: null,
  });

  const {
    reports,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    mutateRemoveReport,
    isLoadingMutateRemoveReport,
    tipoLaudo,
  } = useReports(reportsFilters);

  const handleView = (id: number) => {
    navigate(`/reports/${id}?edit=false`);
  };

  const handleEdit = (id: number) => {
    navigate(`/reports/${id}?edit=true`);
  };

  const handleRemove = async () => {
    if (removeItem) {
      await mutateRemoveReport(removeItem);
      setRemoveItem(null);
    }
  };

  const handleRemoveAllFilters = () => {
    setReportsFilters({
      id: '',
      startDate: null,
      endDate: null,
      emission: null,
      validity: null,
      reportType: null,
    });
  };

  return (
    <div className="h-full">
      <Table.Filter>
        <div className="flex gap-4">
          <TextField
            id="id"
            name="id"
            placeholder="Número"
            width="w-[16.25rem]"
            value={reportsFilters.id || ''}
            onChange={(event) => {
              setReportsFilters((prev) => ({ ...prev, id: event.target.value }));
            }}
          />

          <DatePicker
            name="startDate"
            placeholder="Data Inicial"
            width="w-[11.25rem]"
            value={reportsFilters.startDate ? new Date(reportsFilters.startDate) : null}
            onChange={(date: any) => setReportsFilters((prev) => ({ ...prev, startDate: date }))}
          />

          {reportsFilters.startDate && (
            <DatePicker
              name="endDate"
              placeholder="Data Final"
              width="w-[11.25rem]"
              value={reportsFilters.endDate ? new Date(reportsFilters.endDate) : null}
              onChange={(date: any) => setReportsFilters((prev) => ({ ...prev, endDate: date }))}
            />
          )}

          <DatePicker
            name="emission"
            placeholder="Emissão Laudo"
            width="w-[11.25rem]"
            value={reportsFilters.emission ? new Date(reportsFilters.emission) : null}
            onChange={(date: any) => setReportsFilters((prev) => ({ ...prev, emission: date }))}
          />

          <DatePicker
            name="validity"
            placeholder="Validade"
            width="w-[11.25rem]"
            value={reportsFilters.validity ? new Date(reportsFilters.validity) : null}
            onChange={(date: any) => setReportsFilters((prev) => ({ ...prev, validity: date }))}
          />

          <Select.Component
            id="reportType"
            name="reportType"
            variant="outline"
            placeholder="Tipo de Laudo"
            className="w-[18.75rem] max-h-[28.125rem]"
            value={reportsFilters.reportType ?? ''}
            onValueChange={(newSelectedValues) => {
              setReportsFilters((prev) => ({ ...prev, reportType: newSelectedValues }));
            }}
          >
            {tipoLaudo?.map((laudo) => (
              <Select.Item key={laudo.Id} value={laudo.Title}>
                {laudo.Title}
              </Select.Item>
            ))}
          </Select.Component>
        </div>

        <button className="flex justify-center items-center gap-2 group" onClick={handleRemoveAllFilters}>
          <span className="text-primary font-semibold">LIMPAR FILTROS</span>
          <FontAwesomeIcon icon={faXmark} className="text-pink group-hover:text-pink/80 duration-200" />
        </button>
      </Table.Filter>

      <div className="min-[1100px]:max-h-[30rem] relative min-[1600px]:max-h-[42rem] min-[1800px]:max-h-[42rem] w-full overflow-y-auto">
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
                <Table.Th className="pl-8">Número</Table.Th>
                <Table.Th>Data</Table.Th>
                <Table.Th className="w-[10%]">Tipo de Laudo</Table.Th>
                <Table.Th>Documento</Table.Th>
                <Table.Th>Emissão Laudo</Table.Th>
                <Table.Th>Validade</Table.Th>
                <Table.Th>{''}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {reports?.pages[0]?.data?.value?.length === 0 && (
                <Table.Tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
                  <Table.Td colSpan={7} className="text-center text-primary">
                    Nenhum laudo encontrado!
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
                  {Array.from({ length: 15 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="h-14 px-4" colSpan={7}>
                        <Skeleton height="3.5rem" animation="wave" />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}

              {reports?.pages.map(
                (item: any) =>
                  item?.data?.value?.map((item: IReports) => {
                    const dateValidade = item.validade && new Date(item.validade);

                    const daysAdvance = item.dias_antecedentes_alerta;
                    const isExpired = dateValidade ? differenceInDays(dateValidade, nowDate) : null;
                    const daysToExpire = dateValidade ? differenceInDays(dateValidade, nowDate) : null;
                    const isAlert = daysToExpire !== null && daysToExpire <= daysAdvance && daysToExpire >= 0;

                    return (
                      <Table.Tr key={item.Id}>
                        <Table.Td className="pl-8">{item.Id}</Table.Td>
                        <Table.Td>{item.Created && format(item.Created, 'dd MMM yyyy', { locale: ptBR })}</Table.Td>
                        <Table.Td>{item.tipo_laudo.Title}</Table.Td>
                        <Table.Td>
                          {item.AttachmentFiles[0] && (
                            <a
                              className="flex items-center text-[#303030] gap-2 p-4 group"
                              href={'https://bayergroup.sharepoint.com' + item.AttachmentFiles[0].ServerRelativeUrl}
                              target="_blank"
                            >
                              <Tooltip label="Visualizar documento">
                                <span className="group-hover:border-b">Abrir</span>
                              </Tooltip>
                              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                            </a>
                          )}
                        </Table.Td>
                        <Table.Td>{item.emissao && format(item.emissao, 'dd MMM yyyy', { locale: ptBR })}</Table.Td>
                        <Table.Td>
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
                        </Table.Td>

                        <Table.Td>
                          <PopoverTables
                            onView={() => handleView(item.Id)}
                            onDelete={() => setRemoveItem(item.Id)}
                            onEdit={() => handleEdit(item.Id)}
                          />
                        </Table.Td>
                      </Table.Tr>
                    );
                  }),
              )}
            </Table.Tbody>
          </Table.Root>
        </InfiniteScroll>
      </div>

      <ReportsModal />

      {removeItem !== null && (
        <RemoveItem
          handleRemove={handleRemove}
          isLoading={isLoadingMutateRemoveReport}
          onOpenChange={() => setRemoveItem(null)}
          open={removeItem !== null}
        />
      )}
    </div>
  );
};

export default ReportsTable;
