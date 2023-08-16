import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { Button } from '../../components/Button';
import LayoutBase from '../../layout/LayoutBase';
import Select, { SelectItem } from '../../components/Select';
import ExtinguisherTable from './components/tables/ExtinguisherTable';

const Records = () => {
  return (
    <LayoutBase showMenu>
      <div className="flex flex-col w-full justify-between bg-[#F1F1F1]">
        <div className="flex flex-col p-8">
          <div className="flex pb-8 items-center w-full justify-between">
            <Select id="state_id" name="state_id" label="Selecionar Formulário" className="w-[21.875rem]">
              <SelectItem value="1">Teste</SelectItem>
            </Select>

            <Button.Root className="w-[14.0625rem] h-10">
              <Button.Label>Exportar Planilha</Button.Label>
              <Button.Icon icon={faDownload} />
            </Button.Root>
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
