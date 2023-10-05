// import { twMerge } from 'tailwind-merge';
// import { Skeleton } from '@mui/material';
// import React, { forwardRef } from 'react';
// import * as Label from '@radix-ui/react-label';
// import { VariantProps, tv } from 'tailwind-variants';
// import * as SelectRadix from '@radix-ui/react-select';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

// const select = tv({
//   slots: {
//     base: 'flex w-full h-full flex-col',
//     labelStyle: 'text-primary text-base pb-2',
//     trigger: 'min-w-full outline-none py-2 pl-2 flex group justify-between items-center h-10 leading-none',
//     triggerIcon: 'ml-2 w-[3.125rem] h-10 flex justify-center items-center duration-150',
//     content: 'overflow-hidden z-10 bg-white shadow-xs-primary-app',
//     viewport: 'py-1',
//     arrow: 'fill-white',
//   },
//   variants: {
//     error: {
//       true: {
//         trigger: 'border-pink',
//       },
//       false: {
//         trigger: '',
//       },
//     },
//     mode: {
//       dark: {
//         trigger: 'text-white border border-[#0C2B3B] bg-[#0C2B3B]',
//         triggerIcon: 'bg-[#00354F]',
//       },
//       light: {
//         base: 'bg-white',
//         trigger: ' text-primary data-[placeholder:text-gray-400]',
//         triggerIcon: 'bg-primary',
//       },
//       gray: {
//         base: 'bg-[#F1F1F1]',
//         trigger: ' text-[#3E3E3E] data-[placeholder:text-gray-400] bg-white',
//         triggerIcon: 'bg-primary',
//         labelStyle: 'bg-[#F1F1F1]',
//       },
//     },
//     disabled: {
//       true: {
//         triggerIcon: 'group-hover:cursor-not-allowed',
//       },
//       false: {
//         triggerIcon: '', // group-hover:bg-primary
//       },
//     },
//     variant: {
//       filled: {
//         trigger: 'shadow-xs-app border',
//         triggerIcon: 'group-data-[state="open"]:bg-primary polygon-select text-white',
//       },
//       outline: {
//         trigger: 'font-medium text-primary data-[placeholder:text-primary font-bold]',
//         // trigger: 'font-medium text-primary border-b-2 border-b-[#B3C7D3] data-[placeholder:text-primary font-bold]',
//         triggerIcon: 'bg-transparent text-primary', // invisible group-hover:visible
//       },
//     },
//   },
//   defaultVariants: {
//     disabled: false,
//     error: false,
//     mode: 'light',
//     variant: 'filled',
//   },
// });

// type SelectProps = SelectRadix.SelectProps &
//   VariantProps<typeof select> & {
//     id: string;
//     label?: string;
//     placeholder?: string;
//     isLoading?: boolean;
//     children: React.ReactNode;
//     disabled?: boolean;
//     className?: string;
//   };

// const Select = ({
//   id,
//   label,
//   placeholder,
//   children,
//   isLoading,
//   disabled,
//   error,
//   mode,
//   className,
//   variant,
//   ...props
// }: SelectProps) => {
//   const { base, labelStyle, trigger, triggerIcon, content, arrow, viewport } = select({
//     mode,
//     disabled,
//     variant,
//     error,
//   });

//   return (
//     <>
//       <div className={base({ class: className })}>
//         {label && (
//           <Label.Root className={labelStyle()} htmlFor={id}>
//             {label}
//           </Label.Root>
//         )}

//         {!isLoading && (
//           <SelectRadix.Root {...props}>
//             <SelectRadix.Trigger id={id} aria-invalid="true" disabled={isLoading || disabled} className={trigger()}>
//               <SelectRadix.Value placeholder={placeholder} />
//               <SelectRadix.Icon className={triggerIcon()}>
//                 <FontAwesomeIcon icon={faChevronDown} />
//               </SelectRadix.Icon>
//             </SelectRadix.Trigger>

//             <SelectRadix.Portal>
//               <SelectRadix.Content position="popper" className={twMerge(content(), className)}>
//                 <SelectRadix.Viewport className={arrow()}>
//                   <SelectRadix.Group>{children}</SelectRadix.Group>
//                 </SelectRadix.Viewport>
//                 <SelectRadix.Arrow className={viewport()} />
//               </SelectRadix.Content>
//             </SelectRadix.Portal>
//           </SelectRadix.Root>
//         )}
//         {isLoading && <Skeleton className="min-w-full outline-none py-2 pl-2 h-10" />}
//       </div>
//     </>
//   );
// };

// interface ISelectItemProps extends SelectRadix.SelectItemProps {
//   children: React.ReactNode;
//   className?: string;
// }

// export const SelectItem = forwardRef<HTMLDivElement, ISelectItemProps>(
//   ({ children, className, ...props }, forwardedRef) => {
//     const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//       event.preventDefault();

//       console.log(event);
//     };

//     return (
//       <SelectRadix.Item
//         onMouseDown={handleMouseDown}
//         className={twMerge(
//           'flex items-center h-6 pl-2 py-5 text-[#3E3E3E] select-none hover:bg-[#EDEDED] duration-300 outline-none ',
//           className,
//         )}
//         ref={forwardedRef}
//         {...props}
//       >
//         <SelectRadix.ItemText>{children}</SelectRadix.ItemText>
//       </SelectRadix.Item>
//     );
//   },
// );

// export const SelectSeparator = () => {
//   return <SelectRadix.Separator className="h-[1px] bg-[#CDCDCD] m-[5px]" />;
// };

// interface ISelectLabelProps {
//   children: React.ReactNode;
// }

// export const SelectLabel = ({ children }: ISelectLabelProps) => {
//   return <SelectRadix.Label className="text-primary font-medium py-3 pl-2">{children}</SelectRadix.Label>;
// };

// export default Select;

import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Skeleton } from '@mui/material';
import * as Label from '@radix-ui/react-label';
import * as SelectRadix from '@radix-ui/react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

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

  const [internalSelectedValues, setInternalSelectedValues] = useState<string[]>(selectedValues);

  const handleOptionClick = (optionValue: string) => {
    let newSelectedValues;

    if (multi) {
      if (internalSelectedValues.includes(optionValue)) {
        newSelectedValues = internalSelectedValues.filter((value) => value !== optionValue);
      } else {
        newSelectedValues = [...internalSelectedValues, optionValue];
      }
    } else {
      newSelectedValues = [optionValue];
    }

    setInternalSelectedValues(newSelectedValues);
    onSelectedValuesChange(newSelectedValues);
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
            <SelectRadix.Trigger id={id} aria-invalid="true" disabled={isLoading || disabled} className={trigger()}>
              <SelectRadix.Value placeholder={placeholder} />
              <SelectRadix.Icon className={triggerIcon()}>
                <FontAwesomeIcon icon={faChevronDown} />
              </SelectRadix.Icon>
            </SelectRadix.Trigger>

            <SelectRadix.Portal>
              <SelectRadix.Content position="popper" className={twMerge(content(), className)}>
                <SelectRadix.Viewport className={arrow()}>
                  <SelectRadix.Group>
                    {React.Children.map(children, (child) => {
                      if (React.isValidElement(child)) {
                        const optionValue = child.props.value;
                        const isSelected = internalSelectedValues.includes(optionValue);

                        return React.cloneElement(child as React.ReactElement<ISelectItemProps>, {
                          isSelected,
                          onMouseDown: () => handleOptionClick(optionValue),
                        });
                      }
                      return null;
                    })}
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
