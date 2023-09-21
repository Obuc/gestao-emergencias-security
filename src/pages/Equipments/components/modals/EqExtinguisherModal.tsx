import QRCode from 'qrcode.react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { ptBR } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

import { saveAs } from 'file-saver';

import CardEmpy from '../ui/CardEmpy';
import { EquipmentCard } from '../ui/Card';
import CardSkeleton from '../ui/CardSkeleton';
import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import TextField from '../../../../components/TextField';
import useEqExtinguisher from '../../hooks/useEqExtinguisher';
import BayerLogoBlack from '../../../../components/Icons/BayerLogoBlack';

const EqExtinguisherModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const pdfContainerRef = useRef(null);

  const [showQrCode, setShowQrCode] = useState(false);
  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);
  const { eqExtinguisherModal, isLoadingEqExtinguisherModal, qrCodeExtinguisherValue } = useEqExtinguisher();

  useEffect(() => {
    if (params?.id) {
      setExtinguisherItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setExtinguisherItem(null);
    navigate('/equipments');
  };

  const generateQrCodePdf = () => {
    if (pdfContainerRef.current) {
      html2canvas(pdfContainerRef.current, {
        useCORS: true,
        scale: 10,
      })
        .then((canvas) => {
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, 'captured_image.jpeg');
            }
          }, 'image/jpeg');
          setShowQrCode(false);
        })
        .catch((error) => {
          console.error('Erro ao gerar o PDF:', error);
        });
    }
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={extinguisherItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Extintor N°${params.id}`}
    >
      <>
        <div className="pt-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="cod_extintor"
              name="cod_extintor"
              label="N° Extintor"
              value={eqExtinguisherModal?.cod_extintor ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="site"
              name="site"
              label="Site"
              width="w-[10rem]"
              value={eqExtinguisherModal?.site ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="predio"
              name="predio"
              label="Prédio"
              width="w-[10rem]"
              value={eqExtinguisherModal?.predio ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="tipo_extintor"
              name="tipo_extintor"
              label="Tipo Extintor"
              width="w-[12rem]"
              value={eqExtinguisherModal?.tipo_extintor ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              value={eqExtinguisherModal?.pavimento ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="local"
              name="local"
              label="Local"
              value={eqExtinguisherModal?.local ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="massa"
              name="massa"
              label="Massa"
              width="w-[8rem]"
              value={eqExtinguisherModal?.massa ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
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
                  <QRCode value={qrCodeExtinguisherValue} size={160} fgColor="#000" bgColor="#fff" />
                  <span className="font-medium text-sm italic">{`Extintor/${eqExtinguisherModal?.predio}/${eqExtinguisherModal?.pavimento}/${eqExtinguisherModal?.local}`}</span>

                  <BayerLogoBlack />
                </div>
              </div>
            </div>
          )}

          <Button.Root
            fill
            disabled={isLoadingEqExtinguisherModal}
            className="w-[13.75rem] h-10"
            onClick={() => {
              generateQrCodePdf();
              setShowQrCode(true);
            }}
          >
            <Button.Label>
              {showQrCode && 'Baixar QRCode'} {!showQrCode && 'Gerar QRCode'}
            </Button.Label>
            <Button.Icon icon={faExpand} />
          </Button.Root>
        </div>

        <div className="py-4 px-8">
          {!eqExtinguisherModal?.history?.length && !isLoadingEqExtinguisherModal && <CardEmpy />}
          {isLoadingEqExtinguisherModal && <CardSkeleton />}

          {eqExtinguisherModal?.history &&
            eqExtinguisherModal?.history.map((item) => {
              const cardVariant =
                item.conforme && !item.novo ? 'new' : item.conforme && item.novo ? 'modification' : 'noncompliant';

              const cardTitle =
                item.conforme && !item.novo
                  ? 'Nova Verificação'
                  : item.conforme && item.novo
                  ? 'Alteração do Equipamento'
                  : 'Verificação Inconforme';

              const cardDate = format(new Date(item.Created), 'dd MMM yyyy', { locale: ptBR });

              return (
                <EquipmentCard.Root key={item.Id} variant={cardVariant}>
                  <EquipmentCard.Header title={cardTitle} link={`/records/${item.Id}`} />
                  <EquipmentCard.Content
                    date={cardDate}
                    responsible={item.bombeiro_id.Title}
                    action={item.observacao}
                    cod={item?.cod_extintor}
                  />
                </EquipmentCard.Root>
              );
            })}
        </div>
      </>
    </Modal>
  );
};

export default EqExtinguisherModal;
