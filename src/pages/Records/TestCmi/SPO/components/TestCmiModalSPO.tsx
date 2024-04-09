import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { TestCmiPdfSPO } from './TestCmiPdfSPO';
import Toast from '../../../../../components/Toast';
import Modal from '../../../../../components/Modal';
import { Button } from '../../../../../components/Button';
import TextArea from '../../../../../components/TextArea';
import TextField from '../../../../../components/TextField';
import { Answers } from '../../../../../components/Answers';
import useTestCmiModalSPO from '../hooks/useTestCmiModalSPO';

const TestCmiModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { testCmiItem, setTestCmiItem, cmiTestModal, mutateEdit, formik } = useTestCmiModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setTestCmiItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setTestCmiItem(null);
    navigate('/records/cmi_test');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<TestCmiPdfSPO data={cmiTestModal.data} />).toBlob();
    saveAs(blob, `Registro Bombas de Incêndio SPO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={testCmiItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Bombas de Incêndio N°${params.id}`}
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
                    isLoading={cmiTestModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={cmiTestModal.isLoading}
                  />

                  <TextField
                    id="Responsavel1"
                    name="Responsavel1"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Responsavel1}
                    isLoading={cmiTestModal.isLoading}
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
                    isLoading={cmiTestModal.isLoading}
                  />

                  <TextField
                    id="Municipios"
                    name="Municipios"
                    label="Município"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Municipios}
                    isLoading={cmiTestModal.isLoading}
                  />

                  <TextField
                    id="Site"
                    name="Site"
                    label="Site"
                    disabled
                    width="w-[6.25rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Site}
                    isLoading={cmiTestModal.isLoading}
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
                    isLoading={cmiTestModal.isLoading}
                  />

                  <TextField
                    id="Local"
                    name="Local"
                    label="Local"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Local}
                    isLoading={cmiTestModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                <Answers.Root label="Bomba Jockey 1" isLoading={cmiTestModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_j11"
                        name="OData__x0042_j11"
                        label="Corrente elétrica de partida(A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_j11}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_j12"
                        name="OData__x0042_j12"
                        label="Corrente elétrica nominal(A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_j12}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_j13"
                        name="OData__x0042_j13"
                        label="Indicação da pressão no manômetro dos cavaletes durante o teste (KgF/cm²):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_j13}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <Answers.Label label="O teste foi realizado com a chave de comando na posição Automática?" />
                      <Answers.Button
                        id="OData__x0042_j14"
                        name="OData__x0042_j14"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0042_j14', !formik.values.OData__x0042_j14)}
                        answersValue={formik.values.OData__x0042_j14}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Bomba Jockey 2" isLoading={cmiTestModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_j21"
                        name="OData__x0042_j21"
                        label="Corrente elétrica de partida(A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_j21}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_j22"
                        name="OData__x0042_j22"
                        label="Corrente elétrica nominal(A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_j22}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_j23"
                        name="OData__x0042_j23"
                        label="Indicação da pressão no manômetro dos cavaletes durante o teste (KgF/cm²):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_j23}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <Answers.Label label="O teste foi realizado com a chave de comando na posição Automática?" />
                      <Answers.Button
                        id="OData__x0042_j24"
                        name="OData__x0042_j24"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0042_j24', !formik.values.OData__x0042_j24)}
                        answersValue={formik.values.OData__x0042_j24}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Bomba Principal 1" isLoading={cmiTestModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_p11"
                        name="OData__x0042_p11"
                        label="Corrente elétrica de partida(A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_p11}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_p12"
                        name="OData__x0042_p12"
                        label="Corrente elétrica nominal(A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_p12}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_p13"
                        name="OData__x0042_p13"
                        label="Hidrante Favorável (622) – Pressão Indicada no Manômetro (KgF/cm²):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_p13}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_p14"
                        name="OData__x0042_p14"
                        label="Hidrante Desfavorável (110) – Pressão Indicada no Manômetro (KgF/cm²):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_p14}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_p15"
                        name="OData__x0042_p15"
                        label="Tempo de abertura dos hidrantes(min):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_p15}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Bomba Principal 2" isLoading={cmiTestModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_p21"
                        name="OData__x0042_p21"
                        label="Corrente elétrica de partida(A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_p21}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_p22"
                        name="OData__x0042_p22"
                        label="Corrente elétrica nominal(A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_p22}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_p23"
                        name="OData__x0042_p23"
                        label="Hidrante Favorável (622) – Pressão Indicada no Manômetro (KgF/cm²):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_p23}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_p24"
                        name="OData__x0042_p24"
                        label="Hidrante Desfavorável (110) – Pressão Indicada no Manômetro (KgF/cm²):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_p24}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_p25"
                        name="OData__x0042_p25"
                        label="Tempo de abertura dos hidrantes(min):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_p25}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Bomba Booster 1" isLoading={cmiTestModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_b11"
                        name="OData__x0042_b11"
                        label="Corrente elétrica de partida (A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_b11}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_b12"
                        name="OData__x0042_b12"
                        label="Corrente elétrica nominal(A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_b12}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_b13"
                        name="OData__x0042_b13"
                        label="Pressão Indicada no Manômetro (KgF/cm²):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_b13}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Bomba Booster 2" isLoading={cmiTestModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_b21"
                        name="OData__x0042_b21"
                        label="Corrente elétrica de partida (A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_b21}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_b22"
                        name="OData__x0042_b22"
                        label="Corrente elétrica nominal(A):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_b22}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <TextField
                        disabled
                        id="OData__x0042_b23"
                        name="OData__x0042_b23"
                        label="Pressão Indicada no Manômetro (KgF/cm²):"
                        onChange={formik.handleChange}
                        value={formik.values?.OData__x0042_b23}
                        isLoading={cmiTestModal.isLoading}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Gerador" isLoading={cmiTestModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <Answers.Label label="As Bombas de Incêndio foram testadas com energia da Concessionária?" />
                      <Answers.Button
                        id="OData__x0047_er1"
                        name="OData__x0047_er1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0047_er1', !formik.values.OData__x0047_er1)}
                        answersValue={formik.values.OData__x0047_er1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiTestModal.isLoading}>
                      <Answers.Label label="As Bombas de Incêndio foram testadas com o Gerador ligado?" />
                      <Answers.Button
                        id="OData__x0047_er2"
                        name="OData__x0047_er2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0047_er2', !formik.values.OData__x0047_er2)}
                        answersValue={formik.values.OData__x0047_er2}
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
                    isLoading={cmiTestModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={cmiTestModal.isLoading || generatePdf}
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

                <Button.Root onClick={handleOnOpenChange} disabled={cmiTestModal.isLoading} className="w-[10rem] h-10">
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    fill
                    type="submit"
                    className="w-[10rem] h-10"
                    disabled={cmiTestModal.isLoading || formik.isSubmitting}
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

export default TestCmiModalSPO;
