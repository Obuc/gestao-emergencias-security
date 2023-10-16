import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Skeleton } from '@mui/material';
import * as Label from '@radix-ui/react-label';
import * as SelectRadix from '@radix-ui/react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';

import { selectVariants } from './SelectVariants';
import { ISelectItemProps, SelectProps } from './Select';

const SelectComponent = ({
  id,
  label,
  placeholder,
  children,
  isLoading,
  disabled,
  error,
  mode,
  className,
  variant,
  selectedValues = [],
  onSelectedValuesChange = () => {},
  multi = false,
  ...props
}: SelectProps) => {
  const { base, labelStyle, trigger, triggerIcon, content, arrow, viewport } = selectVariants({
    mode,
    disabled,
    variant,
    error,
  });

  // const [internalSelectedValues, setInternalSelectedValues] = useState<string[]>(selectedValues);

  const handleOptionClick = (optionValue: string) => {
    let newSelectedValues;

    if (multi) {
      if (selectedValues.includes(optionValue)) {
        newSelectedValues = selectedValues.filter((value) => value !== optionValue);
      } else {
        newSelectedValues = [...selectedValues, optionValue];
      }
    } else {
      newSelectedValues = [optionValue];
    }

    // setInternalSelectedValues(newSelectedValues);
    onSelectedValuesChange(newSelectedValues);
  };

  const handleRemoveAll = () => {
    if (multi) {
      // setInternalSelectedValues([]);
      onSelectedValuesChange([]);
    }
  };

  return (
    <>
      <div className={base({ class: className })}>
        {label && (
          <Label.Root className={labelStyle()} htmlFor={id}>
            {label}
          </Label.Root>
        )}

        {!isLoading && (
          <SelectRadix.Root {...props}>
            <SelectRadix.Trigger
              onClick={() => console.log('sss')}
              id={id}
              aria-invalid="true"
              disabled={isLoading || disabled}
              className={trigger()}
            >
              {!multi && <SelectRadix.Value>{props.value}</SelectRadix.Value>}
              {!multi && !props.value && <span className="w-full text-start text-[#6D6D6D]">{placeholder}</span>}

              {multi && (
                <div className="flex items-center overflow-hidden whitespace-nowrap overflow-ellipsis max-w-full mr-3">
                  <span className="max-w-full block text-ellipsis overflow-hidden">
                    {selectedValues.flat().join(', ')}
                  </span>
                </div>
              )}

              {multi && placeholder && selectedValues.length === 0 && (
                <span className="w-full text-start text-[#6D6D6D]">{placeholder}</span>
              )}

              <div className="flex items-center">
                {multi && selectedValues.length > 0 && (
                  <>
                    <span className="flex justify-center items-center w-[1.25rem] h-[1.25rem] rounded-full bg-pink text-white p-3">
                      {selectedValues.length}
                    </span>

                    <span
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveAll();
                      }}
                      className="flex justify-center items-center mx-4 group"
                    >
                      <FontAwesomeIcon icon={faXmark} className="group-hover:text-pink duration-200" />
                    </span>
                  </>
                )}

                {multi && selectedValues.length === 0 && (
                  <SelectRadix.Icon className={triggerIcon()} onClick={() => console.log('ass')}>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </SelectRadix.Icon>
                )}

                {!multi && (
                  <SelectRadix.Icon className={triggerIcon()}>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </SelectRadix.Icon>
                )}
              </div>
            </SelectRadix.Trigger>

            <SelectRadix.Portal>
              <SelectRadix.Content position="popper" className={twMerge(content(), className)}>
                <SelectRadix.Viewport className={arrow()}>
                  <SelectRadix.Group>
                    {multi &&
                      React.Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                          const optionValue = child.props.value;
                          const isSelected = selectedValues.includes(optionValue);

                          return React.cloneElement(child as React.ReactElement<ISelectItemProps>, {
                            isSelected,
                            multi,
                            onMouseDown: () => handleOptionClick(optionValue),
                          });
                        }
                        return null;
                      })}

                    {!multi && children}
                  </SelectRadix.Group>
                </SelectRadix.Viewport>
                <SelectRadix.Arrow className={viewport()} />
              </SelectRadix.Content>
            </SelectRadix.Portal>
          </SelectRadix.Root>
        )}
        {isLoading && <Skeleton className="min-w-full outline-none py-2 pl-2 h-10" />}
      </div>
    </>
  );
};

export default SelectComponent;
