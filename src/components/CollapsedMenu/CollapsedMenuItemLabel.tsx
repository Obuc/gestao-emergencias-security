interface ICollapsedMenuItemLabelProps {
  children: React.ReactNode;
  active?: boolean;
}

export const CollapsedMenuItemLabel = ({ children, active }: ICollapsedMenuItemLabelProps) => {
  return (
    <span className={`whitespace-nowrap flex-1 mr-2 ${active ? 'font-normal' : 'font-light'} hover:font-normal`}>
      {children}
    </span>
  );
};
