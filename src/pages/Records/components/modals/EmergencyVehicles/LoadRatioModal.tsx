import jsPDF from 'jspdf';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { ptBR } from 'date-fns/locale';
import { Formik, FormikProps } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../../../components/Modal';
import { Button } from '../../../../../components/Button';
import TextArea from '../../../../../components/TextArea';
import { Answers } from '../../../../../components/Answers';
import TextField from '../../../../../components/TextField';
import useLoadRatio from '../../../hooks/EmergencyVehicles/useLoadRatio';
import { ILoadRatioModal } from '../../../types/EmergencyVehicles/LoadRatio';
import { IRespostaGeneralChecklist } from '../../../types/EmergencyVehicles/GeneralChecklist';

const LoadRatioModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;
  const componentRef = useRef(null);

  const { loadRatioDataModal, isLoadingLoadRatioDataModal, mutateEditLoadRatio, isLoadingMutateEditLoadRatio } =
    useLoadRatio();

  const [generalChecklistItem, setGeneralChecklistItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setGeneralChecklistItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setGeneralChecklistItem(null);
    navigate('/records');
  };

  const expotToPdf = () => {
    html2canvas(document.querySelector('#container')!, {
      scrollY: -window.scrollY,
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'px', [595.28, canvas.height], false);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`teste.pdf`);
    });
  };

  const initialRequestBadgeValues: ILoadRatioModal = {
    Created: loadRatioDataModal?.Created || '',
    Id: loadRatioDataModal?.Id || '',
    bombeiro: loadRatioDataModal?.bombeiro || '',
    bombeiroId: loadRatioDataModal?.bombeiroId || null,
    conforme: loadRatioDataModal?.conforme || null,
    observacao: loadRatioDataModal?.observacao || '',
    site: loadRatioDataModal?.site || '',
    siteId: loadRatioDataModal?.siteId || null,
    veiculo: {
      Id: loadRatioDataModal?.veiculo?.Id || null,
      placa: loadRatioDataModal?.veiculo?.placa || '',
      site: loadRatioDataModal?.veiculo?.site || '',
      tipo_veiculo: loadRatioDataModal?.veiculo?.tipo_veiculo || '',
    },
    veiculo_idId: loadRatioDataModal?.tipo_veiculo || null,
    respostas: loadRatioDataModal?.respostas || {},
  };

  const handleSubmit = async (values: ILoadRatioModal) => {
    if (values) {
      await mutateEditLoadRatio(values);
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
        onSubmit={(values: ILoadRatioModal) => handleSubmit(values)}
      >
        {(props: FormikProps<ILoadRatioModal>) => (
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
                    isLoading={isLoadingLoadRatioDataModal}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={props.handleChange}
                    value={props.values?.Created && format(props.values?.Created, 'dd MMM yyyy', { locale: ptBR })}
                    isLoading={isLoadingLoadRatioDataModal}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    width="w-[25rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.bombeiro}
                    isLoading={isLoadingLoadRatioDataModal}
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
                    isLoading={isLoadingLoadRatioDataModal}
                  />

                  <TextField
                    id="veiculo.placa"
                    name="veiculo.placa"
                    label="Tipo Veículo"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.veiculo.placa}
                    isLoading={isLoadingLoadRatioDataModal}
                  />
                </div>
              </div>

              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {props.values.respostas &&
                  Object.keys(props.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={isLoadingLoadRatioDataModal}>
                      <Answers.Content key={categoria}>
                        {props.values.respostas &&
                          props.values.respostas[categoria].map((pergunta: IRespostaGeneralChecklist, index) => (
                            <Answers.ContentItem key={index} isLoading={isLoadingLoadRatioDataModal}>
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
                    isLoading={isLoadingLoadRatioDataModal}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root onClick={expotToPdf} disabled={isLoadingLoadRatioDataModal} fill className="h-10">
                    <Button.Label>Exportar para PDF</Button.Label>
                    <Button.Icon icon={faDownload} />
                  </Button.Root>
                )}

                <Button.Root
                  onClick={handleOnOpenChange}
                  disabled={isLoadingLoadRatioDataModal || isLoadingMutateEditLoadRatio}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    onClick={() => handleSubmit(props.values)}
                    disabled={isLoadingLoadRatioDataModal || isLoadingMutateEditLoadRatio}
                    fill
                    className="w-[10rem] h-10"
                  >
                    {isLoadingMutateEditLoadRatio ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
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

export default LoadRatioModal;
