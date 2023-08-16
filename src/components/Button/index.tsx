// import { ButtonBase, ButtonBaseProps, styled } from '@mui/material';
// import Spinner from '../Spinner';

import { ButtonIcon } from './ButtonIcon';
import { ButtonLabel } from './ButtonLabel';
import { ButtonRoot } from './ButtonRoot';
import { ButtonSpinner } from './ButtonSpinner';

// interface IButtonProps extends ButtonBaseProps {
//   fill?: boolean | string;
//   children: React.ReactNode;
//   lg?: boolean | string;
//   width?: string;
//   isLoading?: boolean;
// }

// const BayerButton = styled(ButtonBase)<IButtonProps>(({ fill, lg, width }) => ({
//   position: 'relative',
//   padding: lg ? '.625rem 2.5rem' : '.625rem',
//   maxHeight: '2.5rem',
//   width: width ? width : '',
//   fontFamily: 'Montserrat',
//   backgroundColor: fill ? '#00354F' : '#FFF',
//   color: fill ? '#FFF' : '#00354F',
//   border: !fill ? '1px solid #00354F' : 'none',
//   fontWeight: 500,
//   textTransform: 'uppercase',
//   display: 'flex',
//   gap: '0.5rem',
//   boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
//   transition: 'all 0.3s ease-out',
//   '&.Mui-disabled': {
//     backgroundColor: '#DDD',
//     color: '#BBB',
//     border: '1px solid #BBB',
//   },
//   '&:hover, &.Mui-focusVisible': {
//     // backgroundColor: '#00BCFF',
//     boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.3)',
//     '& .MuiImageBackdrop-root': {
//       opacity: 0.15,
//     },
//     '& .MuiImageMarked-root': {
//       opacity: 0,
//     },
//     '& .MuiTypography-root': {
//       border: '4px solid currentColor',
//     },
//   },
// }));

// const Button = ({ fill, children, lg, isLoading, width, ...props }: IButtonProps) => {
//   return (
//     <div>
//       <BayerButton
//         disabled={isLoading ? isLoading : false}
//         lg={lg?.toString()}
//         fill={fill?.toString()}
//         width={width}
//         {...props}
//       >
//         <>
//           {children}
//           {isLoading && <Spinner />}
//         </>
//       </BayerButton>
//     </div>
//   );
// };

// export default Button;

export const Button = {
  Root: ButtonRoot,
  Spinner: ButtonSpinner,
  Label: ButtonLabel,
  Icon: ButtonIcon,
};
