interface ICollapsedMenuRootProps {
  children: React.ReactNode;
}

export const CollapsedMenuRoot = ({ children }: ICollapsedMenuRootProps) => {
  return (
    <div className="min-w-[17.5rem] h-full bg-[#0C2A3A] text-white">
      <div className="pt-8 ml-1">{children}</div>
    </div>
  );
};
