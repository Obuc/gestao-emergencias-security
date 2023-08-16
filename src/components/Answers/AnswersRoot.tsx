import { twMerge } from 'tailwind-merge';

interface IAnswersRootProps {
  className?: string;
  children: React.ReactNode;
  label: string;
}

export const AnswersRoot = ({ className, children, label }: IAnswersRootProps) => {
  return (
    <div className={twMerge('py-4', className)}>
      <span className="text-xl text-primary font-medium py-3">{label}</span>
      {children}
    </div>
  );
};
