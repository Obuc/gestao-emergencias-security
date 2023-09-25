import { ComponentProps, ReactNode } from 'react';

interface IRadioGroupLabelProps extends ComponentProps<'label'> {
  children: ReactNode;
}

export const RadioGroupLabel = ({ children, ...props }: IRadioGroupLabelProps) => {
  return (
    <label {...props} className="text-primary leading-none h-full">
      {children}
    </label>
  );
};
