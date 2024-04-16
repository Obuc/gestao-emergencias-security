import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { DeaPdfSPO } from './dea-pdf-spo';
import Toast from '../../../../../components/Toast';
import Modal from '../../../../../components/Modal';
import useDeaModalSPO from '../hooks/dea-modal-spo.hook';
import { Button } from '../../../../../components/Button';
import TextArea from '../../../../../components/TextArea';
import TextField from '../../../../../components/TextField';
import { Answers } from '../../../../../components/Answers';

const DeaModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { deaItem, setDeaItem, deaModal, mutateEdit, formik } = useDeaModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setDeaItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setDeaItem(null);
    navigate('/records/dea');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<DeaPdfSPO data={deaModal.data} />).toBlob();
    saveAs(blob, `Registro DEA SPO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={deaItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Desfibrilador Automático (DEA) N°${params.id}`}
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
                    isLoading={deaModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={deaModal.isLoading}
                  />

                  <TextField
                    id="Responsavel"
                    name="Responsavel"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Responsavel}
                    isLoading={deaModal.isLoading}
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
                    isLoading={deaModal.isLoading}
                  />

                  <TextField
                    id="Municipios"
                    name="Municipios"
                    label="Município"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Municipios}
                    isLoading={deaModal.isLoading}
                  />

                  <TextField
                    id="Site"
                    name="Site"
                    label="Site"
                    disabled
                    width="w-[6.25rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Site}
                    isLoading={deaModal.isLoading}
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
                    isLoading={deaModal.isLoading}
                  />

                  <TextField
                    id="Local"
                    name="Local"
                    label="Local"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Local}
                    isLoading={deaModal.isLoading}
                  />
                </div>

                <div className="flex gap-2 py-2">
                  <TextField
                    id="LocEsp"
                    name="LocEsp"
                    label="Local Específico"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.LocEsp}
                    isLoading={deaModal.isLoading}
                  />

                  <TextField
                    id="CodDea"
                    name="CodDea"
                    label="Código"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.CodDea}
                    isLoading={deaModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                <Answers.Root label="Desfibrilador Automático (DEA)" isLoading={deaModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={deaModal.isLoading}>
                      <Answers.Label label="O DEA está sinalizado?" />
                      <Answers.Button
                        id="Sin"
                        name="Sin"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Sin', !formik.values.Sin)}
                        answersValue={formik.values.Sin}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={deaModal.isLoading}>
                      <Answers.Label label="O lacre da caixa de proteção está intacto?" />
                      <Answers.Button
                        id="Int"
                        name="Int"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Int', !formik.values.Int)}
                        answersValue={formik.values.Int}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={deaModal.isLoading}>
                      <Answers.Label label="O DEA está desobstruído?" />
                      <Answers.Button
                        id="Obst"
                        name="Obst"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Obst', !formik.values.Obst)}
                        answersValue={formik.values.Obst}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={deaModal.isLoading}>
                      <Answers.Label label="O DEA está calibrado?" />
                      <Answers.Button
                        id="Clb"
                        name="Clb"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Clb', !formik.values.Clb)}
                        answersValue={formik.values.Clb}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={deaModal.isLoading}>
                      <Answers.Label label="A calibração está dentro da validade?" />
                      <Answers.Button
                        id="Val"
                        name="Val"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Val', !formik.values.Val)}
                        answersValue={formik.values.Val}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={deaModal.isLoading}>
                      <Answers.Label label="As pás estão dentro da validade?" />
                      <Answers.Button
                        id="Pas"
                        name="Pas"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('Pas', !formik.values.Pas)}
                        answersValue={formik.values.Pas}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                {formik.values.Obs && (
                  <TextArea
                    id="Obs"
                    name="Obs"
                    label="Observações"
                    disabled
                    value={formik.values.Obs}
                    onChange={formik.handleChange}
                    isLoading={deaModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={deaModal.isLoading || generatePdf}
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

                <Button.Root onClick={handleOnOpenChange} disabled={deaModal.isLoading} className="w-[10rem] h-10">
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={deaModal.isLoading || formik.isSubmitting}
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

export default DeaModalSPO;
