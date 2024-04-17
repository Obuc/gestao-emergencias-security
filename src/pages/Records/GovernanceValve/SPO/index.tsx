import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import Toast from '../../../../components/Toast';
import { Button } from '../../../../components/Button';
import LayoutBase from '../../../../layout/LayoutBase';
import useGovernanceValveSPO from './hooks/useGovernanceValveSPO';
import GovernanceValveTableSPO from './components/GovernanceValveTableSPO';
import GovernanceValveFiltersSPO from './components/GovernanceValveFiltersSPO';

const GovernanceValveSPO = () => {
  const navigate = useNavigate();
  const localSite = localStorage.getItem('user_site');

  const {
    mutateExportExcel,
    countAppliedFilters,
    handleApplyFilters,
    handleRemoveAllFilters,
    setTempTableFilters,
    tempTableFilters,
    governancevalve,
    mutateRemove,
    sortColumns,
    setSortColumns,
  } = useGovernanceValveSPO();

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
                <h2>Válvulas de Governo</h2>
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

                {/* {month && (
                  <Select.Component
                    id="month"
                    name="month"
                    value={month?.label}
                    className="w-[10rem]"
                    popperWidth="w-[10rem]"
                    mode="gray"
                    variant="outline"
                    onValueChange={(value) => {
                      const monthValue = months.find((option) => option.value === value);
                      setMonth(monthValue);
                    }}
                  >
                    {months.map((month) => (
                      <Select.Item key={month.value} value={month.value}>
                        {month.label}
                      </Select.Item>
                    ))}
                  </Select.Component>
                )} */}

                {/* <Select.Component
                  id="year"
                  name="year"
                  value={year.toString()}
                  className="w-[7.5rem]"
                  popperWidth="w-[7.5rem]"
                  mode="gray"
                  variant="outline"
                  onValueChange={(value) => setYear(+value)}
                >
                  {years.map((year) => (
                    <Select.Item key={year} value={year}>
                      {year}
                    </Select.Item>
                  ))}
                </Select.Component> */}

                <GovernanceValveFiltersSPO
                  countAppliedFilters={countAppliedFilters}
                  handleApplyFilters={handleApplyFilters}
                  handleRemoveAllFilters={handleRemoveAllFilters}
                  setTempTableFilters={setTempTableFilters}
                  tempTableFilters={tempTableFilters}
                />
              </div>
            </div>

            <GovernanceValveTableSPO
              governancevalve={governancevalve}
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

export default GovernanceValveSPO;
