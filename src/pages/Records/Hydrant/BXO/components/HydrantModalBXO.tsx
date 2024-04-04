import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { HydrantPdfBXO } from './HydrantPdfBXO';
import Modal from '../../../../../components/Modal';
import Toast from '../../../../../components/Toast';
import { RespostaHydrants } from '../types/HydrantBXO';
import TextArea from '../../../../../components/TextArea';
import { Button } from '../../../../../components/Button';
import { Answers } from '../../../../../components/Answers';
import TextField from '../../../../../components/TextField';
import useHydrantModalBXO from '../hooks/useHydrantModalBXO';

const HydrantModalBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { hydrantItem, setHydrantItem, hydrantModal, mutateEdit, formik } = useHydrantModalBXO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setHydrantItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setHydrantItem(null);
    navigate('/records/hydrants');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);
    const blob = await pdf(<HydrantPdfBXO data={hydrantModal.data} />).toBlob();
    setGeneratePdf(false);
    saveAs(blob, `Registro Hidrante BXO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);
  };

  return (
    <>
      <Modal className="w-[71rem]" open={hydrantItem !== null} onOpenChange={handleOnOpenChange} title={`Registro Hidrante N°${params.id}`}>
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
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    width="w-[14.375rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Created && format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR })}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.bombeiro}
                    isLoading={hydrantModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="hidrante.site"
                    name="hidrante.site"
                    label="Site"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.hidrante.site}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="hidrante.predio"
                    name="hidrante.predio"
                    label="Prédio"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.hidrante.predio}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="hidrante.pavimento"
                    name="hidrante.pavimento"
                    label="Pavimento"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.hidrante.pavimento}
                    isLoading={hydrantModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="hidrante.local"
                    name="hidrante.local"
                    label="Local Específico"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.hidrante.local}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="hidrante.cod_hidrante"
                    name="hidrante.cod_hidrante"
                    label="Cód. Hidrante"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.hidrante.cod_hidrante}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="hidrante.possui_abrigo"
                    name="hidrante.possui_abrigo"
                    label="Possui Abrigo ?"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.hidrante.possui_abrigo ? 'Sim' : 'Não'}
                    isLoading={hydrantModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {formik.values.respostas &&
                  Object.keys(formik.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={hydrantModal.isLoading}>
                      <Answers.Content key={categoria}>
                        {formik.values.respostas &&
                          formik.values.respostas[categoria].map((pergunta: RespostaHydrants, index) => (
                            <Answers.ContentItem key={index} isLoading={hydrantModal.isLoading}>
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
                    isLoading={hydrantModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={hydrantModal.isLoading || generatePdf}
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

                <Button.Root onClick={handleOnOpenChange} disabled={hydrantModal.isLoading} className="w-[10rem] h-10">
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root type="submit" disabled={hydrantModal.isLoading || formik.isSubmitting} fill className="w-[10rem] h-10">
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
          O sistema encontrou um erro ao tentar atualizar o registro. Recarregue a página e tente novamente. Se o problema persistir, entre
          em contato com o administrador do sistema.
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

export default HydrantModalBXO;
