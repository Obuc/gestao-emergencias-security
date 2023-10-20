import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../../../components/Modal';
import { Button } from '../../../../../components/Button';
import TextArea from '../../../../../components/TextArea';
import { Answers } from '../../../../../components/Answers';
import TextField from '../../../../../components/TextField';
import { GeneralChecklistPdf } from '../../pdf/GeneralChecklistPdf';
import useGeneralChecklist from '../../../hooks/EmergencyVehicles/useGeneralChecklist';
import { IGeneralChecklistModal, IRespostaGeneralChecklist } from '../../../types/EmergencyVehicles/GeneralChecklist';

const GeneralChecklistModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const {
    generalChecklistDataModal,
    isLoadingGeneralChecklistDataModal,
    mutateEditTGeneralChecklist,
    isLoadingEditTGeneralChecklist,
  } = useGeneralChecklist();

  const [generalChecklistItem, setGeneralChecklistItem] = useState<boolean | null>(null);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setGeneralChecklistItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setGeneralChecklistItem(null);
    navigate('/records/general_checklist');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);
    const blob = await pdf(<GeneralChecklistPdf data={generalChecklistDataModal} />).toBlob();
    setGeneratePdf(false);
    saveAs(blob, `Registro Checklist Geral - ID${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);
  };

  const initialRequestBadgeValues: IGeneralChecklistModal = {
    Created: generalChecklistDataModal?.Created || '',
    Id: generalChecklistDataModal?.Id || '',
    bombeiro: generalChecklistDataModal?.bombeiro || '',
    bombeiroId: generalChecklistDataModal?.bombeiroId || null,
    conforme: generalChecklistDataModal?.conforme || null,
    observacao: generalChecklistDataModal?.observacao || '',
    site: generalChecklistDataModal?.site || '',
    siteId: generalChecklistDataModal?.siteId || null,
    veiculo: {
      Id: generalChecklistDataModal?.veiculo?.Id || null,
      placa: generalChecklistDataModal?.veiculo?.placa || '',
      site: generalChecklistDataModal?.veiculo?.site || '',
      tipo_veiculo: generalChecklistDataModal?.veiculo?.tipo_veiculo || '',
    },
    veiculo_idId: generalChecklistDataModal?.tipo_veiculo || null,
    respostas: generalChecklistDataModal?.respostas || {},
  };

  const handleSubmit = async (values: IGeneralChecklistModal) => {
    if (values) {
      await mutateEditTGeneralChecklist(values);
      handleOnOpenChange();
    }
  };

  return (
    <Modal
      className="w-[71rem]"
      open={generalChecklistItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Veículos de Emergência Checklist Geral N°${params.id}`}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialRequestBadgeValues}
        onSubmit={(values: IGeneralChecklistModal) => handleSubmit(values)}
      >
        {(props: FormikProps<IGeneralChecklistModal>) => (
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
                    isLoading={isLoadingGeneralChecklistDataModal}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={props.handleChange}
                    value={props.values?.Created && format(props.values?.Created, 'dd MMM yyyy', { locale: ptBR })}
                    isLoading={isLoadingGeneralChecklistDataModal}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    width="w-[25rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.bombeiro}
                    isLoading={isLoadingGeneralChecklistDataModal}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="veiculo.tipo_veiculo"
                    name="veiculo.tipo_veiculo"
                    label="Tipo Veículo"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.veiculo.tipo_veiculo}
                    isLoading={isLoadingGeneralChecklistDataModal}
                  />

                  <TextField
                    id="veiculo.placa"
                    name="veiculo.placa"
                    label="Placa"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.veiculo.placa}
                    isLoading={isLoadingGeneralChecklistDataModal}
                  />
                </div>
              </div>

              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {props.values.respostas &&
                  Object.keys(props.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={isLoadingGeneralChecklistDataModal}>
                      <Answers.Content key={categoria}>
                        {props.values.respostas &&
                          props.values.respostas[categoria].map((pergunta: IRespostaGeneralChecklist, index) => (
                            <Answers.ContentItem key={index} isLoading={isLoadingGeneralChecklistDataModal}>
                              <Answers.Label label={pergunta.pergunta_id.Title} />
                              <Answers.Button
                                disabled={!isEdit}
                                onClick={() => {
                                  const updatedResposta = !pergunta.resposta;
                                  props.setFieldValue(`respostas.${categoria}[${index}].resposta`, updatedResposta);
                                }}
                                answersValue={pergunta.resposta}
                              />
                            </Answers.ContentItem>
                          ))}
                      </Answers.Content>
                    </Answers.Root>
                  ))}

                {props.values.observacao && (
                  <TextArea
                    id="observacao"
                    name="observacao"
                    label="Observações"
                    disabled
                    value={props.values.observacao}
                    onChange={props.handleChange}
                    isLoading={isLoadingGeneralChecklistDataModal}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={isLoadingGeneralChecklistDataModal || generatePdf}
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
                  disabled={isLoadingGeneralChecklistDataModal || isLoadingEditTGeneralChecklist}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    onClick={() => handleSubmit(props.values)}
                    disabled={isLoadingGeneralChecklistDataModal || isLoadingEditTGeneralChecklist}
                    fill
                    className="w-[10rem] h-10"
                  >
                    {isLoadingEditTGeneralChecklist ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
                  </Button.Root>
                )}
              </div>
            </div>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default GeneralChecklistModal;
