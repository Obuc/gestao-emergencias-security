import { Button } from '@/components/Button';
import TextField from '@/components/TextField';
import { Popover } from '@/components/Popover';
import { LoadRatioFiltersProps } from '../types/loadratio.types';
import { SelectAutoComplete } from '@/components/SelectAutocomplete';

interface IFilters {
  tempTableFilters: LoadRatioFiltersProps;
  setTempTableFilters: React.Dispatch<React.SetStateAction<LoadRatioFiltersProps>>;
  handleRemoveAllFilters: () => void;
  countAppliedFilters: () => number;
  handleApplyFilters: () => void;
}

export const LoadRatioFilters = ({
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
            label="Placa"
            id="plate"
            name="plate"
            value={tempTableFilters.plate || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, plate: event.target.value }));
            }}
          />

          <SelectAutoComplete.Fixed
            id="conformity"
            name="conformity"
            label="Conformidade"
            isSearchable
            value={
              tempTableFilters.conformity
                ? {
                    value: tempTableFilters.conformity,
                    label: tempTableFilters.conformity,
                  }
                : { value: '', label: '' }
            }
            options={[
              { value: 'Conforme', label: 'Conforme' },
              { value: 'Não Conforme', label: 'Não Conforme' },
            ]}
            onChange={(value: any) => {
              setTempTableFilters((prev) => ({ ...prev, conformity: value.value }));
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
