import useParams from '@/hooks/useParams';
import { Button } from '@/components/Button';
import { Popover } from '@/components/Popover';
import TextField from '@/components/TextField';
import DatePicker from '@/components/DatePicker';
import { IGovernanceValveFiltersProps } from '../types/valve.types';
import { SelectAutoComplete } from '@/components/SelectAutocomplete';

interface IGovernanceValveFilters {
  tempTableFilters: IGovernanceValveFiltersProps;
  setTempTableFilters: React.Dispatch<React.SetStateAction<IGovernanceValveFiltersProps>>;
  handleRemoveAllFilters: () => void;
  countAppliedFilters: () => number;
  handleApplyFilters: () => void;
}

export const ValveFiltersBXO = ({
  tempTableFilters,
  setTempTableFilters,
  handleRemoveAllFilters,
  countAppliedFilters,
  handleApplyFilters,
}: IGovernanceValveFilters) => {
  const { predio } = useParams();

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
            label="Responsável"
            id="responsible"
            name="responsible"
            value={tempTableFilters.responsible || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, responsible: event.target.value }));
            }}
          />

          <TextField
            label="N° Registro"
            id="id"
            name="id"
            value={tempTableFilters.id || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, id: event.target.value }));
            }}
          />

          <TextField
            label="N° Válvula"
            id="valveNumber"
            name="valveNumber"
            value={tempTableFilters.valveNumber || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, valveNumber: event.target.value }));
            }}
          />

          <DatePicker
            label="Data Inicial"
            name="startDate"
            value={tempTableFilters.startDate ? new Date(tempTableFilters.startDate) : null}
            onChange={(date: any) => setTempTableFilters((prev) => ({ ...prev, startDate: date }))}
          />

          {tempTableFilters.startDate && (
            <DatePicker
              label="Data Final"
              name="endDate"
              value={tempTableFilters.endDate ? new Date(tempTableFilters.endDate) : null}
              onChange={(date: any) => setTempTableFilters((prev) => ({ ...prev, endDate: date }))}
            />
          )}

          <SelectAutoComplete.Fixed
            id="property"
            name="property"
            label="Prédio"
            isSearchable
            isLoading={predio.isLoading}
            value={tempTableFilters.property}
            options={predio.data?.map((item) => ({
              value: String(item.Id),
              label: String(item.Title),
            }))}
            onChange={(value: any) => {
              setTempTableFilters((prev) => ({ ...prev, property: value }));
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
