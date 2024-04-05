import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import Toast from '../../../../components/Toast';
import years from '../../../../utils/years.mock';
import LayoutBase from '../../../../layout/LayoutBase';
import { Select } from '../../../../components/Select';
import { Button } from '../../../../components/Button';
import { appContext } from '../../../../context/appContext';
import useInspectionCmiBXO from './hooks/useInspectionCmiBXO';
import InspectionCmiTableBXO from './components/InspectionCmiTableBXO';
import InspectionCmiFiltersBXO from './components/InspectionCmiFiltersBXO';

const InspectionCmiBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { formularios, submenu, isLoadingFormularios } = appContext();
  const localSite = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const {
    mutateExportExcel,
    countAppliedFilters,
    handleApplyFilters,
    handleRemoveAllFilters,
    setTempTableFilters,
    tempTableFilters,
    year,
    setYear,
    inspectionCmi,
    mutateRemove,
    sortColumns,
    setSortColumns,
  } = useInspectionCmiBXO();

  const filteredForms =
    formularios &&
    formularios.filter(
      (form) => (form.todos_sites === true || form.site.Title === localSite) && form.Title !== 'Veículos de emergência',
    );

  const filteredSubMenu = submenu && submenu.filter((form) => form.todos_sites === true || form.site.Title === localSite);

  const [formValue, setFormValue] = useState<string>(equipments_value ?? 'cmi_inspection');

  useEffect(() => {
    if (localSite?.length && !equipments_value?.length) {
      localStorage.setItem('equipments_value', 'cmi_inspection');
    }
  }, []);

  useEffect(() => {
    if (params.id === undefined && formValue.length && localSite?.length) {
      navigate(`/records/${formValue}`);
    }
  }, [formValue]);

  useEffect(() => {
    if (localSite === null) {
      localStorage.removeItem('user_site');
      localStorage.removeItem('equipments_value');

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
              <div className="flex gap-2 flex-col">
                <label htmlFor="state_id" className="text-lg text-primary-font font-medium">
                  Selecionar formulário
                </label>

                <Select.Component
                  id="state_id"
                  name="state_id"
                  value={
                    filteredForms?.find((form) => form.url_path === formValue)?.Title ||
                    filteredSubMenu?.find((form) => form.path_url === formValue)?.Title
                  }
                  className="w-[22.5rem]"
                  popperWidth="w-[22.5rem]"
                  mode="gray"
                  isLoading={isLoadingFormularios}
                  onValueChange={(value: any) => {
                    setFormValue(value);
                    localStorage.setItem('equipments_value', value);
                  }}
                >
                  {filteredForms?.map((form) => (
                    <Select.Item key={form.Id} value={form.url_path}>
                      {form.Title}
                    </Select.Item>
                  ))}

                  {filteredSubMenu && filteredSubMenu.length > 0 && (
                    <>
                      <Select.Separator />
                      <Select.Label>Veículos de Emergência</Select.Label>

                      {filteredSubMenu?.map((form) => (
                        <Select.Item key={form.Id * 2} value={form.path_url}>
                          {form.Title}
                        </Select.Item>
                      ))}
                    </>
                  )}
                </Select.Component>
              </div>

              <div className="flex gap-2">
                <Button.Root
                  fill
                  className="min-w-[10rem] h-10"
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

                <Select.Component
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
                </Select.Component>

                <InspectionCmiFiltersBXO
                  countAppliedFilters={countAppliedFilters}
                  handleApplyFilters={handleApplyFilters}
                  handleRemoveAllFilters={handleRemoveAllFilters}
                  setTempTableFilters={setTempTableFilters}
                  tempTableFilters={tempTableFilters}
                />
              </div>
            </div>

            <InspectionCmiTableBXO
              inspectionCmi={inspectionCmi}
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

export default InspectionCmiBXO;
