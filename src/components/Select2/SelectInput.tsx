import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as SelectRadix from '@radix-ui/react-select';
import { VariantProps, tv } from 'tailwind-variants';

type SelectProps = SelectRadix.SelectProps &
  VariantProps<typeof select> & {
    isLoading: boolean;
    id: string;
    placeholder?: string;
  };

const select = tv({
  slots: {
    trigger: 'min-w-full outline-none py-2 pl-2 flex group justify-between items-center h-10 leading-none',
    triggerIcon: 'ml-2 w-[3.125rem] h-10 flex justify-center items-center duration-150',
    content: 'overflow-hidden z-10 bg-white shadow-xs-primary-app',
    viewport: 'py-1',
    arrow: 'fill-white',
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
        base: 'bg-white',
        trigger: ' text-primary data-[placeholder:text-gray-400]',
        triggerIcon: 'bg-primary',
      },
      gray: {
        base: 'bg-[#F1F1F1]',
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

const SelectInput = ({ isLoading, id, placeholder, mode, disabled, variant, error, ...props }: SelectProps) => {
  const { trigger, triggerIcon, content, arrow, viewport } = select({
    mode,
    disabled,
    variant,
    error,
  });

  return (
    <SelectRadix.Root {...props}>
      <SelectRadix.Trigger id={id} aria-invalid="true" disabled={isLoading || disabled} className={trigger()}>
        <SelectRadix.Value placeholder={placeholder} />
        <SelectRadix.Icon className={triggerIcon()}>
          <FontAwesomeIcon icon={faChevronDown} />
        </SelectRadix.Icon>
      </SelectRadix.Trigger>

      <SelectRadix.Portal>
        <SelectRadix.Content position="popper" className={content()}>
          <SelectRadix.Viewport className={arrow()}>
            <SelectRadix.Group>{children}</SelectRadix.Group>
          </SelectRadix.Viewport>
          <SelectRadix.Arrow className={viewport()} />
        </SelectRadix.Content>
      </SelectRadix.Portal>
    </SelectRadix.Root>
  );
};

{
  !isLoading && (
    <SelectRadix.Root {...props}>
      <SelectRadix.Trigger id={id} aria-invalid="true" disabled={isLoading || disabled} className={trigger()}>
        <SelectRadix.Value placeholder={placeholder} />
        <SelectRadix.Icon className={triggerIcon()}>
          <FontAwesomeIcon icon={faChevronDown} />
        </SelectRadix.Icon>
      </SelectRadix.Trigger>

      <SelectRadix.Portal>
        <SelectRadix.Content position="popper" className={twMerge(content(), className)}>
          <SelectRadix.Viewport className={arrow()}>
            <SelectRadix.Group>{children}</SelectRadix.Group>
          </SelectRadix.Viewport>
          <SelectRadix.Arrow className={viewport()} />
        </SelectRadix.Content>
      </SelectRadix.Portal>
    </SelectRadix.Root>
  );
}
{
  isLoading && <Skeleton className="min-w-full outline-none py-2 pl-2 h-10" />;
}

export default SelectInput;
