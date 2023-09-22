import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { Button } from '../../components/Button';
import LayoutBase from '../../layout/LayoutBase';
import ReportsTable from './components/tables/ReportsTable';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const navigate = useNavigate();

  const handleAddReport = () => {
    navigate(`/reports/new`);
  };

  return (
    <LayoutBase showMenu>
      <div className="flex flex-col w-full justify-between bg-[#F1F1F1]">
        <div className="flex flex-col p-8">
          <div className="flex pb-8 items-center w-full justify-start">
            <Button.Root className="min-w-[14.0625rem] h-10" fill onClick={handleAddReport}>
              <Button.Label>Adicionar Laudo</Button.Label>
              <Button.Icon icon={faPlus} />
            </Button.Root>
          </div>

          <ReportsTable />
        </div>
      </div>
    </LayoutBase>
  );
};

export default Report;
