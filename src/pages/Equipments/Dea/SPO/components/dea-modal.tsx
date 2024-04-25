import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '@/components/Modal';
import TextField from '@/components/TextField';
import { useDeaModal } from '../hooks/dea-modal.hook';
import CardEmpy from '../../../components/ui/CardEmpy';
import { EquipmentCard } from '../../../components/ui/Card';
import CardSkeleton from '../../../components/ui/CardSkeleton';

export const DeaModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { deaModalData } = useDeaModal();
  const [valveItem, setValveItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setValveItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setValveItem(null);
    navigate('/equipments/dea');
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={valveItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Desfibrilador Automático (DEA) N°${params.id}`}
    >
      <>
        <div className="pt-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="Title"
              name="Title"
              label="Código do setor"
              value={deaModalData.data?.Title ?? ''}
              isLoading={deaModalData.isLoading}
            />

            <TextField
              disabled
              id="Codigo"
              name="Codigo"
              label="Cód. do equipamento atual"
              value={deaModalData.data?.Codigo ?? ''}
              isLoading={deaModalData.isLoading}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="Predio"
              name="Predio"
              label="Prédio"
              value={deaModalData.data?.Predio ?? ''}
              isLoading={deaModalData.isLoading}
            />

            <TextField
              disabled
              id="LocEsp"
              name="LocEsp"
              label="Local Específico"
              value={deaModalData.data?.LocEsp ?? ''}
              isLoading={deaModalData.isLoading}
            />
          </div>
        </div>

        <div className="py-4 px-8">
          {!deaModalData.data?.history?.length && !deaModalData.isLoading && <CardEmpy />}
          {deaModalData.isLoading && <CardSkeleton />}

          {deaModalData.data?.history &&
            deaModalData.data?.history.map((item) => {
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
                  <EquipmentCard.Header title={cardTitle} link={`/records/dea/${item.idRegistro}`} />
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
