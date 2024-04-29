import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Toast from '@/components/Toast';
import Modal from '@/components/Modal';
import { Button } from '@/components/Button';
import TextArea from '@/components/TextArea';
import TextField from '@/components/TextField';
import { Answers } from '@/components/Answers';
import { EmergencyDoorPdfSPO } from './emergency-door-pdf';
import { useEmergencyDoorModalSPO } from '../hooks/emergency-door-modal.hook';

export const EmergencyDoorModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { emergencyDoorItem, setEmergencyDoorItem, emergencyDoorModal, mutateEdit, formik } = useEmergencyDoorModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setEmergencyDoorItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setEmergencyDoorItem(null);
    navigate('/spo/records/emergency_doors');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<EmergencyDoorPdfSPO data={emergencyDoorModal.data} />).toBlob();
    saveAs(blob, `Registro Portas de Emergência SPO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={emergencyDoorItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Portas de Emergência N°${params.id}`}
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
                    isLoading={emergencyDoorModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={emergencyDoorModal.isLoading}
                  />

                  <TextField
                    id="Responsavel"
                    name="Responsavel"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Responsavel1}
                    isLoading={emergencyDoorModal.isLoading}
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
                    isLoading={emergencyDoorModal.isLoading}
                  />

                  <TextField
                    id="Municipios"
                    name="Municipios"
                    label="Município"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Municipios}
                    isLoading={emergencyDoorModal.isLoading}
                  />

                  <TextField
                    id="Site"
                    name="Site"
                    label="Site"
                    disabled
                    width="w-[6.25rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Site}
                    isLoading={emergencyDoorModal.isLoading}
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
                    isLoading={emergencyDoorModal.isLoading}
                  />

                  <TextField
                    id="Local"
                    name="Local"
                    label="Local"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Local}
                    isLoading={emergencyDoorModal.isLoading}
                  />

                  <TextField
                    id="LocalEsp"
                    name="LocalEsp"
                    label="Local Específico"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.LocalEsp}
                    isLoading={emergencyDoorModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                <Answers.Root label="Portas de Emergência" isLoading={emergencyDoorModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={emergencyDoorModal.isLoading}>
                      <Answers.Label label="A barra anti-pânico ou maçanetas estão funcionando?" />
                      <Answers.Button
                        id="Func"
                        name="Func"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Func', !formik.values.Func)}
                        answersValue={formik.values.Func}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={emergencyDoorModal.isLoading}>
                      <Answers.Label label="A porta está obstruída?" />
                      <Answers.Button
                        id="Obst"
                        name="Obst"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Obst', !formik.values.Obst)}
                        answersValue={formik.values.Obst}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={emergencyDoorModal.isLoading}>
                      <Answers.Label label="Precisa de reparos?" />
                      <Answers.Button
                        id="Reparo"
                        name="Reparo"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Reparo', !formik.values.Reparo)}
                        answersValue={formik.values.Reparo}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={emergencyDoorModal.isLoading}>
                      <Answers.Label label="Está abrindo e fechando corretamente?" />
                      <Answers.Button
                        id="Abertura"
                        name="Abertura"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Abertura', !formik.values.Abertura)}
                        answersValue={formik.values.Abertura}
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
                    isLoading={emergencyDoorModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={emergencyDoorModal.isLoading || generatePdf}
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

                <Button.Root
                  onClick={handleOnOpenChange}
                  disabled={emergencyDoorModal.isLoading}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={emergencyDoorModal.isLoading || formik.isSubmitting}
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
