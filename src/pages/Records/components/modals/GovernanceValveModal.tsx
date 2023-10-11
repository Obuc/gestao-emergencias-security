import jsPDF from 'jspdf';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { ptBR } from 'date-fns/locale';
import { Formik, FormikProps } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import TextArea from '../../../../components/TextArea';
import TextField from '../../../../components/TextField';
import { Answers } from '../../../../components/Answers';
import { RespostaExtintor } from '../../types/Extinguisher';
import { GovernanceValve } from '../../types/GovernanceValve';
import useGovernanceValve from '../../hooks/useGovernanceValve';

const GovernanceValveModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;
  const componentRef = useRef(null);

  const {
    governaceValveModal,
    isLoadingGovernaceValveModal,
    mutateEditGovernanceValve,
    isLoadingMutateEditGovernanceValve,
  } = useGovernanceValve();

  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setExtinguisherItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setExtinguisherItem(null);
    navigate('/records/valves');
  };

  const expotToPdf = () => {
    html2canvas(document.querySelector('#container')!, {
      scrollY: -window.scrollY,
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      console.log(imgData);

      const pdf = new jsPDF('p', 'px', [595.28, canvas.height], false);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`teste.pdf`);
    });
  };

  const initialRequestBadgeValues: GovernanceValve = {
    Created: governaceValveModal?.Created || '',
    Id: governaceValveModal?.Id || 0,
    bombeiro: governaceValveModal?.bombeiro ?? '',
    conforme: governaceValveModal?.conforme ?? '',
    valvula: {
      Id: governaceValveModal?.extintor?.Id || '',
      site: governaceValveModal?.extintor?.site || '',
      predio: governaceValveModal?.extintor?.predio || '',
      pavimento: governaceValveModal?.extintor?.pavimento || '',
      local: governaceValveModal?.extintor?.local || '',
      conforme: governaceValveModal?.extintor?.conforme || false,
      cod_qrcode: governaceValveModal?.extintor?.cod_qrcode || '',
      cod_equipamento: governaceValveModal?.extintor?.cod_equipamento || '',
    },
    respostas: governaceValveModal?.respostas || {},
    observacao: governaceValveModal?.observacao || '',
  };

  const handleSubmit = async (values: GovernanceValve) => {
    if (values) {
      await mutateEditGovernanceValve(values);
      handleOnOpenChange();
    }
  };

  return (
    <Modal
      className="w-[71rem]"
      open={extinguisherItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Válvula de Governo N°${params.id}`}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialRequestBadgeValues}
        onSubmit={(values: GovernanceValve) => handleSubmit(values)}
      >
        {(props: FormikProps<GovernanceValve>) => (
          <>
            <div ref={componentRef} id="container">
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
                    isLoading={isLoadingGovernaceValveModal}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={props.handleChange}
                    value={props.values?.Created ? format(props.values.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={isLoadingGovernaceValveModal}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    width="w-[25rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.bombeiro}
                    isLoading={isLoadingGovernaceValveModal}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="valvula.site"
                    name="valvula.site"
                    label="Site"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.valvula.site}
                    isLoading={isLoadingGovernaceValveModal}
                  />

                  <TextField
                    id="valvula.predio"
                    name="valvula.predio"
                    label="Prédio"
                    width="w-[12.5rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.valvula.predio}
                    isLoading={isLoadingGovernaceValveModal}
                  />
                  <TextField
                    id="valvula.pavimento"
                    name="valvula.pavimento"
                    label="Pavimento"
                    width="w-[12.5rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.valvula.pavimento}
                    isLoading={isLoadingGovernaceValveModal}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="valvula.local"
                    name="valvula.local"
                    label="Local Específico"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.valvula.local}
                    isLoading={isLoadingGovernaceValveModal}
                  />
                  <TextField
                    id="valvula.cod_equipamento"
                    name="valvula.cod_equipamento"
                    label="Cód. Válvula"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.valvula.cod_equipamento}
                    isLoading={isLoadingGovernaceValveModal}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {props.values.respostas &&
                  Object.keys(props.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={isLoadingGovernaceValveModal}>
                      <Answers.Content key={categoria}>
                        {props.values.respostas &&
                          props.values.respostas[categoria].map((pergunta: RespostaExtintor, index) => (
                            <Answers.ContentItem key={index} isLoading={isLoadingGovernaceValveModal}>
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
                    isLoading={isLoadingGovernaceValveModal}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root onClick={expotToPdf} disabled={isLoadingGovernaceValveModal} fill className="h-10">
                    <Button.Label>Exportar para PDF</Button.Label>
                    <Button.Icon icon={faDownload} />
                  </Button.Root>
                )}

                <Button.Root
                  onClick={handleOnOpenChange}
                  disabled={isLoadingGovernaceValveModal}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    onClick={() => handleSubmit(props.values)}
                    disabled={isLoadingGovernaceValveModal}
                    fill
                    className="w-[10rem] h-10"
                  >
                    {isLoadingMutateEditGovernanceValve ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
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

export default GovernanceValveModal;
