import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

interface IEquipmentCardHeaderProps {
  title: string;
  link: string;
}

export const EquipmentCardHeader = ({ title, link }: IEquipmentCardHeaderProps) => {
  return (
    <div className="flex w-full h-10 justify-between pb-4  border-b-[.0625rem] border-b-[#ADADAD]">
      <span className="text-xl h-10 font-semibold">{title}</span>
      <a href={link} target="_blank" className="uppercase flex gap-2 justify-center items-center cursor-default">
        Visualizar Registro <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
      </a>
    </div>
  );
};
