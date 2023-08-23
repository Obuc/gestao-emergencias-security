import { ButtonBase, ButtonBaseProps, styled } from '@mui/material';

const BayerButton = styled(ButtonBase)(({ active }: { active: string }) => ({
  position: 'relative',
  maxHeight: '3.125rem',
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '.875rem',
  textAlign: 'left',
  fontFamily: 'Montserrat',
  backgroundColor: active === 'true' ? '#274150' : '#0C2A3A',
  color: '#FFF',
  fontWeight: 400,
  transition: 'all 0.3s ease-out',
  '&:hover, &.Mui-focusVisible': {
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

interface ICollapsedMenuItemActionProps extends ButtonBaseProps {
  children: React.ReactNode;
  active: string;
}

export const CollapsedMenuItemAction = ({ children, active, ...props }: ICollapsedMenuItemActionProps) => {
  return (
    <BayerButton {...props} active={active}>
      {children}

      {active === 'true' && <div className="polygon-menu bg-red w-6 h-full justify-self-end" />}
    </BayerButton>
  );
};
