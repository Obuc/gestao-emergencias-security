import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ptBR } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Toast from '../../../../../components/Toast';
import Modal from '../../../../../components/Modal';
import { Button } from '../../../../../components/Button';
import TextArea from '../../../../../components/TextArea';
import TextField from '../../../../../components/TextField';
import { Answers } from '../../../../../components/Answers';
import { InspectionCmiPdfSPO } from './InspectionCmiPdfSPO';
import useInspectionCmiModalSPO from '../hooks/useInspectionCmiModalSPO';

const InspectionCmiModalSPO = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { inspectionCmiItem, setInspectionCmiItem, cmiInspectionModal, mutateEdit, formik } = useInspectionCmiModalSPO();

  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      setInspectionCmiItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setInspectionCmiItem(null);
    navigate('/records/cmi_inspection');
  };

  const exportToPdf = async () => {
    setGeneratePdf(true);

    const blob = await pdf(<InspectionCmiPdfSPO data={cmiInspectionModal.data} />).toBlob();
    saveAs(blob, `Registro Casa de Bombas SPO - ID ${params.id} - ${format(new Date(), 'dd/MM/yyyy')}.pdf`);

    setGeneratePdf(false);
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={inspectionCmiItem !== null}
        onOpenChange={handleOnOpenChange}
        title={`Casa de Bombas N°${params.id}`}
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
                    isLoading={cmiInspectionModal.isLoading}
                  />

                  <TextField
                    id="Created"
                    name="Created"
                    label="Data"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Created ? format(formik.values?.Created, 'dd MMM yyyy', { locale: ptBR }) : ''}
                    isLoading={cmiInspectionModal.isLoading}
                  />

                  <TextField
                    id="Responsavel1"
                    name="Responsavel1"
                    label="Responsável"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Responsavel1}
                    isLoading={cmiInspectionModal.isLoading}
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
                    isLoading={cmiInspectionModal.isLoading}
                  />

                  <TextField
                    id="Municipios"
                    name="Municipios"
                    label="Município"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Municipios}
                    isLoading={cmiInspectionModal.isLoading}
                  />

                  <TextField
                    id="Site"
                    name="Site"
                    label="Site"
                    disabled
                    width="w-[6.25rem]"
                    onChange={formik.handleChange}
                    value={formik.values?.Site}
                    isLoading={cmiInspectionModal.isLoading}
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
                    isLoading={cmiInspectionModal.isLoading}
                  />

                  <TextField
                    id="Local"
                    name="Local"
                    label="Local"
                    disabled
                    onChange={formik.handleChange}
                    value={formik.values?.Local}
                    isLoading={cmiInspectionModal.isLoading}
                  />
                </div>
              </div>
              <div className="w-full h-px bg-primary-opacity" />

              <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
                <Answers.Root label="Painéis Elétricos" isLoading={cmiInspectionModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="O botão de emergência está desbloqueado?" />
                      <Answers.Button
                        id="OData__x0050_e1"
                        name="OData__x0050_e1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0050_e1', !formik.values.OData__x0050_e1)}
                        answersValue={formik.values.OData__x0050_e1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Todas as lâmpadas foram testadas? Todas acenderam?" />
                      <Answers.Button
                        id="OData__x0050_e2"
                        name="OData__x0050_e2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0050_e2', !formik.values.OData__x0050_e2)}
                        answersValue={formik.values.OData__x0050_e2}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="O Painel sinótico (IHM) está sem indicativo de alarmes?" />
                      <Answers.Button
                        id="OData__x0050_e3"
                        name="OData__x0050_e3"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0050_e3', !formik.values.OData__x0050_e3)}
                        answersValue={formik.values.OData__x0050_e3}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="O quadro elétrico das bombas auxiliares estão no automático?" />
                      <Answers.Button
                        id="OData__x0050_e4"
                        name="OData__x0050_e4"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0050_e4', !formik.values.OData__x0050_e4)}
                        answersValue={formik.values.OData__x0050_e4}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="O quadro elétrico das bombas principais estão no automático?" />
                      <Answers.Button
                        id="OData__x0050_e5"
                        name="OData__x0050_e5"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0050_e5', !formik.values.OData__x0050_e5)}
                        answersValue={formik.values.OData__x0050_e5}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Reservatórios" isLoading={cmiInspectionModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Os dois reservatórios estão fechados com cadeados?" />
                      <Answers.Button
                        id="OData__x0052_es1"
                        name="OData__x0052_es1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0052_es1', !formik.values.OData__x0052_es1)}
                        answersValue={formik.values.OData__x0052_es1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Os dois reservatórios foram abertos para inspeção?" />
                      <Answers.Button
                        id="OData__x0052_es2"
                        name="OData__x0052_es2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0052_es2', !formik.values.OData__x0052_es2)}
                        answersValue={formik.values.OData__x0052_es2}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Os reservatórios estão com os níveis nas réguas indicadoras?" />
                      <Answers.Button
                        id="OData__x0052_es3"
                        name="OData__x0052_es3"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0052_es3', !formik.values.OData__x0052_es3)}
                        answersValue={formik.values.OData__x0052_es3}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="As boias estão instaladas e funcionando?" />
                      <Answers.Button
                        id="OData__x0052_es4"
                        name="OData__x0052_es4"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0052_es4', !formik.values.OData__x0052_es4)}
                        answersValue={formik.values.OData__x0052_es4}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Os registros de enchimento rápido estão fechados?" />
                      <Answers.Button
                        id="OData__x0052_es5"
                        name="OData__x0052_es5"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0052_es5', !formik.values.OData__x0052_es5)}
                        answersValue={formik.values.OData__x0052_es5}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Os registros de enchimento lento estão abertos?" />
                      <Answers.Button
                        id="OData__x0052_es6"
                        name="OData__x0052_es6"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0052_es6', !formik.values.OData__x0052_es6)}
                        answersValue={formik.values.OData__x0052_es6}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="As torres de teste estão fechadas com cadeados?" />
                      <Answers.Button
                        id="OData__x0052_es7"
                        name="OData__x0052_es7"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0052_es7', !formik.values.OData__x0052_es7)}
                        answersValue={formik.values.OData__x0052_es7}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Bombas de Incêndio" isLoading={cmiInspectionModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Os manômetros estão marcando a pressão da rede?" />
                      <Answers.Button
                        id="OData__x0042_i1"
                        name="OData__x0042_i1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0042_i1', !formik.values.OData__x0042_i1)}
                        answersValue={formik.values.OData__x0042_i1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Toda as válvulas estão abertas no sentido do fluxo de água?" />
                      <Answers.Button
                        id="OData__x0042_i2"
                        name="OData__x0042_i2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0042_i2', !formik.values.OData__x0042_i2)}
                        answersValue={formik.values.OData__x0042_i2}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="As chaves de manutenção elétrica estão ligadas?" />
                      <Answers.Button
                        id="OData__x0042_i3"
                        name="OData__x0042_i3"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0042_i3', !formik.values.OData__x0042_i3)}
                        answersValue={formik.values.OData__x0042_i3}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Os botões de emergência estão desbloqueados?" />
                      <Answers.Button
                        id="OData__x0042_i4"
                        name="OData__x0042_i4"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0042_i4', !formik.values.OData__x0042_i4)}
                        answersValue={formik.values.OData__x0042_i4}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="A bomba de recirculação está funcionando?" />
                      <Answers.Button
                        id="OData__x0042_i5"
                        name="OData__x0042_i5"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0042_i5', !formik.values.OData__x0042_i5)}
                        answersValue={formik.values.OData__x0042_i5}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Os pressostatos estão marcando a pressão corretamente?" />
                      <Answers.Button
                        id="OData__x0042_i6"
                        name="OData__x0042_i6"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0042_i6', !formik.values.OData__x0042_i6)}
                        answersValue={formik.values.OData__x0042_i6}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Diversos" isLoading={cmiInspectionModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="O nível da caixa de dreno está dentro do nível?" />
                      <Answers.Button
                        id="OData__x0044_iv1"
                        name="OData__x0044_iv1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0044_iv1', !formik.values.OData__x0044_iv1)}
                        answersValue={formik.values.OData__x0044_iv1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Toda as válvulas estão abertas no sentido do fluxo de água?" />
                      <Answers.Button
                        id="OData__x0044_iv2"
                        name="OData__x0044_iv2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0044_iv2', !formik.values.OData__x0044_iv2)}
                        answersValue={formik.values.OData__x0044_iv2}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Os botões de emergência estão desbloqueados?" />
                      <Answers.Button
                        id="OData__x0044_iv3"
                        name="OData__x0044_iv3"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0044_iv3', !formik.values.OData__x0044_iv3)}
                        answersValue={formik.values.OData__x0044_iv3}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="O manômetro da bomba de recirculação está marcando corretamente?" />
                      <Answers.Button
                        id="OData__x0044_iv4"
                        name="OData__x0044_iv4"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0044_iv4', !formik.values.OData__x0044_iv4)}
                        answersValue={formik.values.OData__x0044_iv4}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Todos os cadeados das tubulações estão fechados?" />
                      <Answers.Button
                        id="OData__x0044_iv5"
                        name="OData__x0044_iv5"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0044_iv5', !formik.values.OData__x0044_iv5)}
                        answersValue={formik.values.OData__x0044_iv5}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="Os manovacuômetros estão instalados?" />
                      <Answers.Button
                        id="OData__x0044_iv6"
                        name="OData__x0044_iv6"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0044_iv6', !formik.values.OData__x0044_iv6)}
                        answersValue={formik.values.OData__x0044_iv6}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Gerador de Emergência" isLoading={cmiInspectionModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="O gerador está pronto para partir?" />
                      <Answers.Button
                        id="OData__x0047_er1"
                        name="OData__x0047_er1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0047_er1', !formik.values.OData__x0047_er1)}
                        answersValue={formik.values.OData__x0047_er1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="O gerador está com cadeado no acesso?" />
                      <Answers.Button
                        id="OData__x0047_er2"
                        name="OData__x0047_er2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0047_er2', !formik.values.OData__x0047_er2)}
                        answersValue={formik.values.OData__x0047_er2}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="O gerador está protegido com extintor?" />
                      <Answers.Button
                        id="OData__x0047_er3"
                        name="OData__x0047_er3"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0047_er3', !formik.values.OData__x0047_er3)}
                        answersValue={formik.values.OData__x0047_er3}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="O gerador não apresenta vazamento de diesel?" />
                      <Answers.Button
                        id="OData__x0047_er4"
                        name="OData__x0047_er4"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0047_er4', !formik.values.OData__x0047_er4)}
                        answersValue={formik.values.OData__x0047_er4}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>

                <Answers.Root label="Casa de Bombas" isLoading={cmiInspectionModal.isLoading}>
                  <Answers.Content>
                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="A porta de acesso estava trancada?" />
                      <Answers.Button
                        id="OData__x0043_b1"
                        name="OData__x0043_b1"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0043_b1', !formik.values.OData__x0043_b1)}
                        answersValue={formik.values.OData__x0043_b1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="A janela de manutenção está trancada?" />
                      <Answers.Button
                        id="OData__x0043_b2"
                        name="OData__x0043_b2"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0043_b2', !formik.values.OData__x0043_b2)}
                        answersValue={formik.values.OData__x0043_b2}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="A iluminação de emergência está funcionando?" />
                      <Answers.Button
                        id="OData__x0043_b3"
                        name="OData__x0043_b3"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0043_b3', !formik.values.OData__x0043_b3)}
                        answersValue={formik.values.OData__x0043_b3}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="A iluminação está funcionando?" />
                      <Answers.Button
                        id="OData__x0043_b4"
                        name="OData__x0043_b4"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0043_b4', !formik.values.OData__x0043_b4)}
                        answersValue={formik.values.OData__x0043_b4}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem isLoading={cmiInspectionModal.isLoading}>
                      <Answers.Label label="O ramal de emergência está funcionando?" />
                      <Answers.Button
                        id="OData__x0043_b5"
                        name="OData__x0043_b5"
                        disabled={!isEdit}
                        onClick={() => formik.setFieldValue('OData__x0043_b5', !formik.values.OData__x0043_b5)}
                        answersValue={formik.values.OData__x0043_b5}
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
                    isLoading={cmiInspectionModal.isLoading}
                  />
                )}
              </div>

              <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                {!isEdit && (
                  <Button.Root
                    fill
                    onClick={exportToPdf}
                    className="min-w-[14.0625rem] h-10"
                    disabled={cmiInspectionModal.isLoading || generatePdf}
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
                  disabled={cmiInspectionModal.isLoading}
                  className="w-[10rem] h-10"
                >
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root
                    type="submit"
                    fill
                    disabled={cmiInspectionModal.isLoading || formik.isSubmitting}
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

export default InspectionCmiModalSPO;
