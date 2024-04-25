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
import { useHydrantModal } from '../hooks/hydrants-modal.hook';

export const HydrantModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { hydrantModalData, historyModalData, year, setYear } = useHydrantModal();
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
              value={hydrantModalData.data?.cod_hidrante ?? ''}
              isLoading={hydrantModalData.isLoading}
            />

            <TextField
              disabled
              id="site"
              name="site"
              label="Site"
              width="w-[10rem]"
              value={hydrantModalData.data?.site ?? ''}
              isLoading={hydrantModalData.isLoading}
            />

            <TextField
              disabled
              id="predio"
              name="predio"
              label="Prédio"
              width="w-[10rem]"
              value={hydrantModalData.data?.predio ?? ''}
              isLoading={hydrantModalData.isLoading}
            />

            <TextField
              disabled
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              value={hydrantModalData.data?.pavimento ?? ''}
              isLoading={hydrantModalData.isLoading}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="local"
              name="local"
              label="Local"
              value={hydrantModalData.data?.local ?? ''}
              isLoading={hydrantModalData.isLoading}
            />

            <TextField
              disabled
              id="possui_abrigo"
              name="possui_abrigo"
              label="Possui Abrigo ?"
              width="w-[10rem]"
              value={hydrantModalData.data?.possui_abrigo ? 'Sim' : 'Não' ?? ''}
              isLoading={hydrantModalData.isLoading}
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

          {historyModalData &&
            historyModalData.data?.map((item) => {
              const cardVariant = item.conforme ? 'new' : 'noncompliant';
              const cardTitle = item.conforme ? 'Nova Verificação' : 'Verificação Inconforme';
              const cardDate = format(new Date(item.Created), 'dd MMM yyyy', { locale: ptBR });

              return (
                <EquipmentCard.Root key={item.Id} variant={cardVariant}>
                  <EquipmentCard.Header title={cardTitle} link={`/records/hydrant/${item.Id}`} />
                  <EquipmentCard.Content date={cardDate} responsible={item.bombeiro.Title} action={item.observacao} />
                </EquipmentCard.Root>
              );
            })}
        </div>
      </>
    </Modal>
  );
};
