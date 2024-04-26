import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import Toast from '@/components/Toast';
import { Button } from '@/components/Button';
import LayoutBase from '@/layout/LayoutBase';
import { useInspectionCmiSPO } from './hooks/cmi-inspection-modal.hook';
import { InspectionCmiTableSPO } from './components/cmi-inspection-table';
import { InspectionCmiFiltersSPO } from './components/cmi-inspection-filters';

const InspectionCmiSPO = () => {
  const navigate = useNavigate();
  const localSite = localStorage.getItem('user_site');

  const {
    mutateExportExcel,
    countAppliedFilters,
    handleApplyFilters,
    handleRemoveAllFilters,
    setTempTableFilters,
    tempTableFilters,
    cmiInspection,
    mutateRemove,
    sortColumns,
    setSortColumns,
  } = useInspectionCmiSPO();

  useEffect(() => {
    if (localSite === null) {
      localStorage.removeItem('user_site');

      if (window.location.pathname !== '/') {
        navigate('/');
      }
    }
  }, [localSite, navigate]);

  return (
    <>
      <LayoutBase showMenu>
        <div className="flex flex-col h-full w-full justify-between bg-[#F1F1F1]">
          <div className="flex h-full flex-col p-8">
            <div className="flex pb-8 items-center w-full justify-between">
              <div className="flex w-full items-center gap-2 text-2xl text-primary-font font-semibold">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <h2>Inspeção CMI</h2>
              </div>

              <div className="flex gap-2">
                <Button.Root
                  fill
                  className="min-w-[12rem] h-10"
                  disabled={mutateExportExcel.isLoading}
                  onClick={() => mutateExportExcel.mutate()}
                >
                  {mutateExportExcel.isLoading ? (
                    <Button.Spinner />
                  ) : (
                    <>
                      <Button.Label>Exportar Planilha</Button.Label>
                      <Button.Icon icon={faDownload} />
                    </>
                  )}
                </Button.Root>

                <InspectionCmiFiltersSPO
                  countAppliedFilters={countAppliedFilters}
                  handleApplyFilters={handleApplyFilters}
                  handleRemoveAllFilters={handleRemoveAllFilters}
                  setTempTableFilters={setTempTableFilters}
                  tempTableFilters={tempTableFilters}
                />
              </div>
            </div>

            <InspectionCmiTableSPO
              cmiInspection={cmiInspection}
              mutateRemove={mutateRemove}
              setSortColumns={setSortColumns}
              sortColumns={sortColumns}
            />
          </div>
        </div>
      </LayoutBase>

      {mutateExportExcel.isError && (
        <Toast type="error" open={mutateExportExcel.isError} onOpenChange={mutateExportExcel.reset}>
          O sistema encontrou um erro ao tentar gerar o arquivo Excel. Por favor, contate o suporte para obter ajuda.
        </Toast>
      )}

      {mutateExportExcel.isSuccess && (
        <Toast type="success" open={mutateExportExcel.isSuccess} onOpenChange={mutateExportExcel.reset}>
          O arquivo Excel foi gerado com sucesso. Operação concluída.
        </Toast>
      )}
    </>
  );
};

export default InspectionCmiSPO;
