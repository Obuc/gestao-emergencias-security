import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import { twMerge } from 'tailwind-merge';

import { useDebounce } from '../../hooks/useDebounce';

interface ITextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  icon?: React.ReactNode;
  placeholder?: string;
  width?: string;
  errors?: string;
  touched?: boolean;
  isLoading?: boolean;
}

const TextField = ({
  label,
  name,
  icon,
  placeholder = '',
  width,
  errors,
  touched,
  isLoading,
  ...props
}: ITextFieldProps) => {
  const [displayValue, setDisplayValue] = useState(props.value ? props.value : '');

  useEffect(() => {
    setDisplayValue(props.value || '');
  }, [props.value]);

  const debouncedChange = useDebounce((value: string) => {
    const event = {
      target: {
        name: name,
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    props.onChange?.(event);
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setDisplayValue(newValue);
    debouncedChange(newValue);
  };

  return (
    <div className={`flex flex-col relative text-primary-font ${width ? width : 'w-full'}`}>
      {label && (
        <label htmlFor={name} className="pb-2 font-[500]">
          {label}
        </label>
      )}

      {!isLoading && (
        <input
          id={name}
          {...props}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          data-errors={errors && touched}
          className={twMerge(
            'data-[errors=true]:border-pink bg-white h-10 outline-none border shadow-xs-app px-2 placeholder:text-[#6D6D6D]',
            props.className,
          )}
        />
      )}

      {icon && <div className="absolute right-2 top-2">{icon}</div>}

      {isLoading && <Skeleton className={twMerge('p-2', props.className)} />}
    </div>
  );
};

export default TextField;
