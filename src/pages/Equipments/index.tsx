import { useState } from 'react';
import { faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';

import LayoutBase from '../../layout/LayoutBase';
import { Button } from '../../components/Button';
import { appContext } from '../../context/appContext';
import Select, { SelectItem } from '../../components/Select';
import EquipmentsTable from './components/tables/EquipmentsTable';

const Equipments = () => {
  const { formularios, isLoadingFormularios } = appContext();
  const localSite = localStorage.getItem('user_site');
  const [formValue, setFormValue] = useState<string>('Extintores');

  const filteredForms =
    formularios && formularios.filter((form) => form.todos_sites === true || form.site.Title === localSite);

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
                onValueChange={(value) => setFormValue(value)}
              >
                {filteredForms?.map((form) => (
                  <SelectItem key={form.Id} value={form.Title}>
                    {form.Title}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex gap-2">
              <Button.Root className="w-[14.0625rem] h-10">
                <Button.Label>Exportar Planilha</Button.Label>
                <Button.Icon icon={faDownload} />
              </Button.Root>

              <Button.Root className="w-[14.0625rem] h-10" fill>
                <Button.Label>Gerar QRCode</Button.Label>
                <Button.Icon icon={faExpand} />
              </Button.Root>
            </div>
          </div>

          {formValue === 'Extintores' && <EquipmentsTable />}
        </div>
      </div>
    </LayoutBase>
  );
};

export default Equipments;
