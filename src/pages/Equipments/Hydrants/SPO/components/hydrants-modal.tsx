import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '@/components/Modal';
import TextField from '@/components/TextField';
import CardEmpy from '../../../components/ui/CardEmpy';
import useHydrantModal from '../hooks/hydrants-modal.hook';
import { EquipmentCard } from '../../../components/ui/Card';
import CardSkeleton from '../../../components/ui/CardSkeleton';

const HydrantModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { hydrantModalData } = useHydrantModal();
  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setExtinguisherItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setExtinguisherItem(null);
    navigate('/equipments/hydrant');
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={extinguisherItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Hidrante N°${params.id}`}
    >
      <>
        <div className="pt-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="Title"
              name="Title"
              label="Código do setor"
              value={hydrantModalData.data?.Title ?? ''}
              isLoading={hydrantModalData.isLoading}
            />

            <TextField
              disabled
              id="numero_hidrante"
              name="numero_hidrante"
              label="Cód. do equipamento atual"
              value={hydrantModalData.data?.numero_hidrante ?? ''}
              isLoading={hydrantModalData.isLoading}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="Predio"
              name="Predio"
              label="Prédio"
              value={hydrantModalData.data?.Predio ?? ''}
              isLoading={hydrantModalData.isLoading}
            />

            <TextField
              disabled
              id="Pavimento"
              name="Pavimento"
              label="Pavimento"
              value={hydrantModalData.data?.Pavimento ?? ''}
              isLoading={hydrantModalData.isLoading}
            />

            <TextField
              disabled
              id="LocEsp"
              name="LocEsp"
              label="Localização"
              value={hydrantModalData.data?.LocEsp ?? ''}
              isLoading={hydrantModalData.isLoading}
            />
          </div>
        </div>

        <div className="py-4 px-8">
          {!hydrantModalData.data?.history?.length && !hydrantModalData.isLoading && <CardEmpy />}
          {hydrantModalData.isLoading && <CardSkeleton />}

          {hydrantModalData.data?.history &&
            hydrantModalData.data?.history.map((item) => {
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
                  <EquipmentCard.Header title={cardTitle} link={`/records/hydrant/${item.Id}`} />
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

export default HydrantModal;
