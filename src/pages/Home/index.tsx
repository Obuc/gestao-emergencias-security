import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import BayerLogoWhite from '../../components/Icons/BayerLogoWhite';

import { Button } from '../../components/Button';
import { appContext } from '../../context/appContext';
import BgGradient from '../../components/Icons/BgGradient';
import Select, { SelectItem } from '../../components/Select';

const Home = () => {
  const { sites, isLoadingSites } = appContext();
  const [site, setSite] = useState<string>('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (!site) return;

    localStorage.setItem('user_site', site);
    navigate('/records');
  };

  useEffect(() => {
    const site = localStorage.getItem('user_site');

    if (site) {
      navigate('/records');
    }
  }, []);

  return (
    <div className="h-screen w-full bg-bg-home flex text-white">
      <div className="w-[14.125rem] bg-primary [clip-path:polygon(0%_0%,100%_0%,100%_0%,0%_80%)] py-7 flex justify-center">
        <BayerLogoWhite />
      </div>

      <div className="w-[40rem] flex flex-col justify-center items-center ">
        <div className="text-5xl font-bold flex justify-center items-center gap-5 py-12">
          <span className="text-6xl max-w-[23.6875rem] font-bold">Gestão de Emergência</span>
        </div>

        <div className="flex flex-col gap-2 bg-[#0b273633] px-14 py-12 rounded-sm">
          <div className="flex flex-col gap-2 ">
            <span className="text-lg">
              <FontAwesomeIcon icon={faLocationDot} /> Escolha o site
            </span>

            <Select
              id="county_id"
              name="county_id"
              className="w-[22.25rem]"
              value={site}
              isLoading={isLoadingSites}
              onValueChange={(value) => setSite(value)}
            >
              {sites?.length &&
                sites.map((item) => (
                  <SelectItem key={item.Id} value={item.Title}>
                    {item.Title}
                  </SelectItem>
                ))}
            </Select>
          </div>

          <div className="self-end mt-2 -mr-1">
            <Button.Root className="w-[11.25rem] h-10" onClick={handleStart} fill disabled={site === ''}>
              <Button.Label>Iniciar</Button.Label>
            </Button.Root>
          </div>
        </div>
      </div>

      <div
        className="flex-1 h-full bg-cover [clip-path:polygon(25%_0%,100%_0%,100%_100%,0%_100%)] bg-right relative flex flex-col items-center justify-center"
        style={{
          backgroundImage: 'url("./assets/bombeiros.png")',
        }}
      >
        <div className="absolute bottom-0 left-0 w-full">
          <BgGradient />
        </div>
      </div>

      <div className="w-[22.125rem] h-full absolute top-0 right-0 [clip-path:polygon(90%_0%,100%_0%,100%_100%,0%_100%)] bg-primary/70"></div>
    </div>
  );
};

export default Home;
