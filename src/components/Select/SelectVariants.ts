import { tv } from 'tailwind-variants';

export const selectVariants = tv({
  slots: {
    base: 'flex w-full h-full flex-col',
    labelStyle: 'text-primary text-base pb-2',
    trigger:
      'min-w-full outline-none py-2 pl-2 flex group justify-between items-center h-10 leading-none whitespace-nowrap',
    triggerIcon: 'w-[3.125rem] h-10 flex justify-center items-center duration-150',
    content: 'overflow-hidden z-10 bg-white max-h-[34.375rem] shadow-xs-primary-app', //
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
        trigger: 'text-primary data-[placeholder:text-gray-400]',
        triggerIcon: 'bg-primary',
      },
      gray: {
        base: 'bg-[#F1F1F1]',
        trigger: ' text-[#3E3E3E] data-[placeholder:text-gray-400] bg-white',
        triggerIcon: 'bg-primary',
        labelStyle: 'bg-[#F1F1F1]',
      },
    },
    disabled: {
      true: {
        triggerIcon: 'group-hover:cursor-not-allowed',
      },
      false: {
        triggerIcon: '', // group-hover:bg-primary
      },
    },
    variant: {
      filled: {
        trigger: 'shadow-xs-app border',
        triggerIcon: 'group-data-[state="open"]:bg-primary polygon-select text-white',
      },
      outline: {
        trigger: 'font-medium text-primary data-[placeholder:text-primary font-bold] shadow-sm-primary-app',
        // trigger: 'font-medium text-primary border-b-2 border-b-[#B3C7D3] data-[placeholder:text-primary font-bold]',
        triggerIcon: 'bg-transparent text-primary', // invisible group-hover:visible
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
