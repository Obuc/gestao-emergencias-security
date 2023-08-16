import { ButtonBase, ButtonBaseProps, styled } from '@mui/material';

interface IButtonProps extends ButtonBaseProps {
  fill?: boolean | string;
  children: React.ReactNode;
}

const ButtonRootStyle = styled(ButtonBase)<IButtonProps>(({ fill }) => ({
  position: 'relative',
  padding: '.625rem',
  maxHeight: '2.5rem',
  fontFamily: 'Montserrat',
  backgroundColor: fill ? '#0C2A3A' : '#FFF',
  color: fill ? '#FFF' : '#0C2A3A',
  border: !fill ? '1px solid #0C2A3A' : 'none',
  fontWeight: 500,
  textTransform: 'uppercase',
  display: 'flex',
  gap: '0.5rem',
  boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
  transition: 'all 0.3s ease-out',
  '&.Mui-disabled': {
    backgroundColor: '#DDD',
    color: '#BBB',
    border: '1px solid #BBB',
  },
  '&:hover, &.Mui-focusVisible': {
    // backgroundColor: '#00BCFF',
    boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.3)',
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

export const ButtonRoot = ({ children, ...props }: IButtonProps) => {
  return <ButtonRootStyle {...props}>{children}</ButtonRootStyle>;
};
