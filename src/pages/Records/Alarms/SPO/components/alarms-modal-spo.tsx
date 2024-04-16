import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { AlarmsPdfSPO } from './alarms-pdf-spo';
import Toast from '../../../../../components/Toast';
import Modal from '../../../../../components/Modal';
import { Button } from '../../../../../components/Button';
import TextArea from '../../../../../components/TextArea';
import TextField from '../../../../../components/TextField';
import { Answers } from '../../../../../components/Answers';
import useAlarmsModalSPO from '../hooks/alarms-modal-spo.hook';

const AlarmsModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { alarmsItem, setAlarmsItem, alarmsModal, mutateEdit, formik } = useAlarmsModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setAlarmsItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setAlarmsItem(null);
    navigate('/records/fire_alarms');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<AlarmsPdfSPO data={alarmsModal.data} />).toBlob();
    saveAs(blob, `Registro Alarmes de Incêndio SPO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={alarmsItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Alarmes de Incêndio N°${params.id}`}
      >
        <form className="flex flex-col w-full gap-6" onSubmit={formik.handleSubmit}>
          <>
            <div>
              <div className="py-6 px-8">
                <div className="flex gap-2 py-2">
                  <TextField
                    id="Id"
                    name="Id"
                    label="Número"
                    width="w-[10rem]"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Id}
                    isLoading={alarmsModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={alarmsModal.isLoading}
                  />

                  <TextField
                    id="Responsavel"
                    name="Responsavel"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Responsavel1}
                    isLoading={alarmsModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="UF"
                    name="UF"
                    label="UF"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.UF}
                    isLoading={alarmsModal.isLoading}
                  />

                  <TextField
                    id="Municipios"
                    name="Municipios"
                    label="Município"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Municipios}
                    isLoading={alarmsModal.isLoading}
                  />

                  <TextField
                    id="Site"
                    name="Site"
                    label="Site"
                    disabled
                    width="w-[6.25rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Site}
                    isLoading={alarmsModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="Area"
                    name="Area"
                    label="Área"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Area}
                    isLoading={alarmsModal.isLoading}
                  />

                  <TextField
                    id="Local"
                    name="Local"
                    label="Local"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Local}
                    isLoading={alarmsModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                <Answers.Root label="Sirene" isLoading={alarmsModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={alarmsModal.isLoading}>
                      <Answers.Label label="A sirene está funcionando?" />
                      <Answers.Button
                        id="Sirene"
                        name="Sirene"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Sirene', !formik.values.Sirene)}
                        answersValue={formik.values.Sirene}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Luminoso" isLoading={alarmsModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={alarmsModal.isLoading}>
                      <Answers.Label label="O alarme luminoso está funcionando?" />
                      <Answers.Button
                        id="Luminoso"
                        name="Luminoso"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Luminoso', !formik.values.Luminoso)}
                        answersValue={formik.values.Luminoso}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                {formik.values.Observacao && (
                  <TextArea
                    id="Observacao"
                    name="Observacao"
                    label="Observações"
                    disabled
                    value={formik.values.Observacao}
                    onChange={formik.handleChange}
                    isLoading={alarmsModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={alarmsModal.isLoading || generatePdf}
                  >
                    {generatePdf ? (
                      <Button.Spinner />
                    ) : (
                      <>
                        <Button.Label>Exportar para PDF</Button.Label>
                        <Button.Icon icon={faDownload} />
                      </>
                    )}
                  </Button.Root>
                )}

                <Button.Root onClick={handleOnOpenChange} disabled={alarmsModal.isLoading} className="w-[10rem] h-10">
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={alarmsModal.isLoading || formik.isSubmitting}
                  >
                    {mutateEdit.isLoading ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
                  </Button.Root>
                )}
              </div>
            </div>
          </>
        </form>
      </Modal>

      {mutateEdit.isError && (
        <Toast type="error" open={mutateEdit.isError} onOpenChange={mutateEdit.reset}>
          O sistema encontrou um erro ao tentar atualizar o registro. Recarregue a página e tente novamente. Se o problema
          persistir, entre em contato com o administrador do sistema.
        </Toast>
      )}

      {mutateEdit.isSuccess && (
        <Toast type="success" open={mutateEdit.isSuccess} onOpenChange={mutateEdit.reset}>
          O registro foi atualizado com sucesso do sistema. Operação concluída.
        </Toast>
      )}
    </>
  );
};

export default AlarmsModalSPO;
