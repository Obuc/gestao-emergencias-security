import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Toast from '@/components/Toast';
import Modal from '@/components/Modal';
import { ValvePdfSPO } from './valve-pdf';
import { Button } from '@/components/Button';
import TextArea from '@/components/TextArea';
import TextField from '@/components/TextField';
import { Answers } from '@/components/Answers';
import { useValveModalSPO } from '../hooks/valve-modal.hook';

export const ValveModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { governanceValveItem, setGovernanceValveItem, governanceValveModal, mutateEdit, formik } = useValveModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setGovernanceValveItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setGovernanceValveItem(null);
    navigate('/spo/records/valve');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<ValvePdfSPO data={governanceValveModal.data} />).toBlob();
    saveAs(blob, `Registro Válvula de Governo SPO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={governanceValveItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Registro Válvula de Governo N°${params.id}`}
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
                    isLoading={governanceValveModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={governanceValveModal.isLoading}
                  />

                  <TextField
                    id="Responsavel1"
                    name="Responsavel1"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Responsavel1}
                    isLoading={governanceValveModal.isLoading}
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
                    isLoading={governanceValveModal.isLoading}
                  />

                  <TextField
                    id="Municipios"
                    name="Municipios"
                    label="Município"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Municipios}
                    isLoading={governanceValveModal.isLoading}
                  />

                  <TextField
                    id="Site"
                    name="Site"
                    label="Site"
                    disabled
                    width="w-[6.25rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Site}
                    isLoading={governanceValveModal.isLoading}
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
                    isLoading={governanceValveModal.isLoading}
                  />

                  <TextField
                    id="Local"
                    name="Local"
                    label="Local"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Local}
                    isLoading={governanceValveModal.isLoading}
                  />

                  <TextField
                    id="codigo"
                    name="codigo"
                    label="Código"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.codigo}
                    isLoading={governanceValveModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                <Answers.Root label="Tampa" isLoading={governanceValveModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={governanceValveModal.isLoading}>
                      <Answers.Label label="A tampa da válvula está fechada corretamente?" />
                      <Answers.Button
                        id="OData__x0054_mp1"
                        name="OData__x0054_mp1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0054_mp1', !formik.values.OData__x0054_mp1)}
                        answersValue={formik.values.OData__x0054_mp1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={governanceValveModal.isLoading}>
                      <Answers.Label label="A tampa da válvula está em bom estado de conservação?" />
                      <Answers.Button
                        id="OData__x0054_mp2"
                        name="OData__x0054_mp2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0054_mp2', !formik.values.OData__x0054_mp2)}
                        answersValue={formik.values.OData__x0054_mp2}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Funcionamento" isLoading={governanceValveModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={governanceValveModal.isLoading}>
                      <Answers.Label label="A “T” encaixou corretamente na válvula?" />
                      <Answers.Button
                        id="OData__x0046_cn1"
                        name="OData__x0046_cn1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0046_cn1', !formik.values.OData__x0046_cn1)}
                        answersValue={formik.values.OData__x0046_cn1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={governanceValveModal.isLoading}>
                      <Answers.Label label="A válvula estava aberta totalmente?" />
                      <Answers.Button
                        id="OData__x0046_cn2"
                        name="OData__x0046_cn2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0046_cn2', !formik.values.OData__x0046_cn2)}
                        answersValue={formik.values.OData__x0046_cn2}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={governanceValveModal.isLoading}>
                      <Answers.Label label="A válvula foi fechada sem dificuldade?" />
                      <Answers.Button
                        id="OData__x0046_cn3"
                        name="OData__x0046_cn3"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0046_cn3', !formik.values.OData__x0046_cn3)}
                        answersValue={formik.values.OData__x0046_cn3}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={governanceValveModal.isLoading}>
                      <Answers.Label label="Após o teste, a válvula permaneceu aberta novamente?" />
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

                <Answers.Root label="Sinalização" isLoading={governanceValveModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={governanceValveModal.isLoading}>
                      <Answers.Label label="A tampa está sinalizada corretamente?" />
                      <Answers.Button
                        id="OData__x0053_in1"
                        name="OData__x0053_in1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0053_in1', !formik.values.OData__x0053_in1)}
                        answersValue={formik.values.OData__x0053_in1}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Obstrução" isLoading={governanceValveModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={governanceValveModal.isLoading}>
                      <Answers.Label label="A tampa da válvula está desobstruída?" />
                      <Answers.Button
                        id="OData__x004f_bs1"
                        name="OData__x004f_bs1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x004f_bs1', !formik.values.OData__x004f_bs1)}
                        answersValue={formik.values.OData__x004f_bs1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={governanceValveModal.isLoading}>
                      <Answers.Label label="Está sem objetos estranhos no interior da caixa da válvula?" />
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

                <Answers.Root label="Lacre" isLoading={governanceValveModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={governanceValveModal.isLoading}>
                      <Answers.Label label="A válvula está lacrada corretamente?" />
                      <Answers.Button
                        id="OData__x004c_cr1"
                        name="OData__x004c_cr1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x004c_cr1', !formik.values.OData__x004c_cr1)}
                        answersValue={formik.values.OData__x004c_cr1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={governanceValveModal.isLoading}>
                      <Answers.Label label="O lacre da válvula está intacto?" />
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

                {formik.values.Observacao && (
                  <TextArea
                    id="Observacao"
                    name="Observacao"
                    label="Observações"
                    disabled
                    value={formik.values.Observacao}
                    onChange={formik.handleChange}
                    isLoading={governanceValveModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={governanceValveModal.isLoading || generatePdf}
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
                  disabled={governanceValveModal.isLoading}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={governanceValveModal.isLoading || formik.isSubmitting}
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
