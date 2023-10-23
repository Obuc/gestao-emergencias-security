import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CardEmpy from '../ui/CardEmpy';
import { EquipmentCard } from '../ui/Card';
import CardSkeleton from '../ui/CardSkeleton';
import Modal from '../../../../components/Modal';
import useEqTestCmi from '../../hooks/useEqTestCmi';
import TextField from '../../../../components/TextField';

const EqCmiTestModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [testCmi, setTestCmi] = useState<boolean | null>(null);

  const { eqTestCmiModal, isLoadingEqTestCmiModal } = useEqTestCmi();

  useEffect(() => {
    if (params?.id) {
      setTestCmi(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setTestCmi(null);
    navigate('/equipments/cmi_test');
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={testCmi !== null}
      onOpenChange={handleOnOpenChange}
      title={`Equipamento Teste CMI N°${params.id}`}
    >
      <>
        <div className="py-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              id="Id"
              name="Id"
              label="Número"
              width="w-[6.25rem]"
              disabled
              value={eqTestCmiModal?.Id || ''}
              isLoading={isLoadingEqTestCmiModal}
            />
            <TextField
              id="cod_qrcode"
              name="cod_qrcode"
              label="Pavimento"
              disabled
              value={eqTestCmiModal?.pavimento || ''}
              isLoading={isLoadingEqTestCmiModal}
            />

            <TextField
              id="predio"
              name="predio"
              label="Prédio"
              disabled
              value={eqTestCmiModal?.predio || ''}
              isLoading={isLoadingEqTestCmiModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              id="site"
              name="site"
              label="Site"
              disabled
              value={eqTestCmiModal?.site || ''}
              isLoading={isLoadingEqTestCmiModal}
            />
            <TextField
              id="tipo_equipamento"
              name="tipo_equipamento"
              label="Tipo Equipamento"
              disabled
              value={eqTestCmiModal?.tipo_equipamento || ''}
              isLoading={isLoadingEqTestCmiModal}
            />
          </div>
        </div>

        <div className="py-4 px-8">
          {!eqTestCmiModal?.history?.length && !isLoadingEqTestCmiModal && <CardEmpy />}
          {isLoadingEqTestCmiModal && <CardSkeleton />}

          {eqTestCmiModal?.history &&
            eqTestCmiModal?.history.map((item) => {
              const cardVariant = item.conforme ? 'new' : 'noncompliant';
              const cardTitle = item.conforme ? 'Nova Verificação' : 'Verificação Inconforme';

              const cardDate = format(new Date(item.Created), 'dd MMM yyyy', { locale: ptBR });

              return (
                <EquipmentCard.Root key={item.Id} variant={cardVariant}>
                  <EquipmentCard.Header title={cardTitle} link={`/records/cmi_test/${item.Id}`} />
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

export default EqCmiTestModal;
