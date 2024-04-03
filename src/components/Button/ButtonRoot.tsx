import { ButtonBase, ButtonBaseProps, styled } from '@mui/material';

interface IButtonProps extends ButtonBaseProps {
  fill?: boolean | string;
  bgcolor?: string;
  children: React.ReactNode;
}

const ButtonRootStyle = styled(ButtonBase)<IButtonProps>(({ fill, bgcolor }) => ({
  position: 'relative',
  padding: '.625rem',
  maxHeight: '2.5rem',
  fontFamily: 'Montserrat',
  backgroundColor: fill ? (bgcolor ? bgcolor : '#10384F') : '#FFF',
  color: bgcolor === '#f8f9fa' ? '#10384F' : fill ? '#FFF' : '#10384F',
  border: !fill ? (bgcolor ? `1px solid ${bgcolor} ` : '1px solid #10384F') : 'none',
  fontWeight: 500,
  // textTransform: 'uppercase',
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

export const ButtonRoot = ({ fill, bgcolor, children, ...props }: IButtonProps) => {
  return (
    <ButtonRootStyle fill={fill?.toString()} bgcolor={bgcolor} {...props}>
      {children}
    </ButtonRootStyle>
  );
};
