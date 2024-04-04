import { Button } from '../../../../../components/Button';
import { IHydrantFiltersProps } from '../types/HydrantSPO';
import { Popover } from '../../../../../components/Popover';
import TextField from '../../../../../components/TextField';
import DatePicker from '../../../../../components/DatePicker';
import { SelectAutoComplete } from '../../../../../components/SelectAutocomplete';

interface IHydrantFilters {
  tempTableFilters: IHydrantFiltersProps;
  setTempTableFilters: React.Dispatch<React.SetStateAction<IHydrantFiltersProps>>;
  handleRemoveAllFilters: () => void;
  countAppliedFilters: () => number;
  handleApplyFilters: () => void;
}

const HydrantFiltersSPO = ({
  tempTableFilters,
  setTempTableFilters,
  handleRemoveAllFilters,
  countAppliedFilters,
  handleApplyFilters,
}: IHydrantFilters) => {
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
            label="Hidrante"
            id="hydrantId"
            name="hydrantId"
            value={tempTableFilters.hydrantId || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, hydrantId: event.target.value }));
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

          <TextField
            label="Lacre"
            id="seal"
            name="seal"
            value={tempTableFilters.seal || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, seal: event.target.value }));
            }}
          />

          <TextField
            label="Mangueiras"
            id="hoses"
            name="hoses"
            value={tempTableFilters.hoses || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, hoses: event.target.value }));
            }}
          />

          <TextField
            label="Local"
            id="place"
            name="place"
            value={tempTableFilters.place || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, place: event.target.value }));
            }}
          />

          <TextField
            label="Pavimento"
            id="pavement"
            name="pavement"
            value={tempTableFilters.pavement || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, pavement: event.target.value }));
            }}
          />

          <TextField
            label="Local Específico"
            id="specificLocation"
            name="specificLocation"
            value={tempTableFilters.specificLocation || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, specificLocation: event.target.value }));
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

export default HydrantFiltersSPO;
