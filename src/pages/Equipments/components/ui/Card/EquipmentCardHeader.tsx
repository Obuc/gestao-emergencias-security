import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface IEquipmentCardHeaderProps {
  title: string;
  link: string;
}

export const EquipmentCardHeader = ({ title, link }: IEquipmentCardHeaderProps) => {
  const navigate = useNavigate();

  const handleOpenLink = () => {
    navigate(link);
  };

  return (
    <div className="flex w-full h-10 justify-between pb-4  border-b-[.0625rem] border-b-[#ADADAD]">
      <span className="text-xl h-10 font-semibold">{title}</span>
      <div onClick={handleOpenLink} className="uppercase flex gap-2 justify-center items-center cursor-default">
        Visualizar Registro <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
      </div>
    </div>
  );
};
