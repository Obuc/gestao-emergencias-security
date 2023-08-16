// import { useState } from 'react';
// import { format } from 'date-fns';
// import { useNavigate } from 'react-router-dom';
// import { IconButton, Skeleton } from '@mui/material';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFilterCircleXmark, faPaperclip } from '@fortawesome/free-solid-svg-icons';

import { TableHead } from '@mui/material';
import { TableRoot } from './TableRoot';
import { TableRow } from './TableRow';
import { TableData } from './TableData';
import { TableBody } from './TableBody';
import { TableHeadData } from './TableHeadData';

// import { ILosses } from '../../types/Losses';
// import LossesModal from '../modal/LossesModal';
// import Tooltip from '../../../../components/Tooltip';
// import TextField from '../../../../components/TextField';
// import DatePicker from '../../../../components/DatePicker';
// import { SelectedOptionsLosses } from '../../hooks/useLosses';
// import Autocomplete from '../../../../components/Autocomplete';

// interface ILossesTable {
//   data: {
//     losses: Array<ILosses>;
//   };
//   isLoading: boolean;
//   isFetching: boolean;
//   limit: number;
//   isError: boolean;
//   selectedOptions: SelectedOptionsLosses;
//   setSelectedOptions: React.Dispatch<React.SetStateAction<SelectedOptionsLosses>>;
// }

// const LossesTable = ({
//   data,
//   isLoading,
//   isFetching,
//   isError,
//   limit,
//   selectedOptions,
//   setSelectedOptions,
// }: ILossesTable) => {
//   const navigate = useNavigate();
//   const [editLosses, setEditLosses] = useState<ILosses | null>(null);

//   const handleAutocompleteChange = (value: string, type: string) => {
//     setSelectedOptions((prevSelectedOptions: SelectedOptionsLosses) => ({
//       ...prevSelectedOptions,
//       [type]: value,
//     }));
//   };

//   const handleClearFilters = () => {
//     setSelectedOptions({
//       number: '',
//       site: '',
//       created_at: '',
//       updated_at: '',
//     });
//   };

//   //   useEffect(() => {
//   //     if (editLosses) {
//   //       const filterLosses = data.losses.find((item) => item.id === editLosses.id);
//   //       if (filterLosses) setEditLosses(filterLosses);
//   //     }
//   //   }, [data?.losses]);

//   return (
//     <>
//       <table className="min-[1100px]:h-[35.6rem] min-[1600px]:h-[41rem] min-[1800px]:h-[32rem] w-full block overflow-hidden text-primary -mt-2 border-spacing-y-2 border-separate p-px">
//         <thead className="h-14 text-lg shadow-xs-primary-app bg-white">
//           <tr>
//             <th className="font-medium w-[3%] text-start pl-8">
//               <Autocomplete label="Número">
//                 <TextField
//                   name="number"
//                   value={selectedOptions.number}
//                   placeholder="Pesquise o número"
//                   onChange={(event) => handleAutocompleteChange(event.target.value, 'number')}
//                 />
//               </Autocomplete>
//             </th>
//             <th className="font-medium w-[5%] text-start">
//               <Autocomplete label="Site">
//                 <TextField
//                   name="site"
//                   value={selectedOptions.site}
//                   placeholder="Pesquise o site"
//                   onChange={(event) => handleAutocompleteChange(event.target.value, 'site')}
//                 />
//               </Autocomplete>
//             </th>
//             <th className="font-medium w-[8%] text-start">
//               <Autocomplete label="Criado em">
//                 <DatePicker
//                   name="created_at"
//                   value={selectedOptions.created_at ? new Date(selectedOptions.created_at) : null}
//                   onChange={(date: any) => handleAutocompleteChange(date, 'created_at')}
//                 />
//               </Autocomplete>
//             </th>
//             <th className="font-medium w-[8%] text-start">
//               <Autocomplete label="Atualizado em">
//                 <DatePicker
//                   name="updated_at"
//                   value={selectedOptions.updated_at ? new Date(selectedOptions.updated_at) : null}
//                   onChange={(date: any) => handleAutocompleteChange(date, 'updated_at')}
//                 />
//               </Autocomplete>
//             </th>
//             <th className="font-medium w-[10%] text-start">Anexos</th>

//             <th className="font-medium w-[5%] text-start">
//               {(selectedOptions.number ||
//                 selectedOptions.site ||
//                 selectedOptions.created_at ||
//                 selectedOptions.updated_at) && (
//                 <IconButton disabled={isLoading || isFetching} onClick={handleClearFilters}>
//                   <Tooltip label="Limpar filtros">
//                     <FontAwesomeIcon className="text-primary text-2xl w-6 h-6" icon={faFilterCircleXmark} />
//                   </Tooltip>
//                 </IconButton>
//               )}
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.losses?.length <= 0 && !isFetching && (
//             <tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
//               <td colSpan={6}>Nenhum registro encontrado!</td>
//             </tr>
//           )}

//           {isLoading && (
//             <>
//               {Array.from({ length: limit }).map((_, index) => (
//                 <tr key={index}>
//                   <td className="h-14" colSpan={6}>
//                     <Skeleton height="3.5rem" animation="wave" />
//                   </td>
//                 </tr>
//               ))}
//             </>
//           )}

//           {isError && (
//             <tr className="h-14 shadow-xsm text-center font-medium bg-white duration-200">
//               <td colSpan={6}>Ops, ocorreu um erro, recarregue a página e tente novamente! </td>
//             </tr>
//           )}

//           {data?.losses &&
//             !isLoading &&
//             !isError &&
//             data.losses.map((item, index) => {
//               const created_at = format(new Date(item.created_at.toString()), 'dd/MM/yyyy HH:mm');

//               const updated_at = format(new Date(item.updated_at.toString()), 'dd/MM/yyyy HH:mm');

//               return (
//                 <tr
//                   key={index}
//                   onClick={() => {
//                     setEditLosses(item);
//                     navigate(`/losses/${item.id}`);
//                   }}
//                   className="h-14 shadow-xsm text-left bg-white hover:bg-[#E9F0F3] hover:cursor-pointer duration-200"
//                 >
//                   <td className="text-start pl-8">{item.id}</td>
//                   <td className="text-start">{item.site.title}</td>
//                   <td className="text-start">{created_at}</td>
//                   <td className="text-start">{updated_at}</td>
//                   <td className="text-start">
//                     {item.lossesAttachments.length > 0 && (
//                       <div className="w-10 h-10 rounded bg-primary flex justify-center items-center">
//                         <FontAwesomeIcon className="text-white text-2xl" icon={faPaperclip} />
//                       </div>
//                     )}
//                   </td>
//                   <td className="h-14 flex justify-between items-center w-full"></td>
//                 </tr>
//               );
//             })}
//         </tbody>
//       </table>

//       {editLosses && (
//         <LossesModal open={editLosses !== null} onOpenChange={() => setEditLosses(null)} data={editLosses} />
//       )}
//     </>
//   );
// };

// export default LossesTable;

export const Table = {
  Root: TableRoot,
  Thead: TableHead,
  Th: TableHeadData,
  Tr: TableRow,
  Tbody: TableBody,
  Td: TableData,
};
