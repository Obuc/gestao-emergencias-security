import { forwardRef } from 'react';
import DatePickerReact, { registerLocale } from 'react-datepicker';

import { ptBR } from 'date-fns/locale';

registerLocale('pt-BR', ptBR);

interface IDatePickerProps {
  name: string;
  label?: string;
  width?: string;
  value: Date | null;
  onChange: (date: any) => void;
  errors?: string;
  touched?: boolean;
}

interface IInputDateProps {
  name: string;
  value: Date | null;
  onClick: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: string;
  touched?: boolean;
}

const InputDate = forwardRef<HTMLInputElement, IInputDateProps>((props, ref) => {
  const { value, onClick, onChange, errors, touched } = props;
  const dateValue = value?.toString();
  //   const [, meta] = useField(name);

  return (
    <input
      className={`${errors && touched && 'border-pink'} w-full h-10 outline-none border shadow-lg-app p-2`}
      type="text"
      value={dateValue}
      onClick={onClick}
      onChange={onChange}
      ref={ref}
    />
  );
});

const DatePicker = (props: IDatePickerProps) => {
  const { name, label, width, value, onChange, errors, touched } = props;

  return (
    <div className={`flex flex-col text-primary ${width ? width : 'w-full'}`}>
      <label className="pb-2">{label ? label : ''}</label>
      <DatePickerReact
        name={name}
        dateFormat="dd/MM/yyyy"
        locale="pt-BR"
        selected={value}
        onChange={onChange}
        customInput={
          <InputDate
            name={name}
            value={value}
            errors={errors}
            touched={touched}
            onClick={() => {}}
            onChange={onChange}
          />
        }
      />
    </div>
  );
};

export default DatePicker;
