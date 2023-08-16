interface ITableRootProps {
  children: React.ReactNode;
}

export const TableRoot = ({ children }: ITableRootProps) => {
  return (
    <table className="w-full block overflow-hidden text-primary -mt-2 border-spacing-y-2 border-separate p-px">
      {children}
    </table>
  );
};

// min-[1100px]:h-[35.6rem] min-[1600px]:h-[41rem] min-[1800px]:h-[32rem]
