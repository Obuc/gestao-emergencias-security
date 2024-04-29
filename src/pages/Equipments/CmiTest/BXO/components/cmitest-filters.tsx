import useParams from '@/hooks/useParams';
import { Button } from '@/components/Button';
import TextField from '@/components/TextField';
import { Popover } from '@/components/Popover';
import { CmiTestFiltersProps } from '../types/cmitest.types';
import { SelectAutoComplete } from '@/components/SelectAutocomplete';

interface IFilters {
  tempTableFilters: CmiTestFiltersProps;
  setTempTableFilters: React.Dispatch<React.SetStateAction<CmiTestFiltersProps>>;
  handleRemoveAllFilters: () => void;
  countAppliedFilters: () => number;
  handleApplyFilters: () => void;
}

export const CmiTestFilters = ({
  tempTableFilters,
  setTempTableFilters,
  handleRemoveAllFilters,
  countAppliedFilters,
  handleApplyFilters,
}: IFilters) => {
  const { pavimento } = useParams();

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
            label="Cód. QRCode"
            id="cod_qrcode"
            name="cod_qrcode"
            value={tempTableFilters.cod_qrcode || ''}
            onChange={(event) => {
              setTempTableFilters((prev) => ({ ...prev, cod_qrcode: event.target.value }));
            }}
          />

          <SelectAutoComplete.Fixed
            id="pavement"
            name="pavement"
            label="Pavimento"
            isSearchable
            value={tempTableFilters.pavement}
            options={pavimento.data?.map((item) => ({
              value: item.Id,
              label: item.Title,
            }))}
            onChange={(value: any) => {
              setTempTableFilters((prev) => ({ ...prev, pavement: value }));
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
