import { forwardRef, useRef } from 'react';
import DatePickerReact, { registerLocale } from 'react-datepicker';

import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

registerLocale('pt-BR', ptBR);

interface IDatePickerProps {
  name: string;
  label?: string;
  width?: string;
  value: Date | null;
  onChange: (date: any) => void;
  errors?: string;
  touched?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

interface IInputDateProps {
  name: string;
  value: Date | null;
  onClick: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: string;
  touched?: boolean;
  placeholder?: string;
}

const InputDate = forwardRef<HTMLInputElement, IInputDateProps>((props, ref) => {
  const { value, onClick, onChange, errors, touched, placeholder } = props;
  const dateValue = value?.toString();

  return (
    <div
      className={`flex w-full h-10 justify-between items-center shadow-xs-app border pr-3 ${
        errors && touched && 'border-pink'
      }`}
    >
      <input
        className="w-full h-full px-2 outline-none placeholder:text-[#6D6D6D]"
        type="text"
        value={dateValue}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
        ref={ref}
      />

      <span className="outline-none text-primary" onClick={onClick}>
        <FontAwesomeIcon icon={faCalendar} />
      </span>
    </div>
  );
});

const DatePicker = (props: IDatePickerProps) => {
  const { name, label, width, value, onChange, errors, touched, isLoading, placeholder } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={`flex flex-col justify-center text-primary ${width ? width : 'w-full'}`}>
      {label && <label className="pb-2">{label}</label>}

      {!isLoading && (
        <DatePickerReact
          name={name}
          dateFormat="dd/MM/yyyy"
          locale="pt-BR"
          selected={value}
          onChange={onChange}
          placeholderText={placeholder}
          customInput={
            <InputDate
              name={name}
              value={value}
              errors={errors}
              touched={touched}
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              onChange={onChange}
              ref={inputRef}
            />
          }
        />
      )}

      {isLoading && <Skeleton className="min-w-full outline-none py-2 pl-2 h-10" />}
    </div>
  );
};

export default DatePicker;
