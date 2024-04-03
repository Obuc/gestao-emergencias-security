interface ITableFilterProps {
  children: React.ReactNode;
}

const TableFilter = ({ children }: ITableFilterProps) => {
  return (
    <div className="w-full h-[6.25rem] bg-[#FCFCFC] mb-4 shadow-xs-primary-app py-[.625rem] px-4 flex flex-col gap-2">
      <span className="text-lg text-primary-font font-medium">Filtros</span>
      <div className="flex justify-between">{children}</div>
    </div>
  );
};

export default TableFilter;
