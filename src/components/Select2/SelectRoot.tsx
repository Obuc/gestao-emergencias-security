interface ISelectRootProps {
  children: React.ReactNode;
}

const SelectRoot = ({ children }: ISelectRootProps) => {
  return <div className="flex w-full h-full flex-col">{children}</div>;
};

export default SelectRoot;
