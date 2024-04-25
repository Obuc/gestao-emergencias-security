import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { HydrantPdfSPO } from './HydrantPdfSPO';
import Toast from '../../../../../components/Toast';
import Modal from '../../../../../components/Modal';
import { Button } from '../../../../../components/Button';
import TextArea from '../../../../../components/TextArea';
import TextField from '../../../../../components/TextField';
import { Answers } from '../../../../../components/Answers';
import useHydrantModalSPO from '../hooks/useHydrantModalSPO';

const HydrantModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { hydrantItem, setHydrantItem, hydrantModal, mutateEdit, formik } = useHydrantModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setHydrantItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setHydrantItem(null);
    navigate('/records/hydrant');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<HydrantPdfSPO data={hydrantModal.data} />).toBlob();
    saveAs(blob, `Registro Hidrante SPO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={hydrantItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Registro Hidrante N°${params.id}`}
      >
        <form className="flex flex-col w-full gap-6" onSubmit={formik.handleSubmit}>
          <>
            <div>
              <div className="py-6 px-8">
                <div className="flex gap-2 py-2">
                  <TextField
                    id="Id"
                    name="Id"
                    label="Num. Registro"
                    width="w-[10rem]"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Id}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="Responsavel1"
                    name="Responsavel1"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Responsavel1}
                    isLoading={hydrantModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="UF"
                    name="UF"
                    label="UF"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.UF}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="Municipios"
                    name="Municipios"
                    label="Município"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Municipios}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="Site"
                    name="Site"
                    label="Site"
                    disabled
                    width="w-[6.25rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Site}
                    isLoading={hydrantModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="Area"
                    name="Area"
                    label="Área"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Area}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="Local"
                    name="Local"
                    label="Local"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Local}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="Pavimento"
                    name="Pavimento"
                    label="Pavimento"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Pavimento}
                    isLoading={hydrantModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="LocalEsp"
                    name="LocalEsp"
                    label="Local Específico"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.LocalEsp}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="CodLacre"
                    name="CodLacre"
                    label="Código do lacre"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.CodLacre ? formik.values?.CodLacre : 'N/A'}
                    isLoading={hydrantModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="CodMangueira"
                    name="CodMangueira"
                    label="Código da(s) mangueira(s)"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.CodMangueira}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="Diametro"
                    name="Diametro"
                    label="Diâmetro"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Diametro}
                    isLoading={hydrantModal.isLoading}
                  />

                  <TextField
                    id="Comprimento"
                    name="Comprimento"
                    label="Comprimento"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Comprimento}
                    isLoading={hydrantModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                <Answers.Root label="Hidrante" isLoading={hydrantModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="O hidrante está sem avarias?" />
                      <Answers.Button
                        id="OData__x0048_id1"
                        name="OData__x0048_id1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0048_id1', !formik.values.OData__x0048_id1)}
                        answersValue={formik.values.OData__x0048_id1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="O hidrante está em bom estado de conservação?" />
                      <Answers.Button
                        id="OData__x0048_id2"
                        name="OData__x0048_id2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0048_id2', !formik.values.OData__x0048_id2)}
                        answersValue={formik.values.OData__x0048_id2}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Abrigo" isLoading={hydrantModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="O abrigo de mangueira está sem avarias?" />
                      <Answers.Button
                        id="OData__x0041_bg1"
                        name="OData__x0041_bg1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0041_bg1', !formik.values.OData__x0041_bg1)}
                        answersValue={formik.values.OData__x0041_bg1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="O abrigo está em bom esteado de conservação?" />
                      <Answers.Button
                        id="OData__x0041_bg2"
                        name="OData__x0041_bg2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0041_bg2', !formik.values.OData__x0041_bg2)}
                        answersValue={formik.values.OData__x0041_bg2}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Sinalização" isLoading={hydrantModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="A sinalização está fixada adequadamente?" />
                      <Answers.Button
                        id="OData__x0053_nl1"
                        name="OData__x0053_nl1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0053_nl1', !formik.values.OData__x0053_nl1)}
                        answersValue={formik.values.OData__x0053_nl1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="A sinalização está de acordo com as normas?" />
                      <Answers.Button
                        id="OData__x0053_nl2"
                        name="OData__x0053_nl2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0053_nl2', !formik.values.OData__x0053_nl2)}
                        answersValue={formik.values.OData__x0053_nl2}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Obstrução" isLoading={hydrantModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="O hidrante está desobstruído?" />
                      <Answers.Button
                        id="Obst1"
                        name="Obst1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Obst1', !formik.values.Obst1)}
                        answersValue={formik.values.Obst1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="Está sem objetos estranhos no abrigo?" />
                      <Answers.Button
                        id="Obst2"
                        name="Obst2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Obst2', !formik.values.Obst2)}
                        answersValue={formik.values.Obst2}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Lacre" isLoading={hydrantModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="O abrigo está lacrado corretamente?" />
                      <Answers.Button
                        id="OData__x004c_cr1"
                        name="OData__x004c_cr1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x004c_cr1', !formik.values.OData__x004c_cr1)}
                        answersValue={formik.values.OData__x004c_cr1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="O lacre do abrigo está intacto?" />
                      <Answers.Button
                        id="OData__x004c_cr2"
                        name="OData__x004c_cr2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x004c_cr2', !formik.values.OData__x004c_cr2)}
                        answersValue={formik.values.OData__x004c_cr2}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Inspeção" isLoading={hydrantModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="A etiqueta de Inspeção está instalada?" />
                      <Answers.Button
                        id="Insp1"
                        name="Insp1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Insp1', !formik.values.Insp1)}
                        answersValue={formik.values.Insp1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={hydrantModal.isLoading}>
                      <Answers.Label label="A trava está fixada na alavanca de acionamento?" />
                      <Answers.Button
                        id="Insp2"
                        name="Insp2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Insp2', !formik.values.Insp2)}
                        answersValue={formik.values.Insp2}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                {formik.values.Observacao && (
                  <TextArea
                    id="Observacao"
                    name="Observacao"
                    label="Observações"
                    disabled
                    value={formik.values.Observacao}
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
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={hydrantModal.isLoading || formik.isSubmitting}
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

export default HydrantModalSPO;
