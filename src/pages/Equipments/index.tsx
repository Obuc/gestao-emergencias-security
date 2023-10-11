import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';

import useEqTestCmi from './hooks/useEqTestCmi';
import LayoutBase from '../../layout/LayoutBase';
import { Button } from '../../components/Button';
import { Select } from '../../components/Select';
import { appContext } from '../../context/appContext';
import useEqExtinguisher from './hooks/useEqExtinguisher';
import useEqInspectionCmi from './hooks/useEqInspectionCmi';
import EqCmiTestTable from './components/tables/EqCmiTestTable';
import useEqLoadRatio from './hooks/EmergencyVehicles/useEqLoadRatio';
import EqTestCmiQRCode from './components/tables/QRCode/EqTestCmiQRCode';
import EqExtinguisherTable from './components/tables/EqExtinguisherTable';
import EqEqGovernanceValve from './components/tables/EqEqGovernanceValve';
import EqCmiInspectionTable from './components/tables/EqCmiInspectionTable';
import EqLoadRatioQRCode from './components/tables/QRCode/EqLoadRatioQRCode';
import EqGenerateQRCodeModal from './components/modals/EqGenerateQRCodeModal';
import EqExtinguisherQRCode from './components/tables/QRCode/EqExtinguisherQRCode';
import useEqGeneralChecklist from './hooks/EmergencyVehicles/useEqGeneralChecklist';
import EqInspectionCmiQRCode from './components/tables/QRCode/EqInspectionCmiQRCode';
import EqLoadRatioTable from './components/tables/EmergencyVehicles/EqLoadRatioTable';
import EqGovernanceValveQRCode from './components/tables/QRCode/EqGovernanceValveQRCode';
import EqGeneralChecklistQRCode from './components/tables/QRCode/EqGeneralChecklistQRCode';
import EqGeneralChecklistTable from './components/tables/EmergencyVehicles/EqGeneralChecklistTable';

const Equipments = () => {
  const { formularios, submenu, isLoadingFormularios } = appContext();

  const localSite = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');
  const navigate = useNavigate();
  const params = useParams();

  const [formValue, setFormValue] = useState<string>(equipments_value ?? 'Extintores');
  const [openModalGenerateQRCode, setOpenModalGenerateQRCode] = useState<boolean | null>(null);

  const { handleExportEqTestCmiToExcel } = useEqTestCmi();
  const { handleExportExtinguisherToExcel } = useEqExtinguisher();
  const { handleExportEqInspectionCmiToExcel } = useEqInspectionCmi();
  const { handleExportEqGeneralChecklistToExcel } = useEqGeneralChecklist();
  const { handleExportEqLoadRatioToExcel } = useEqLoadRatio();

  const filteredForms =
    formularios &&
    formularios.filter(
      (form) => (form.todos_sites === true || form.site.Title === localSite) && form.Title !== 'Veículos de emergência',
    );

  const filteredSubMenu =
    submenu && submenu.filter((form) => form.todos_sites === true || form.site.Title === localSite);

  const handleExportToExcel = () => {
    switch (formValue) {
      case 'extinguisher':
        handleExportExtinguisherToExcel();
        break;

      case 'cmi_test':
        handleExportEqTestCmiToExcel();
        break;

      case 'cmi_inspection':
        handleExportEqInspectionCmiToExcel();
        break;

      case 'general_checklist':
        handleExportEqGeneralChecklistToExcel();
        break;

      case 'scania':
        handleExportEqLoadRatioToExcel();
        break;

      case 's10':
        handleExportEqLoadRatioToExcel();
        break;

      case 'mercedes':
        handleExportEqLoadRatioToExcel();
        break;

      case 'van':
        handleExportEqLoadRatioToExcel();
        break;

      case 'iveco':
        handleExportEqLoadRatioToExcel();
        break;

      case 'sprinter':
        handleExportEqLoadRatioToExcel();
        break;
    }
  };

  useEffect(() => {
    if (params.id === undefined) {
      navigate(`/equipments/${formValue}`);
    }
  }, [formValue]);

  return (
    <LayoutBase showMenu>
      <div className="flex flex-col w-full justify-between bg-[#F1F1F1]">
        <div className="flex flex-col p-8">
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
                onValueChange={(value) => {
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

          {formValue === 'extinguisher' && <EqExtinguisherTable />}
          {formValue === 'valves' && <EqEqGovernanceValve />}
          {formValue === 'cmi_test' && <EqCmiTestTable />}
          {formValue === 'cmi_inspection' && <EqCmiInspectionTable />}

          {formValue === 'general_checklist' && <EqGeneralChecklistTable />}
          {formValue === 'scania' && <EqLoadRatioTable />}
          {formValue === 's10' && <EqLoadRatioTable />}
          {formValue === 'mercedes' && <EqLoadRatioTable />}
          {formValue === 'van' && <EqLoadRatioTable />}
          {formValue === 'iveco' && <EqLoadRatioTable />}
          {formValue === 'sprinter' && <EqLoadRatioTable />}
        </div>
      </div>

      {openModalGenerateQRCode && (
        <EqGenerateQRCodeModal open={openModalGenerateQRCode} onOpenChange={() => setOpenModalGenerateQRCode(null)}>
          {formValue === 'extinguisher' && <EqExtinguisherQRCode />}
          {formValue === 'cmi_test' && <EqTestCmiQRCode />}
          {formValue === 'cmi_inspection' && <EqInspectionCmiQRCode />}
          {formValue === 'valves' && <EqGovernanceValveQRCode />}

          {formValue === 'general_checklist' && <EqGeneralChecklistQRCode />}
          {formValue === 'scania' && <EqLoadRatioQRCode />}
          {formValue === 's10' && <EqLoadRatioQRCode />}
          {formValue === 'mercedes' && <EqLoadRatioQRCode />}
          {formValue === 'van' && <EqLoadRatioQRCode />}
          {formValue === 'iveco' && <EqLoadRatioQRCode />}
          {formValue === 'sprinter' && <EqLoadRatioQRCode />}
        </EqGenerateQRCodeModal>
      )}
    </LayoutBase>
  );
};

export default Equipments;
