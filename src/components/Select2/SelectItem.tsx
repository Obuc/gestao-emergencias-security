import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import * as SelectRadix from '@radix-ui/react-select';

interface ISelectItemProps extends SelectRadix.SelectItemProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectItem = forwardRef<HTMLDivElement, ISelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <SelectRadix.Item
        className={twMerge(
          'flex items-center h-6 pl-2 py-5 text-[#3E3E3E] select-none hover:bg-[#EDEDED] duration-300 outline-none ',
          className,
        )}
        ref={forwardedRef}
        {...props}
      >
        <SelectRadix.ItemText>{children}</SelectRadix.ItemText>
      </SelectRadix.Item>
    );
  },
);
