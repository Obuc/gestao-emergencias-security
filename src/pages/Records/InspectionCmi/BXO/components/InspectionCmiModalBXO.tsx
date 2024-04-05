import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../../../components/Modal';
import Toast from '../../../../../components/Toast';
import TextArea from '../../../../../components/TextArea';
import { Button } from '../../../../../components/Button';
import { Answers } from '../../../../../components/Answers';
import TextField from '../../../../../components/TextField';
import { InspectionCmiPdfBXO } from './InspectionCmiPdfBXO';
import { ResponstaInspectionCMI } from '../types/InspectionCmiBXO';
import useInspectionCmiModalBXO from '../hooks/useInspectionCmiModalBXO';

const InspectionCmiModalBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { governanceValveItem, setGovernanceValveItem, inspectionCmiModal, mutateEdit, formik } =
    useInspectionCmiModalBXO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setGovernanceValveItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setGovernanceValveItem(null);
    navigate('/records/cmi_inspection');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);
    const blob = await pdf(<InspectionCmiPdfBXO data={inspectionCmiModal.data} />).toBlob();
    setGeneratePdf(false);
    saveAs(blob, `Registro Inspeção CMI BXO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={governanceValveItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Registro Inspeção CMI N°${params.id}`}
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
                    width="w-[6.25rem]"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.Id}
                    isLoading={inspectionCmiModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    width="w-[10rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={inspectionCmiModal.isLoading}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.bombeiro}
                    isLoading={inspectionCmiModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="extintor.site"
                    name="extintor.site"
                    label="Site"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.cmi.site}
                    isLoading={inspectionCmiModal.isLoading}
                  />

                  <TextField
                    id="extintor.predio"
                    name="extintor.predio"
                    label="Prédio"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.cmi.predio}
                    isLoading={inspectionCmiModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {formik.values.respostas &&
                  Object.keys(formik.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={inspectionCmiModal.isLoading}>
                      <Answers.Content
                        className={`${
                          formik.values.respostas && formik.values.respostas[categoria].length === 1 && 'grid-cols-1'
                        }`}
                        key={categoria}
                      >
                        {formik.values.respostas &&
                          formik.values.respostas[categoria].map((pergunta: ResponstaInspectionCMI, index) => (
                            <Answers.ContentItem key={index} isLoading={inspectionCmiModal.isLoading}>
                              <Answers.Label label={pergunta.pergunta_id.Title} />

                              <Answers.Button
                                disabled={!isEdit}
                                onClick={() => {
                                  const updatedResposta = !pergunta.resposta;
                                  formik.setFieldValue(`respostas.${categoria}[${index}].resposta`, updatedResposta);
                                }}
                                answersValue={pergunta.resposta}
                              />
                            </Answers.ContentItem>
                          ))}
                      </Answers.Content>
                    </Answers.Root>
                  ))}

                {formik.values.observacao && (
                  <TextArea
                    id="observacao"
                    name="observacao"
                    label="Observações"
                    disabled
                    value={formik.values.observacao}
                    onChange={formik.handleChange}
                    isLoading={inspectionCmiModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={inspectionCmiModal.isLoading || generatePdf}
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
                  disabled={inspectionCmiModal.isLoading}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={mutateEdit.isLoading || formik.isSubmitting}
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

export default InspectionCmiModalBXO;
