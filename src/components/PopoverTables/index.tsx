import * as PopoverRadix from '@radix-ui/react-popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

interface IPopoverProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PopoverTables = ({ onEdit, onDelete, onView }: IPopoverProps) => (
  <PopoverRadix.Root>
    <PopoverRadix.Trigger asChild>
      <button className="cursor-pointer outline-none w-10 h-10">
        <FontAwesomeIcon icon={faEllipsisVertical} fontSize="22px" />
      </button>
    </PopoverRadix.Trigger>
    <PopoverRadix.Portal>
      <PopoverRadix.Content
        className="rounded-sm w-[9.375rem] shadow-md-app bg-white will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
        sideOffset={5}
      >
        <div className="flex flex-col">
          <PopoverItem label="Visualizar" icon={<FontAwesomeIcon icon={faEye} />} onClick={onView} />
          <PopoverItem label="Editar" icon={<FontAwesomeIcon icon={faPencil} />} onClick={onEdit} />
          <PopoverItem label="Excluir" icon={<FontAwesomeIcon icon={faTrash} />} onClick={onDelete} />
        </div>
        <PopoverRadix.Arrow className="fill-white" />
      </PopoverRadix.Content>
    </PopoverRadix.Portal>
  </PopoverRadix.Root>
);

interface IPopoverItemProps extends React.InputHTMLAttributes<HTMLDivElement> {
  label: string;
  icon: React.ReactNode;
}

const PopoverItem = ({ label, icon, ...props }: IPopoverItemProps) => {
  return (
    <div {...props} className="cursor-pointer h-10 flex px-6 items-center gap-3 hover:bg-primary-opacity text-primary">
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default PopoverTables;
