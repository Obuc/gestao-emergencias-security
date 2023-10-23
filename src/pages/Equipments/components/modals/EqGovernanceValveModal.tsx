import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CardEmpy from '../ui/CardEmpy';
import { EquipmentCard } from '../ui/Card';
import CardSkeleton from '../ui/CardSkeleton';
import Modal from '../../../../components/Modal';
import TextField from '../../../../components/TextField';
import useEqGovernanceValve from '../../hooks/useEqGovernanceValve';

const EqGovernanceValveModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [governanceValveItem, setGovernanceValveItem] = useState<boolean | null>(null);

  const { eqEqGovernanceValveModal, isLoadingEqEqGovernanceValveModal } = useEqGovernanceValve();

  useEffect(() => {
    if (params?.id) {
      setGovernanceValveItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setGovernanceValveItem(null);
    navigate('/equipments/valves');
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={governanceValveItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Equipamento Válvula de Governo N°${params.id}`}
    >
      <>
        <div className="pt-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="cod_equipamento"
              name="cod_equipamento"
              label="N° Válvula"
              width="w-[10rem]"
              value={eqEqGovernanceValveModal?.cod_equipamento ?? ''}
              isLoading={isLoadingEqEqGovernanceValveModal}
            />

            <TextField
              disabled
              id="site"
              name="site"
              label="Site"
              width="w-[10rem]"
              value={eqEqGovernanceValveModal?.site ?? ''}
              isLoading={isLoadingEqEqGovernanceValveModal}
            />

            <TextField
              disabled
              id="predio"
              name="predio"
              label="Prédio"
              width="w-[10rem]"
              value={eqEqGovernanceValveModal?.predio ?? ''}
              isLoading={isLoadingEqEqGovernanceValveModal}
            />

            <TextField
              disabled
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              value={eqEqGovernanceValveModal?.pavimento ?? ''}
              isLoading={isLoadingEqEqGovernanceValveModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="local"
              name="local"
              label="Local"
              value={eqEqGovernanceValveModal?.local ?? ''}
              isLoading={isLoadingEqEqGovernanceValveModal}
            />
          </div>
        </div>

        <div className="py-4 px-8 gap-2">
          {!eqEqGovernanceValveModal?.history?.length && !isLoadingEqEqGovernanceValveModal && <CardEmpy />}
          {isLoadingEqEqGovernanceValveModal && <CardSkeleton />}

          {eqEqGovernanceValveModal?.history &&
            eqEqGovernanceValveModal?.history.map((item) => {
              const cardVariant = item.conforme ? 'new' : 'noncompliant';
              const cardTitle = item.conforme ? 'Nova Verificação' : 'Verificação Inconforme';
              const cardDate = item.data_legado
                ? format(new Date(item.data_legado), 'dd MMM yyyy', { locale: ptBR })
                : format(new Date(item.Created), 'dd MMM yyyy', { locale: ptBR });

              return (
                <EquipmentCard.Root key={item.Id} variant={cardVariant}>
                  <EquipmentCard.Header title={cardTitle} link={`/records/valves/${item.Id}`} />
                  <EquipmentCard.Content
                    date={cardDate}
                    responsible={item.bombeiro_id.Title}
                    action={item.observacao}
                  />
                </EquipmentCard.Root>
              );
            })}
        </div>
      </>
    </Modal>
  );
};

export default EqGovernanceValveModal;
