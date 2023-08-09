import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowLeft, faLocationDot, faGear } from '@fortawesome/free-solid-svg-icons';

// import Avatar from '../Avatar';
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
  // const { loggedUser } = useAuth();

  const { user } = userContext();

  console.log(user);

  const site = localStorage.getItem('site_home');

  return (
    <>
      <div className="flex justify-between items-center max-h-28 shadow-md-app w-screen py-4 px-28 relative">
        <BackButton />

        <div className="flex items-center">
          <img className="w-16 h-16 mr-9" src={BayerLogo} alt="Logo da Bayer" />

          <div className="flex text-2xl gap-2 text-primary select-none">
            <h2>SPP</h2>
            <span className=" font-bold text-blue">///</span>
            <h1 className="font-bold">Passes & Id</h1>
          </div>
        </div>

        <div className="flex h-full  items-center gap-2">
          {/* {loggedUser.role === 1 && (
            <Tooltip label="Selecionar site">
              <div onClick={() => navigate('/')} className="flex gap-2 pr-4 justify-center items-center cursor-pointer">
                <FontAwesomeIcon className="text-blue text-xl" icon={faLocationDot} />{' '}
                <span className="text-primary font-medium">{site}</span>
              </div>
            </Tooltip>
          )}

          {loggedUser.role === 3 && (
            <Tooltip label="Painel Administração">
              <IconButton onClick={() => navigate('/admin')}>
                <FontAwesomeIcon
                  className={`transition-all ease-in delay-150 w-7 h-7 cursor-pointer text-3xl text-primary`}
                  icon={faGear}
                />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip label="Inicio">
            <IconButton onClick={() => navigate('/')}>
              <FontAwesomeIcon
                className={`transition-all ease-in delay-150 w-7 h-7 cursor-pointer text-3xl text-primary`}
                icon={faHouse}
              />
            </IconButton>
          </Tooltip>

          {loggedUser && (
            <>
              <div className="w-11 h-11 ml-10 rounded-full shadow flex justify-center items-center ">
                <Avatar
                  image={loggedUser.photo ? URL.createObjectURL(loggedUser.photo) : undefined}
                  username={loggedUser.name}
                />
              </div>
              <div className="flex flex-col gap-1 select-none ml-3">
                <span className="font-bold text-primary">{loggedUser.name}</span>
                <span className="text-[.875rem] italic text-primary">
                  {loggedUser.role === 1 && 'Host'}
                  {loggedUser.role === 2 && 'Passes & Id'}
                  {loggedUser.role === 3 && 'Administrador'}
                </span>
              </div>
            </>
          )} */}
        </div>
      </div>
    </>
  );
};

export default Header;
