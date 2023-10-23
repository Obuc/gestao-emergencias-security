import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CardEmpy from '../ui/CardEmpy';
import { EquipmentCard } from '../ui/Card';
import CardSkeleton from '../ui/CardSkeleton';
import Modal from '../../../../components/Modal';
import TextField from '../../../../components/TextField';
import useEqInspectionCmi from '../../hooks/useEqInspectionCmi';

const EqCmiInspectionModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [inspectionCmi, setInspectionCmi] = useState<boolean | null>(null);

  const { eqInspectionCmiModal, isLoadingeEInspectionCmiModal } = useEqInspectionCmi();

  useEffect(() => {
    if (params?.id) {
      setInspectionCmi(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setInspectionCmi(null);
    navigate('/equipments/cmi_inspection');
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={inspectionCmi !== null}
      onOpenChange={handleOnOpenChange}
      title={`Equipamento Inspeção CMI N°${params.id}`}
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
              value={eqInspectionCmiModal?.Id || ''}
              isLoading={isLoadingeEInspectionCmiModal}
            />
            <TextField
              id="cod_qrcode"
              name="cod_qrcode"
              label="Pavimento"
              disabled
              value={eqInspectionCmiModal?.pavimento || ''}
              isLoading={isLoadingeEInspectionCmiModal}
            />

            <TextField
              id="predio"
              name="predio"
              label="Prédio"
              disabled
              value={eqInspectionCmiModal?.predio || ''}
              isLoading={isLoadingeEInspectionCmiModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              id="site"
              name="site"
              label="Site"
              disabled
              value={eqInspectionCmiModal?.site || ''}
              isLoading={isLoadingeEInspectionCmiModal}
            />
            <TextField
              id="tipo_equipamento"
              name="tipo_equipamento"
              label="Tipo Equipamento"
              disabled
              value={eqInspectionCmiModal?.tipo_equipamento || ''}
              isLoading={isLoadingeEInspectionCmiModal}
            />
          </div>
        </div>

        <div className="py-4 px-8">
          {!eqInspectionCmiModal?.history?.length && !isLoadingeEInspectionCmiModal && <CardEmpy />}
          {isLoadingeEInspectionCmiModal && <CardSkeleton />}

          {eqInspectionCmiModal?.history &&
            eqInspectionCmiModal?.history.map((item) => {
              const cardVariant = item.conforme ? 'new' : 'noncompliant';
              const cardTitle = item.conforme ? 'Nova Verificação' : 'Verificação Inconforme';

              const cardDate = format(new Date(item.Created), 'dd MMM yyyy', { locale: ptBR });

              return (
                <EquipmentCard.Root key={item.Id} variant={cardVariant}>
                  <EquipmentCard.Header title={cardTitle} link={`/records/cmi_inspection/${item.Id}`} />
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

export default EqCmiInspectionModal;
