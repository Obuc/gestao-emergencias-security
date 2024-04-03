import Modal from '../../../../components/Modal';

interface IEqGenerateQRCodeModalProps {
  open: boolean | null;
  onOpenChange: () => void;
  children: React.ReactNode;
}

const EqGenerateQRCodeModal = ({ open, onOpenChange, children }: IEqGenerateQRCodeModalProps) => {
  const equipments_value = localStorage.getItem('equipments_value');

  const handleOnOpenChange = () => {
    onOpenChange();
  };

  return (
    <Modal
      className="min-w-[68.75rem]"
      open={open !== null}
      onOpenChange={handleOnOpenChange}
      title={`Gerar QRCodes: ${equipments_value}`}
    >
      <div className="flex flex-col gap-2 px-8 py-6 text-primary-font">
        <span className="text-lg py-4">Selecione abaixo os equipamentos que deseja gerar os QRCodes.</span>

        {children}
      </div>
    </Modal>
  );
};

export default EqGenerateQRCodeModal;
