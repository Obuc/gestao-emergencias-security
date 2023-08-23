import { Skeleton } from '@mui/material';

interface IAnswersContentItemProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const AnswersContentItem = ({ children, isLoading }: IAnswersContentItemProps) => {
  return (
    <div className="flex flex-1 flex-col">
      {!isLoading && children}
      {isLoading && (
        <div className="flex flex-1 flex-col">
          <Skeleton />

          <div className="flex gap-2">
            <Skeleton className="p-1.5 mt-1 w-[6.25rem]" />
          </div>
        </div>
      )}
    </div>
  );
};
