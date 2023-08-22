import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import BayerLogoWhite from '../../components/Icons/BayerLogoWhite';
import BgGradient from '../../components/Icons/BgGradient';

const Home = () => {
  return (
    <div className="h-screen w-full bg-bg-home flex text-white">
      <div className="w-[14.125rem] bg-primary [clip-path:polygon(0%_0%,100%_0%,100%_0%,0%_90%)] py-7 flex justify-center">
        <BayerLogoWhite />
      </div>

      <div className="w-[40rem] flex flex-col justify-center items-center ">
        <div className="text-5xl font-bold flex justify-center items-center gap-5 py-12">
          <span className="text-5xl font-bold">Passes & ID</span>
        </div>

        <div className="flex flex-col gap-2 w-[25rem] bg-[#133C53] px-6 py-4 rounded-sm">
          <div className="flex flex-col gap-2 ">
            <span className="text-lg">
              <FontAwesomeIcon icon={faLocationDot} /> Escolha o site
            </span>

            {/* <Select
                id="county_id"
                name="county_id"
                className="w-[22.25rem]"
                mode="dark"
                value={site}
                onValueChange={(value) => setSite(value)}
              >
                {sites?.length &&
                  sites.map((item) => (
                    <SelectItem key={item.id} value={item.title}>
                      {item.title}
                    </SelectItem>
                  ))}
              </Select> */}
          </div>

          {/* {site && (
              <div className="self-end mt-2 -mr-1">
                <Button lg onClick={handleStart}>
                  Iniciar
                </Button>
              </div>
            )} */}
        </div>

        {/* {loggedUser.role !== 1 && (
          <div className="self-center mt-2 -mr-1">
            <Button fill lg onClick={handleStart} width="24.0625rem">
              Entrar
            </Button>
          </div>
        )} */}
      </div>

      <div
        className="flex-1 h-full bg-cover [clip-path:polygon(25%_0%,100%_0%,100%_100%,0%_100%)] bg-right relative flex flex-col items-center justify-center"
        style={{
          backgroundImage: 'url("/bombeiros.png")',
        }}
      >
        <div className="absolute bottom-0 left-0 w-full">
          <BgGradient />
        </div>
      </div>

      <div className="w-[22.125rem] h-full absolute top-0 right-0 [clip-path:polygon(75%_0%,100%_0%,100%_100%,0%_100%)] bg-primary/70"></div>
    </div>
  );
};

export default Home;
