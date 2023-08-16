import { twMerge } from 'tailwind-merge';

interface IAnswersContentProps {
  className?: string;
  children: React.ReactNode;
}

export const AnswersContent = ({ className, children }: IAnswersContentProps) => {
  return (
    <div className={twMerge('w-full bg-white shadow-xs-app py-4 px-3 grid grid-cols-2 gap-2', className)}>
      {children}
    </div>
  );
};
