import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import Spinner from '@/components/Spinner';
import { useHome } from './hooks/home.hook';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import BackgroundImage from '@/assets/bombeiros.png';
import BayerLogoWhite from '@/components/Icons/BayerLogoWhite';

const Home = () => {
  const navigate = useNavigate();
  // const { pathname } = useLocation();
  const { sites } = useHome();

  const [site, setSite] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // const equipments_value = pathname.split('/')[2];
  // const localSite = localStorage.getItem('user_site');

  const handleStart = () => {
    if (!site) return;

    // if (site === 'SPO') {
    //   window.location.href = 'https://bayergroup.sharepoint.com/sites/005070/system/index_brigada.html';
    //   return;
    // }

    navigate(`/${site.toLowerCase()}/records/extinguisher`);
    localStorage.setItem('user_site', site);
  };

  // useEffect(() => {
  //   if (localSite && localSite?.length > 0) {
  //     navigate(`/records/${equipments_value?.length > 0 ? equipments_value : 'extinguisher'}`);
  //   }
  // }, [localSite, equipments_value]);

  return (
    <div className="flex h-screen overflow-hidden bg-cover relative">
      {loading && (
        <div className="absolute top-0 left-0 z-50 h-full w-full flex justify-center items-center bg-[linear-gradient(49deg,_#10384F_16%,_#ff3162f2_96%)] ">
          <div className="w-[26.125rem] h-[20.25rem] bg-white shadow-lg-app border border-[#ffffffa1] rounded-lg flex flex-col justify-center items-center gap-10">
            <Spinner />
            <span className="text-[#2D2D2D] text-xl">Carregando informações...</span>
          </div>
        </div>
      )}

      <img
        src={BackgroundImage}
        className="absolute w-full h-full object-cover object-bottom"
        onLoad={() => setLoading(false)}
      />

      <div className="flex h-full w-full absolute bg-[linear-gradient(230deg,_#10384f30_19%,_#fa3162b8_96%)]">
        <div
          className="flex-1
        [clip-path:polygon(0%_0%,95%_0%,75%_100%,0%_100%)]
        bg-[linear-gradient(49deg,_#10384F_16%,_#ff3162f2_96%)]
        "
        >
          <div className="flex flex-col h-full p-14">
            <div className="flex gap-6 items-center">
              <BayerLogoWhite />
              <h1 className="text-white text-4xl font-medium">Business Security Brasil</h1>
            </div>

            <div className="flex flex-col flex-1 justify-center h-full ml-[12.5rem] gap-8 text-white">
              <h2 className="text-6xl max-w-[23.6875rem] font-bold">Gestão de Emergência</h2>

              <div className="flex flex-col max-w-[29.25rem] gap-2 bg-[#0b273633] px-14 py-12 rounded-sm">
                <div className="flex flex-col gap-2 ">
                  <span className="text-lg">
                    <FontAwesomeIcon icon={faLocationDot} /> Escolha o site
                  </span>

                  <Select.Component
                    id="county_id"
                    name="county_id"
                    className="w-[22.25rem]"
                    popperWidth="w-[22.25rem]"
                    mode="gray"
                    value={site}
                    isLoading={sites.isLoading}
                    onValueChange={(value) => setSite(value)}
                  >
                    {sites.data?.length &&
                      sites.data.map((item) => (
                        <Select.Item key={item.Id} value={item.Title}>
                          {item.Title}
                        </Select.Item>
                      ))}
                  </Select.Component>
                </div>

                <div className="self-end mt-2 -mr-1">
                  <Button.Root className="w-[11.25rem] h-10" onClick={handleStart} fill disabled={site === ''}>
                    <Button.Label>Iniciar</Button.Label>
                  </Button.Root>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[50rem]"></div>
      </div>
      <span
        className="absolute rotate-12 scale-105 h-full bg-white w-px
      min-[1100px]:left-[50%] min-[1100px]:top-[50%] min-[1100px]:-translate-y-[50%]
      min-[1500px]:left-[51%] min-[1500px]:top-[51%] min-[1500px]:-translate-y-[51%]
      min-[1800px]:left-[53.5%] min-[1800px]:top-[53.5%] min-[1800px]:-translate-y-[53.5%]
      "
      />
    </div>
  );
};

export default Home;
