import { Indicator, RadioGroupIndicatorProps } from '@radix-ui/react-radio-group';

interface IRadioGroupIndicatorProps extends RadioGroupIndicatorProps {}

export const RadioGroupIndicator = ({ ...props }: IRadioGroupIndicatorProps) => {
  return (
    <Indicator
      {...props}
      className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[.6875rem] after:h-[.6875rem] after:rounded-[50%] after:bg-primary"
    />
  );
};
