interface ITextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  placeholder?: string;
  width?: string;
  errors?: string;
  touched?: boolean;
}

const TextField = ({ label, name, placeholder = '', width, errors, touched, ...props }: ITextFieldProps) => {
  return (
    <div className={`flex flex-col relative text-primary ${width ? width : 'w-full'}`}>
      <label htmlFor={name} className="pb-2">
        {label ? label : ''}
      </label>
      <input
        id={name}
        {...props}
        placeholder={placeholder}
        className={`${errors && touched && 'border-pink'}  bg-white h-10 outline-none border shadow-xs-app p-2`}
      />
    </div>
  );
};

export default TextField;
