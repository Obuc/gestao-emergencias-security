import { AsyncProps } from 'react-select/async';
import { GroupBase, Props as SelectProps } from 'react-select';

export type OptionSelect = {
  value: string;
  label: string;
};

export interface ISelectAutoCompleteAsyncProps extends AsyncProps<OptionSelect, any, GroupBase<OptionSelect>> {
  label: string;
  errors?: string;
  touched?: boolean;
  outline?: boolean;
  empyoptionsMessage?: string;
  isLoadingView?: boolean;
}

export interface ISelectAutoCompleteProps extends SelectProps<OptionSelect> {
  label?: string;
  sublabel?: string;
  errors?: string;
  touched?: boolean;
  outline?: boolean;
  isLoadingView?: boolean;
}
