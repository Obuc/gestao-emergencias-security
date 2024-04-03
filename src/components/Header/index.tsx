import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import Avatar from '../Avatar';
import Tooltip from '../Tooltip';
import BXOLogo from '../Icons/BXOLogo';
import SPOLogo from '../Icons/SPOLogo';
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
  const site = localStorage.getItem('user_site');

  const handleChangeSite = () => {
    localStorage.removeItem('user_site');
    localStorage.removeItem('equipments_value');

    navigate('/');
  };

  return (
    <>
      <div className="flex justify-between items-center max-h-28 shadow-md-app w-screen py-4 px-28 relative">
        <BackButton />

        <div className="flex items-center">
          <img className="w-16 h-16 mr-9" src={BayerLogo} alt="Logo da Bayer" />

          <div className="flex text-2xl gap-2 text-primary-font select-none">
            <h2>Business Security Brasil</h2>
            <span className=" font-bold text-red">///</span>
            <h1 className="font-bold">Gestão Sistema de Emergência</h1>
          </div>
        </div>

        <div className="flex h-full  items-center gap-5">
          <Tooltip label="Alterar Site">
            <div
              onClick={handleChangeSite}
              className="cursor-pointer px-4 py-2 bg-[#F6F6F6] shadow-xs-primary-app text-primary-font flex justify-center items-center gap-2"
            >
              {site === 'BXO' && <BXOLogo />}
              {site === 'SPO' && <SPOLogo />}
              <span className="font-medium">Site {site}</span>
            </div>
          </Tooltip>

          <Tooltip label="Inicio">
            <IconButton onClick={() => navigate('/')}>
              <FontAwesomeIcon
                className={`transition-all ease-in delay-150 w-7 h-7 cursor-pointer text-3xl text-primary-font`}
                icon={faHouse}
              />
            </IconButton>
          </Tooltip>

          {user && (
            <>
              <div className="w-11 h-11 rounded-full shadow flex justify-center items-center ">
                <Avatar image={user.photo ? user.photo : undefined} username={user?.Title} />
              </div>
              <div className="flex flex-col gap-1 select-none ml-3">
                <span className="font-bold text-primary-font">{user?.Title}</span>
                <span className="text-[.875rem] italic text-primary-font">
                  {user?.isAdmin ? 'Administrador' : 'Usuário Comum'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
