import * as Dialog from '@radix-ui/react-dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { twMerge } from 'tailwind-merge';

interface IModalProps {
  open: boolean;
  onOpenChange: () => void;
  title: string;
  className?: string;
  children: React.ReactNode;
}

const Modal = ({ open, onOpenChange, title, className, children }: IModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-primary-opacity data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content
          className={twMerge(
            'data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-w-[54.625rem] translate-x-[-50%] translate-y-[-50%] bg-white shadow focus:outline-none',
            className,
          )}
        >
          <Dialog.Title className="h-16 w-full flex bg-[#F1F1F1] items-center text-xl text-primary ">
            <div className="h-full w-[4.6875rem] mr-6 polygon bg-primary" />
            {title}
          </Dialog.Title>

          <div className="py-6 px-8">{children}</div>

          <Dialog.Close asChild>
            <button
              className="text-pink absolute top-[.625rem] right-[1rem] inline-flex h-[2.5rem] w-[2.5rem] appearance-none items-center justify-center focus:outline-none hover:bg-pink hover:text-white duration-100"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
