import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import useTestCMI from './hooks/useTestCMI';
import useHydrants from './hooks/useHydrants';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import LayoutBase from '../../layout/LayoutBase';
import { appContext } from '../../context/appContext';
import useExtinguisher from './hooks/useExtinguisher';
import useInspectionCmi from './hooks/useInspectionCmi';
import TestCmiTable from './components/tables/TestCmiTable';
import useGovernanceValve from './hooks/useGovernanceValve';
import HydrantsTable from './components/tables/HydrantsTable';
import useLoadRatio from './hooks/EmergencyVehicles/useLoadRatio';
import ExtinguisherTable from './components/tables/ExtinguisherTable';
import InspectionCmiTable from './components/tables/InspectionCmiTable';
import GovernanceValveTable from './components/tables/GovernanceValveTable';
import useGeneralChecklist from './hooks/EmergencyVehicles/useGeneralChecklist';
import LoadRatioTable from './components/tables/EmergencyVehicles/LoadRatioTable';
import GeneralChecklistTable from './components/tables/EmergencyVehicles/GeneralChecklistTable';

const Records = () => {
  const navigate = useNavigate();
  const { formularios, submenu, isLoadingFormularios } = appContext();
  const localSite = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const { handleExportTestCmiToExcel, isLoadingTestCmiExportToExcel } = useTestCMI();
  const { handleExportExtinguisherToExcel, isLoadingExtinguisherExportToExcel } = useExtinguisher();
  const { handleExportInspectionCmiToExcel, isLoadingInspectionCmiExportToExcel } = useInspectionCmi();
  const { handleExportGovernanceValveToExcel, isLoadingGovernanceValveExportToExcel } = useGovernanceValve();
  const { handleExportGeneralChecklistToExcel, isLoadingGeneralChecklistExportToExcel } = useGeneralChecklist();
  const { handleExportLoadRatioToExcel, isLoadingLoadRatioExportToExcel } = useLoadRatio();
  const { handleExportHydrantsToExcel, isLoadingHydrantsExportToExcel } = useHydrants();

  const filteredForms =
    formularios &&
    formularios.filter(
      (form) => (form.todos_sites === true || form.site.Title === localSite) && form.Title !== 'Veículos de emergência',
    );

  const filteredSubMenu =
    submenu && submenu.filter((form) => form.todos_sites === true || form.site.Title === localSite);

  const [formValue, setFormValue] = useState<string>(equipments_value ?? 'Extintores');

  useEffect(() => {
    !equipments_value?.length && localStorage.setItem('equipments_value', 'Extintores');
  }, []);

  useEffect(() => {
    navigate(`/records/${formValue}`);
  }, [formValue]);

  const handleExportToExcel = () => {
    switch (formValue) {
      case 'extinguisher':
        handleExportExtinguisherToExcel();
        break;

      case 'valves':
        handleExportGovernanceValveToExcel();
        break;

      case 'hydrants':
        handleExportHydrantsToExcel();
        break;

      case 'cmi_test':
        handleExportTestCmiToExcel();
        break;

      case 'cmi_inspection':
        handleExportInspectionCmiToExcel();
        break;

      case 'general_checklist':
        handleExportGeneralChecklistToExcel();
        break;

      case 'scania':
        handleExportLoadRatioToExcel();
        break;

      case 's10':
        handleExportLoadRatioToExcel();
        break;

      case 'mercedes':
        handleExportLoadRatioToExcel();
        break;

      case 'van':
        handleExportLoadRatioToExcel();
        break;

      case 'iveco':
        handleExportLoadRatioToExcel();
        break;

      case 'sprinter':
        handleExportLoadRatioToExcel();
        break;
    }
  };

  return (
    <LayoutBase showMenu>
      <div className="flex flex-col h-full w-full justify-between bg-[#F1F1F1]">
        <div className="flex h-full flex-col p-8">
          <div className="flex pb-8 items-center w-full justify-between">
            <div className="flex gap-2 flex-col">
              <label htmlFor="state_id" className="text-lg text-primary font-medium">
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

                <Select.Separator />
                <Select.Label>Veículos de Emergência</Select.Label>

                {filteredSubMenu?.map((form) => (
                  <Select.Item key={form.Id * 2} value={form.path_url}>
                    {form.Title}
                  </Select.Item>
                ))}

                <Select.Separator />
              </Select.Component>
            </div>

            <Button.Root
              className="min-w-[14.0625rem] h-10"
              disabled={
                isLoadingExtinguisherExportToExcel ||
                isLoadingTestCmiExportToExcel ||
                isLoadingInspectionCmiExportToExcel ||
                isLoadingGeneralChecklistExportToExcel ||
                isLoadingGovernanceValveExportToExcel ||
                isLoadingLoadRatioExportToExcel ||
                isLoadingHydrantsExportToExcel
              }
              onClick={handleExportToExcel}
            >
              {isLoadingExtinguisherExportToExcel ||
              isLoadingHydrantsExportToExcel ||
              isLoadingTestCmiExportToExcel ||
              isLoadingInspectionCmiExportToExcel ||
              isLoadingGeneralChecklistExportToExcel ||
              isLoadingGovernanceValveExportToExcel ||
              isLoadingLoadRatioExportToExcel ? (
                <Button.Spinner />
              ) : (
                <>
                  <Button.Label>Exportar Planilha</Button.Label>
                  <Button.Icon icon={faDownload} />
                </>
              )}
            </Button.Root>
          </div>

          {formValue === 'extinguisher' && <ExtinguisherTable />}
          {formValue === 'valves' && <GovernanceValveTable />}
          {formValue === 'cmi_test' && <TestCmiTable />}
          {formValue === 'cmi_inspection' && <InspectionCmiTable />}
          {formValue === 'hydrants' && <HydrantsTable />}

          {/* Veiculos de Emergencia */}
          {formValue === 'general_checklist' && <GeneralChecklistTable />}

          {formValue === 'scania' && <LoadRatioTable />}
          {formValue === 's10' && <LoadRatioTable />}
          {formValue === 'mercedes' && <LoadRatioTable />}
          {formValue === 'van' && <LoadRatioTable />}
          {formValue === 'iveco' && <LoadRatioTable />}
          {formValue === 'sprinter' && <LoadRatioTable />}
        </div>
      </div>
    </LayoutBase>
  );
};

export default Records;
