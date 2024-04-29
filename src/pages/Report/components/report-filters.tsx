import useParams from '@/hooks/useParams';
import { Button } from '@/components/Button';
import { Popover } from '@/components/Popover';
import TextField from '@/components/TextField';
import DatePicker from '@/components/DatePicker';
import { IReportsFiltersProps } from '../types/report.types';
import { SelectAutoComplete } from '@/components/SelectAutocomplete';

interface ReportFilters {
  tempTableFilters: IReportsFiltersProps;
  setTempTableFilters: React.Dispatch<React.SetStateAction<IReportsFiltersProps>>;
  handleRemoveAllFilters: () => void;
  countAppliedFilters: () => number;
  handleApplyFilters: () => void;
}

export const ReportFilters = ({
  tempTableFilters,
  setTempTableFilters,
  handleRemoveAllFilters,
  countAppliedFilters,
  handleApplyFilters,
}: ReportFilters) => {
  const { tipoLaudo } = useParams();

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
            id="id"
            name="id"
            label="Número"
            value={tempTableFilters.id || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, id: event.target.value }));
            }}
          />

          <DatePicker
            name="startDate"
            label="Data Inicial"
            value={tempTableFilters.startDate ? new Date(tempTableFilters.startDate) : null}
            onChange={(date: any) => setTempTableFilters((prev) => ({ ...prev, startDate: date }))}
          />

          {tempTableFilters.startDate && (
            <DatePicker
              name="endDate"
              label="Data Final"
              value={tempTableFilters.endDate ? new Date(tempTableFilters.endDate) : null}
              onChange={(date: any) => setTempTableFilters((prev) => ({ ...prev, endDate: date }))}
            />
          )}

          <DatePicker
            name="emission"
            label="Emissão Laudo"
            value={tempTableFilters.emission ? new Date(tempTableFilters.emission) : null}
            onChange={(date: any) => setTempTableFilters((prev) => ({ ...prev, emission: date }))}
          />

          <DatePicker
            name="validity"
            label="Validade"
            value={tempTableFilters.validity ? new Date(tempTableFilters.validity) : null}
            onChange={(date: any) => setTempTableFilters((prev) => ({ ...prev, validity: date }))}
          />

          <SelectAutoComplete.Fixed
            id="reportType"
            name="reportType"
            label="Tipo de Laudo"
            isSearchable
            isLoading={tipoLaudo.isLoading}
            value={tempTableFilters.reportType}
            options={tipoLaudo.data?.map((item) => ({
              value: String(item.Id),
              label: String(item.Title),
            }))}
            onChange={(value: any) => {
              setTempTableFilters((prev) => ({ ...prev, reportType: value }));
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
