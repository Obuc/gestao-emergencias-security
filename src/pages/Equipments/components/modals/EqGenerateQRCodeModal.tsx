import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import { ButtonIcon } from '../../../../components/Button/ButtonIcon';

interface IEqGenerateQRCodeModalProps {
  open: boolean | null;
  onOpenChange: () => void;
  children: React.ReactNode;
}

const EqGenerateQRCodeModal = ({ open, onOpenChange, children }: IEqGenerateQRCodeModalProps) => {
  const equipments_value = localStorage.getItem('equipments_value');

  const generateQrCodePdf = () => {
    const element = document.getElementById('qrCodeElement');

    if (element) {
      html2canvas(element, {
        useCORS: true,
        scale: 10,
      })
        .then((canvas) => {
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, 'captured_image.jpeg');
            }
          }, 'image/jpeg');
        })
        .catch((error) => {
          console.error('Erro ao gerar o PDF:', error);
        });
    }
  };

  const handleOnOpenChange = () => {
    onOpenChange();
  };

  return (
    <Modal
      className="w-[72.625rem]"
      open={open !== null}
      onOpenChange={handleOnOpenChange}
      title={`Gerar QRCodes: ${equipments_value}`}
    >
      <div className="flex flex-col gap-2 px-8 py-6 text-primary">
        <span className="text-lg py-4">Selecione abaixo os equipamentos que deseja gerar os QRCodes.</span>

        {children}

        <div className="flex w-full gap-2 pt-14 justify-end items-center">
          <Button.Root className="w-[10rem] h-10" onClick={onOpenChange}>
            <Button.Label>Cancelar</Button.Label>
          </Button.Root>

          <Button.Root className="w-[14.0625rem] h-10" fill onClick={generateQrCodePdf}>
            <Button.Label>Gerar QRCodes</Button.Label>
            <ButtonIcon icon={faExpand} />
          </Button.Root>
        </div>
      </div>
    </Modal>
  );
};

export default EqGenerateQRCodeModal;
