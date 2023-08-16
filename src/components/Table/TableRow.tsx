import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface ITableRowProps extends ComponentProps<'tr'> {
  children: React.ReactNode;
  className?: string;
}

export const TableRow = ({ children, className, ...props }: ITableRowProps) => {
  return (
    <tr {...props} className={twMerge('h-[4.375rem] text-base shadow-xs-primary-app bg-white', className)}>
      {children}
    </tr>
  );
};

//className="h-14 shadow-xsm text-left bg-white hover:bg-[#E9F0F3] hover:cursor-pointer duration-200"
