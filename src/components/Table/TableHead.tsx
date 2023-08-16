interface ITableHeadProps {
  children: React.ReactNode;
}

export const TableHead = ({ children }: ITableHeadProps) => {
  return <thead className="h-14 text-lg shadow-xs-primary-app bg-white">{children}</thead>;
};
