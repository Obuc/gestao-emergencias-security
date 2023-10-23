import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CardEmpy from '../ui/CardEmpy';
import { EquipmentCard } from '../ui/Card';
import CardSkeleton from '../ui/CardSkeleton';
import Modal from '../../../../components/Modal';
import useEqHydrants from '../../hooks/useEqHydrants';
import TextField from '../../../../components/TextField';

const EqHydrantsModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [hydrantItem, setHydrantItem] = useState<boolean | null>(null);

  const { eqHydrantModal, isLoadingEqHydrantModal } = useEqHydrants();

  useEffect(() => {
    if (params?.id) {
      setHydrantItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setHydrantItem(null);
    navigate('/equipments/hydrants');
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={hydrantItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Equipamento Hidrante N°${params.id}`}
    >
      <>
        <div className="pt-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="cod_hidrante"
              name="cod_hidrante"
              label="N° Hidrante"
              width="w-[10rem]"
              value={eqHydrantModal?.cod_hidrante ?? ''}
              isLoading={isLoadingEqHydrantModal}
            />

            <TextField
              disabled
              id="site"
              name="site"
              label="Site"
              width="w-[10rem]"
              value={eqHydrantModal?.site ?? ''}
              isLoading={isLoadingEqHydrantModal}
            />

            <TextField
              disabled
              id="predio"
              name="predio"
              label="Prédio"
              width="w-[10rem]"
              value={eqHydrantModal?.predio ?? ''}
              isLoading={isLoadingEqHydrantModal}
            />

            <TextField
              disabled
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              value={eqHydrantModal?.pavimento ?? ''}
              isLoading={isLoadingEqHydrantModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="local"
              name="local"
              label="Local"
              value={eqHydrantModal?.local ?? ''}
              isLoading={isLoadingEqHydrantModal}
            />

            <TextField
              disabled
              id="possui_abrigo"
              name="possui_abrigo"
              label="Possui Abrigo ?"
              width="w-[10rem]"
              value={eqHydrantModal?.possui_abrigo ? 'Sim' : 'Não' ?? ''}
              isLoading={isLoadingEqHydrantModal}
            />
          </div>
        </div>

        <div className="py-4 px-8 gap-2">
          {!eqHydrantModal?.history?.length && !isLoadingEqHydrantModal && <CardEmpy />}
          {isLoadingEqHydrantModal && <CardSkeleton />}

          {eqHydrantModal?.history &&
            eqHydrantModal?.history.map((item) => {
              const cardVariant = item.conforme ? 'new' : 'noncompliant';
              const cardTitle = item.conforme ? 'Nova Verificação' : 'Verificação Inconforme';
              const cardDate = format(new Date(item.Created), 'dd MMM yyyy', { locale: ptBR });

              return (
                <EquipmentCard.Root key={item.Id} variant={cardVariant}>
                  <EquipmentCard.Header title={cardTitle} link={`/records/hydrants/${item.Id}`} />
                  <EquipmentCard.Content date={cardDate} responsible={item.bombeiro.Title} action={item.observacao} />
                </EquipmentCard.Root>
              );
            })}
        </div>
      </>
    </Modal>
  );
};

export default EqHydrantsModal;
