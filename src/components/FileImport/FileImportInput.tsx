import { ComponentProps } from 'react';

interface IFileImportInputProps extends ComponentProps<'input'> {}

export const FileImportInput = ({ ...props }: IFileImportInputProps) => {
  return <input {...props} id="file" type="file" className="hidden" />;
};
