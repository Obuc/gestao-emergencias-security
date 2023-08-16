import { twMerge } from 'tailwind-merge';

interface ITableDataProps {
  children: React.ReactNode;
  className?: string;
}

export const TableData = ({ children, className }: ITableDataProps) => {
  return <td className={twMerge('text-center w-[1%]', className)}>{children}</td>;
};
