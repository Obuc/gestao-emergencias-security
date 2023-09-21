import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import TextArea from '../../../../components/TextArea';
import TextField from '../../../../components/TextField';
import { Answers } from '../../../../components/Answers';
import useReports from '../../hooks/useReports';
import { IReports } from '../../types/Reports';

const ReportsModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);

  const { reportModal, isLoadingReportModal } = useReports();

  console.log(reportModal);

  useEffect(() => {
    if (params?.id) {
      setExtinguisherItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setExtinguisherItem(null);
    navigate('/reports');
  };

  const initialRequestBadgeValues: IReports = {
    Attachments: reportModal?.Attachments || false,
    AttachmentFiles: reportModal?.AttachmentFiles || [],
    Created: reportModal?.Created || '',
    dias_antecedentes_alerta: reportModal?.dias_antecedentes_alerta || 0,
    emissao: reportModal?.emissao || '',
    excluido: reportModal?.excluido || false,
    Id: reportModal?.Id || 0,
    site: reportModal?.site || { Title: '' },
    tipo_laudo: reportModal?.tipo_laudo || { Title: '' },
    validade: reportModal?.validade || '',
  };

  const handleSubmit = async (values: IReports) => {
    if (values) {
      // await mutateEditExtinguisher(values);
      handleOnOpenChange();
    }
  };

  return (
    <Modal
      className="w-[71rem]"
      open={extinguisherItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Extintor N°${params.id}`}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialRequestBadgeValues}
        onSubmit={(values: IReports) => handleSubmit(values)}
      >
        {(props: FormikProps<IReports>) => (
          <>
            <div>
              <div className="py-6 px-8">
                <div className="flex gap-2 py-2">
                  <TextField
                    id="Id"
                    name="Id"
                    label="Número"
                    width="w-[6.25rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.Id}
                    isLoading={isLoadingReportModal}
                  />

                  <TextField
                    id="Id"
                    name="Id"
                    label="Data"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.Created}
                    isLoading={isLoadingReportModal}
                  />

                  {/* Attachments: reportModal?.Attachments || false,
    AttachmentFiles: reportModal?.AttachmentFiles || [],


    dias_antecedentes_alerta: reportModal?.dias_antecedentes_alerta || 0,
    emissao: reportModal?.emissao || '',
    site: reportModal?.site || { Title: '' },
    tipo_laudo: reportModal?.tipo_laudo || { Title: '' },
    validade: reportModal?.validade || '', */}
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />
            </div>

            <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
              <Button.Root onClick={handleOnOpenChange} disabled={isLoadingReportModal} className="w-[10rem] h-10">
                <Button.Label>Fechar</Button.Label>
              </Button.Root>

              {/* {isEdit && (
                  <Button.Root
                    onClick={() => handleSubmit(props.values)}
                    disabled={isLoadingExtinguisherModal}
                    fill
                    className="w-[10rem] h-10"
                  >
                    {IsLoadingMutateEditExtinguisher ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
                  </Button.Root>
                )} */}
            </div>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default ReportsModal;
