interface ITableRootProps {
  children: React.ReactNode;
}

export const TableRoot = ({ children }: ITableRootProps) => {
  return (
    <table className="w-full h-full block bg-white text-primary border-spacing-y-2 p-px overflow-hidden relative">
      {children}
    </table>
  );
};

// min-[1100px]:h-[35.6rem] min-[1600px]:h-[41rem] min-[1800px]:h-[32rem]
