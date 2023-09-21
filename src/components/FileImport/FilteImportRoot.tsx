import { ComponentProps, ReactNode } from 'react';

interface IFilteImportRootProps extends ComponentProps<'div'> {
  children: ReactNode;
}

export const FilteImportRoot = ({ children, ...props }: IFilteImportRootProps) => {
  return (
    <div {...props} className="flex flex-col gap-2 w-[33rem]">
      {children}
    </div>
  );
};
