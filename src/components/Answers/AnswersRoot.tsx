import { Skeleton } from '@mui/material';
import { twMerge } from 'tailwind-merge';

interface IAnswersRootProps {
  className?: string;
  children: React.ReactNode;
  label: string;
  isLoading?: boolean;
}

export const AnswersRoot = ({ className, children, label, isLoading }: IAnswersRootProps) => {
  return (
    <div className={twMerge('py-4', className)}>
      {!isLoading && <span className="text-xl text-primary font-medium py-3">{label}</span>}
      {isLoading && <Skeleton className="py-3" />}

      {children}
    </div>
  );
};
