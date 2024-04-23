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
              id="cod_extintor"
              name="cod_extintor"
              label="N° Extintor"
              value={extinguisherModalData.data?.cod_extintor ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />

            <TextField
              disabled
              id="site"
              name="site"
              label="Site"
              width="w-[10rem]"
              value={extinguisherModalData.data?.site ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />

            <TextField
              disabled
              id="predio"
              name="predio"
              label="Prédio"
              width="w-[10rem]"
              value={extinguisherModalData.data?.predio ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />

            <TextField
              disabled
              id="tipo_extintor"
              name="tipo_extintor"
              label="Tipo Extintor"
              width="w-[12rem]"
              value={extinguisherModalData.data?.tipo_extintor ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              value={extinguisherModalData.data?.pavimento ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />

            <TextField
              disabled
              id="local"
              name="local"
              label="Local"
              value={extinguisherModalData.data?.local ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />

            <TextField
              disabled
              id="massa"
              name="massa"
              label="Massa"
              width="w-[8rem]"
              value={extinguisherModalData.data?.massa ?? ''}
              isLoading={extinguisherModalData.isLoading}
            />
          </div>
        </div>

        <div className="py-4 px-8">
          {!extinguisherModalData.data?.history?.length && !extinguisherModalData.isLoading && <CardEmpy />}
          {extinguisherModalData.isLoading && <CardSkeleton />}

          {extinguisherModalData.data?.history &&
            extinguisherModalData.data?.history.map((item) => {
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

export default ExtinguisherModal;
