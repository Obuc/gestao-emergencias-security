import QRCode from 'qrcode.react';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { ptBR } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

import CardEmpy from '../ui/CardEmpy';
import { EquipmentCard } from '../ui/Card';
import CardSkeleton from '../ui/CardSkeleton';
import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import TextField from '../../../../components/TextField';
import BXOLogo from '../../../../components/Icons/BXOLogo';
import SPOLogo from '../../../../components/Icons/SPOLogo';
import useEqGovernanceValve from '../../hooks/useEqGovernanceValve';

const EqGovernanceValveModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const pdfContainerRef = useRef(null);
  const site_value = localStorage.getItem('user_site');

  const [showQrCode, setShowQrCode] = useState(false);
  const [governanceValveItem, setGovernanceValveItem] = useState<boolean | null>(null);

  const { eqEqGovernanceValveModal, isLoadingEqEqGovernanceValveModal, qrCodeValue } = useEqGovernanceValve();

  useEffect(() => {
    if (params?.id) {
      setGovernanceValveItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setGovernanceValveItem(null);
    navigate('/equipments/valves');
  };

  const generateQrCodePdf = () => {
    const element = document.getElementById('container');

    if (element) {
      html2canvas(element, {
        useCORS: true,
        scale: 10,
      })
        .then((canvas) => {
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, `QRCode - ${eqEqGovernanceValveModal?.cod_equipamento} - ${site_value}.jpeg`);
            }
          }, 'image/jpeg');
        })
        .catch((error) => {
          console.error('Erro ao gerar o PDF:', error);
        });
    }
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={governanceValveItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Equipamento Válvula de Governo N°${params.id}`}
    >
      <>
        <div className="pt-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="cod_equipamento"
              name="cod_equipamento"
              label="N° Válvula"
              width="w-[10rem]"
              value={eqEqGovernanceValveModal?.cod_equipamento ?? ''}
              isLoading={isLoadingEqEqGovernanceValveModal}
            />

            <TextField
              disabled
              id="site"
              name="site"
              label="Site"
              width="w-[10rem]"
              value={eqEqGovernanceValveModal?.site ?? ''}
              isLoading={isLoadingEqEqGovernanceValveModal}
            />

            <TextField
              disabled
              id="predio"
              name="predio"
              label="Prédio"
              width="w-[10rem]"
              value={eqEqGovernanceValveModal?.predio ?? ''}
              isLoading={isLoadingEqEqGovernanceValveModal}
            />

            <TextField
              disabled
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              value={eqEqGovernanceValveModal?.pavimento ?? ''}
              isLoading={isLoadingEqEqGovernanceValveModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="local"
              name="local"
              label="Local"
              value={eqEqGovernanceValveModal?.local ?? ''}
              isLoading={isLoadingEqEqGovernanceValveModal}
            />
          </div>
        </div>

        <div className="w-full p-4 gap-3 flex flex-col justify-center items-center my-10 bg-[#00354F0F]">
          {showQrCode && (
            <div
              ref={pdfContainerRef}
              id="container"
              className="w-full h-full p-4 flex flex-col justify-center items-center gap-10"
            >
              <div className="flex flex-col justify-center w-[20rem] items-center gap-6 bg-white border-[.0625rem]">
                <div className="uppercase text-lg font-semibold py-4 m-auto bg-bg-home w-full text-center text-white">
                  Gestão de Emergência
                </div>

                <div className="px-2 py-2 gap-3 flex flex-col justify-center items-center">
                  <QRCode renderAs="svg" value={qrCodeValue} size={150} fgColor="#000" bgColor="#fff" />
                  <span className="font-medium text-sm italic">{`Valvula/${eqEqGovernanceValveModal?.site}/${eqEqGovernanceValveModal?.predio}/${eqEqGovernanceValveModal?.pavimento}`}</span>

                  {eqEqGovernanceValveModal?.site === 'BXO' && <BXOLogo height="50" width="45" />}
                  {eqEqGovernanceValveModal?.site === 'SPO' && <SPOLogo height="50" width="45" />}
                </div>
              </div>
            </div>
          )}

          <Button.Root
            fill
            disabled={isLoadingEqEqGovernanceValveModal}
            className="w-[13.75rem] h-10"
            onClick={() => {
              generateQrCodePdf();
              setShowQrCode(true);
            }}
          >
            <Button.Label>Baixar QRCode</Button.Label>
            <Button.Icon icon={faExpand} />
          </Button.Root>
        </div>

        <div className="py-4 px-8 gap-2">
          {!eqEqGovernanceValveModal?.history?.length && !isLoadingEqEqGovernanceValveModal && <CardEmpy />}
          {isLoadingEqEqGovernanceValveModal && <CardSkeleton />}

          {eqEqGovernanceValveModal?.history &&
            eqEqGovernanceValveModal?.history.map((item) => {
              const cardVariant = item.conforme ? 'new' : 'noncompliant';
              const cardTitle = item.conforme ? 'Nova Verificação' : 'Verificação Inconforme';
              const cardDate = item.data_legado
                ? format(new Date(item.data_legado), 'dd MMM yyyy', { locale: ptBR })
                : format(new Date(item.Created), 'dd MMM yyyy', { locale: ptBR });

              return (
                <EquipmentCard.Root key={item.Id} variant={cardVariant}>
                  <EquipmentCard.Header title={cardTitle} link={`/records/valves/${item.Id}`} />
                  <EquipmentCard.Content
                    date={cardDate}
                    responsible={item.bombeiro_id.Title}
                    action={item.observacao}
                  />
                </EquipmentCard.Root>
              );
            })}
        </div>
      </>
    </Modal>
  );
};

export default EqGovernanceValveModal;
