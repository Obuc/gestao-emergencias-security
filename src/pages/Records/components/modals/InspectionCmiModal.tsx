import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import TextArea from '../../../../components/TextArea';
import TextField from '../../../../components/TextField';
import { Answers } from '../../../../components/Answers';
import { InspectionCmiPdf } from '../pdf/InspectionCmiPdf';
import useInspectionCmi from '../../hooks/useInspectionCmi';
import { InspectionCmiDataModal, ResponstaInspectionCMI } from '../../types/InspectionCMI';

const InspectionCmiModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const {
    inspectionCmiDataModal,
    isLoadingInspectionCmiDataModal,
    mutateEditInspectionCmi,
    isLoadingMutateEditInspectionCmi,
  } = useInspectionCmi();

  const [cmiItem, setCmiItem] = useState<boolean | null>(null);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setCmiItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setCmiItem(null);
    navigate('/records/cmi_inspection');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);
    const blob = await pdf(<InspectionCmiPdf data={inspectionCmiDataModal} />).toBlob();
    setGeneratePdf(false);
    saveAs(blob, `Registro Inspecao CMI - ID${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);
  };

  const initialRequestBadgeValues: InspectionCmiDataModal = {
    Created: inspectionCmiDataModal?.Created || '',
    Id: inspectionCmiDataModal?.Id || 0,
    bombeiro: inspectionCmiDataModal?.bombeiro ?? '',
    cmi: {
      Id: inspectionCmiDataModal?.cmi?.Id || '',
      site: inspectionCmiDataModal?.cmi?.site || '',
      predio: inspectionCmiDataModal?.cmi?.predio || '',
      local: inspectionCmiDataModal?.cmi?.local || '',
      validade: inspectionCmiDataModal?.cmi?.validade || '',
      conforme: inspectionCmiDataModal?.cmi?.conforme || false,
      cod_qrcode: inspectionCmiDataModal?.cmi?.cod_qrcode || '',
    },
    respostas: inspectionCmiDataModal?.respostas || {},
    novo: inspectionCmiDataModal?.novo || false,
    observacao: inspectionCmiDataModal?.observacao || '',
  };

  const handleSubmit = async (values: InspectionCmiDataModal) => {
    if (values) {
      await mutateEditInspectionCmi(values);
      handleOnOpenChange();
    }
  };

  return (
    <Modal
      className="w-[71rem]"
      open={cmiItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Inspeção CMI N°${params.id}`}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialRequestBadgeValues}
        onSubmit={(values: InspectionCmiDataModal) => handleSubmit(values)}
      >
        {(props: FormikProps<InspectionCmiDataModal>) => (
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
                    isLoading={isLoadingInspectionCmiDataModal}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={props.handleChange}
                    value={props.values?.Created ? format(props.values.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={isLoadingInspectionCmiDataModal}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.bombeiro}
                    isLoading={isLoadingInspectionCmiDataModal}
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
                    isLoading={isLoadingInspectionCmiDataModal}
                  />

                  <TextField
                    id="extintor.predio"
                    name="extintor.predio"
                    label="Prédio"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.cmi.predio}
                    isLoading={isLoadingInspectionCmiDataModal}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {props.values.respostas &&
                  Object.keys(props.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={isLoadingInspectionCmiDataModal}>
                      <Answers.Content
                        className={`${
                          props.values.respostas && props.values.respostas[categoria].length === 1 && 'grid-cols-1'
                        }`}
                        key={categoria}
                      >
                        {props.values.respostas &&
                          props.values.respostas[categoria].map((pergunta: ResponstaInspectionCMI, index) => (
                            <Answers.ContentItem key={index} isLoading={isLoadingInspectionCmiDataModal}>
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
                    isLoading={isLoadingInspectionCmiDataModal}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={isLoadingInspectionCmiDataModal || generatePdf}
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
                  disabled={isLoadingInspectionCmiDataModal}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    onClick={() => handleSubmit(props.values)}
                    disabled={isLoadingMutateEditInspectionCmi}
                    fill
                    className="w-[10rem] h-10"
                  >
                    {isLoadingMutateEditInspectionCmi ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
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

export default InspectionCmiModal;
