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
import { EyewashShowerPdfSPO } from './eyewash-shower-pdf';
import { useEyewashShowerModalSPO } from '../hooks/eyewash-shower-modal.hook';

export const EyewashEhowerModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { eyewashShowerItem, setEyewashShowerItem, eyewashShowerModal, mutateEdit, formik } = useEyewashShowerModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setEyewashShowerItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setEyewashShowerItem(null);
    navigate('/spo/records/eyewash_shower');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<EyewashShowerPdfSPO data={eyewashShowerModal.data} />).toBlob();
    saveAs(blob, `Registro Chuveiro Lava-Olhos SPO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={eyewashShowerItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Chuveiro Lava-Olhos N°${params.id}`}
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
                    isLoading={eyewashShowerModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={eyewashShowerModal.isLoading}
                  />

                  <TextField
                    id="Responsavel"
                    name="Responsavel"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Responsavel}
                    isLoading={eyewashShowerModal.isLoading}
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
                    isLoading={eyewashShowerModal.isLoading}
                  />

                  <TextField
                    id="Municipios"
                    name="Municipios"
                    label="Município"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Municipios}
                    isLoading={eyewashShowerModal.isLoading}
                  />

                  <TextField
                    id="Site"
                    name="Site"
                    label="Site"
                    disabled
                    width="w-[6.25rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Site}
                    isLoading={eyewashShowerModal.isLoading}
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
                    isLoading={eyewashShowerModal.isLoading}
                  />

                  <TextField
                    id="Local"
                    name="Local"
                    label="Local"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Local}
                    isLoading={eyewashShowerModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                <Answers.Root label="Chuveiro Lava-Olhos" isLoading={eyewashShowerModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={eyewashShowerModal.isLoading}>
                      <Answers.Label label="O chuveiro está sinalizado?" />
                      <Answers.Button
                        id="Sin"
                        name="Sin"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Sin', !formik.values.Sin)}
                        answersValue={formik.values.Sin}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={eyewashShowerModal.isLoading}>
                      <Answers.Label label="O chuveiro está desobstruído?" />
                      <Answers.Button
                        id="Obs"
                        name="Obs"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Obs', !formik.values.Obs)}
                        answersValue={formik.values.Obs}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={eyewashShowerModal.isLoading}>
                      <Answers.Label label="Foi inspecionado juntamente com um funcionário do Setor?" />
                      <Answers.Button
                        id="Insp"
                        name="Insp"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Insp', !formik.values.Insp)}
                        answersValue={formik.values.Insp}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={eyewashShowerModal.isLoading}>
                      <Answers.Label label="O chuveiro está com pressão?" />
                      <Answers.Button
                        id="Press"
                        name="Press"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Press', !formik.values.Press)}
                        answersValue={formik.values.Press}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={eyewashShowerModal.isLoading}>
                      <Answers.Label label="A água do chuveiro está limpa?" />
                      <Answers.Button
                        id="Agua"
                        name="Agua"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Agua', !formik.values.Agua)}
                        answersValue={formik.values.Agua}
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
                    isLoading={eyewashShowerModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={eyewashShowerModal.isLoading || generatePdf}
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
                  disabled={eyewashShowerModal.isLoading}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={eyewashShowerModal.isLoading || formik.isSubmitting}
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
