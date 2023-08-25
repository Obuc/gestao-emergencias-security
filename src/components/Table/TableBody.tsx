interface ITableBodyProps {
  children: React.ReactNode;
}

export const TableBody = ({ children }: ITableBodyProps) => {
  return <tbody className="w-full h-full">{children}</tbody>;
};
