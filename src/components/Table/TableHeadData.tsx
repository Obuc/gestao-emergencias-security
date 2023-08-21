import { twMerge } from 'tailwind-merge';

interface ITableHeadDataProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeadData = ({ children, className }: ITableHeadDataProps) => {
  return <th className={twMerge('h-14 font-medium w-[3%] text-lg text-start', className)}>{children}</th>;
};
