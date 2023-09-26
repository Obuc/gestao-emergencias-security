import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import TextArea from '../../../../components/TextArea';
import TextField from '../../../../components/TextField';
import { Answers } from '../../../../components/Answers';
import useExtinguisher from '../../hooks/useExtinguisher';
import { ExtinguisherDataModal, RespostaExtintor } from '../../types/Extinguisher';

const ExtinguisherModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;
  const componentRef = useRef(null);

  const { extinguisherModal, IsLoadingMutateEditExtinguisher, mutateEditExtinguisher, isLoadingExtinguisherModal } =
    useExtinguisher();
  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setExtinguisherItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setExtinguisherItem(null);
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

  const initialRequestBadgeValues: ExtinguisherDataModal = {
    Created: extinguisherModal?.Created || '',
    Id: extinguisherModal?.Id || 0,
    Modified: extinguisherModal?.Modified || '',
    Title: null,
    bombeiro: extinguisherModal?.bombeiro ?? '',
    data_pesagem: extinguisherModal?.data_pesagem || '',
    extintor: {
      Id: extinguisherModal?.extintor?.Id || '',
      site: extinguisherModal?.extintor?.site || '',
      predio: extinguisherModal?.extintor?.predio || '',
      pavimento: extinguisherModal?.extintor?.pavimento || '',
      local: extinguisherModal?.extintor?.local || '',
      cod_extintor: extinguisherModal?.extintor?.cod_extintor || '',
      validade: extinguisherModal?.extintor?.validade || '',
      conforme: extinguisherModal?.extintor?.conforme || false,
      massa: extinguisherModal?.extintor?.massa || '',
      cod_qrcode: extinguisherModal?.extintor?.cod_qrcode || '',
      tipo_extintor: extinguisherModal?.extintor?.tipo_extintor || '',
    },
    respostas: extinguisherModal?.respostas || {},
    novo: extinguisherModal?.novo || false,
    observacao: extinguisherModal?.observacao || '',
    status: null,
  };

  const handleSubmit = async (values: ExtinguisherDataModal) => {
    if (values) {
      await mutateEditExtinguisher(values);
      handleOnOpenChange();
    }
  };

  return (
    <Modal
      className="w-[71rem]"
      open={extinguisherItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Extintor N°${params.id}`}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialRequestBadgeValues}
        onSubmit={(values: ExtinguisherDataModal) => handleSubmit(values)}
      >
        {(props: FormikProps<ExtinguisherDataModal>) => (
          <>
            {/* <div onClick={() => console.log(props.values)}>Props</div> */}
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
                    isLoading={isLoadingExtinguisherModal}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={props.handleChange}
                    value={
                      props.values?.Created && format(new Date(props.values?.Created), 'dd MMM yyyy', { locale: ptBR })
                    }
                    isLoading={isLoadingExtinguisherModal}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    width="w-[25rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.bombeiro}
                    isLoading={isLoadingExtinguisherModal}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="extintor.cod_qrcode"
                    name="extintor.cod_qrcode"
                    label="Cód. Área"
                    width="w-[16.25rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.extintor.cod_qrcode}
                    isLoading={isLoadingExtinguisherModal}
                  />

                  <TextField
                    id="extintor.site"
                    name="extintor.site"
                    label="Site"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.extintor.site}
                    isLoading={isLoadingExtinguisherModal}
                  />

                  <TextField
                    id="extintor.predio"
                    name="extintor.predio"
                    label="Prédio"
                    width="w-[12.5rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.extintor.predio}
                    isLoading={isLoadingExtinguisherModal}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="extintor.pavimento"
                    name="extintor.pavimento"
                    label="Pavimento"
                    width="w-[12.5rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.extintor.pavimento}
                    isLoading={isLoadingExtinguisherModal}
                  />

                  <TextField
                    id="extintor.local"
                    name="extintor.local"
                    label="Local Específico"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.extintor.local}
                    isLoading={isLoadingExtinguisherModal}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="extintor.validade"
                    name="extintor.validade"
                    label="Data de Vencimento"
                    disabled
                    onChange={props.handleChange}
                    value={
                      props.values?.extintor.validade &&
                      format(new Date(props.values?.extintor.validade), 'dd MMM yyyy', { locale: ptBR })
                    }
                    isLoading={isLoadingExtinguisherModal}
                  />

                  <TextField
                    id="extintor.tipo_extintor"
                    name="extintor.tipo_extintor"
                    label="Tipo"
                    width="w-[6.25rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.extintor.tipo_extintor}
                    isLoading={isLoadingExtinguisherModal}
                  />

                  <TextField
                    id="extintor.massa"
                    name="extintor.massa"
                    label="Peso"
                    width="w-[6.25rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.extintor.massa}
                    isLoading={isLoadingExtinguisherModal}
                  />

                  <TextField
                    id="extintor.cod_extintor"
                    name="extintor.cod_extintor"
                    label="Cód. Extintor"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.extintor.cod_extintor}
                    isLoading={isLoadingExtinguisherModal}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {props.values.respostas &&
                  Object.keys(props.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={isLoadingExtinguisherModal}>
                      <Answers.Content key={categoria}>
                        {props.values.respostas &&
                          props.values.respostas[categoria].map((pergunta: RespostaExtintor, index) => (
                            <Answers.ContentItem key={index} isLoading={isLoadingExtinguisherModal}>
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
                    isLoading={isLoadingExtinguisherModal}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root onClick={expotToPdf} disabled={isLoadingExtinguisherModal} fill className="h-10">
                    <Button.Label>Exportar para PDF</Button.Label>
                    <Button.Icon icon={faDownload} />
                  </Button.Root>
                )}

                <Button.Root
                  onClick={handleOnOpenChange}
                  disabled={isLoadingExtinguisherModal}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    onClick={() => handleSubmit(props.values)}
                    disabled={isLoadingExtinguisherModal}
                    fill
                    className="w-[10rem] h-10"
                  >
                    {IsLoadingMutateEditExtinguisher ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
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

export default ExtinguisherModal;
