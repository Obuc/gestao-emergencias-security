import useParams from '@/hooks/useParams';
import { Button } from '@/components/Button';
import { Popover } from '@/components/Popover';
import TextField from '@/components/TextField';
import DatePicker from '@/components/DatePicker';
import { SelectAutoComplete } from '@/components/SelectAutocomplete';
import { IExtinguisherFiltersProps } from '../types/extinguisher.types';

interface IExtinguisherFilters {
  tempTableFilters: IExtinguisherFiltersProps;
  setTempTableFilters: React.Dispatch<React.SetStateAction<IExtinguisherFiltersProps>>;
  handleRemoveAllFilters: () => void;
  countAppliedFilters: () => number;
  handleApplyFilters: () => void;
}

export const ExtinguisherFiltersBXO = ({
  tempTableFilters,
  setTempTableFilters,
  handleRemoveAllFilters,
  countAppliedFilters,
  handleApplyFilters,
}: IExtinguisherFilters) => {
  const { local, pavimento } = useParams();

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
            placeholder="Responsável"
            value={tempTableFilters.responsible || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, responsible: event.target.value }));
            }}
          />

          <DatePicker
            label="Data Inicial"
            name="startDate"
            placeholder="Data Inicial"
            value={tempTableFilters.startDate ? new Date(tempTableFilters.startDate) : null}
            onChange={(date: any) => setTempTableFilters((prev) => ({ ...prev, startDate: date }))}
          />

          {tempTableFilters.startDate && (
            <DatePicker
              label="Data Final"
              name="endDate"
              placeholder="Data Final"
              value={tempTableFilters.endDate ? new Date(tempTableFilters.endDate) : null}
              onChange={(date: any) => setTempTableFilters((prev) => ({ ...prev, endDate: date }))}
            />
          )}

          <DatePicker
            label="Validade"
            name="expiration"
            placeholder="Validade"
            value={tempTableFilters.expiration ? new Date(tempTableFilters.expiration) : null}
            onChange={(date: any) => setTempTableFilters((prev) => ({ ...prev, expiration: date }))}
          />

          <TextField
            label="Cód. Extintor"
            id="extinguisherId"
            name="extinguisherId"
            placeholder="Cód. Extintor"
            value={tempTableFilters.extinguisherId || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, extinguisherId: event.target.value }));
            }}
          />

          <SelectAutoComplete.Fixed
            id="place"
            name="place"
            label="Local"
            isSearchable
            isLoading={local.isLoading}
            value={tempTableFilters.place}
            options={local.data?.map((item) => ({
              value: String(item.Id),
              label: String(item.Title),
            }))}
            onChange={(value: any) => {
              setTempTableFilters((prev) => ({ ...prev, place: value }));
            }}
          />

          <SelectAutoComplete.Fixed
            id="pavement"
            name="pavement"
            label="Pavimento"
            isSearchable
            isLoading={pavimento.isLoading}
            value={tempTableFilters.pavement}
            options={pavimento.data?.map((item) => ({
              value: String(item.Id),
              label: String(item.Title),
            }))}
            onChange={(value: any) => {
              setTempTableFilters((prev) => ({ ...prev, pavement: value }));
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
