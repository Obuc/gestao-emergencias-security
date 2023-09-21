import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage, faFilePdf } from '@fortawesome/free-solid-svg-icons';

interface IFileImportIconProps {
  fileType: string;
}

const isImageFile = (fileType: string) => {
  const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
  return imageMimeTypes.includes(fileType);
};

const isDocumentFile = (fileType: string) => {
  const documentMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];
  return documentMimeTypes.includes(fileType);
};

export const FileImportIcon = ({ fileType }: IFileImportIconProps) => {
  return (
    <>
      {isImageFile(fileType) && <FontAwesomeIcon icon={faFileImage} className="text-[#89D329] text-2xl" />}
      {isDocumentFile(fileType) && <FontAwesomeIcon icon={faFilePdf} className="text-pink text-2xl" />}
    </>
  );
};
