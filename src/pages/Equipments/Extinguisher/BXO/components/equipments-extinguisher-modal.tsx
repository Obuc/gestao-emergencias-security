import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '../../../../../components/Modal';
import CardEmpy from '../../../components/ui/CardEmpy';
import { EquipmentCard } from '../../../components/ui/Card';
import TextField from '../../../../../components/TextField';
import CardSkeleton from '../../../components/ui/CardSkeleton';
import useEquipmentsExtinguisherModal from '../hooks/equipments-extinguisher-modal.hook';

const EquipmentsExtinguisherModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { equipmentsExtinguisherModal } = useEquipmentsExtinguisherModal();
  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setExtinguisherItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setExtinguisherItem(null);
    navigate('/equipments/extinguisher');
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
              value={equipmentsExtinguisherModal.data?.cod_extintor ?? ''}
              isLoading={equipmentsExtinguisherModal.isLoading}
            />

            <TextField
              disabled
              id="site"
              name="site"
              label="Site"
              width="w-[10rem]"
              value={equipmentsExtinguisherModal.data?.site ?? ''}
              isLoading={equipmentsExtinguisherModal.isLoading}
            />

            <TextField
              disabled
              id="predio"
              name="predio"
              label="Prédio"
              width="w-[10rem]"
              value={equipmentsExtinguisherModal.data?.predio ?? ''}
              isLoading={equipmentsExtinguisherModal.isLoading}
            />

            <TextField
              disabled
              id="tipo_extintor"
              name="tipo_extintor"
              label="Tipo Extintor"
              width="w-[12rem]"
              value={equipmentsExtinguisherModal.data?.tipo_extintor ?? ''}
              isLoading={equipmentsExtinguisherModal.isLoading}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              value={equipmentsExtinguisherModal.data?.pavimento ?? ''}
              isLoading={equipmentsExtinguisherModal.isLoading}
            />

            <TextField
              disabled
              id="local"
              name="local"
              label="Local"
              value={equipmentsExtinguisherModal.data?.local ?? ''}
              isLoading={equipmentsExtinguisherModal.isLoading}
            />

            <TextField
              disabled
              id="massa"
              name="massa"
              label="Massa"
              width="w-[8rem]"
              value={equipmentsExtinguisherModal.data?.massa ?? ''}
              isLoading={equipmentsExtinguisherModal.isLoading}
            />
          </div>
        </div>

        <div className="py-4 px-8">
          {!equipmentsExtinguisherModal.data?.history?.length && !equipmentsExtinguisherModal.isLoading && <CardEmpy />}
          {equipmentsExtinguisherModal.isLoading && <CardSkeleton />}

          {equipmentsExtinguisherModal.data?.history &&
            equipmentsExtinguisherModal.data?.history.map((item) => {
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
                  <EquipmentCard.Header title={cardTitle} link={`/records/extinguisher/${item.Id}`} />
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

export default EquipmentsExtinguisherModal;
