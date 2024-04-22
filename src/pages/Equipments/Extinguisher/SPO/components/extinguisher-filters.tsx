import { Button } from '@/components/Button';
import TextField from '@/components/TextField';
import { Popover } from '@/components/Popover';
import { SelectAutoComplete } from '@/components/SelectAutocomplete';
import { ExtinguisherFiltersProps } from '../types/extinguisher.types';

interface IFilters {
  tempTableFilters: ExtinguisherFiltersProps;
  setTempTableFilters: React.Dispatch<React.SetStateAction<ExtinguisherFiltersProps>>;
  handleRemoveAllFilters: () => void;
  countAppliedFilters: () => number;
  handleApplyFilters: () => void;
}

const ExtinguisherFilters = ({
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
            id="id"
            name="id"
            value={tempTableFilters.id || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, id: event.target.value }));
            }}
          />

          <TextField
            label="Cód. Extintor"
            id="codExtintor"
            name="codExtintor"
            value={tempTableFilters.codExtintor || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, codExtintor: event.target.value }));
            }}
          />

          <TextField
            label="Prédio"
            id="predio"
            name="predio"
            value={tempTableFilters.predio || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, predio: event.target.value }));
            }}
          />

          <TextField
            label="Pavimento"
            id="pavimento"
            name="pavimento"
            value={tempTableFilters.pavimento || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, pavimento: event.target.value }));
            }}
          />

          <TextField
            label="Local"
            id="local"
            name="local"
            value={tempTableFilters.local || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, local: event.target.value }));
            }}
          />

          <TextField
            label="Tipo de extintor"
            id="tipo"
            name="tipo"
            value={tempTableFilters.tipo || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, tipo: event.target.value }));
            }}
          />

          <TextField
            label="Cód Local"
            id="cod_local"
            name="cod_local"
            value={tempTableFilters.cod_local || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, cod_local: event.target.value }));
            }}
          />

          <SelectAutoComplete.Fixed
            id="conforme"
            name="conforme"
            label="Conformidade"
            isSearchable
            value={tempTableFilters.conforme}
            options={[
              { value: 'Sim', label: 'Conforme' },
              { value: 'Não', label: 'Não Conforme' },
            ]}
            onChange={(value: any) => {
              setTempTableFilters((prev) => ({ ...prev, conforme: value }));
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

export default ExtinguisherFilters;
