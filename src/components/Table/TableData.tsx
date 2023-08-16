import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface ITableDataProps extends ComponentProps<'td'> {
  children: React.ReactNode;
  className?: string;
}

export const TableData = ({ children, className, ...props }: ITableDataProps) => {
  return (
    <td {...props} className={twMerge('text-center w-[1%]', className)}>
      {children}
    </td>
  );
};
