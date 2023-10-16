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
import useEqHydrants from '../../hooks/useEqHydrants';
import { Button } from '../../../../components/Button';
import TextField from '../../../../components/TextField';
import BXOLogo from '../../../../components/Icons/BXOLogo';
import SPOLogo from '../../../../components/Icons/SPOLogo';

const EqHydrantsModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const pdfContainerRef = useRef(null);
  const site_value = localStorage.getItem('user_site');

  const [showQrCode, setShowQrCode] = useState(false);
  const [hydrantItem, setHydrantItem] = useState<boolean | null>(null);

  const { eqHydrantModal, isLoadingEqHydrantModal, qrCodeValue } = useEqHydrants();

  useEffect(() => {
    if (params?.id) {
      setHydrantItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setHydrantItem(null);
    navigate('/equipments/hydrants');
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
              saveAs(blob, `QRCode - ${eqHydrantModal?.cod_hidrante} - ${site_value}.jpeg`);
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
      open={hydrantItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Equipamento Hidrante N°${params.id}`}
    >
      <>
        <div className="pt-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="cod_hidrante"
              name="cod_hidrante"
              label="N° Hidrante"
              width="w-[10rem]"
              value={eqHydrantModal?.cod_hidrante ?? ''}
              isLoading={isLoadingEqHydrantModal}
            />

            <TextField
              disabled
              id="site"
              name="site"
              label="Site"
              width="w-[10rem]"
              value={eqHydrantModal?.site ?? ''}
              isLoading={isLoadingEqHydrantModal}
            />

            <TextField
              disabled
              id="predio"
              name="predio"
              label="Prédio"
              width="w-[10rem]"
              value={eqHydrantModal?.predio ?? ''}
              isLoading={isLoadingEqHydrantModal}
            />

            <TextField
              disabled
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              value={eqHydrantModal?.pavimento ?? ''}
              isLoading={isLoadingEqHydrantModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="local"
              name="local"
              label="Local"
              value={eqHydrantModal?.local ?? ''}
              isLoading={isLoadingEqHydrantModal}
            />

            <TextField
              disabled
              id="possui_abrigo"
              name="possui_abrigo"
              label="Possui Abrigo ?"
              width="w-[10rem]"
              value={eqHydrantModal?.possui_abrigo ? 'Sim' : 'Não' ?? ''}
              isLoading={isLoadingEqHydrantModal}
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
                  <span className="font-medium text-sm italic">{`Hidrante/${eqHydrantModal?.site}/${eqHydrantModal?.predio}/${eqHydrantModal?.pavimento}`}</span>

                  {eqHydrantModal?.site === 'BXO' && <BXOLogo height="50" width="45" />}
                  {eqHydrantModal?.site === 'SPO' && <SPOLogo height="50" width="45" />}
                </div>
              </div>
            </div>
          )}

          <Button.Root
            fill
            disabled={isLoadingEqHydrantModal}
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
          {!eqHydrantModal?.history?.length && !isLoadingEqHydrantModal && <CardEmpy />}
          {isLoadingEqHydrantModal && <CardSkeleton />}

          {eqHydrantModal?.history &&
            eqHydrantModal?.history.map((item) => {
              const cardVariant = item.conforme ? 'new' : 'noncompliant';
              const cardTitle = item.conforme ? 'Nova Verificação' : 'Verificação Inconforme';
              const cardDate = format(new Date(item.Created), 'dd MMM yyyy', { locale: ptBR });

              return (
                <EquipmentCard.Root key={item.Id} variant={cardVariant}>
                  <EquipmentCard.Header title={cardTitle} link={`/records/hydrants/${item.Id}`} />
                  <EquipmentCard.Content date={cardDate} responsible={item.bombeiro.Title} action={item.observacao} />
                </EquipmentCard.Root>
              );
            })}
        </div>
      </>
    </Modal>
  );
};

export default EqHydrantsModal;
