import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../../../components/Modal';
import Toast from '../../../../../components/Toast';
import { LoadRatioPdfBXO } from './LoadRatioPdfBXO';
import TextArea from '../../../../../components/TextArea';
import { Button } from '../../../../../components/Button';
import { IRespostaLoadRatio } from '../types/LoadRatioBXO';
import { Answers } from '../../../../../components/Answers';
import TextField from '../../../../../components/TextField';
import useLoadRatioModalBXO from '../hooks/useLoadRatioModalBXO';

const LoadRatioModalBXO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;
  const equipments_value = localStorage.getItem('equipments_value');

  const { loadRatioModal, mutateEdit, loadRatioItem ,setLoadRatioItem, formik } = useLoadRatioModalBXO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setLoadRatioItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setLoadRatioItem(null);
    navigate(`/records/${equipments_value}`);
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);
    const blob = await pdf(<LoadRatioPdfBXO data={loadRatioModal.data} />).toBlob();
    setGeneratePdf(false);
    saveAs(
      blob,
      `Registro ${loadRatioModal.data?.veiculo?.tipo_veiculo} - ID${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`,
    );
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={loadRatioItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Registro Relação de Carga N°${params.id}`}
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
                    isLoading={loadRatioModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created && format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR })}
                    isLoading={loadRatioModal.isLoading}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    width="w-[25rem]"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.bombeiro}
                    isLoading={loadRatioModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="veiculo.tipo_veiculo"
                    name="veiculo.tipo_veiculo"
                    label="Tipo Veículo"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.veiculo.tipo_veiculo}
                    isLoading={loadRatioModal.isLoading}
                  />

                  <TextField
                    id="veiculo.placa"
                    name="veiculo.placa"
                    label="Tipo Veículo"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values.veiculo.placa}
                    isLoading={loadRatioModal.isLoading}
                  />
                </div>
              </div>

              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {formik.values.respostas &&
                  Object.keys(formik.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={loadRatioModal.isLoading}>
                      <Answers.Content key={categoria}>
                        {formik.values.respostas &&
                          formik.values.respostas[categoria].map((pergunta: IRespostaLoadRatio, index) => (
                            <Answers.ContentItem key={index} isLoading={loadRatioModal.isLoading}>
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
                    isLoading={loadRatioModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={loadRatioModal.isLoading || generatePdf}
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
                  disabled={loadRatioModal.isLoading || mutateEdit.isLoading}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={loadRatioModal.isLoading || mutateEdit.isLoading}
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

export default LoadRatioModalBXO;
