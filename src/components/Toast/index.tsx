import { Dispatch, SetStateAction } from 'react';
import * as ToastRadix from '@radix-ui/react-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

interface IToastProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  type: 'error' | 'success';
}

const Toast = ({ children, open, onOpenChange, type }: IToastProps) => {
  return (
    <ToastRadix.Provider swipeDirection="right">
      <ToastRadix.Root
        data-error-type={type}
        className="data-[error-type=success]:bg-[#F7FFF0] data-[error-type=error]:bg-[#FFE4EB] text-[#1E1E1E] text-lg font-semibold border data-[error-type=success]:border-[#C7DFBC] data-[error-type=error]:border-[#FFC1D0] rounded shadow-md p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-ToastRadix-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
        open={open}
        onOpenChange={onOpenChange}
      >
        <ToastRadix.Description asChild>
          <>
            {type === 'success' && (
              <div className="flex items-center gap-5 [grid-area:_description] m-0 text-slate11 text-[13px] leading-[1.3]">
                <FontAwesomeIcon className="text-[#46CC40] text-[2.625rem]" icon={faCircleCheck} /> {children}
              </div>
            )}

            {type === 'error' && (
              <div className="flex items-center gap-5 [grid-area:_description] m-0 text-slate11 text-[13px] leading-[1.3]">
                <FontAwesomeIcon className="text-[#FF3162] text-[2.625rem]" icon={faCircleExclamation} /> {children}
              </div>
            )}
          </>
        </ToastRadix.Description>
      </ToastRadix.Root>
      <ToastRadix.Viewport className="[--viewport-padding:_25px] fixed bottom-0 left-[40%] flex flex-col p-[var(--viewport-padding)] gap-[10px] max-w-[34.375rem] m-0 list-none z-[2147483647] outline-none" />
    </ToastRadix.Provider>
  );
};

export default Toast;
