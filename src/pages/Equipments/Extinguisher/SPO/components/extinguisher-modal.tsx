import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '@/components/Modal';
import TextField from '@/components/TextField';
import CardEmpy from '../../../components/ui/CardEmpy';
import { EquipmentCard } from '../../../components/ui/Card';
import CardSkeleton from '../../../components/ui/CardSkeleton';
import useextinguisherModalData from '../hooks/extinguisher-modal.hook';

const ExtinguisherModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { extinguisherModalData } = useextinguisherModalData();
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
              id="Title"
              name="Title"
              label="Código do setor"
              value={extinguisherModalData.data?.Title ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />

            <TextField
              disabled
              id="codExtintor"
              name="codExtintor"
              label="Cód. do equipamento atual"
              value={extinguisherModalData.data?.codExtintor ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />

            <TextField
              disabled
              id="validadeExtintor"
              name="validadeExtintor"
              label="Data de Validade"
              value={
                extinguisherModalData.data?.validadeExtintor
                  ? format(extinguisherModalData.data.validadeExtintor, 'dd/MM/yyyy')
                  : ''
              }
              isLoading={extinguisherModalData.isLoading}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="Predio"
              name="Predio"
              label="Prédio"
              value={extinguisherModalData.data?.Predio ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />

            <TextField
              disabled
              id="Pavimento"
              name="Pavimento"
              label="Pavimento"
              value={extinguisherModalData.data?.Pavimento ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />

            <TextField
              disabled
              id="LocEsp"
              name="LocEsp"
              label="Localização"
              value={extinguisherModalData.data?.LocEsp ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />
          </div>
        </div>

        <div className="py-4 px-8">
          {!extinguisherModalData.data?.history?.length && !extinguisherModalData.isLoading && <CardEmpy />}
          {extinguisherModalData.isLoading && <CardSkeleton />}

          {extinguisherModalData.data?.history &&
            extinguisherModalData.data?.history.map((item) => {
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
                  <EquipmentCard.Header title={cardTitle} link={`/records/extinguisher/${item.Id}`} />
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

export default ExtinguisherModal;
