import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '@/components/Modal';
import years from '@/utils/years.mock';
import { Select } from '@/components/Select';
import TextField from '@/components/TextField';
import CardEmpy from '../../../components/ui/CardEmpy';
import { EquipmentCard } from '../../../components/ui/Card';
import CardSkeleton from '../../../components/ui/CardSkeleton';
import { useSpillKitModal } from '../hooks/spill-kit-modal.hook';

export const SpillKitModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { spillKitModalData, historyModalData, setYear, year } = useSpillKitModal();
  const [valveItem, setValveItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setValveItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setValveItem(null);
    navigate('/spo/equipments/spill_kit');
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={valveItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Kit de Derramamento Químico N°${params.id}`}
    >
      <>
        <div className="pt-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="Title"
              name="Title"
              label="Código do setor"
              value={spillKitModalData.data?.Title ?? ''}
              isLoading={spillKitModalData.isLoading}
            />

            <TextField
              disabled
              id="Predio"
              name="Predio"
              label="Prédio"
              value={spillKitModalData.data?.Predio ?? ''}
              isLoading={spillKitModalData.isLoading}
            />

            <TextField
              disabled
              id="Pavimento"
              name="Pavimento"
              label="Pavimento"
              value={spillKitModalData.data?.Pavimento ?? ''}
              isLoading={spillKitModalData.isLoading}
            />
          </div>
        </div>

        <div className="py-4 px-8">
          <div className="pb-4 flex gap-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-[500]">Selecione o ano de exibição das verificações</span>

              <Select.Component
                id="year"
                name="year"
                value={year.toString()}
                className="w-[7.5rem]"
                popperWidth="w-[7.5rem]"
                mode="gray"
                variant="outline"
                onValueChange={(value) => setYear(+value)}
              >
                {years.map((year) => (
                  <Select.Item key={year} value={year}>
                    {year}
                  </Select.Item>
                ))}
              </Select.Component>
            </div>

            {historyModalData.data && historyModalData.data?.length > 0 && (
              <span className="font-[500]">Total registros: {historyModalData.data?.length}</span>
            )}
          </div>

          {!historyModalData.data?.length && !historyModalData.isLoading && <CardEmpy />}
          {historyModalData.isLoading && <CardSkeleton />}

          {historyModalData.data &&
            historyModalData.data?.map((item) => {
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
                  <EquipmentCard.Header title={cardTitle} link={`/spo/records/spill_kit/${item.idRegistro}`} />
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