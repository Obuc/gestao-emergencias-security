import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Toast from '@/components/Toast';
import Modal from '@/components/Modal';
import { Button } from '@/components/Button';
import TextArea from '@/components/TextArea';
import TextField from '@/components/TextField';
import { Answers } from '@/components/Answers';
import { AmbulanceCheckPdfSPO } from './ambulance-check-pdf.tsx';
import { useAmbulanceCheckModalSPO } from '../hooks/ambulance-check-modal.hook.ts';

export const AmbulanceCheckModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { ambulanceCheckItem, setAmbulanceCheckItem, ambulanceCheckModal, mutateEdit, formik } =
    useAmbulanceCheckModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setAmbulanceCheckItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setAmbulanceCheckItem(null);
    navigate('/spo/records/ambulance_check');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<AmbulanceCheckPdfSPO data={ambulanceCheckModal.data} />).toBlob();
    saveAs(blob, `Registro Verificação de Ambulância SPO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={ambulanceCheckItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Verificação de Ambulância N°${params.id}`}
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
                    width="w-[10rem]"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Id}
                    isLoading={ambulanceCheckModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={ambulanceCheckModal.isLoading}
                  />

                  <TextField
                    id="Responsavel"
                    name="Responsavel"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Responsavel1}
                    isLoading={ambulanceCheckModal.isLoading}
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
                    isLoading={ambulanceCheckModal.isLoading}
                  />

                  <TextField
                    id="Municipios"
                    name="Municipios"
                    label="Município"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Municipios}
                    isLoading={ambulanceCheckModal.isLoading}
                  />

                  <TextField
                    id="Site"
                    name="Site"
                    label="Site"
                    disabled
                    width="w-[6.25rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Site}
                    isLoading={ambulanceCheckModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                <Answers.Root label="Ambulância" isLoading={ambulanceCheckModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={ambulanceCheckModal.isLoading}>
                      <Answers.Label label="Nível de combustível da ambulância acima da metade do tanque?" />
                      <Answers.Button
                        id="OData__x0056_er1"
                        name="OData__x0056_er1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0056_er1', !formik.values.OData__x0056_er1)}
                        answersValue={formik.values.OData__x0056_er1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={ambulanceCheckModal.isLoading}>
                      <Answers.Label
                        label="Sinais luminosos e sonoros funcionando?
"
                      />
                      <Answers.Button
                        id="OData__x0056_er2"
                        name="OData__x0056_er2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0056_er2', !formik.values.OData__x0056_er2)}
                        answersValue={formik.values.OData__x0056_er2}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={ambulanceCheckModal.isLoading}>
                      <Answers.Label label="Pneus calibrados?" />
                      <Answers.Button
                        id="OData__x0056_er3"
                        name="OData__x0056_er3"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0056_er3', !formik.values.OData__x0056_er3)}
                        answersValue={formik.values.OData__x0056_er3}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={ambulanceCheckModal.isLoading}>
                      <Answers.Label label="O indicador de bateria do DEA está no verde?" />
                      <Answers.Button
                        id="OData__x0056_er4"
                        name="OData__x0056_er4"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0056_er4', !formik.values.OData__x0056_er4)}
                        answersValue={formik.values.OData__x0056_er4}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={ambulanceCheckModal.isLoading}>
                      <Answers.Label label="Verificado se há avaria na lataria?" />
                      <Answers.Button
                        id="OData__x0056_er5"
                        name="OData__x0056_er5"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0056_er5', !formik.values.OData__x0056_er5)}
                        answersValue={formik.values.OData__x0056_er5}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={ambulanceCheckModal.isLoading}>
                      <Answers.Label label="Verificado condições - óleo do motor, fluído de freio e água do radiador?" />
                      <Answers.Button
                        id="OData__x0056_er6"
                        name="OData__x0056_er6"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0056_er6', !formik.values.OData__x0056_er6)}
                        answersValue={formik.values.OData__x0056_er6}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={ambulanceCheckModal.isLoading}>
                      <Answers.Label label="Verificado o sistema de ar condicionado?" />
                      <Answers.Button
                        id="OData__x0056_er7"
                        name="OData__x0056_er7"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0056_er7', !formik.values.OData__x0056_er7)}
                        answersValue={formik.values.OData__x0056_er7}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={ambulanceCheckModal.isLoading}>
                      <Answers.Label label="Verificado as condições do óleo da direção hidráulica e bateria?" />
                      <Answers.Button
                        id="OData__x0056_er8"
                        name="OData__x0056_er8"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0056_er8', !formik.values.OData__x0056_er8)}
                        answersValue={formik.values.OData__x0056_er8}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={ambulanceCheckModal.isLoading}>
                      <Answers.Label label="Verificado mochila de Primeiros Socorros?" />
                      <Answers.Button
                        id="OData__x0056_er9"
                        name="OData__x0056_er9"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0056_er9', !formik.values.OData__x0056_er9)}
                        answersValue={formik.values.OData__x0056_er9}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={ambulanceCheckModal.isLoading}>
                      <Answers.Label label="Verificado prancha longa e maca?" />
                      <Answers.Button
                        id="OData__x0056_er10"
                        name="OData__x0056_er10"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0056_er10', !formik.values.OData__x0056_er10)}
                        answersValue={formik.values.OData__x0056_er10}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={ambulanceCheckModal.isLoading}>
                      <Answers.Label label="Realizado descolamento para circulação do óleo e aquecimento do motor?" />
                      <Answers.Button
                        id="OData__x0056_er11"
                        name="OData__x0056_er11"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0056_er11', !formik.values.OData__x0056_er11)}
                        answersValue={formik.values.OData__x0056_er11}
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
                    isLoading={ambulanceCheckModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={ambulanceCheckModal.isLoading || generatePdf}
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
                  disabled={ambulanceCheckModal.isLoading}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={ambulanceCheckModal.isLoading || formik.isSubmitting}
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
