import { twMerge } from 'tailwind-merge';

interface ITableRowProps {
  children: React.ReactNode;
  className?: string;
}

export const TableRow = ({ children, className }: ITableRowProps) => {
  return <tr className={twMerge('h-[4.375rem] text-base shadow-xs-primary-app bg-white', className)}>{children}</tr>;
};

//className="h-14 shadow-xsm text-left bg-white hover:bg-[#E9F0F3] hover:cursor-pointer duration-200"
