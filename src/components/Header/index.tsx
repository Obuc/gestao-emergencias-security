import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import Avatar from '../Avatar';
import Tooltip from '../Tooltip';
import BayerLogo from '../../assets/Bayer Cross.svg';
import { userContext } from '../../context/userContext';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(-1)}
      className="cursor-pointer transition-all ease-in delay-150 flex justify-center pr-2 items-center h-12 w-14 bg-primary-opacity absolute left-0 bottom-0 polygon hover:w-16 hover:bg-primary"
    >
      <FontAwesomeIcon className="text-white" icon={faArrowLeft} />
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const { user } = userContext();

  return (
    <>
      <div className="flex justify-between items-center max-h-28 shadow-md-app w-screen py-4 px-28 relative">
        <BackButton />

        <div className="flex items-center">
          <img className="w-16 h-16 mr-9" src={BayerLogo} alt="Logo da Bayer" />

          <div className="flex text-2xl gap-2 text-primary select-none">
            <h2>Business Security Brasil</h2>
            <span className=" font-bold text-red">///</span>
            <h1 className="font-bold">Gestão Sitema de Emergência</h1>
          </div>
        </div>

        <div className="flex h-full  items-center gap-2">
          <Tooltip label="Inicio">
            <IconButton onClick={() => navigate('/')}>
              <FontAwesomeIcon
                className={`transition-all ease-in delay-150 w-7 h-7 cursor-pointer text-3xl text-primary`}
                icon={faHouse}
              />
            </IconButton>
          </Tooltip>

          {user && (
            <>
              <div className="w-11 h-11 ml-10 rounded-full shadow flex justify-center items-center ">
                <Avatar image={user.photo ? user.photo : undefined} username={user?.Title} />
              </div>
              <div className="flex flex-col gap-1 select-none ml-3">
                <span className="font-bold text-primary">{user.Title}</span>
                <span className="text-[.875rem] italic text-primary">Administrador</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
