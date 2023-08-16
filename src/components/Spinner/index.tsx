import CircularProgress, { circularProgressClasses, CircularProgressProps } from '@mui/material/CircularProgress';

const Spinner = (props: CircularProgressProps) => {
  return (
    <CircularProgress
      variant="indeterminate"
      disableShrink
      sx={{
        color: () => '#BBB',
        animationDuration: '550ms',
        [`& .${circularProgressClasses.circle}`]: {
          strokeLinecap: 'round',
        },
      }}
      size={20}
      thickness={4}
      {...props}
    />
  );
};

export default Spinner;
