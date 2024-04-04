import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../../../components/Modal';
import { ExtinguisherPdfSPO } from './ExtinguisherPdfSPO';
import { Button } from '../../../../../components/Button';
import TextArea from '../../../../../components/TextArea';
import TextField from '../../../../../components/TextField';
import { Answers } from '../../../../../components/Answers';
import useExtinguisherModalSPO from '../hooks/useExtinguisherModalSPO';

const ExtinguisherModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { extinguisherItem, setExtinguisherItem, extinguisherModal, mutateEdit, formik } = useExtinguisherModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setExtinguisherItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setExtinguisherItem(null);
    navigate('/records/extinguisher');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<ExtinguisherPdfSPO data={extinguisherModal.data} />).toBlob();
    saveAs(blob, `Registro Extintor - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <Modal
      className="w-[71rem]"
      open={extinguisherItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Extintor N°${params.id}`}
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
                  value={formik.values.Id}
                  isLoading={extinguisherModal.isLoading}
                />

                <TextField
                  id="Created"
                  name="Created"
                  label="Data"
                  disabled
                  onChange={formik.handleChange}
                  value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                  isLoading={extinguisherModal.isLoading}
                />

                <TextField
                  id="Responsavel1"
                  name="Responsavel1"
                  label="Responsável"
                  disabled
                  onChange={formik.handleChange}
                  value={formik.values.Responsavel1}
                  isLoading={extinguisherModal.isLoading}
                />
              </div>

              <div className="flex gap-2 py-2">
                <TextField
                  id="codigo"
                  name="codigo"
                  label="Cód. Área"
                  disabled
                  width="w-[10rem]"
                  onChange={formik.handleChange}
                  value={formik.values.codigo}
                  isLoading={extinguisherModal.isLoading}
                />

                <TextField
                  id="UF"
                  name="UF"
                  label="UF"
                  disabled
                  onChange={formik.handleChange}
                  value={formik.values.UF}
                  isLoading={extinguisherModal.isLoading}
                />

                <TextField
                  id="Municipios"
                  name="Municipios"
                  label="Múnicipio"
                  disabled
                  onChange={formik.handleChange}
                  value={formik.values.Municipios}
                  isLoading={extinguisherModal.isLoading}
                />

                <TextField
                  id="Site"
                  name="Site"
                  label="Site"
                  disabled
                  width="w-[6.25rem]"
                  onChange={formik.handleChange}
                  value={formik.values.Site}
                  isLoading={extinguisherModal.isLoading}
                />
              </div>

              <div className="flex gap-2 py-2">
                <TextField
                  id="Area"
                  name="Area"
                  label="Área"
                  disabled
                  onChange={formik.handleChange}
                  value={formik.values.Area}
                  isLoading={extinguisherModal.isLoading}
                />

                <TextField
                  id="Local"
                  name="Local"
                  label="Local"
                  disabled
                  onChange={formik.handleChange}
                  value={formik.values.Local}
                  isLoading={extinguisherModal.isLoading}
                />

                <TextField
                  id="Pavimento"
                  name="Pavimento"
                  label="Pavimento"
                  disabled
                  onChange={formik.handleChange}
                  value={formik.values.Pavimento}
                  isLoading={extinguisherModal.isLoading}
                />
              </div>

              <div className="flex gap-2 py-2">
                <TextField
                  id="LocalEsp"
                  name="LocalEsp"
                  label="Local Específico"
                  disabled
                  onChange={formik.handleChange}
                  value={formik.values.LocalEsp}
                  isLoading={extinguisherModal.isLoading}
                />

                <TextField
                  id="DataVenc"
                  name="DataVenc"
                  label="Data de Vencimento"
                  disabled
                  onChange={formik.handleChange}
                  value={
                    formik.values?.DataVenc ? format(formik.values?.DataVenc, 'dd MMM yyyy', { locale: ptBR }) : ''
                  }
                  isLoading={extinguisherModal.isLoading}
                />
              </div>

              <div className="flex gap-2 py-2">
                <TextField
                  id="Tipo"
                  name="Tipo"
                  label="Tipo"
                  disabled
                  onChange={formik.handleChange}
                  value={formik.values.Tipo}
                  isLoading={extinguisherModal.isLoading}
                />

                <TextField
                  id="Massa"
                  name="Massa"
                  label="Peso"
                  disabled
                  onChange={formik.handleChange}
                  value={formik.values.Massa}
                  isLoading={extinguisherModal.isLoading}
                />

                <TextField
                  id="Title"
                  name="Title"
                  label="Cód. Extintor"
                  disabled
                  onChange={formik.handleChange}
                  value={formik.values.Title}
                  isLoading={extinguisherModal.isLoading}
                />
              </div>
            </div>
            <div className="w-full h-px bg-primary-opacity" />

            <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
              <Answers.Root label="Manômetro" isLoading={extinguisherModal.isLoading}>
                <Answers.Content>
                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="O ponteiro está marcando na área verde?" />
                    <Answers.Button
                      id="OData__x004d_an1"
                      name="OData__x004d_an1"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('OData__x004d_an1', !formik.values.OData__x004d_an1)}
                      answersValue={formik.values.OData__x004d_an1}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="O manômetro está sem avarias?" />
                    <Answers.Button
                      id="OData__x004d_an2"
                      name="OData__x004d_an2"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('OData__x004d_an2', !formik.values.OData__x004d_an2)}
                      answersValue={formik.values.OData__x004d_an2}
                    />
                  </Answers.ContentItem>
                </Answers.Content>
              </Answers.Root>

              <Answers.Root label="Carga" isLoading={extinguisherModal.isLoading}>
                <Answers.Content>
                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="A carga nominal está dentro da validade normativa?" />
                    <Answers.Button
                      id="OData__x0043_ar1"
                      name="OData__x0043_ar1"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('OData__x0043_ar1', !formik.values.OData__x0043_ar1)}
                      answersValue={formik.values.OData__x0043_ar1}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="O anel colorido está instalado na parte superior do cilindro?" />
                    <Answers.Button
                      id="OData__x0043_ar2"
                      name="OData__x0043_ar2"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('OData__x0043_ar2', !formik.values.OData__x0043_ar2)}
                      answersValue={formik.values.OData__x0043_ar2}
                    />
                  </Answers.ContentItem>
                </Answers.Content>
              </Answers.Root>

              <Answers.Root label="Cilindro" isLoading={extinguisherModal.isLoading}>
                <Answers.Content>
                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="O cilindro está intacto?" />
                    <Answers.Button
                      id="OData__x0043_il1"
                      name="OData__x0043_il1"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('OData__x0043_il1', !formik.values.OData__x0043_il1)}
                      answersValue={formik.values.OData__x0043_il1}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="O cilindro está em bom estado de conservação?" />
                    <Answers.Button
                      id="OData__x0043_il2"
                      name="OData__x0043_il2"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('OData__x0043_il2', !formik.values.OData__x0043_il2)}
                      answersValue={formik.values.OData__x0043_il2}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="O cilindro está fixado na parede ou sobre um suporte de piso?" />
                    <Answers.Button
                      id="OData__x0043_il3"
                      name="OData__x0043_il3"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('OData__x0043_il3', !formik.values.OData__x0043_il3)}
                      answersValue={formik.values.OData__x0043_il3}
                    />
                  </Answers.ContentItem>
                </Answers.Content>
              </Answers.Root>

              <Answers.Root label="Sinalização" isLoading={extinguisherModal.isLoading}>
                <Answers.Content>
                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="A sinalização está afixada acima do extintor?" />
                    <Answers.Button
                      id="OData__x0053_in1"
                      name="OData__x0053_in1"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('OData__x0053_in1', !formik.values.OData__x0053_in1)}
                      answersValue={formik.values.OData__x0053_in1}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="A sinalização está adequada ao tipo de extintor?" />
                    <Answers.Button
                      id="OData__x0053_in2"
                      name="OData__x0053_in2"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('OData__x0053_in2', !formik.values.OData__x0053_in2)}
                      answersValue={formik.values.OData__x0053_in2}
                    />
                  </Answers.ContentItem>
                </Answers.Content>
              </Answers.Root>

              <Answers.Root label="Obstrução" isLoading={extinguisherModal.isLoading}>
                <Answers.Content>
                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="O Extintor está desobstruído?" />
                    <Answers.Button
                      id="Obst1"
                      name="Obst1"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('Obst1', !formik.values.Obst1)}
                      answersValue={formik.values.Obst1}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="O Extintor está instalado no local adequado?" />
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

              <Answers.Root label="Lacre e Trava" isLoading={extinguisherModal.isLoading}>
                <Answers.Content>
                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="O lacre está intacto?" />
                    <Answers.Button
                      id="OData__x004c_tv1"
                      name="OData__x004c_tv1"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('OData__x004c_tv1', !formik.values.OData__x004c_tv1)}
                      answersValue={formik.values.OData__x004c_tv1}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem isLoading={extinguisherModal.isLoading}>
                    <Answers.Label label="A trava está fixada na alavanca de acionamento?" />
                    <Answers.Button
                      id="OData__x004c_tv2"
                      name="OData__x004c_tv2"
                      disabled={!isEdit}
                      onClick={() => formik.setFieldValue('OData__x004c_tv2', !formik.values.OData__x004c_tv2)}
                      answersValue={formik.values.OData__x004c_tv2}
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
                  isLoading={extinguisherModal.isLoading}
                />
              )}
            </div>

            <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
              {!isEdit && (
                <Button.Root
                  fill
                  onClick={exportToPdf}
                  className="min-w-[14.0625rem] h-10"
                  disabled={extinguisherModal.isLoading || generatePdf}
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
                disabled={extinguisherModal.isLoading}
                className="w-[10rem] h-10"
              >
                <Button.Label>Fechar</Button.Label>
              </Button.Root>

              {isEdit && (
                <Button.Root
                  type="submit"
                  fill
                  disabled={extinguisherModal.isLoading || formik.isSubmitting}
                  className="w-[10rem] h-10"
                >
                  {mutateEdit.isLoading ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
                </Button.Root>
              )}
            </div>
          </div>
        </>
      </form>
    </Modal>
  );
};

export default ExtinguisherModalSPO;
