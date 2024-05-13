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
import { SpillKitPdfSPO } from './spill-kit-pdf';
import { useSpillKitModalSPO } from '../hooks/spill-kit-modal.hook';

export const SpillKitModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { spillKitItem, setSpillKitItem, spillKitModal, mutateEdit, formik } = useSpillKitModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setSpillKitItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setSpillKitItem(null);
    navigate('/spo/records/spill_kit');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<SpillKitPdfSPO data={spillKitModal.data} />).toBlob();
    saveAs(blob, `Registro Kit de Derramamento Químico SPO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={spillKitItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Kit de Derramamento Químico N°${params.id}`}
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
                    isLoading={spillKitModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={spillKitModal.isLoading}
                  />

                  <TextField
                    id="Responsavel"
                    name="Responsavel"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Responsavel}
                    isLoading={spillKitModal.isLoading}
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
                    isLoading={spillKitModal.isLoading}
                  />

                  <TextField
                    id="Municipios"
                    name="Municipios"
                    label="Município"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Municipios}
                    isLoading={spillKitModal.isLoading}
                  />

                  <TextField
                    id="Site"
                    name="Site"
                    label="Site"
                    disabled
                    width="w-[6.25rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Site}
                    isLoading={spillKitModal.isLoading}
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
                    isLoading={spillKitModal.isLoading}
                  />

                  <TextField
                    id="Local"
                    name="Local"
                    label="Local"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Local}
                    isLoading={spillKitModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                <Answers.Root label="Kit de Derramamento Químico" isLoading={spillKitModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={spillKitModal.isLoading}>
                      <Answers.Label label="O Kit está sinalizado?" />
                      <Answers.Button
                        id="Sin"
                        name="Sin"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Sin', !formik.values.Sin)}
                        answersValue={formik.values.Sin}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={spillKitModal.isLoading}>
                      <Answers.Label label="O Kit está desobstruído?" />
                      <Answers.Button
                        id="Obs"
                        name="Obs"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Obs', !formik.values.Obs)}
                        answersValue={formik.values.Obs}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={spillKitModal.isLoading}>
                      <Answers.Label label="O Kit está lacrado?" />
                      <Answers.Button
                        id="Lacre"
                        name="Lacre"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Lacre', !formik.values.Lacre)}
                        answersValue={formik.values.Lacre}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={spillKitModal.isLoading}>
                      <Answers.Label label="O Kit está completo com todos os itens?" />
                      <Answers.Button
                        id="Compl"
                        name="Compl"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Compl', !formik.values.Compl)}
                        answersValue={formik.values.Compl}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={spillKitModal.isLoading}>
                      <Answers.Label label="Todos os itens do Kit estão dentro da validade?" />
                      <Answers.Button
                        id="Validade"
                        name="Validade"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Validade', !formik.values.Validade)}
                        answersValue={formik.values.Validade}
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
                    isLoading={spillKitModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={spillKitModal.isLoading || generatePdf}
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

                <Button.Root onClick={handleOnOpenChange} disabled={spillKitModal.isLoading} className="w-[10rem] h-10">
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={spillKitModal.isLoading || formik.isSubmitting}
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
