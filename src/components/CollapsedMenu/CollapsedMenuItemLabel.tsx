interface ICollapsedMenuItemLabelProps {
  children: React.ReactNode;
  active?: boolean;
}

export const CollapsedMenuItemLabel = ({ children, active }: ICollapsedMenuItemLabelProps) => {
  return (
    <span className={`whitespace-nowrap flex-1 mr-2 ml-3 ${active ? 'font-semibold' : 'font-normal'} hover:font-semibold`}>
      {children}
    </span>
  );
};
