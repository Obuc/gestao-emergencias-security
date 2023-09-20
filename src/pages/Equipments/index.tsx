import { useState } from 'react';
import * as XLSX from 'xlsx';
import { faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';

import LayoutBase from '../../layout/LayoutBase';
import { Button } from '../../components/Button';
import { appContext } from '../../context/appContext';
import useEqExtinguisher from './hooks/useEqExtinguisher';
import Select, { SelectItem } from '../../components/Select';
import useEqGovernanceValve from './hooks/useEqGovernanceValve';
import EqCmiTestTable from './components/tables/EqCmiTestTable';
import { EquipmentsExtinguisher } from './types/EquipmentsExtinguisher';
import EqExtinguisherTable from './components/tables/EqExtinguisherTable';
import EqEqGovernanceValve from './components/tables/EqEqGovernanceValve';
import EqExtinguisherQRCode from './components/tables/EqExtinguisherQRCode';
import EqGenerateQRCodeModal from './components/modals/EqGenerateQRCodeModal';

const Equipments = () => {
  const { formularios, isLoadingFormularios } = appContext();

  const localSite = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const [formValue, setFormValue] = useState<string>(equipments_value ?? 'Extintores');
  const [openModalGenerateQRCode, setOpenModalGenerateQRCode] = useState<boolean | null>(null);

  const { eqExtinguisher, isLoadingEqExtinguisher } = useEqExtinguisher();
  const { eqGovernanceValve, isLoadingEqGovernanceValve } = useEqGovernanceValve();

  const filteredForms =
    formularios &&
    formularios.filter(
      (form) => form.menu_equipamento === true || form.todos_sites === true || form.site.Title === localSite,
    );

  const handleExport = () => {
    const columns: (keyof EquipmentsExtinguisher)[] = ['Id', 'cod_extintor', 'local', 'pavimento', 'conforme', 'site'];

    const headerRow = columns.map((column) => column.toString());

    const dataFiltered = eqExtinguisher?.map((item) => {
      const newItem: { [key: string]: any } = {};
      columns.forEach((column) => {
        newItem[column] = item[column];
      });
      return newItem;
    });

    if (dataFiltered) {
      const dataArray = [headerRow, ...dataFiltered.map((item) => columns.map((column) => item[column]))];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(dataArray);

      XLSX.utils.book_append_sheet(wb, ws, '');
      XLSX.writeFile(wb, 'dados_excel.xlsx');
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
                className="w-[22.25rem]"
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
              </Select>
            </div>

            <div className="flex gap-2">
              <Button.Root className="min-w-[14.0625rem] h-10" onClick={handleExport}>
                <Button.Label>Exportar Planilha</Button.Label>
                <Button.Icon icon={faDownload} />
              </Button.Root>

              <Button.Root className="w-[14.0625rem] h-10" fill onClick={() => setOpenModalGenerateQRCode(true)}>
                <Button.Label>Gerar QRCode</Button.Label>
                <Button.Icon icon={faExpand} />
              </Button.Root>
            </div>
          </div>

          <div id="table-equipment">
            {formValue === 'Extintores' && <EqExtinguisherTable />}
            {formValue === 'Válvulas de Governo' && <EqEqGovernanceValve />}
            {formValue === 'Teste CMI' && <EqCmiTestTable />}
          </div>
        </div>
      </div>

      {openModalGenerateQRCode && (
        <EqGenerateQRCodeModal open={openModalGenerateQRCode} onOpenChange={() => setOpenModalGenerateQRCode(null)}>
          {formValue === 'Extintores' && (
            <EqExtinguisherQRCode data={eqExtinguisher} isLoading={isLoadingEqExtinguisher} />
          )}

          {formValue === 'Válvulas de Governo' && (
            <EqExtinguisherQRCode data={eqGovernanceValve} isLoading={isLoadingEqGovernanceValve} />
          )}
        </EqGenerateQRCodeModal>
      )}
    </LayoutBase>
  );
};

export default Equipments;
