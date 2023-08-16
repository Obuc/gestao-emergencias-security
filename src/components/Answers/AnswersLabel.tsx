import { twMerge } from 'tailwind-merge';

interface IAnswersLabelProps {
  className?: string;
  label: string;
}

export const AnswersLabel = ({ className, label }: IAnswersLabelProps) => {
  return <div className={twMerge('flex flex-1 flex-col', className)}>{label}</div>;
};
