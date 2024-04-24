import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '@/components/Modal';
import TextField from '@/components/TextField';
import CardEmpy from '../../../components/ui/CardEmpy';
import { EquipmentCard } from '../../../components/ui/Card';
import CardSkeleton from '../../../components/ui/CardSkeleton';
import { useFireAlarmsModal } from '../hooks/firealarms-modal.hook';

export const FireAlarmsModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { fireAlarmsModalData } = useFireAlarmsModal();
  const [valveItem, setValveItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setValveItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setValveItem(null);
    navigate('/equipments/fire_alarms');
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={valveItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Alarmes de Incêndio N°${params.id}`}
    >
      <>
        <div className="pt-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="Title"
              name="Title"
              label="Código do setor"
              value={fireAlarmsModalData.data?.Title ?? ''}
              isLoading={fireAlarmsModalData.isLoading}
            />

            <TextField
              disabled
              id="Predio"
              name="Predio"
              label="Prédio"
              value={fireAlarmsModalData.data?.Predio ?? ''}
              isLoading={fireAlarmsModalData.isLoading}
            />
          </div>
        </div>

        <div className="py-4 px-8">
          {!fireAlarmsModalData.data?.history?.length && !fireAlarmsModalData.isLoading && <CardEmpy />}
          {fireAlarmsModalData.isLoading && <CardSkeleton />}

          {fireAlarmsModalData.data?.history &&
            fireAlarmsModalData.data?.history.map((item) => {
              const cardVariant = item.tipo === 'Normal' ? 'new' : item.tipo === 'Novo' ? 'modification' : 'noncompliant';

              const cardTitle =
                item.tipo === 'Normal'
                  ? 'Nova Verificação'
                  : item.tipo === 'Novo'
                  ? 'Alteração do Equipamento'
                  : 'Verificação Inconforme';

              const cardDate = format(new Date(item.Created), 'dd MMM yyyy', { locale: ptBR });

              return (
                <EquipmentCard.Root key={item.Id} variant={cardVariant}>
                  <EquipmentCard.Header title={cardTitle} link={`/records/fire_alarms/${item.idRegistro}`} />
                  <EquipmentCard.Content
                    date={cardDate}
                    responsible={item.responsavel}
                    action={item.item}
                    newDate={item?.novaValidade ? format(new Date(item.novaValidade), 'dd MMM yyyy', { locale: ptBR }) : ''}
                    newCod={item?.novoCodigo}
                  />
                </EquipmentCard.Root>
              );
            })}
        </div>
      </>
    </Modal>
  );
};
