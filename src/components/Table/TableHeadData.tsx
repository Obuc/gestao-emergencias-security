import { twMerge } from 'tailwind-merge';

interface ITableHeadDataProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeadData = ({ children, className }: ITableHeadDataProps) => {
  return <th className={twMerge('h-14 font-medium text-lg text-start w-[3%]', className)}>{children}</th>;
};
