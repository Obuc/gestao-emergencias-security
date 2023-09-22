import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faPaperclip } from '@fortawesome/free-solid-svg-icons';

interface IFileImportLabelProps {
  children: ReactNode;
  error?: boolean;
}

export const FileImportLabel = ({ children, error }: IFileImportLabelProps) => {
  return (

      <label
        htmlFor="file"
        className={`flex rounded h-14 w-full cursor-pointer gap-4 justify-between text-primary px-6 items-center border-dashed ${
          error ? 'border-pink' : 'border-black/10'
        } border-2`}
      >
        <div className="flex gap-2 justify-center items-center">
          <FontAwesomeIcon icon={faCloudArrowUp} className="text-pink text-2xl" />
          {children}
        </div>

        <div className="w-8 h-8 rounded bg-pink flex justify-center items-center">
          <FontAwesomeIcon icon={faPaperclip} className="text-white text-2xl" />
        </div>
      </label>

  );
};
