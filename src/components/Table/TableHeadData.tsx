import { twMerge } from 'tailwind-merge';

interface ITableHeadDataProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeadData = ({ children, className }: ITableHeadDataProps) => {
  return <th className={twMerge('h-20 font-medium w-[3%] text-lg text-center', className)}>{children}</th>;
};
