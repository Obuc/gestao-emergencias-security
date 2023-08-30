import { useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { Button } from '../../components/Button';
import LayoutBase from '../../layout/LayoutBase';
import { appContext } from '../../context/appContext';
import useExtinguisher from './hooks/useExtinguisher';
import Select, { SelectItem } from '../../components/Select';
import ExtinguisherTable from './components/tables/ExtinguisherTable';
import GovernanceValveTable from './components/tables/GovernanceValveTable';

const Records = () => {
  const { isLoading } = useExtinguisher();
  const { formularios, isLoadingFormularios } = appContext();
  const localSite = localStorage.getItem('user_site');
  const equipments_value = localStorage.getItem('equipments_value');

  const filteredForms =
    formularios && formularios.filter((form) => form.todos_sites === true || form.site.Title === localSite);

  const [formValue, setFormValue] = useState<string>(equipments_value ?? 'Extintores');

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

            <Button.Root className="min-w-[14.0625rem] h-10" disabled={isLoading}>
              <Button.Label>Exportar Planilha</Button.Label>
              <Button.Icon icon={faDownload} />
            </Button.Root>
          </div>

          {formValue === 'Extintores' && <ExtinguisherTable />}
          {formValue === 'Válvulas de Governo' && <GovernanceValveTable />}
        </div>
        {/* <div className="bg-white h-16 flex justify-end items-center px-10 py-5">
          <Pagination setPage={setPage} pageCount={pageCount} page={page} />
        </div> */}
      </div>
    </LayoutBase>
  );
};

export default Records;
