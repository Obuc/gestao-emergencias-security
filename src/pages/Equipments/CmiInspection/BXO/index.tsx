import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';

import Toast from '@/components/Toast';
import LayoutBase from '@/layout/LayoutBase';
import { Button } from '@/components/Button';
import { useCmiInspection } from './hooks/cmiInspection.hook';
import { CmiInspectionTable } from './components/cmiInspection-table';
import { CmiInspectionFilters } from './components/cmiInspection-filters';
import { CmiInspectionQrcodeModal } from './components/cmiInspection-qrcode-modal';

const EquipmentsCmiInspectionBXO = () => {
  const navigate = useNavigate();
  const localSite = localStorage.getItem('user_site');
  const [openModalGenerateQRCode, setOpenModalGenerateQRCode] = useState<boolean | null>(null);

  const {
    cmiInspectionData,
    mutateRemove,
    sortColumns,
    setSortColumns,
    mutateExportExcel,
    countAppliedFilters,
    handleApplyFilters,
    handleRemoveAllFilters,
    setTempTableFilters,
    tempTableFilters,
  } = useCmiInspection();

  useEffect(() => {
    if (localSite === null) {
      navigate('/');
    }
  }, [localSite]);

  return (
    <>
      <LayoutBase showMenu>
        <div className="flex flex-col w-full justify-between bg-[#F1F1F1]">
          <div className="flex flex-col p-8">
            <div className="flex pb-8 items-center w-full justify-between">
              <div className="flex w-full items-center gap-2 text-2xl text-primary-font font-semibold">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <h2>Inspeção CMI</h2>
              </div>

              <div className="flex gap-2">
                <Button.Root
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

                <Button.Root className="w-[12rem] h-10" fill onClick={() => setOpenModalGenerateQRCode(true)}>
                  <Button.Label>Gerar QRCode</Button.Label>
                  <Button.Icon icon={faExpand} />
                </Button.Root>

                <CmiInspectionFilters
                  countAppliedFilters={countAppliedFilters}
                  handleApplyFilters={handleApplyFilters}
                  handleRemoveAllFilters={handleRemoveAllFilters}
                  setTempTableFilters={setTempTableFilters}
                  tempTableFilters={tempTableFilters}
                />
              </div>
            </div>

            <CmiInspectionTable
              cmiInspectionData={cmiInspectionData}
              mutateRemove={mutateRemove}
              sortColumns={sortColumns}
              setSortColumns={setSortColumns}
            />
          </div>
        </div>

        {openModalGenerateQRCode && (
          <CmiInspectionQrcodeModal open={openModalGenerateQRCode} onOpenChange={() => setOpenModalGenerateQRCode(null)} />
        )}
      </LayoutBase>

      {mutateExportExcel.isError && (
        <Toast type="error" open={mutateExportExcel.isError} onOpenChange={mutateExportExcel.reset}>
          O sistema encontrou um erro ao tentar exportar planilha. Por favor, contate o suporte para obter ajuda.
        </Toast>
      )}

      {mutateExportExcel.isSuccess && (
        <Toast type="success" open={mutateExportExcel.isSuccess} onOpenChange={mutateExportExcel.reset}>
          A planilha excel foi exportada com sucesso. Operação concluída.
        </Toast>
      )}
    </>
  );
};

export default EquipmentsCmiInspectionBXO;
