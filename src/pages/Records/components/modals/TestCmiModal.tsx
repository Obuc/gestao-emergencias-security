import jsPDF from 'jspdf';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { ptBR } from 'date-fns/locale';
import { Formik, FormikProps } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import useTestCMI from '../../hooks/useTestCMI';
import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import TextArea from '../../../../components/TextArea';
import TextField from '../../../../components/TextField';
import { Answers } from '../../../../components/Answers';
import { ResponstaTestCmi, TestCmiDataModal } from '../../types/TestCMI';

const TestCmiModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;
  const componentRef = useRef(null);

  const { testCmiDataModal, isLoadingTestCmiDataModal, mutateEditTestCmi, isLoadingMutateEditTestCmi } = useTestCMI();
  const [cmiItem, setCmiItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setCmiItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setCmiItem(null);
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

  const initialRequestBadgeValues: TestCmiDataModal = {
    Created: testCmiDataModal?.Created || '',
    Id: testCmiDataModal?.Id || 0,
    Modified: testCmiDataModal?.Modified || '',
    Title: null,
    bombeiro: testCmiDataModal?.bombeiro ?? '',
    cmi: {
      Id: testCmiDataModal?.extintor?.Id || '',
      site: testCmiDataModal?.extintor?.site || '',
      predio: testCmiDataModal?.extintor?.predio || '',
      local: testCmiDataModal?.extintor?.local || '',
      validade: testCmiDataModal?.extintor?.validade || '',
      conforme: testCmiDataModal?.extintor?.conforme || false,
      cod_qrcode: testCmiDataModal?.extintor?.cod_qrcode || '',
    },
    respostas: testCmiDataModal?.respostas || {},
    novo: testCmiDataModal?.novo || false,
    observacao: testCmiDataModal?.observacao || '',
    status: '',
  };

  const handleSubmit = async (values: TestCmiDataModal) => {
    if (values) {
      await mutateEditTestCmi(values);
      handleOnOpenChange();
    }
  };

  return (
    <Modal
      className="w-[71rem]"
      open={cmiItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Teste CMI N°${params.id}`}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialRequestBadgeValues}
        onSubmit={(values: TestCmiDataModal) => handleSubmit(values)}
      >
        {(props: FormikProps<TestCmiDataModal>) => (
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
                    isLoading={isLoadingTestCmiDataModal}
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
                    isLoading={isLoadingTestCmiDataModal}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.bombeiro}
                    isLoading={isLoadingTestCmiDataModal}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="extintor.site"
                    name="extintor.site"
                    label="Site"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.cmi.site}
                    isLoading={isLoadingTestCmiDataModal}
                  />

                  <TextField
                    id="extintor.predio"
                    name="extintor.predio"
                    label="Prédio"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.cmi.predio}
                    isLoading={isLoadingTestCmiDataModal}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {props.values.respostas &&
                  props.values.cmi.site === 'BXO' &&
                  Object.keys(props.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={isLoadingTestCmiDataModal}>
                      <Answers.Content className="grid-cols-1" key={categoria}>
                        {props.values.respostas &&
                          props.values.respostas[categoria].map((pergunta: ResponstaTestCmi, index) => (
                            <Answers.ContentItem key={index} isLoading={isLoadingTestCmiDataModal}>
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

                {props.values.respostas &&
                  props.values.cmi.site === 'SPO' &&
                  Object.keys(props.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={isLoadingTestCmiDataModal}>
                      <Answers.Content key={categoria}>
                        {props.values.respostas &&
                          props.values.respostas[categoria].map((pergunta: ResponstaTestCmi, index) => (
                            <Answers.ContentItem key={index} isLoading={isLoadingTestCmiDataModal}>
                              <Answers.Label label={pergunta.pergunta_id.Title} />

                              {pergunta.resposta_2 && (
                                <TextField
                                  id="pergunta.resposta_2"
                                  name="pergunta.resposta_2"
                                  onChange={(e) => {
                                    props.setFieldValue(`respostas.${categoria}[${index}].resposta_2`, e.target.value);
                                  }}
                                  value={pergunta.resposta_2 ?? ''}
                                  isLoading={isLoadingTestCmiDataModal}
                                  disabled={!isEdit}
                                />
                              )}

                              {!pergunta.resposta_2 && (
                                <Answers.Button
                                  disabled={!isEdit}
                                  onClick={() => {
                                    const updatedResposta = !pergunta.resposta;
                                    props.setFieldValue(`respostas.${categoria}[${index}].resposta`, updatedResposta);
                                  }}
                                  answersValue={pergunta.resposta}
                                />
                              )}
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
                    isLoading={isLoadingTestCmiDataModal}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root onClick={expotToPdf} disabled={isLoadingTestCmiDataModal} fill className="h-10">
                    <Button.Label>Exportar para PDF</Button.Label>
                    <Button.Icon icon={faDownload} />
                  </Button.Root>
                )}

                <Button.Root
                  onClick={handleOnOpenChange}
                  disabled={isLoadingTestCmiDataModal}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    onClick={() => handleSubmit(props.values)}
                    disabled={isLoadingTestCmiDataModal}
                    fill
                    className="w-[10rem] h-10"
                  >
                    {isLoadingMutateEditTestCmi ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
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

export default TestCmiModal;
