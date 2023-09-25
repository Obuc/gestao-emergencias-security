import { ReactNode } from 'react';
import { RadioGroupProps, Root } from '@radix-ui/react-radio-group';

interface IRadioGroupRootProps extends RadioGroupProps {
  children: ReactNode;
}

export const RadioGroupRoot = ({ children, ...props }: IRadioGroupRootProps) => {
  return (
    <Root
      {...props}
      className={`
      ${props.orientation === 'horizontal' && 'flex justify-center items-center gap-4'}
      ${props.orientation === 'vertical' && 'flex flex-col justify-center items-center gap-4'}
      `}
    >
      {children}
    </Root>
  );
};
