import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { format, isBefore } from 'date-fns';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '@/components/Modal';
import TextField from '@/components/TextField';
import { useSchedule } from '../hooks/schedule';

export const ScheduleModal = () => {
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
    navigate('/bxo/schedule');
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

          {dataEquipmentsModal?.proximaInspecao && (
            <TextField
              id="proximaInspecao"
              name="proximaInspecao"
              label="Próxima Inspeção"
              className={`${isBefore(dataEquipmentsModal?.proximaInspecao, new Date()) && 'text-pink font-medium'}`}
              disabled
              value={
                dataEquipmentsModal?.proximaInspecao
                  ? format(dataEquipmentsModal?.proximaInspecao, 'dd MMM yyyy', { locale: ptBR })
                  : ''
              }
              isLoading={isLoadingDataEquipmentsModal}
            />
          )}
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

          {dataEquipmentsModal?.predio && (
            <TextField
              id="predio"
              name="predio"
              label="Prédio"
              disabled
              value={dataEquipmentsModal?.predio}
              isLoading={isLoadingDataEquipmentsModal}
            />
          )}

          {dataEquipmentsModal?.tipo_veiculo && (
            <TextField
              id="tipo_veiculo"
              name="tipo_veiculo"
              label="Tipo de Veículo"
              disabled
              value={dataEquipmentsModal?.tipo_veiculo}
              isLoading={isLoadingDataEquipmentsModal}
            />
          )}

          {dataEquipmentsModal?.placa && (
            <TextField
              id="placa"
              name="placa"
              label="Placa"
              disabled
              value={dataEquipmentsModal?.placa}
              isLoading={isLoadingDataEquipmentsModal}
            />
          )}
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
