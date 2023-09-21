// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCloudArrowUp, faFileImage, faFilePdf, faPaperclip, faXmark } from '@fortawesome/free-solid-svg-icons';

import { FileImportAction } from './FileImportAction';
import { FileImportContent } from './FileImportContent';
import { FileImportIcon } from './FileImportIcon';
import { FileImportInput } from './FileImportInput';
import { FileImportItemLabel } from './FileImportItemLabel';
import { FileImportLabel } from './FileImportLabel';
import { FilteImportRootItem } from './FileImportRootItem';
import { FilteImportRoot } from './FilteImportRoot';

// interface IFileImportProps {
//   handleFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   children: React.ReactNode;
//   error?: boolean;
// }

// const FileImport = ({ handleFile, children, error }: IFileImportProps) => {
//   return (
//     <div className="flex flex-col gap-2">
//       <label
//         htmlFor="file"
//         className={`flex rounded h-14 w-[33rem] cursor-pointer gap-4 justify-between text-primary px-6 items-center border-dashed ${
//           error ? 'border-pink' : 'border-black/10'
//         } border-2`}
//       >
//         <div className="flex gap-2 justify-center items-center">
//           <FontAwesomeIcon icon={faCloudArrowUp} className="text-blue text-2xl" />
//           Anexo boletin
//         </div>

//         <div className="w-8 h-8 rounded bg-blue flex justify-center items-center">
//           <FontAwesomeIcon icon={faPaperclip} className="text-white text-2xl" />
//         </div>
//       </label>
//       <input
//         id="file"
//         type="file"
//         className="hidden"
//         onChange={handleFile}
//         accept=".jpg, .jpeg, .png, .gif, .pdf, .doc, .docx"
//       />

//       <div className="flex flex-col gap-1">{children}</div>
//     </div>
//   );
// };

// interface IFileImportItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   children: React.ReactNode;
//   fileType: string;
// }

// const isImageFile = (fileType: string) => {
//   const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
//   return imageMimeTypes.includes(fileType);
// };

// const isDocumentFile = (fileType: string) => {
//   const documentMimeTypes = [
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'application/vnd.ms-excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     'application/vnd.ms-powerpoint',
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//   ];
//   return documentMimeTypes.includes(fileType);
// };

// export const FileImportItem = ({ children, fileType, ...props }: IFileImportItemProps) => {
//   return (
//     <div className="w-full h-14 rounded border border-[#ECECEC] flex px-6 items-center justify-between">
//       <div className="flex gap-2">
//         {isImageFile(fileType) && <FontAwesomeIcon icon={faFileImage} className="text-[#89D329] text-2xl" />}
//         {isDocumentFile(fileType) && <FontAwesomeIcon icon={faFilePdf} className="text-pink text-2xl" />}

//         {children}
//       </div>
//       <button
//         {...props}
//         type="button"
//         className="w-7 h-7 rounded-full flex justify-center items-center bg-[#D5E3FF] hover:cursor-pointer"
//       >
//         <FontAwesomeIcon icon={faXmark} className="text-blue" />
//       </button>
//     </div>
//   );
// };

// export default FileImport;

export const FileImport = {
  Root: FilteImportRoot,
  RootItem: FilteImportRootItem,
  Label: FileImportLabel,
  ItemLabel: FileImportItemLabel,
  Input: FileImportInput,
  Icon: FileImportIcon,
  Content: FileImportContent,
  Action: FileImportAction,
};
