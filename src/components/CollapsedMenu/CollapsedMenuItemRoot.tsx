import Tooltip from '../Tooltip';

interface ICollapsedMenuItemRootProps {
  children: React.ReactNode;
  label: string;
  isSub?: boolean;
}

export const CollapsedMenuItemRoot = ({ children, label, isSub }: ICollapsedMenuItemRootProps) => {
  return (
    <Tooltip label={label}>
      <div className={`flex flex-col ${isSub && 'ml-2'} h-12 cursor-pointer`}>{children}</div>
    </Tooltip>
  );
};
