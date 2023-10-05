import * as SelectRadix from '@radix-ui/react-select';

interface ISelectItemLabelProps {
  children: React.ReactNode;
}

const SelectItemLabel = ({ children }: ISelectItemLabelProps) => {
  return <SelectRadix.Label className="text-primary font-medium py-3 pl-2">{children}</SelectRadix.Label>;
};

export default SelectItemLabel;
