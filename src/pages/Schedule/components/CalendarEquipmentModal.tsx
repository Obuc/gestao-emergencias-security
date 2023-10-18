import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../components/Modal';
import { useSchedule } from '../hooks/useSchedule';
import TextField from '../../../components/TextField';

const CalendarEquipmentModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const equipmentModal = searchParams.get('equipment');
  const [modalViewEquipment, setModalViewEquipment] = useState<boolean | null>(null);

  const { dataEquipmentsModal, isLoadingDataEquipmentsModal } = useSchedule();

  useEffect(() => {
    if (params?.id) {
      setModalViewEquipment(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setModalViewEquipment(null);
    navigate('/schedule');
  };

  return (
    <Modal
      className="w-[45rem]"
      open={modalViewEquipment !== null}
      onOpenChange={handleOnOpenChange}
      title={`${equipmentModal} ID ${params.id}`}
    >
      <div className="p-8">
        <div className="flex gap-2 py-2">
          <TextField
            id="Id"
            name="Id"
            label="Número"
            disabled
            value={dataEquipmentsModal?.Id}
            isLoading={isLoadingDataEquipmentsModal}
          />

          <TextField
            id="ultima_inspecao"
            name="ultima_inspecao"
            label="Última Inspeção"
            disabled
            value={
              dataEquipmentsModal?.ultima_inspecao
                ? format(dataEquipmentsModal?.ultima_inspecao, 'dd MMM yyyy', { locale: ptBR })
                : ''
            }
            isLoading={isLoadingDataEquipmentsModal}
          />
        </div>

        <div className="flex gap-2 py-2">
          {dataEquipmentsModal?.pavimento && (
            <TextField
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              disabled
              value={dataEquipmentsModal?.pavimento}
              isLoading={isLoadingDataEquipmentsModal}
            />
          )}

          <TextField
            id="predio"
            name="predio"
            label="Prédio"
            disabled
            value={dataEquipmentsModal?.predio}
            isLoading={isLoadingDataEquipmentsModal}
          />
        </div>

        {dataEquipmentsModal?.local && (
          <div className="flex gap-2 py-2">
            <TextField
              id="local"
              name="local"
              label="Local"
              disabled
              value={dataEquipmentsModal?.local}
              isLoading={isLoadingDataEquipmentsModal}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CalendarEquipmentModal;
