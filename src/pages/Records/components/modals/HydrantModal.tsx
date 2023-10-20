import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../../components/Modal';
import { HydrantsPdf } from '../pdf/HydrantsPdf';
import useHydrants from '../../hooks/useHydrants';
import { Button } from '../../../../components/Button';
import TextArea from '../../../../components/TextArea';
import TextField from '../../../../components/TextField';
import { Answers } from '../../../../components/Answers';
import { HydrantsDataModal, RespostaHydrants } from '../../types/Hydrants';

const HydrantModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { hydrantsDataModal, isLoadingMutateEditHydrant, mutateEditHydrant, isLoadingHydrantsDataModal } =
    useHydrants();

  const [hydrantItem, setHydrantItem] = useState<boolean | null>(null);
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
    const blob = await pdf(<HydrantsPdf data={hydrantsDataModal} />).toBlob();
    setGeneratePdf(false);
    saveAs(blob, `Registro Hidrante - ID${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);
  };

  const initialRequestBadgeValues: HydrantsDataModal = {
    Id: hydrantsDataModal?.Id || 0,
    Created: hydrantsDataModal?.Created || '',
    bombeiro: hydrantsDataModal?.bombeiro ?? '',
    hidrante: {
      Id: hydrantsDataModal?.hidrante?.Id || '',
      site: hydrantsDataModal?.hidrante?.site || '',
      predio: hydrantsDataModal?.hidrante?.predio || '',
      pavimento: hydrantsDataModal?.hidrante?.pavimento || '',
      local: hydrantsDataModal?.hidrante?.local || '',
      conforme: hydrantsDataModal?.hidrante?.conforme || false,
      cod_qrcode: hydrantsDataModal?.hidrante?.cod_qrcode || '',
      cod_hidrante: hydrantsDataModal?.hidrante?.cod_hidrante || '',
      possui_abrigo: hydrantsDataModal?.hidrante?.possui_abrigo || null,
    },
    respostas: hydrantsDataModal?.respostas || {},
    observacao: hydrantsDataModal?.observacao || '',
  };

  const handleSubmit = async (values: HydrantsDataModal) => {
    if (values) {
      await mutateEditHydrant(values);
      handleOnOpenChange();
    }
  };

  return (
    <Modal
      className="w-[71rem]"
      open={hydrantItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Hidrante N°${params.id}`}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialRequestBadgeValues}
        onSubmit={(values: HydrantsDataModal) => handleSubmit(values)}
      >
        {(props: FormikProps<HydrantsDataModal>) => (
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
                    isLoading={isLoadingHydrantsDataModal}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={props.handleChange}
                    value={props.values?.Created && format(props.values?.Created, 'dd MMM yyyy', { locale: ptBR })}
                    isLoading={isLoadingHydrantsDataModal}
                  />

                  <TextField
                    id="bombeiro"
                    name="bombeiro"
                    label="Responsável"
                    width="w-[25rem]"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.bombeiro}
                    isLoading={isLoadingHydrantsDataModal}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="hidrante.site"
                    name="hidrante.site"
                    label="Site"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.hidrante.site}
                    isLoading={isLoadingHydrantsDataModal}
                  />

                  <TextField
                    id="hidrante.predio"
                    name="hidrante.predio"
                    label="Prédio"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.hidrante.predio}
                    isLoading={isLoadingHydrantsDataModal}
                  />

                  <TextField
                    id="hidrante.pavimento"
                    name="hidrante.pavimento"
                    label="Pavimento"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.hidrante.pavimento}
                    isLoading={isLoadingHydrantsDataModal}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="hidrante.local"
                    name="hidrante.local"
                    label="Local Específico"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.hidrante.local}
                    isLoading={isLoadingHydrantsDataModal}
                  />

                  <TextField
                    id="hidrante.cod_hidrante"
                    name="hidrante.cod_hidrante"
                    label="Cód. Hidrante"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.hidrante.cod_hidrante}
                    isLoading={isLoadingHydrantsDataModal}
                  />

                  <TextField
                    id="hidrante.possui_abrigo"
                    name="hidrante.possui_abrigo"
                    label="Possui Abrigo ?"
                    disabled
                    onChange={props.handleChange}
                    value={props.values.hidrante.possui_abrigo ? 'Sim' : 'Não'}
                    isLoading={isLoadingHydrantsDataModal}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                {props.values.respostas &&
                  Object.keys(props.values.respostas).map((categoria) => (
                    <Answers.Root key={categoria} label={categoria} isLoading={isLoadingHydrantsDataModal}>
                      <Answers.Content key={categoria}>
                        {props.values.respostas &&
                          props.values.respostas[categoria].map((pergunta: RespostaHydrants, index) => (
                            <Answers.ContentItem key={index} isLoading={isLoadingHydrantsDataModal}>
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
                    isLoading={isLoadingHydrantsDataModal}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={isLoadingHydrantsDataModal || generatePdf}
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
                  disabled={isLoadingHydrantsDataModal}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    onClick={() => handleSubmit(props.values)}
                    disabled={isLoadingHydrantsDataModal}
                    fill
                    className="w-[10rem] h-10"
                  >
                    {isLoadingMutateEditHydrant ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
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

export default HydrantModal;
