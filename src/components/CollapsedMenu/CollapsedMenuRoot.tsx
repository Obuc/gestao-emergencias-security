interface ICollapsedMenuRootProps {
  children: React.ReactNode;
}

export const CollapsedMenuRoot = ({ children }: ICollapsedMenuRootProps) => {
  return (
    <div className="min-w-[20rem] h-full overflow-y-scroll overflow-x-hidden bg-primary text-white">
      <div className="pt-8 ml-1">{children}</div>
    </div>
  );
};
