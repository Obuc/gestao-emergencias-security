import jsPDF from 'jspdf';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import EqExtinguisherQRCode from '../tables/EqExtinguisherQRCode';
import { ButtonIcon } from '../../../../components/Button/ButtonIcon';
import BayerLogoBlack from '../../../../components/Icons/BayerLogoBlack';
import { EquipmentsExtinguisher } from '../../types/EquipmentsExtinguisher';

interface IGenerateQRCodeProps {
  open: boolean | null;
  onOpenChange: () => void;
}

const GenerateQRCode = ({ open, onOpenChange }: IGenerateQRCodeProps) => {
  const equipments_value = localStorage.getItem('equipments_value');
  const [selectedItemsExtinguisher, setSelectedItemsExtinguisher] = useState<EquipmentsExtinguisher[]>([]);

  const pdfContainerRef = useRef(null);

  const generateQrCodePdf = async () => {
    if (pdfContainerRef.current) {
      await html2canvas(pdfContainerRef.current, {
        useCORS: true,
        scale: 5,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'px', [595.28, canvas.height], false);
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`teste.pdf`);
      });
    }
  };

  const handleOnOpenChange = () => {
    onOpenChange();
    setSelectedItemsExtinguisher([]);
  };

  return (
    <Modal
      className="w-[72.625rem]"
      open={open !== null}
      onOpenChange={handleOnOpenChange}
      title={`Gerar QRCodes: ${equipments_value}`}
    >
      <div className="flex flex-col gap-2 px-8 py-6 text-primary">
        <span className="text-xl py-4">Selecione abaixo os equipamentos que deseja gerar os QRCodes.</span>

        <EqExtinguisherQRCode
          selectedItems={selectedItemsExtinguisher}
          setSelectedItems={setSelectedItemsExtinguisher}
        />

        <div className="w-full grid grid-cols-2 justify-center gap-4" ref={pdfContainerRef}>
          {selectedItemsExtinguisher.map((qrCodeValue) => {
            const value = `Extintor;${qrCodeValue?.site};${qrCodeValue?.cod_qrcode}`;

            return (
              <div key={qrCodeValue.Id} className="flex justify-center items-center">
                <div className="flex flex-col justify-center w-[20rem] items-center gap-6 bg-white border-[.0625rem] border-black">
                  <div className="uppercase text-lg font-semibold py-4 m-auto bg-bg-home w-full text-center text-white">
                    Gestão de Emergência
                  </div>

                  <div className="px-2 py-2 gap-3 flex flex-col justify-center items-center">
                    <QRCode value={value} size={150} fgColor="#000" bgColor="#fff" />
                    <span className="font-medium text-sm italic">{`Extintor/${qrCodeValue?.predio}/${qrCodeValue?.pavimento}/${qrCodeValue?.local}`}</span>

                    <BayerLogoBlack />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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

export default GenerateQRCode;
