import jsPDF from 'jspdf';
import QRCode from 'qrcode.react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { ptBR } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

import { EquipmentCard } from '../ui/Card';
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

  const [showQrCode, setShowQrCode] = useState(false);
  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);

  const { eqEqGovernanceValveModal, isLoadingEqEqGovernanceValveModal } = useEqGovernanceValve();

  const qrCodeValue = `Extintor;${eqEqGovernanceValveModal?.site};${eqEqGovernanceValveModal?.cod_qrcode}`;

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
        scrollY: -window.scrollY,
        useCORS: true,
        scale: 2,
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');

          const pdf = new jsPDF('p', 'px', [1100, canvas.height], false);
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`teste.pdf`);
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
              id="cod_equipamento"
              name="cod_equipamento"
              label="N° Válvula"
              width="w-[8rem]"
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
              <div className="flex flex-col justify-center items-center gap-6 bg-white border-[.1875rem] border-black px-6 py-4">
                {eqEqGovernanceValveModal?.site === 'BXO' && <BXOLogo width="7.5rem" height="7.5rem" />}
                {eqEqGovernanceValveModal?.site === 'SPO' && <SPOLogo />}
                <QRCode value={qrCodeValue} size={160} fgColor="#000" bgColor="#fff" />
                <span className="font-medium">{`Extintor/${eqEqGovernanceValveModal?.predio}/${eqEqGovernanceValveModal?.pavimento}/${eqEqGovernanceValveModal?.cod_qrcode}/${eqEqGovernanceValveModal?.local}`}</span>
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
          {eqEqGovernanceValveModal?.history &&
            eqEqGovernanceValveModal?.history.map((item) => {
              const cardVariant = item.conforme ? 'new' : 'noncompliant';
              const cardTitle = item.conforme ? 'Nova Verificação' : 'Verificação Inconforme';
              const cardDate = item.data_legado
                ? format(new Date(item.data_legado), 'dd MMM yyyy', { locale: ptBR })
                : format(new Date(item.Created), 'dd MMM yyyy', { locale: ptBR });

              return (
                <EquipmentCard.Root key={item.Id} variant={cardVariant}>
                  <EquipmentCard.Header title={cardTitle} link={`/records/${item.Id}`} />
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
