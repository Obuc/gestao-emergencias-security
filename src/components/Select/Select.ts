import * as SelectRadix from '@radix-ui/react-select';
import { VariantProps } from 'tailwind-variants';
import { selectVariants } from './SelectVariants';

export interface ISelectItemProps extends SelectRadix.SelectItemProps {
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
  multi?: boolean;
}

export type SelectProps = SelectRadix.SelectProps &
  VariantProps<typeof selectVariants> & {
    id: string;
    label?: string;
    placeholder?: string;
    isLoading?: boolean;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    multi?: boolean;

    selectedValues?: string[];
    onSelectedValuesChange?: (selectedValues: string[]) => void;
  };
