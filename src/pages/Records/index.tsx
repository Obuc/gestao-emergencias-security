import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import useTestCMI from './hooks/useTestCMI';
import { Button } from '../../components/Button';
import LayoutBase from '../../layout/LayoutBase';
import { appContext } from '../../context/appContext';
import useExtinguisher from './hooks/useExtinguisher';
import useInspectionCmi from './hooks/useInspectionCmi';
import TestCmiTable from './components/tables/TestCmiTable';
import useGovernanceValve from './hooks/useGovernanceValve';
import useLoadRatio from './hooks/EmergencyVehicles/useLoadRatio';
import ExtinguisherTable from './components/tables/ExtinguisherTable';
import InspectionCmiTable from './components/tables/InspectionCmiTable';
import GovernanceValveTable from './components/tables/GovernanceValveTable';
import useGeneralChecklist from './hooks/EmergencyVehicles/useGeneralChecklist';
import LoadRatioTable from './components/tables/EmergencyVehicles/LoadRatioTable';
import Select, { SelectItem, SelectLabel, SelectSeparator } from '../../components/Select';
import GeneralChecklistTable from './components/tables/EmergencyVehicles/GeneralChecklistTable';

const Records = () => {
  const { isLoading } = useExtinguisher();
  const { formularios, submenu, isLoadingFormularios } = appContext();
  const localSite = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const { handleExportTestCmiToExcel, isLoadingTestCmiExportToExcel } = useTestCMI();
  const { handleExportExtinguisherToExcel, isLoadingExtinguisherExportToExcel } = useExtinguisher();
  const { handleExportInspectionCmiToExcel, isLoadingInspectionCmiExportToExcel } = useInspectionCmi();
  const { handleExportGovernanceValveToExcel, isLoadingGovernanceValveExportToExcel } = useGovernanceValve();
  const { handleExportGeneralChecklistToExcel, isLoadingGeneralChecklistExportToExcel } = useGeneralChecklist();
  const { handleExportLoadRatioToExcel, isLoadingLoadRatioExportToExcel } = useLoadRatio();

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

  const handleExportToExcel = () => {
    switch (formValue) {
      case 'Extintores':
        handleExportExtinguisherToExcel();
        break;

      case 'Válvulas de Governo':
        handleExportGovernanceValveToExcel();
        break;

      case 'Teste CMI':
        handleExportTestCmiToExcel();
        break;

      case 'Inspeção CMI':
        handleExportInspectionCmiToExcel();
        break;

      case 'Checklist Geral':
        handleExportGeneralChecklistToExcel();
        break;

      case 'Scania':
        handleExportLoadRatioToExcel();
        break;

      case 'S10':
        handleExportLoadRatioToExcel();
        break;

      case 'Mercedes':
        handleExportLoadRatioToExcel();
        break;

      case 'Furgão':
        handleExportLoadRatioToExcel();
        break;

      case 'Ambulância Iveco':
        handleExportLoadRatioToExcel();
        break;

      case 'Ambulância Sprinter':
        handleExportLoadRatioToExcel();
        break;
    }
  };

  return (
    <LayoutBase showMenu>
      <div className="flex flex-col w-full justify-between bg-[#F1F1F1]">
        <div className="flex flex-col p-8">
          <div className="flex pb-8 items-center w-full justify-between">
            <div className="flex gap-2 flex-col">
              <label htmlFor="state_id" className="text-lg text-primary font-medium">
                Selecionar formulário
              </label>

              <Select
                id="state_id"
                name="state_id"
                value={formValue}
                className="w-[22.5rem]"
                mode="gray"
                isLoading={isLoadingFormularios}
                onValueChange={(value) => {
                  setFormValue(value);
                  localStorage.setItem('equipments_value', value);
                }}
              >
                {filteredForms?.map((form) => (
                  <SelectItem key={form.Id} value={form.Title}>
                    {form.Title}
                  </SelectItem>
                ))}

                <SelectSeparator />
                <SelectLabel>Veículos de Emergência</SelectLabel>

                {filteredSubMenu?.map((form) => (
                  <SelectItem key={form.Id * 2} value={form.Title}>
                    {form.Title}
                  </SelectItem>
                ))}

                <SelectSeparator />
              </Select>
            </div>

            <Button.Root
              className="min-w-[14.0625rem] h-10"
              disabled={
                isLoading ||
                isLoadingExtinguisherExportToExcel ||
                isLoadingTestCmiExportToExcel ||
                isLoadingInspectionCmiExportToExcel ||
                isLoadingGeneralChecklistExportToExcel ||
                isLoadingGovernanceValveExportToExcel ||
                isLoadingLoadRatioExportToExcel
              }
              onClick={handleExportToExcel}
            >
              {isLoadingExtinguisherExportToExcel ||
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

          {formValue === 'Extintores' && <ExtinguisherTable />}
          {formValue === 'Válvulas de Governo' && <GovernanceValveTable />}
          {formValue === 'Teste CMI' && <TestCmiTable />}
          {formValue === 'Inspeção CMI' && <InspectionCmiTable />}

          {/* Veiculos de Emergencia */}
          {formValue === 'Checklist Geral' && <GeneralChecklistTable />}

          {formValue === 'Scania' && <LoadRatioTable />}
          {formValue === 'S10' && <LoadRatioTable />}
          {formValue === 'Mercedes' && <LoadRatioTable />}
          {formValue === 'Furgão' && <LoadRatioTable />}
          {formValue === 'Ambulância Iveco' && <LoadRatioTable />}
          {formValue === 'Ambulância Sprinter' && <LoadRatioTable />}
        </div>
      </div>
    </LayoutBase>
  );
};

export default Records;
