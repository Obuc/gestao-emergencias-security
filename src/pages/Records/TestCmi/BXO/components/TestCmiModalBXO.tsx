import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../../../components/Modal';
import Toast from '../../../../../components/Toast';
import { TestCmiCmiPdfBXO } from './TestCmiCmiPdfBXO';
import { ResponstaTestCmi } from '../types/TestCmiBXO';
import TextArea from '../../../../../components/TextArea';
import { Button } from '../../../../../components/Button';
import { Answers } from '../../../../../components/Answers';
import TextField from '../../../../../components/TextField';
import useTestCmiModalBXO from '../hooks/useTestCmiModalBXO';

const TestCmiModalBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { testCmiModal, mutateEdit, testCmiItem, setTestCmiItem, formik } = useTestCmiModalBXO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setTestCmiItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setTestCmiItem(null);
    navigate('/records/cmi_test');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);
    const blob = await pdf(<TestCmiCmiPdfBXO data={testCmiModal.data} />).toBlob();
    setGeneratePdf(false);
    saveAs(blob, `Registro Teste CMI BXO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={testCmiItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Registro Teste CMI N°${params.id}`}
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
                    isLoading={testCmiModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={testCmiModal.isLoading}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.bombeiro}
                    isLoading={testCmiModal.isLoading}
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
                    isLoading={testCmiModal.isLoading}
                  />

                  <TextField
                    id="extintor.predio"
                    name="extintor.predio"
                    label="Prédio"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.cmi.predio}
                    isLoading={testCmiModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {formik.values.respostas &&
                  formik.values.cmi.site === 'BXO' &&
                  Object.keys(formik.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={testCmiModal.isLoading}>
                      <Answers.Content className="grid-cols-1" key={categoria}>
                        {formik.values.respostas &&
                          formik.values.respostas[categoria].map((pergunta: ResponstaTestCmi, index) => (
                            <Answers.ContentItem key={index} isLoading={testCmiModal.isLoading}>
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

                {formik.values.respostas &&
                  formik.values.cmi.site === 'SPO' &&
                  Object.keys(formik.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={testCmiModal.isLoading}>
                      <Answers.Content key={categoria}>
                        {formik.values.respostas &&
                          formik.values.respostas[categoria].map((pergunta: ResponstaTestCmi, index) => (
                            <Answers.ContentItem key={index} isLoading={testCmiModal.isLoading}>
                              <Answers.Label label={pergunta.pergunta_id.Title} />

                              {pergunta.resposta_2 && (
                                <TextField
                                  id="pergunta.resposta_2"
                                  name="pergunta.resposta_2"
                                  onChange={(e) => {
                                    formik.setFieldValue(`respostas.${categoria}[${index}].resposta_2`, e.target.value);
                                  }}
                                  value={pergunta.resposta_2 ?? ''}
                                  isLoading={testCmiModal.isLoading}
                                  disabled={!isEdit}
                                />
                              )}

                              {!pergunta.resposta_2 && (
                                <Answers.Button
                                  disabled={!isEdit}
                                  onClick={() => {
                                    const updatedResposta = !pergunta.resposta;
                                    formik.setFieldValue(`respostas.${categoria}[${index}].resposta`, updatedResposta);
                                  }}
                                  answersValue={pergunta.resposta}
                                />
                              )}
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
                    isLoading={testCmiModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={testCmiModal.isLoading || generatePdf}
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

                <Button.Root onClick={handleOnOpenChange} disabled={testCmiModal.isLoading} className="w-[10rem] h-10">
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={testCmiModal.isLoading || formik.isSubmitting}
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

export default TestCmiModalBXO;
