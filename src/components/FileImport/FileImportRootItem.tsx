import { ReactNode } from 'react';

interface IFilteImportRootItemProps {
  children: ReactNode;
}

export const FilteImportRootItem = ({ children }: IFilteImportRootItemProps) => {
  return (
    <div className="w-full h-14 rounded border border-[#ECECEC] flex px-6 items-center gap-2 justify-between">
      {children}
    </div>
  );
};
