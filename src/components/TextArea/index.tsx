interface ITextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  placeholder?: string;
  width?: string;
  errors?: string;
  touched?: boolean;
}

const TextArea = ({ label, name, placeholder = '', width, errors, touched, ...props }: ITextAreaProps) => {
  return (
    <div className={`flex flex-col text-primary ${width ? width : 'w-full'}`}>
      <label htmlFor={name} className="pb-2 flex gap-2 justify-between">
        {label}
        <span className={`text-primary ${props.value?.toString().length! > 250 && 'text-pink'}`}>
          {props.value?.toString().length!}/{255}
        </span>
      </label>
      <textarea
        {...props}
        id={name}
        className={`${
          errors && touched && 'border-pink'
        } outline-none border shadow-xs-app p-2 h-[5rem] text-primary min-h-[2.5rem] max-h-[5rem] bg-white`}
        placeholder={placeholder}
        maxLength={255}
      />
    </div>
  );
};

export default TextArea;
