interface ITableRootProps {
  children: React.ReactNode;
}

export const TableRoot = ({ children }: ITableRootProps) => {
  return (
    <table className="w-full h-full block bg-white text-primary border-spacing-y-2 p-px overflow-hidden relative ">
      {children}
    </table>
  );
};
