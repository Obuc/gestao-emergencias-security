import { ReactNode } from 'react';
import { Item, RadioGroupItemProps } from '@radix-ui/react-radio-group';

interface IRadioGroupItemProps extends RadioGroupItemProps {
  children: ReactNode;
}

export const RadioGroupItem = ({ children, ...props }: IRadioGroupItemProps) => {
  return (
    <Item
      {...props}
      className="bg-white w-6 h-6 rounded-full shadow-md-app hover:bg-primary-opacity focus:shadow-2xl outline-none cursor-default"
    >
      {children}
    </Item>
  );
};
