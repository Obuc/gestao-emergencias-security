import * as Dialog from '@radix-ui/react-dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../Button';

interface IRemoveItemProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean | null>>;
  isLoading: boolean;
  handleRemove: () => Promise<void>;
}

const RemoveItem = ({ open, onOpenChange, isLoading, handleRemove }: IRemoveItemProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-primary-opacity data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content
          className="
            data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] w-[31.4375rem]
            max-w-[54.625rem] translate-x-[-50%] translate-y-[-50%] bg-white shadow focus:outline-none
           "
        >
          <Dialog.Title className="h-16 w-full flex bg-[#F1F1F1] items-center text-xl text-primary ">
            <div className="h-full w-[4.6875rem] mr-6 polygon bg-primary" />
            Excluir
          </Dialog.Title>

          <div className="pt-9 pb-8 flex flex-col gap-8 justify-center items-center w-full">
            <span className="text-primary text-xl">Você deseja realmente excluir?</span>
            <div className="flex gap-2">
              <Button.Root onClick={() => onOpenChange(null)} className="w-[10rem] h-10">
                <Button.Label>Cancelar</Button.Label>
              </Button.Root>

              <Button.Root disabled={isLoading} fill onClick={handleRemove} className="w-[10rem] h-10">
                {isLoading ? <Button.Spinner /> : <Button.Label>Confirmar</Button.Label>}
              </Button.Root>
            </div>
          </div>

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

export default RemoveItem;
