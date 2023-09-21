import { ReactNode } from 'react';

interface IFileImportContentProps {
  children: ReactNode;
}

export const FileImportContent = ({ children }: IFileImportContentProps) => {
  return <div className="flex gap-2">{children}</div>;
};
