import { Skeleton } from '@mui/material';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { Button } from '../../components/Button';
import LayoutBase from '../../layout/LayoutBase';
import { appContext } from '../../context/appContext';
import useExtinguisher from './hooks/useExtinguisher';
import Select, { SelectItem } from '../../components/Select';
import ExtinguisherTable from './components/tables/ExtinguisherTable';

const Records = () => {
  const { isLoading } = useExtinguisher();
  const { formularios, isLoadingFormularios } = appContext();

  return (
    <LayoutBase showMenu>
      <div className="flex flex-col w-full justify-between bg-[#F1F1F1]">
        <div className="flex flex-col p-8">
          <div className="flex pb-8 items-center w-full justify-between">
            <div className="flex gap-2 flex-col">
              <label htmlFor="state_id" className="text-lg text-primary font-medium">
                Selecionar formulário
              </label>
              {isLoadingFormularios && <Skeleton width="22.25rem" height="2.5rem" />}
              {!isLoadingFormularios && (
                <Select disabled={isLoadingFormularios} id="state_id" name="state_id" className="w-[22.25rem]">
                  {formularios &&
                    formularios.map((form) => (
                      <SelectItem key={form.Id} value={form.Title}>
                        {form.Title}
                      </SelectItem>
                    ))}
                </Select>
              )}
            </div>

            {isLoading && <Skeleton width="14rem" height="2.5rem" />}
            {!isLoading && (
              <Button.Root className="w-[14.0625rem] h-10">
                <Button.Label>Exportar Planilha</Button.Label>
                <Button.Icon icon={faDownload} />
              </Button.Root>
            )}
          </div>

          <ExtinguisherTable />
        </div>
        <div className="bg-white h-16 flex justify-end items-center px-10 py-5">
          {/* <Pagination setPage={setPage} pageCount={pageCount} page={page} /> */}
        </div>
      </div>

      {/* {newRequest && <LossesModal open={newRequest} onOpenChange={handleNewRequest} />} */}
    </LayoutBase>
  );
};

export default Records;
