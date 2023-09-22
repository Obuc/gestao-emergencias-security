import { ComponentProps } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IFileImportActionProps extends ComponentProps<'button'> {}

export const FileImportAction = ({ ...props }: IFileImportActionProps) => {
  return (
    <button
      {...props}
      type="button"
      className={`w-7 h-7 p-2 rounded-full flex justify-center items-center ${
        props.disabled ? 'bg-gray-100' : 'bg-[#EDEDED]'
      } hover:cursor-pointer`}
    >
      <FontAwesomeIcon icon={faXmark} className={`${props.disabled ? 'text-gray-300' : 'text-pink'}`} />
    </button>
  );
};
