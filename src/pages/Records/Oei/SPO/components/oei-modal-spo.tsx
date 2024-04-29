import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Toast from '@/components/Toast';
import Modal from '@/components/Modal';
import { OeiPdfSPO } from './oei-pdf-spo';
import { Button } from '@/components/Button';
import TextArea from '@/components/TextArea';
import TextField from '@/components/TextField';
import { Answers } from '@/components/Answers';
import { useOeiModalSPO } from '../hooks/oei-modal-spo.hook';

export const OeiModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { oeiItem, setOeiItem, oeiModal, mutateEdit, formik } = useOeiModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setOeiItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setOeiItem(null);
    navigate('/spo/records/oei_operation');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<OeiPdfSPO data={oeiModal.data} />).toBlob();
    saveAs(blob, `Registro Operação OEI SPO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={oeiItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Operação OEI N°${params.id}`}
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
                    isLoading={oeiModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={oeiModal.isLoading}
                  />

                  <TextField
                    id="Responsavel"
                    name="Responsavel"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Responsavel1}
                    isLoading={oeiModal.isLoading}
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
                    isLoading={oeiModal.isLoading}
                  />

                  <TextField
                    id="Municipios"
                    name="Municipios"
                    label="Município"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Municipios}
                    isLoading={oeiModal.isLoading}
                  />

                  <TextField
                    id="Site"
                    name="Site"
                    label="Site"
                    disabled
                    width="w-[6.25rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Site}
                    isLoading={oeiModal.isLoading}
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
                    isLoading={oeiModal.isLoading}
                  />

                  <TextField
                    id="Local"
                    name="Local"
                    label="Local"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Local}
                    isLoading={oeiModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                <Answers.Root label="Localização" isLoading={oeiModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={oeiModal.isLoading}>
                      <Answers.Label label="Qual prédio e elevador foi testado?" />
                      <Answers.Button
                        id="OData__x004c_oc1"
                        name="OData__x004c_oc1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x004c_oc1', !formik.values.OData__x004c_oc1)}
                        answersValue={formik.values.OData__x004c_oc1}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Funcionamento OEI" isLoading={oeiModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={oeiModal.isLoading}>
                      <Answers.Label label="O bombeiro estava no elevador correspondente à chave acionada?" />
                      <Answers.Button
                        id="OData__x0046_cn1"
                        name="OData__x0046_cn1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0046_cn1', !formik.values.OData__x0046_cn1)}
                        answersValue={formik.values.OData__x0046_cn1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={oeiModal.isLoading}>
                      <Answers.Label label="A chave para operação foi acionada corretamente?" />
                      <Answers.Button
                        id="OData__x0046_cn2"
                        name="OData__x0046_cn2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0046_cn2', !formik.values.OData__x0046_cn2)}
                        answersValue={formik.values.OData__x0046_cn2}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={oeiModal.isLoading}>
                      <Answers.Label label="Após o acionamento da chave na Central, o elevador foi para o térreo e abriu as portas?" />
                      <Answers.Button
                        id="OData__x0046_cn3"
                        name="OData__x0046_cn3"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0046_cn3', !formik.values.OData__x0046_cn3)}
                        answersValue={formik.values.OData__x0046_cn3}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={oeiModal.isLoading}>
                      <Answers.Label label="Após o desligamento da chave na Central, o elevador voltou para a operação normal?" />
                      <Answers.Button
                        id="OData__x0046_cn4"
                        name="OData__x0046_cn4"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0046_cn4', !formik.values.OData__x0046_cn4)}
                        answersValue={formik.values.OData__x0046_cn4}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Interfone" isLoading={oeiModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={oeiModal.isLoading}>
                      <Answers.Label label="O Bombeiro ouve bem o Operador da Central de emergencia?" />
                      <Answers.Button
                        id="OData__x0049_nt1"
                        name="OData__x0049_nt1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0049_nt1', !formik.values.OData__x0049_nt1)}
                        answersValue={formik.values.OData__x0049_nt1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={oeiModal.isLoading}>
                      <Answers.Label label="O Operador da Central de Emergência ouve bem o Bombeiro?" />
                      <Answers.Button
                        id="OData__x0049_nt2"
                        name="OData__x0049_nt2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0049_nt2', !formik.values.OData__x0049_nt2)}
                        answersValue={formik.values.OData__x0049_nt2}
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
                    isLoading={oeiModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={oeiModal.isLoading || generatePdf}
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

                <Button.Root onClick={handleOnOpenChange} disabled={oeiModal.isLoading} className="w-[10rem] h-10">
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={oeiModal.isLoading || formik.isSubmitting}
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
