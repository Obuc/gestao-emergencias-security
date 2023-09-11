import * as XLSX from 'xlsx';
import { getDate, getMonth, getYear } from 'date-fns';

interface IexportTableToSlsxProps {
  tableId: string;
  type: string;
  formValue: string;
}

export const exportTableToXlsx = ({ type, formValue, tableId }: IexportTableToSlsxProps) => {
  const dataAtual = new Date();

  const dia = getDate(dataAtual);
  const mes = getMonth(dataAtual) + 1;
  const ano = getYear(dataAtual);

  // "DD/MM/AAAA"
  const dataFormatada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;

  const table = document.getElementById(tableId);
  const ws = XLSX.utils.table_to_sheet(table);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${type} - ${formValue}`);
  XLSX.writeFile(wb, `${type} - ${formValue} ${dataFormatada}.xlsx`);
};
