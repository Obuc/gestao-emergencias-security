import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import * as SelectRadix from '@radix-ui/react-select';

import Checkbox from '../Checkbox';
import { ISelectItemProps } from './Select';

const SelectItem = forwardRef<HTMLDivElement, ISelectItemProps>(
  ({ children, className, isSelected, multi, ...props }, forwardedRef) => {
    return (
      <SelectRadix.Item
        className={twMerge(
          'flex items-center h-6 pl-2 py-5 text-[#3E3E3E] select-none hover:bg-[#EDEDED] duration-300 outline-none overflow-hidden whitespace-nowrap overflow-ellipsis max-w-full',
          isSelected ? 'bg-[#EDEDED]' : '',
          className,
        )}
        ref={forwardedRef}
        {...props}
      >
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-full mr-3">
          <div>{multi && <Checkbox checked={isSelected} />}</div>

          <span title={children?.toString()} className="max-w-full text-ellipsis overflow-hidden text-sm">
            {children}
          </span>
        </div>
      </SelectRadix.Item>
    );
  },
);

export default SelectItem;
