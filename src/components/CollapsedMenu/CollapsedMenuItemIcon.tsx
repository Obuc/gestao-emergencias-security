interface ICollapsedMenuItemIconProps {
  icon: React.ElementType;
  active: boolean;
}

export const CollapsedMenuItemIcon = ({ icon: Icon, active }: ICollapsedMenuItemIconProps) => (
  <Icon className={` text-xl justify-self-start mr-4 ${active ? 'fill-white' : 'fill-[#C0C0C0]'}`} />
);
