interface ITableRootProps {
  children: React.ReactNode;
}

export const TableRoot = ({ children }: ITableRootProps) => {
  return (
    <div className="sticky top-0 bg-white z-10">
      <table className="w-full h-full block bg-white text-primary border-spacing-y-2 p-px overflow-hidden relative">
        {children}
      </table>
    </div>
  );
};
