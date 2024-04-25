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
import { useCmiTestModal } from '../hooks/cmitest-modal.hook';
import CardSkeleton from '../../../components/ui/CardSkeleton';

export const CmiTestModal = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { cmiTestModalData, historyModalData, year, setYear } = useCmiTestModal();
  const [cmiTestItem, setCmiTestItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setCmiTestItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setCmiTestItem(null);
    navigate('/equipments/cmi_test');
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={cmiTestItem !== null}
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
              value={cmiTestModalData.data?.Id || ''}
              isLoading={cmiTestModalData.isLoading}
            />
            <TextField
              id="cod_qrcode"
              name="cod_qrcode"
              label="Pavimento"
              disabled
              value={cmiTestModalData.data?.pavimento || ''}
              isLoading={cmiTestModalData.isLoading}
            />

            <TextField
              id="predio"
              name="predio"
              label="Prédio"
              disabled
              value={cmiTestModalData.data?.predio || ''}
              isLoading={cmiTestModalData.isLoading}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              id="site"
              name="site"
              label="Site"
              disabled
              value={cmiTestModalData.data?.site || ''}
              isLoading={cmiTestModalData.isLoading}
            />
            <TextField
              id="tipo_equipamento"
              name="tipo_equipamento"
              label="Tipo Equipamento"
              disabled
              value={cmiTestModalData.data?.tipo_equipamento || ''}
              isLoading={cmiTestModalData.isLoading}
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
                  <EquipmentCard.Header title={cardTitle} link={`/records/cmi_test/${item.Id}`} />
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
