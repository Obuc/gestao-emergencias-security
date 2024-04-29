import React from 'react';
import DataGrid, { Column, SortColumn } from 'react-data-grid';

import DataGridSortIndicator from './DataGridSortIndicator';
import DataGridNoRowsFalback from './DataGridNoRowsFalback';

interface CustomDataGridProps {
  columns: Column<any>[];
  mappedRows: any[];
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  sortColumns?: readonly SortColumn[];
  setSortColumns?: React.Dispatch<React.SetStateAction<readonly SortColumn[]>>;
}

const CustomDataGrid: React.FC<CustomDataGridProps> = ({
  columns,
  mappedRows,
  handleScroll,
  sortColumns,
  setSortColumns,
}) => {
  return (
    <DataGrid
      className="bg-white text-primary-font border-spacing-y-2 shadow-xs-primary-app
        h-full
        min-[1100px]:max-h-[35rem] min-[1300px]:max-h-[42.1875rem] min-[1500px]:max-h-[39.375rem] min-[1700px]:max-h-[48.125rem] min-[1800px]:max-h-[46.25rem] min-[2000px]:max-h-[53.4375rem]

        min-[1100px]:max-w-[92rem] min-[1400px]:max-w-[102.5rem] min-[1800px]:max-w-[112.5rem]
        min-w-full"
      columns={columns}
      rowClass={() =>
        'w-full pl-4 text-primary-font text-base shadow-xs-primary-app bg-white leading-[3.125rem] select-none outline-none border-b'
      }
      rowHeight={50} // 56
      headerRowHeight={50}
      rows={mappedRows}
      onScroll={handleScroll}
      defaultColumnOptions={{
        sortable: true,
        resizable: true,
      }}
      sortColumns={sortColumns}
      onSortColumnsChange={setSortColumns}
      renderers={{
        renderSortStatus(props) {
          return <DataGridSortIndicator {...props} />;
        },
        noRowsFallback: <DataGridNoRowsFalback />,
      }}
    />
  );
};

export default CustomDataGrid;
