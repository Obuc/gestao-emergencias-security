import { Skeleton } from '@mui/material';
import { twMerge } from 'tailwind-merge';
import AsyncSelect from 'react-select/async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { DropdownIndicatorProps, components } from 'react-select';

import { ISelectAutoCompleteAsyncProps, OptionSelect } from './SelectAutoCompleteTypes';

export const SelectAutocompleteAsync = ({
  label,
  errors,
  touched,
  outline,
  isLoadingView,
  ...props
}: ISelectAutoCompleteAsyncProps) => {
  const DropdownIndicator = (props: DropdownIndicatorProps<OptionSelect, false, any>) => {
    return (
      <components.DropdownIndicator {...props} className="text-base h-10">
        <FontAwesomeIcon icon={faChevronDown} />
      </components.DropdownIndicator>
    );
  };

  const titleValue = (props.value as OptionSelect)?.label || undefined;

  return (
    <div
      className={twMerge('flex flex-col gap-2 text-primary-font-font font-[500] w-full', props.className)}
      title={titleValue}
    >
      <label>
        {label} {props.required && <span className="text-pink font-bold">*</span>}
      </label>

      {isLoadingView && <Skeleton className={twMerge('py-2', props.className)} />}

      {!isLoadingView && (
        <AsyncSelect
          {...props}
          placeholder={props.placeholder ?? ''}
          components={{ DropdownIndicator }}
          loadingMessage={() => 'Carregando...'}
          noOptionsMessage={(obj) => (props.noOptionsMessage ? props.noOptionsMessage(obj) : 'Opção não encontrada')}
          styles={{
            control: (provided, state) => ({
              ...provided,
              '&:hover': {
                borderColor: 'none',
              },
              backgroundColor: state.isDisabled ? '#FFF' : '#FFF',
              fontSize: '.875rem',
              borderRadius: '0',
              fontWeight: '500',
              lineHeight: '1.5',
              outline: '0',
              borderColor: errors && touched ? '#FF3162' : 'none',
              boxShadow: '0px 0px 2px 0px rgba(16, 56, 79, 0.16)',
              minHeight: '2.5rem',
              maxHeight: '2.5rem',
              overflow: 'hidden',
            }),

            singleValue: (provided, state) => ({
              ...provided,
              color: state.isDisabled ? '#303030' : '#303030',
            }),

            clearIndicator: (styles) => ({
              ...styles,
              visibility: 'hidden',
            }),

            indicatorsContainer: (styles) => ({
              ...styles,
              minHeight: '2.5rem',
              // maxHeight: '2.5rem',
            }),

            valueContainer: (styles) => ({
              ...styles,
              minHeight: '2.5rem',
              // maxHeight: '2.5rem',
            }),

            dropdownIndicator: (styles, state) => ({
              ...styles,
              color: state.isDisabled ? '#FFF' : '#B4B4B4',

              '&:hover': {
                cursor: 'pointer',
                color: '#00354F',
                backgroundColor: '#FFF',
                transition: 'all ease-in-out 150ms',
              },
            }),
            menu: (styles, state) => ({
              ...styles,
              borderRadius: '0',
              maxHeight: state.isMulti ? '12.5rem' : '25rem',
            }),
            menuList: (styles, state) => ({
              ...styles,
              maxHeight: state.isMulti ? '12.5rem' : '25rem',
              overflowX: 'hidden',
            }),
            option: (styles, state) => ({
              ...styles,
              backgroundColor: state.isSelected ? '#00354F' : '#FFF',
              color: state.isSelected ? '#FFF' : '#3E3E3E',
              '&:hover': {
                backgroundColor: '#CFCFCF',
              },
            }),

            indicatorSeparator: (styles) => ({
              ...styles,
              backgroundColor: '#fff',
            }),
          }}
        />
      )}
    </div>
  );
};
