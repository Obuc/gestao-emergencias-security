import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';

import LayoutBase from '../../../../layout/LayoutBase';
import { Button } from '../../../../components/Button';
import useEquipmentsExtinguisher from './hooks/equipments-extinguisher.hook';
import EquipmentsExtinguisherTable from './components/equipments-extinguisher-table';
import EquipmentsExtinguisherQrcodeModal from './components/equipments-extinguisher-qrcode-modal';

const EquipmentsExtinguisher = () => {
  const navigate = useNavigate();
  const localSite = localStorage.getItem('user_site');
  const [openModalGenerateQRCode, setOpenModalGenerateQRCode] = useState<boolean | null>(null);

  const { mutateExportExcel } = useEquipmentsExtinguisher();

  useEffect(() => {
    if (localSite === null) {
      navigate('/');
    }
  }, [localSite]);

  return (
    <LayoutBase showMenu>
      <div className="flex flex-col w-full justify-between bg-[#F1F1F1]">
        <div className="flex flex-col p-8">
          <div className="flex pb-8 items-center w-full justify-between">
            <div className="flex gap-2">
              <Button.Root
                className="min-w-[14.0625rem] h-10"
                disabled={mutateExportExcel.isLoading}
                onClick={() => mutateExportExcel.mutate()}
              >
                {mutateExportExcel.isLoading ? (
                  <Button.Spinner />
                ) : (
                  <>
                    <Button.Label>Exportar Planilha</Button.Label>
                    <Button.Icon icon={faDownload} />
                  </>
                )}
              </Button.Root>

              <Button.Root className="w-[14.0625rem] h-10" fill onClick={() => setOpenModalGenerateQRCode(true)}>
                <Button.Label>Gerar QRCode</Button.Label>
                <Button.Icon icon={faExpand} />
              </Button.Root>
            </div>
          </div>

          <EquipmentsExtinguisherTable />
        </div>
      </div>

      {openModalGenerateQRCode && (
        <EquipmentsExtinguisherQrcodeModal
          open={openModalGenerateQRCode}
          onOpenChange={() => setOpenModalGenerateQRCode(null)}
        />
      )}
    </LayoutBase>
  );
};

export default EquipmentsExtinguisher;
