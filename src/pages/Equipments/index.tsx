import { useState } from 'react';
import { faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';

import useEqTestCmi from './hooks/useEqTestCmi';
import LayoutBase from '../../layout/LayoutBase';
import { Button } from '../../components/Button';
import { appContext } from '../../context/appContext';
import useEqExtinguisher from './hooks/useEqExtinguisher';
import useEqInspectionCmi from './hooks/useEqInspectionCmi';
import EqCmiTestTable from './components/tables/EqCmiTestTable';
import EqTestCmiQRCode from './components/tables/QRCode/EqTestCmiQRCode';
import EqExtinguisherTable from './components/tables/EqExtinguisherTable';
import EqEqGovernanceValve from './components/tables/EqEqGovernanceValve';
import EqCmiInspectionTable from './components/tables/EqCmiInspectionTable';
import EqGenerateQRCodeModal from './components/modals/EqGenerateQRCodeModal';
import EqExtinguisherQRCode from './components/tables/QRCode/EqExtinguisherQRCode';
import useEqGeneralChecklist from './hooks/EmergencyVehicles/useEqGeneralChecklist';
import EqInspectionCmiQRCode from './components/tables/QRCode/EqInspectionCmiQRCode';
import EqGovernanceValveQRCode from './components/tables/QRCode/EqGovernanceValveQRCode';
import EqGeneralChecklistQRCode from './components/tables/QRCode/EqGeneralChecklistQRCode';
import Select, { SelectItem, SelectLabel, SelectSeparator } from '../../components/Select';
import EqGeneralChecklistTable from './components/tables/EmergencyVehicles/EqGeneralChecklistTable';

const Equipments = () => {
  const { formularios, submenu, isLoadingFormularios } = appContext();

  const localSite = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const [formValue, setFormValue] = useState<string>(equipments_value ?? 'Extintores');
  const [openModalGenerateQRCode, setOpenModalGenerateQRCode] = useState<boolean | null>(null);

  const { handleExportEqTestCmiToExcel } = useEqTestCmi();
  const { handleExportExtinguisherToExcel } = useEqExtinguisher();
  const { handleExportEqInspectionCmiToExcel } = useEqInspectionCmi();
  const { handleExportEqGeneralChecklistToExcel } = useEqGeneralChecklist();

  const filteredForms =
    formularios &&
    formularios.filter(
      (form) => (form.todos_sites === true || form.site.Title === localSite) && form.Title !== 'Veículos de emergência',
    );

  const filteredSubMenu =
    submenu && submenu.filter((form) => form.todos_sites === true || form.site.Title === localSite);

  const handleExportToExcel = () => {
    switch (formValue) {
      case 'Extintores':
        handleExportExtinguisherToExcel();
        break;

      case 'Teste CMI':
        handleExportEqTestCmiToExcel();
        break;

      case 'Inspeção CMI':
        handleExportEqInspectionCmiToExcel();
        break;

      case 'Checklist Geral':
        handleExportEqGeneralChecklistToExcel();
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

            <div className="flex gap-2">
              <Button.Root className="min-w-[14.0625rem] h-10" onClick={handleExportToExcel}>
                <Button.Label>Exportar Planilha</Button.Label>
                <Button.Icon icon={faDownload} />
              </Button.Root>

              <Button.Root className="w-[14.0625rem] h-10" fill onClick={() => setOpenModalGenerateQRCode(true)}>
                <Button.Label>Gerar QRCode</Button.Label>
                <Button.Icon icon={faExpand} />
              </Button.Root>
            </div>
          </div>

          {formValue === 'Extintores' && <EqExtinguisherTable />}
          {formValue === 'Válvulas de Governo' && <EqEqGovernanceValve />}
          {formValue === 'Teste CMI' && <EqCmiTestTable />}
          {formValue === 'Inspeção CMI' && <EqCmiInspectionTable />}
          {formValue === 'Checklist Geral' && <EqGeneralChecklistTable />}
        </div>
      </div>

      {openModalGenerateQRCode && (
        <EqGenerateQRCodeModal open={openModalGenerateQRCode} onOpenChange={() => setOpenModalGenerateQRCode(null)}>
          {formValue === 'Extintores' && <EqExtinguisherQRCode />}
          {formValue === 'Teste CMI' && <EqTestCmiQRCode />}
          {formValue === 'Inspeção CMI' && <EqInspectionCmiQRCode />}
          {formValue === 'Válvulas de Governo' && <EqGovernanceValveQRCode />}
          {formValue === 'Checklist Geral' && <EqGeneralChecklistQRCode />}
        </EqGenerateQRCodeModal>
      )}
    </LayoutBase>
  );
};

export default Equipments;
