import { ComponentProps, ReactNode } from 'react';

interface IRadioGroupContentProps extends ComponentProps<'div'> {
  children: ReactNode;
}

export const RadioGroupContent = ({ children, ...props }: IRadioGroupContentProps) => {
  return (
    <div {...props} className="flex gap-4 items-center">
      {children}
    </div>
  );
};
