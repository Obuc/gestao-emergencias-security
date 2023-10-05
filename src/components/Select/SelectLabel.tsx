import * as SelectRadix from '@radix-ui/react-select';

interface ISelectLabelProps {
  children: React.ReactNode;
}

const SelectLabel = ({ children }: ISelectLabelProps) => {
  return <SelectRadix.Label className="text-primary font-medium py-3 pl-2">{children}</SelectRadix.Label>;
};

export default SelectLabel;
