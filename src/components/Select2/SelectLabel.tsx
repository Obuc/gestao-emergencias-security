import * as Label from '@radix-ui/react-label';

interface ISelectLabelProps {
  children: React.ReactNode;
  id: string;
}

const SelectLabel = ({ children, id }: ISelectLabelProps) => {
  return (
    <Label.Root className="text-primary text-base pb-2" htmlFor={id}>
      {children}
    </Label.Root>
  );
};

export default SelectLabel;
