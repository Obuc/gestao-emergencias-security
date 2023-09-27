import QRCode from 'qrcode.react';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { ptBR } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

import CardEmpy from '../../ui/CardEmpy';
import { EquipmentCard } from '../../ui/Card';
import CardSkeleton from '../../ui/CardSkeleton';
import Modal from '../../../../../components/Modal';
import { Button } from '../../../../../components/Button';
import TextField from '../../../../../components/TextField';
import BXOLogo from '../../../../../components/Icons/BXOLogo';
import SPOLogo from '../../../../../components/Icons/SPOLogo';
import useEqLoadRatio from '../../../hooks/EmergencyVehicles/useEqLoadRatio';

const EqLoadRatioModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const pdfContainerRef = useRef(null);

  const [showQrCode, setShowQrCode] = useState(false);
  const [generalChecklist, setGeneralChecklist] = useState<boolean | null>(null);

  const { eqLoadRatioModal, isLoadingEqLoadRatioModal, qrCodeValue } = useEqLoadRatio();

  useEffect(() => {
    if (params?.id) {
      setGeneralChecklist(true);
      setShowQrCode(false);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setGeneralChecklist(null);
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
              saveAs(blob, `Checklist Geral - ${eqLoadRatioModal?.Id} - ${eqLoadRatioModal?.site}.jpeg`);
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
      open={generalChecklist !== null}
      onOpenChange={handleOnOpenChange}
      title={`Equipamento ${eqLoadRatioModal?.tipo_veiculo} N°${params.id}`}
    >
      <>
        <div className="py-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              id="Id"
              name="Id"
              label="Número"
              width="w-[6.25rem]"
              disabled
              value={eqLoadRatioModal?.Id || ''}
              isLoading={isLoadingEqLoadRatioModal}
            />
            <TextField
              id="site"
              name="site"
              label="Site"
              disabled
              value={eqLoadRatioModal?.site || ''}
              isLoading={isLoadingEqLoadRatioModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              id="tipo_veiculo"
              name="tipo_veiculo"
              label="Tipo Veículo"
              disabled
              value={eqLoadRatioModal?.tipo_veiculo || ''}
              isLoading={isLoadingEqLoadRatioModal}
            />

            <TextField
              id="placa"
              name="placa"
              label="Placa"
              disabled
              value={eqLoadRatioModal?.placa || ''}
              isLoading={isLoadingEqLoadRatioModal}
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

                  <span className="font-medium text-center text-sm italic">{`RelacaoCarga/${eqLoadRatioModal?.site}/${eqLoadRatioModal?.placa}/${eqLoadRatioModal?.tipo_veiculo}`}</span>

                  {eqLoadRatioModal?.site === 'BXO' && <BXOLogo height="50" width="45" />}
                  {eqLoadRatioModal?.site === 'SPO' && <SPOLogo height="50" width="45" />}
                </div>
              </div>
            </div>
          )}

          <Button.Root
            fill
            disabled={isLoadingEqLoadRatioModal}
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
          {!eqLoadRatioModal?.history?.length && !isLoadingEqLoadRatioModal && <CardEmpy />}
          {isLoadingEqLoadRatioModal && <CardSkeleton />}

          {eqLoadRatioModal?.history &&
            eqLoadRatioModal?.history.map((item) => {
              const cardVariant = item.conforme ? 'new' : 'noncompliant';
              const cardTitle = item.conforme ? 'Nova Verificação' : 'Verificação Inconforme';

              const cardDate = format(new Date(item.Created), 'dd MMM yyyy', { locale: ptBR });

              return (
                <EquipmentCard.Root key={item.Id} variant={cardVariant}>
                  <EquipmentCard.Header title={cardTitle} link={`/records/${item.Id}`} />
                  <EquipmentCard.Content date={cardDate} responsible={item.bombeiro?.Title} action={item.observacao} />
                </EquipmentCard.Root>
              );
            })}
        </div>
      </>
    </Modal>
  );
};

export default EqLoadRatioModal;
