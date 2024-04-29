import { Skeleton } from '@mui/material';
import { twMerge } from 'tailwind-merge';

interface ITextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  placeholder?: string;
  width?: string;
  errors?: string;
  touched?: boolean;
  isLoading?: boolean;
  showLength?: boolean;
  isEdit?: boolean;
}

const TextArea = ({
  label,
  name,
  placeholder = '',
  width,
  errors,
  touched,
  isLoading,
  showLength = false,
  isEdit,
  ...props
}: ITextAreaProps) => {
  return (
    <div className={`flex flex-col text-primary-font ${width ? width : 'w-full'}`}>
      <label htmlFor={name} className="pb-2 flex gap-2 justify-between font-[500]">
        {label}
        {showLength && (
          <span className={`text-primary-font ${props.value?.toString().length! > 1000 && 'text-pink'}`}>
            {props.value?.toString().length!}/{1000}
          </span>
        )}
      </label>
      {!isLoading && isEdit && (
        <textarea
          {...props}
          id={name}
          data-errors={errors && touched}
          className={twMerge(
            'data-[errors=true]:border-pink outline-none border shadow-xs-app p-2 h-[6rem] text-primary-font min-h-[2.5rem] max-h-[8.125rem] bg-white',
            props.className,
          )}
          placeholder={placeholder}
          maxLength={3000}
        />
      )}

      {!isLoading && !isEdit && (
        <div className="outline-none border shadow-xs-app p-2 h-auto break-words block text-primary-font min-h-[2.5rem] bg-white ">
          {props.value}
        </div>
      )}

      {isLoading && <Skeleton className={twMerge('p-10', props.className)} />}
    </div>
  );
};

export default TextArea;
