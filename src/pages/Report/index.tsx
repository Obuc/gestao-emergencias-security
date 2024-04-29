import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { Button } from '../../components/Button';
import LayoutBase from '../../layout/LayoutBase';
import { useReports } from './hooks/report.hook';
import { ReportsTable } from './components/report-table';
import { ReportFilters } from './components/report-filters';

const Report = () => {
  const navigate = useNavigate();
  const localSite = localStorage.getItem('user_site');
  const localSiteLowerCase = localSite?.toLocaleLowerCase();

  const {
    countAppliedFilters,
    handleApplyFilters,
    handleRemoveAllFilters,
    mutateRemove,
    reportData,
    setSortColumns,
    setTempTableFilters,
    sortColumns,
    tempTableFilters,
  } = useReports();

  const handleAddReport = () => {
    navigate(`/${localSiteLowerCase}/reports/new`);
  };

  useEffect(() => {
    if (localSite === null) {
      navigate('/');
    }
  }, [localSite]);

  return (
    <LayoutBase showMenu>
      <div className="flex flex-col w-full justify-between bg-[#F1F1F1]">
        <div className="flex flex-col p-8">
          <div className="flex pb-8 items-center w-full justify-end gap-2">
            <Button.Root className="min-w-[14.0625rem] h-10" fill onClick={handleAddReport}>
              <Button.Label>Adicionar Laudo</Button.Label>
              <Button.Icon icon={faPlus} />
            </Button.Root>

            <ReportFilters
              countAppliedFilters={countAppliedFilters}
              handleApplyFilters={handleApplyFilters}
              handleRemoveAllFilters={handleRemoveAllFilters}
              setTempTableFilters={setTempTableFilters}
              tempTableFilters={tempTableFilters}
            />
          </div>

          <ReportsTable
            reportData={reportData}
            mutateRemove={mutateRemove}
            setSortColumns={setSortColumns}
            sortColumns={sortColumns}
          />
        </div>
      </div>
    </LayoutBase>
  );
};

export default Report;
