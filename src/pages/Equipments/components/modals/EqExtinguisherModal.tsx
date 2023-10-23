import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CardEmpy from '../ui/CardEmpy';
import { EquipmentCard } from '../ui/Card';
import CardSkeleton from '../ui/CardSkeleton';
import Modal from '../../../../components/Modal';
import TextField from '../../../../components/TextField';
import useEqExtinguisher from '../../hooks/useEqExtinguisher';

const EqExtinguisherModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);
  const { eqExtinguisherModal, isLoadingEqExtinguisherModal } = useEqExtinguisher();

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
              value={eqExtinguisherModal?.cod_extintor ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="site"
              name="site"
              label="Site"
              width="w-[10rem]"
              value={eqExtinguisherModal?.site ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="predio"
              name="predio"
              label="Prédio"
              width="w-[10rem]"
              value={eqExtinguisherModal?.predio ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="tipo_extintor"
              name="tipo_extintor"
              label="Tipo Extintor"
              width="w-[12rem]"
              value={eqExtinguisherModal?.tipo_extintor ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              value={eqExtinguisherModal?.pavimento ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="local"
              name="local"
              label="Local"
              value={eqExtinguisherModal?.local ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="massa"
              name="massa"
              label="Massa"
              width="w-[8rem]"
              value={eqExtinguisherModal?.massa ?? ''}
              isLoading={isLoadingEqExtinguisherModal}
            />
          </div>
        </div>

        <div className="py-4 px-8">
          {!eqExtinguisherModal?.history?.length && !isLoadingEqExtinguisherModal && <CardEmpy />}
          {isLoadingEqExtinguisherModal && <CardSkeleton />}

          {eqExtinguisherModal?.history &&
            eqExtinguisherModal?.history.map((item) => {
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

export default EqExtinguisherModal;
