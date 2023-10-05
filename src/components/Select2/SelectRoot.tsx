import { Skeleton } from '@mui/material';
import * as SelectRadix from '@radix-ui/react-select';

interface SelectProps extends SelectRadix.SelectProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

const SelectRoot = ({ children, isLoading, ...props }: SelectProps) => {
  return (
    <>
      {!isLoading && <SelectRadix.Root {...props}>{children}</SelectRadix.Root>}
      {isLoading && <Skeleton className="min-w-full outline-none py-2 pl-2 h-10" />}
    </>
  );
};

export default SelectRoot;
