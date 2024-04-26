import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Modal from '@/components/Modal';
import years from '@/utils/years.mock';
import { Select } from '@/components/Select';
import TextField from '@/components/TextField';
import CardEmpy from '../../../components/ui/CardEmpy';
import { EquipmentCard } from '../../../components/ui/Card';
import CardSkeleton from '../../../components/ui/CardSkeleton';
import { useLoadRatioModal } from '../hooks/loadratio-modal.hook';

export const LoadRatioModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const equipments_value = pathname.split('/')[2];

  const { loadRatioModalData, historyModalData, year, setYear } = useLoadRatioModal();
  const [loadRatioItem, setLoadRatioItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setLoadRatioItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setLoadRatioItem(null);
    navigate(`/bxo/equipments/${equipments_value}`);
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={loadRatioItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro ${loadRatioModalData.data?.tipo_veiculo} N°${params.id}`}
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
              value={loadRatioModalData.data?.Id || ''}
              isLoading={loadRatioModalData.isLoading}
            />
            <TextField
              id="site"
              name="site"
              label="Site"
              disabled
              value={loadRatioModalData.data?.site || ''}
              isLoading={loadRatioModalData.isLoading}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              id="tipo_veiculo"
              name="tipo_veiculo"
              label="Tipo Veículo"
              disabled
              value={loadRatioModalData.data?.tipo_veiculo || ''}
              isLoading={loadRatioModalData.isLoading}
            />

            <TextField
              id="placa"
              name="placa"
              label="Placa"
              disabled
              value={loadRatioModalData.data?.placa || ''}
              isLoading={loadRatioModalData.isLoading}
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
                  <EquipmentCard.Header title={cardTitle} link={`/bxo/records/${equipments_value}/${item.Id}`} />
                  <EquipmentCard.Content date={cardDate} responsible={item.bombeiro.Title} observation={item.observacao} />
                </EquipmentCard.Root>
              );
            })}
        </div>
      </>
    </Modal>
  );
};
