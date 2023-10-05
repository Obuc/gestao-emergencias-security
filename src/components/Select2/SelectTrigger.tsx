import * as SelectRadix from '@radix-ui/react-select';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VariantProps, tv } from 'tailwind-variants';

const select = tv({
  slots: {
    trigger: 'min-w-full outline-none py-2 pl-2 flex group justify-between items-center h-10 leading-none',
    triggerIcon: 'ml-2 w-[3.125rem] h-10 flex justify-center items-center duration-150',
  },
  variants: {
    error: {
      true: {
        trigger: 'border-pink',
      },
      false: {
        trigger: '',
      },
    },
    mode: {
      dark: {
        trigger: 'text-white border border-[#0C2B3B] bg-[#0C2B3B]',
        triggerIcon: 'bg-[#00354F]',
      },
      light: {
        trigger: ' text-primary data-[placeholder:text-gray-400]',
        triggerIcon: 'bg-primary',
      },
      gray: {
        trigger: ' text-[#3E3E3E] data-[placeholder:text-gray-400] bg-white',
        triggerIcon: 'bg-primary',
      },
    },
    disabled: {
      true: {
        triggerIcon: 'group-hover:cursor-not-allowed',
      },
      false: {
        triggerIcon: '',
      },
    },
    variant: {
      filled: {
        trigger: 'shadow-xs-app border',
        triggerIcon: 'group-data-[state="open"]:bg-primary polygon-select text-white',
      },
      outline: {
        trigger: 'font-medium text-primary data-[placeholder:text-primary font-bold]',
        triggerIcon: 'bg-transparent text-primary',
      },
    },
  },
  defaultVariants: {
    disabled: false,
    error: false,
    mode: 'light',
    variant: 'filled',
  },
});

interface ISelectTriggerProps extends VariantProps<typeof select> {
  id: string;
  placeholder?: string;
}

const SelectTrigger = ({ id, placeholder, mode, disabled, variant, error }: ISelectTriggerProps) => {
  const { trigger, triggerIcon } = select({
    mode,
    disabled,
    variant,
    error,
  });

  return (
    <SelectRadix.Trigger id={id} aria-invalid="true" className={trigger()}>
      <SelectRadix.Value placeholder={placeholder} />
      <SelectRadix.Icon className={triggerIcon()}>
        <FontAwesomeIcon icon={faChevronDown} />
      </SelectRadix.Icon>
    </SelectRadix.Trigger>
  );
};

export default SelectTrigger;
