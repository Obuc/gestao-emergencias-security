import { twMerge } from 'tailwind-merge';

interface ITableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody = ({ children, className }: ITableBodyProps) => {
  return <tbody className={twMerge('w-full h-full', className)}>{children}</tbody>;
};
