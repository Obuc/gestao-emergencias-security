import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../../../components/Button';
import { ButtonIcon } from '../../../../components/Button/ButtonIcon';
import Modal from '../../../../components/Modal';
import EqExtinguisherQRCode from '../tables/EqExtinguisherQRCode';
import { useRef, useState } from 'react';
import { EquipmentsExtinguisher } from '../../types/EquipmentsExtinguisher';
import BXOLogo from '../../../../components/Icons/BXOLogo';
import SPOLogo from '../../../../components/Icons/SPOLogo';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface IGenerateQRCodeProps {
  open: boolean | null;
  onOpenChange: () => void;
}

const GenerateQRCode = ({ open, onOpenChange }: IGenerateQRCodeProps) => {
  const equipments_value = localStorage.getItem('equipments_value');
  const [selectedItemsExtinguisher, setSelectedItemsExtinguisher] = useState<EquipmentsExtinguisher[]>([]);

  const pdfContainerRef = useRef(null);

  // const qrCodeElements = selectedItemsExtinguisher.map((qrCodeValue) => {
  //   const value = `Extintor;${qrCodeValue?.site};${qrCodeValue?.cod_qrcode}`;

  //   return (
  //     <div
  //       ref={pdfContainerRef}
  //       id="container"
  //       className="w-full h-full p-4 flex flex-col justify-center items-center gap-10"
  //     >
  //       <div className="flex flex-col justify-center items-center gap-6 bg-white border-[.1875rem] border-black px-6 py-4">
  //         {qrCodeValue.site === 'BXO' && <BXOLogo width="7.5rem" height="7.5rem" />}
  //         {qrCodeValue.site === 'SPO' && <SPOLogo />}
  //         <QRCode value={value} size={160} fgColor="#000" bgColor="#fff" />
  //         <span className="font-medium">{`Extintor/${qrCodeValue?.predio}/${qrCodeValue?.pavimento}/${qrCodeValue?.cod_qrcode}/${qrCodeValue?.local}`}</span>
  //       </div>
  //     </div>
  //   );
  // });

  const generateQrCodePdf = async () => {
    if (pdfContainerRef.current) {
      // const qrcodes = generateQRCodes(selectedItems);

      const pdf = new jsPDF();
      const qrCodeSize = 160;

      const qrCodeCanvas = await html2canvas(pdfContainerRef.current, {
        useCORS: true,
        scale: 2,
      });

      const imgData = qrCodeCanvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 10, 10, qrCodeSize, qrCodeSize);

      pdf.save('qrcodes.pdf');
    }
  };

  return (
    <Modal
      className="w-[72.625rem]"
      open={open !== null}
      onOpenChange={onOpenChange}
      title={`Gerar QRCodes: ${equipments_value}`}
    >
      <div className="flex flex-col gap-2 px-8 py-6 text-primary">
        <span className="text-xl py-4">Selecione abaixo os equipamentos que deseja gerar os QRCodes.</span>

        <EqExtinguisherQRCode
          selectedItems={selectedItemsExtinguisher}
          setSelectedItems={setSelectedItemsExtinguisher}
        />

        <div ref={pdfContainerRef}>
          {selectedItemsExtinguisher.map((qrCodeValue, index) => {
            const value = `Extintor;${qrCodeValue?.site};${qrCodeValue?.cod_qrcode}`;

            return (
              <div
                ref={pdfContainerRef}
                id="container"
                className="w-full h-full p-4 flex flex-col justify-center items-center gap-10"
              >
                <div className="flex flex-col justify-center items-center gap-6 bg-white border-[.1875rem] border-black px-6 py-4">
                  <span>{index}</span>
                  {qrCodeValue.site === 'BXO' && <BXOLogo width="7.5rem" height="7.5rem" />}
                  {qrCodeValue.site === 'SPO' && <SPOLogo />}
                  <QRCode value={value} size={160} fgColor="#000" bgColor="#fff" />
                  <span className="font-medium">{`Extintor/${qrCodeValue?.predio}/${qrCodeValue?.pavimento}/${qrCodeValue?.cod_qrcode}/${qrCodeValue?.local}`}</span>
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

        {/* <div>
      {selectedItemsExtinguisher.map((qrCodeValue) => {
    const value = `Extintor;${qrCodeValue?.site};${qrCodeValue?.cod_qrcode}`;

    return (
      <div
        ref={pdfContainerRef}
        id="container"
        className="w-full h-full p-4 flex flex-col justify-center items-center gap-10"
      >
        <div className="flex flex-col justify-center items-center gap-6 bg-white border-[.1875rem] border-black px-6 py-4">
          {qrCodeValue.site === 'BXO' && <BXOLogo width="7.5rem" height="7.5rem" />}
          {qrCodeValue.site === 'SPO' && <SPOLogo />}
          <QRCode value={value} size={160} fgColor="#000" bgColor="#fff" />
          <span className="font-medium">{`Extintor/${qrCodeValue?.predio}/${qrCodeValue?.pavimento}/${qrCodeValue?.cod_qrcode}/${qrCodeValue?.local}`}</span>
        </div>
      </div>
    )}
      </div> */}
      </div>
    </Modal>
  );
};

export default GenerateQRCode;
