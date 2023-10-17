import { Dispatch, SetStateAction } from 'react';
import * as ToastRadix from '@radix-ui/react-toast';
import {
  faXmark,
  faCircleExclamation,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IToastProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  type: 'error' | 'success';
}

const Toast = ({ children, open, onOpenChange, type }: IToastProps) => {
  return (
    <ToastRadix.Provider swipeDirection="right">
      <ToastRadix.Root
        className="bg-white text-primary shadow-md rounded-sm p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-ToastRadix-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
        open={open}
        onOpenChange={onOpenChange}
      >
        <ToastRadix.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
          {type === 'error' && (
            <div>
              <FontAwesomeIcon
                className="text-[#D32929]"
                icon={faCircleExclamation}
              />{' '}
              Erro
            </div>
          )}

          {type === 'success' && (
            <div>
              <FontAwesomeIcon
                className="text-[#89D329]"
                icon={faCircleCheck}
              />{' '}
              Success
            </div>
          )}
        </ToastRadix.Title>
        <ToastRadix.Description asChild>
          <div className="[grid-area:_description] m-0 text-slate11 text-[13px] leading-[1.3]">
            {children}
          </div>
        </ToastRadix.Description>
        <ToastRadix.Action
          className="[grid-area:_action]"
          asChild
          altText="Goto schedule to undo"
        >
          <button className="text-pink text-xl inline-flex items-center justify-center rounded font-medium px-[10px] leading-[25px] h-[25px]">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </ToastRadix.Action>
      </ToastRadix.Root>
      <ToastRadix.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </ToastRadix.Provider>
  );
};

export default Toast;
