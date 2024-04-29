import { ComponentProps, ReactNode } from 'react';

interface IFileImportItemLabelProps extends ComponentProps<'a'> {
  children: ReactNode;
}

export const FileImportItemLabel = ({ children, ...props }: IFileImportItemLabelProps) => {
  return (
    <div className="whitespace-nowrap overflow-hidden">
      <a {...props} className="text-primary-font cursor-pointer overflow-hidden truncate ml-4 justify-self-start">
        {children}
      </a>
    </div>
  );
};
