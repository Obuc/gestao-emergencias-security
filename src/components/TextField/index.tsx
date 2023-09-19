import { Skeleton } from '@mui/material';
import { twMerge } from 'tailwind-merge';

interface ITextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  placeholder?: string;
  width?: string;
  errors?: string;
  touched?: boolean;
  isLoading?: boolean;
}

const TextField = ({ label, name, placeholder = '', width, errors, touched, isLoading, ...props }: ITextFieldProps) => {
  return (
    <div className={`flex flex-col relative text-primary ${width ? width : 'w-full'}`}>
      <label htmlFor={name} className="pb-2">
        {label ? label : ''}
      </label>

      {!isLoading && (
        <input
          id={name}
          {...props}
          placeholder={placeholder}
          className={`${
            errors && touched && 'border-pink'
          }  bg-white h-10 outline-none border shadow-xs-app p-2 print:p-0 print:shadow-none`}
        />
      )}

      {isLoading && <Skeleton className={twMerge('p-2', props.className)} />}
    </div>
  );
};

export default TextField;
