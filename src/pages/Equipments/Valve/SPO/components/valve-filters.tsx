import { Button } from '@/components/Button';
import TextField from '@/components/TextField';
import { Popover } from '@/components/Popover';
import { ValveFiltersProps } from '../types/valve.types';
import { SelectAutoComplete } from '@/components/SelectAutocomplete';

interface IFilters {
  tempTableFilters: ValveFiltersProps;
  setTempTableFilters: React.Dispatch<React.SetStateAction<ValveFiltersProps>>;
  handleRemoveAllFilters: () => void;
  countAppliedFilters: () => number;
  handleApplyFilters: () => void;
}

const ValveFilters = ({
  tempTableFilters,
  setTempTableFilters,
  handleRemoveAllFilters,
  countAppliedFilters,
  handleApplyFilters,
}: IFilters) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <div>
          <Button.Root bgcolor="#FFF" className="min-w-[7.5rem] h-10">
            <Button.Label>Filtros</Button.Label>
            <span className="w-6 h-6 rounded bg-[#9F9F9F] text-[#FDFDFD] flex justify-center items-center">
              {countAppliedFilters()}
            </span>
          </Button.Root>
        </div>
      </Popover.Trigger>

      <Popover.Content>
        <h1 className="text-xl text-primary-font-font font-semibold">Filtros</h1>

        <div className="flex flex-col gap-2 py-6">
          <TextField
            label="ID"
            id="Id"
            name="Id"
            value={tempTableFilters.Id || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, Id: event.target.value }));
            }}
          />

          <TextField
            label="Cód. Válvula"
            id="Codigo"
            name="Codigo"
            value={tempTableFilters.Codigo || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, Codigo: event.target.value }));
            }}
          />

          <TextField
            label="Prédio"
            id="Predio"
            name="Predio"
            value={tempTableFilters.Predio || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, Predio: event.target.value }));
            }}
          />

          <TextField
            label="Local"
            id="LocEsp"
            name="LocEsp"
            value={tempTableFilters.LocEsp || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, LocEsp: event.target.value }));
            }}
          />

          <TextField
            label="Cód Local"
            id="numero_etiqueta"
            name="numero_etiqueta"
            value={tempTableFilters.numero_etiqueta || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, numero_etiqueta: event.target.value }));
            }}
          />

          <SelectAutoComplete.Fixed
            id="Conforme"
            name="Conforme"
            label="Conformidade"
            isSearchable
            value={tempTableFilters.Conforme}
            options={[
              { value: 'Sim', label: 'Conforme' },
              { value: 'Não', label: 'Não Conforme' },
            ]}
            onChange={(value: any) => {
              setTempTableFilters((prev) => ({ ...prev, Conforme: value }));
            }}
          />
        </div>

        <div className="flex w-full flex-col gap-4">
          <Button.Root fill className="min-w-[10rem] h-10" onClick={handleApplyFilters}>
            <Button.Label>Aplicar</Button.Label>
          </Button.Root>

          <Button.Root className="min-w-[10rem] h-10" onClick={handleRemoveAllFilters}>
            <Button.Label>Limpar Filtros</Button.Label>
          </Button.Root>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ValveFilters;
