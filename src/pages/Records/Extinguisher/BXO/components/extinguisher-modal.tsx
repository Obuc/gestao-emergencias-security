import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import TextArea from '@/components/TextArea';
import { Button } from '@/components/Button';
import { Answers } from '@/components/Answers';
import TextField from '@/components/TextField';
import { ExtinguisherPdfBXO } from './extinguisher-pdf';
import { ExtinguisherAnswers } from '../types/extinguisher.types';
import { useExtinguisherModalBXO } from '../hooks/extinguisher-modal.hook';

export const ExtinguisherModalBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { extinguisherItem, setExtinguisherItem, extinguisherModal, mutateEdit, formik } = useExtinguisherModalBXO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setExtinguisherItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setExtinguisherItem(null);
    navigate('/bxo/records/extinguisher');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);
    const blob = await pdf(<ExtinguisherPdfBXO data={extinguisherModal.data} />).toBlob();
    setGeneratePdf(false);
    saveAs(blob, `Registro Extintor BXO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={extinguisherItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Registro Extintor N°${params.id}`}
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
                    isLoading={extinguisherModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={extinguisherModal.isLoading}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    width="w-[25rem]"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.bombeiro}
                    isLoading={extinguisherModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="extintor.site"
                    name="extintor.site"
                    label="Site"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.extintor.site}
                    isLoading={extinguisherModal.isLoading}
                  />

                  <TextField
                    id="extintor.predio"
                    name="extintor.predio"
                    label="Prédio"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.extintor.predio}
                    isLoading={extinguisherModal.isLoading}
                  />

                  <TextField
                    id="extintor.pavimento"
                    name="extintor.pavimento"
                    label="Pavimento"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.extintor.pavimento}
                    isLoading={extinguisherModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="extintor.local"
                    name="extintor.local"
                    label="Local Específico"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.extintor.local}
                    isLoading={extinguisherModal.isLoading}
                  />
                  <TextField
                    id="extintor.validade"
                    name="extintor.validade"
                    label="Data de Vencimento"
                    disabled
                    onChange={formik.handleChange}
                    value={
                      formik.values?.extintor?.validade
                        ? format(formik.values?.extintor.validade, 'dd MMM yyyy', { locale: ptBR })
                        : ''
                    }
                    isLoading={extinguisherModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="extintor.tipo_extintor"
                    name="extintor.tipo_extintor"
                    label="Tipo"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.extintor.tipo_extintor}
                    isLoading={extinguisherModal.isLoading}
                  />
                  <TextField
                    id="extintor.massa"
                    name="extintor.massa"
                    label="Peso"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.extintor.massa}
                    isLoading={extinguisherModal.isLoading}
                  />
                  <TextField
                    id="extintor.cod_extintor"
                    name="extintor.cod_extintor"
                    label="Cód. Extintor"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.extintor.cod_extintor}
                    isLoading={extinguisherModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {formik.values.respostas &&
                  Object.keys(formik.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={extinguisherModal.isLoading}>
                      <Answers.Content key={categoria}>
                        {formik.values.respostas &&
                          formik.values.respostas[categoria].map((pergunta: ExtinguisherAnswers, index) => (
                            <Answers.ContentItem key={index} isLoading={extinguisherModal.isLoading}>
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
                    isLoading={extinguisherModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={extinguisherModal.isLoading || generatePdf}
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

                <Button.Root onClick={handleOnOpenChange} disabled={extinguisherModal.isLoading} className="w-[10rem] h-10">
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={extinguisherModal.isLoading || formik.isSubmitting}
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
