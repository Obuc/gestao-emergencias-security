import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '@/components/Modal';
import years from '@/utils/years.mock';
import { Select } from '@/components/Select';
import TextField from '@/components/TextField';
import CardEmpy from '../../../components/ui/CardEmpy';
import { useValveModal } from '../hooks/valve-modal.hook';
import { EquipmentCard } from '../../../components/ui/Card';
import CardSkeleton from '../../../components/ui/CardSkeleton';

export const ValveModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { valveModalData, historyModalData, year, setYear } = useValveModal();
  const [valveItem, setValveItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setValveItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setValveItem(null);
    navigate('/equipments/valve');
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={valveItem !== null}
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
              value={valveModalData.data?.cod_equipamento ?? ''}
              isLoading={valveModalData.isLoading}
            />

            <TextField
              disabled
              id="site"
              name="site"
              label="Site"
              width="w-[10rem]"
              value={valveModalData.data?.site ?? ''}
              isLoading={valveModalData.isLoading}
            />

            <TextField
              disabled
              id="predio"
              name="predio"
              label="Prédio"
              width="w-[10rem]"
              value={valveModalData.data?.predio ?? ''}
              isLoading={valveModalData.isLoading}
            />

            <TextField
              disabled
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              value={valveModalData.data?.pavimento ?? ''}
              isLoading={valveModalData.isLoading}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="local"
              name="local"
              label="Local"
              value={valveModalData.data?.local ?? ''}
              isLoading={valveModalData.isLoading}
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
                  <EquipmentCard.Header title={cardTitle} link={`/records/valve/${item.Id}`} />
                  <EquipmentCard.Content
                    date={cardDate}
                    responsible={item.bombeiro_id.Title}
                    observation={item.observacao}
                  />
                </EquipmentCard.Root>
              );
            })}
        </div>
      </>
    </Modal>
  );
};
