import * as SelectRadix from '@radix-ui/react-select';
import { twMerge } from 'tailwind-merge';

interface ISelectPortalProps {
  children: React.ReactNode;
  className?: string;
}

const SelectPortal = ({ children, className }: ISelectPortalProps) => {
  return (
    <SelectRadix.Portal>
      <SelectRadix.Content
        position="popper"
        className={twMerge('overflow-hidden z-10 bg-white shadow-xs-primary-app', className)}
      >
        <SelectRadix.Viewport className="fill-white">
          <SelectRadix.Group>{children}</SelectRadix.Group>
        </SelectRadix.Viewport>
        <SelectRadix.Arrow className="py-1" />
      </SelectRadix.Content>
    </SelectRadix.Portal>
  );
};

export default SelectPortal;
