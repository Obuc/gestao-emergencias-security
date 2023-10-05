import { twMerge } from 'tailwind-merge';

interface ISelectContainerProps {
  children: React.ReactNode;
  className?: string;
}

const SelectContainer = ({ children, className }: ISelectContainerProps) => {
  return <div className={twMerge('flex w-full h-full flex-col', className)}>{children}</div>;
};

export default SelectContainer;
