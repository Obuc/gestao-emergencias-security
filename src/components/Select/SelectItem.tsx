import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { ISelectItemProps } from './Select';
import * as SelectRadix from '@radix-ui/react-select';

const SelectItem = forwardRef<HTMLDivElement, ISelectItemProps>(
  ({ children, className, isSelected, ...props }, forwardedRef) => {
    return (
      <SelectRadix.Item
        className={twMerge(
          'flex items-center h-6 pl-2 py-5 text-[#3E3E3E] select-none hover:bg-[#EDEDED] duration-300 outline-none ',
          isSelected ? 'bg-primary text-white' : '',
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

export default SelectItem;
