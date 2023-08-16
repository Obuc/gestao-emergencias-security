import * as yup from 'yup';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import TextArea from '../../../../components/TextArea';
import TextField from '../../../../components/TextField';
import { Answers } from '../../../../components/Answers';
import useExtinguisher from '../../hooks/useExtinguisher';
import { ExtinguisherDataModal } from '../../types/ExtinguisherModalTypes';

const ExtinguisherModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' ? true : false;

  const { extinguisherModal, mutateEditExtinguisher, IsLoadingMutateEditExtinguisher } = useExtinguisher();
  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);

  useEffect(() => {
    if (params?.id) {
      setExtinguisherItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setExtinguisherItem(null);
    navigate('/records');
  };

  const validation = yup.object({
    // shelf_life: yup.string().required('Foto é obrigatório'),
  });

  const initialRequestBadgeValues: ExtinguisherDataModal = {
    ID: extinguisherModal?.Id ? extinguisherModal.Id : 0,
    Created: extinguisherModal?.Created ?? '',
    Responsavel1: { Title: extinguisherModal?.Responsavel1?.Title ?? '' },
    codigo: extinguisherModal?.codigo ?? '',
    UF: extinguisherModal?.UF ?? '',
    Municipios: extinguisherModal?.Municipios ?? '',
    Site: extinguisherModal?.Site ?? '',
    Area: extinguisherModal?.Area ?? '',
    Local: extinguisherModal?.Local ?? '',
    Pavimento: extinguisherModal?.Pavimento ?? '',
    LocalEsp: extinguisherModal?.LocalEsp ?? '',
    DataVenc: extinguisherModal?.DataVenc ?? '',
    Tipo: extinguisherModal?.Tipo ?? '',
    Massa: extinguisherModal?.Massa ?? '',
    Title: extinguisherModal?.Title ?? '',
    OData__x004d_an1: extinguisherModal?.OData__x004d_an1 ?? false,
    OData__x004d_an2: extinguisherModal?.OData__x004d_an2 ?? false,
    OData__x0043_ar1: extinguisherModal?.OData__x0043_ar1 ?? false,
    OData__x0043_ar2: extinguisherModal?.OData__x0043_ar2 ?? false,
    OData__x0043_il1: extinguisherModal?.OData__x0043_il1 ?? false,
    OData__x0043_il2: extinguisherModal?.OData__x0043_il2 ?? false,
    OData__x0043_il3: extinguisherModal?.OData__x0043_il3 ?? false,
    OData__x0053_in1: extinguisherModal?.OData__x0053_in1 ?? false,
    OData__x0053_in2: extinguisherModal?.OData__x0053_in2 ?? false,
    Obst1: extinguisherModal?.Obst1 ?? false,
    Obst2: extinguisherModal?.Obst2 ?? false,
    OData__x004c_tv1: extinguisherModal?.OData__x004c_tv1 ?? false,
    OData__x004c_tv2: extinguisherModal?.OData__x004c_tv2 ?? false,
    Observacao: extinguisherModal?.Observacao ?? '',
  };

  const handleSubmit = async (values: ExtinguisherDataModal) => {
    if (values) {
      await mutateEditExtinguisher(values);
      handleOnOpenChange();
    }
  };

  return (
    <Modal
      className="w-[71rem]"
      open={extinguisherItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Extintor N°${params.id}`}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialRequestBadgeValues}
        validationSchema={validation}
        onSubmit={(values: ExtinguisherDataModal) => handleSubmit(values)}
      >
        {(props: FormikProps<ExtinguisherDataModal>) => (
          <>
            <div className="py-6 px-8">
              <div className="flex gap-2 py-2">
                <TextField
                  id="ID"
                  name="ID"
                  label="Número"
                  width="w-[6.25rem]"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.ID}
                />

                <TextField
                  id="Created"
                  name="Created"
                  label="Data"
                  width="w-[12.5rem]"
                  disabled
                  onChange={props.handleChange}
                  value={
                    props.values?.Created && format(new Date(props.values?.Created), 'dd MMM yyyy', { locale: ptBR })
                  }
                />

                <TextField
                  id="Responsavel1.Title"
                  name="Responsavel1.Title"
                  label="Responsável"
                  width="w-[25rem]"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.Responsavel1.Title}
                />
                <TextField
                  id="ID"
                  name="ID"
                  label="Cód. Área"
                  width="w-[16.25rem]"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.ID}
                />
              </div>

              <div className="flex gap-2 py-2">
                <TextField
                  id="UF"
                  name="UF"
                  label="UF"
                  width="w-[12.5rem]"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.UF}
                />

                <TextField
                  id="Municipios"
                  name="Municipios"
                  label="Município"
                  width="w-[12.5rem]"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.Municipios}
                />

                <TextField
                  id="Site"
                  name="Site"
                  label="Site"
                  width="w-[11.5625rem]"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.Site}
                />

                <TextField
                  id="Area"
                  name="Area"
                  label="Área"
                  width="w-[12.5rem]"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.Area}
                />
              </div>

              <div className="flex gap-2 py-2">
                <TextField
                  id="Local"
                  name="Local"
                  label="Local"
                  width="w-[12.5rem]"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.Local}
                />

                <TextField
                  id="Pavimento"
                  name="Pavimento"
                  label="Pavimento"
                  width="w-[12.5rem]"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.Pavimento}
                />

                <TextField
                  id="LocalEsp"
                  name="LocalEsp"
                  label="Local Específico"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.LocalEsp}
                />
              </div>

              <div className="flex gap-2 py-2">
                <TextField
                  id="DataVenc"
                  name="DataVenc"
                  label="Data de Vencimento"
                  disabled
                  onChange={props.handleChange}
                  value={
                    props.values?.DataVenc && format(new Date(props.values?.DataVenc), 'dd MMM yyyy', { locale: ptBR })
                  }
                />

                <TextField
                  id="Tipo"
                  name="Tipo"
                  label="Tipo"
                  width="w-[6.25rem]"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.Tipo}
                />

                <TextField
                  id="Massa"
                  name="Massa"
                  label="Peso"
                  width="w-[6.25rem]"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.Massa}
                />

                <TextField
                  id="codigo"
                  name="codigo"
                  label="Cód. Extintor"
                  disabled
                  onChange={props.handleChange}
                  value={props.values.codigo}
                />
              </div>
            </div>
            <div className="w-full h-px bg-primary-opacity" />

            <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
              {props.values.Tipo !== 'CO2' && (
                <Answers.Root label="Manometrô">
                  <Answers.Content>
                    <Answers.ContentItem>
                      <Answers.Label label="O ponteiro está marcando na área verde?" />
                      <Answers.Button
                        disabled={!isEdit}
                        onClick={() => props.setFieldValue('OData__x004d_an1', !props.values.OData__x004d_an1)}
                        answersValue={props.values.OData__x004d_an1}
                      />
                    </Answers.ContentItem>

                    <Answers.ContentItem>
                      <Answers.Label label="O manômetro está sem avarias?" />
                      <Answers.Button
                        disabled={!isEdit}
                        onClick={() => props.setFieldValue('OData__x004d_an2', !props.values.OData__x004d_an2)}
                        answersValue={props.values.OData__x004d_an2}
                      />
                    </Answers.ContentItem>
                  </Answers.Content>
                </Answers.Root>
              )}

              <Answers.Root label="Carga">
                <Answers.Content>
                  <Answers.ContentItem>
                    <Answers.Label label="A carga nominal está dentro da validade normativa?" />
                    <Answers.Button
                      disabled={!isEdit}
                      onClick={() => props.setFieldValue('OData__x0043_ar1', !props.values.OData__x0043_ar1)}
                      answersValue={props.values.OData__x0043_ar1}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem>
                    <Answers.Label label="O anel colorido está instalado na parte superior do cilindro?" />
                    <Answers.Button
                      disabled={!isEdit}
                      onClick={() => props.setFieldValue('OData__x0043_ar2', !props.values.OData__x0043_ar2)}
                      answersValue={props.values.OData__x0043_ar2}
                    />
                  </Answers.ContentItem>
                </Answers.Content>
              </Answers.Root>

              <Answers.Root label="Cilindro">
                <Answers.Content>
                  <Answers.ContentItem>
                    <Answers.Label label="O cilindro está intacto?" />
                    <Answers.Button
                      disabled={!isEdit}
                      onClick={() => props.setFieldValue('OData__x0043_il1', !props.values.OData__x0043_il1)}
                      answersValue={props.values.OData__x0043_il1}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem>
                    <Answers.Label label="O cilindro está em bom estado de conservação?" />
                    <Answers.Button
                      disabled={!isEdit}
                      onClick={() => props.setFieldValue('OData__x0043_il2', !props.values.OData__x0043_il2)}
                      answersValue={props.values.OData__x0043_il2}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem>
                    <Answers.Label label="O cilindro está fixado na parede ou sobre um suporte de piso?" />
                    <Answers.Button
                      disabled={!isEdit}
                      onClick={() => props.setFieldValue('OData__x0043_il3', !props.values.OData__x0043_il3)}
                      answersValue={props.values.OData__x0043_il3}
                    />
                  </Answers.ContentItem>
                </Answers.Content>
              </Answers.Root>

              <Answers.Root label="Sinalização">
                <Answers.Content>
                  <Answers.ContentItem>
                    <Answers.Label label="A sinalização está afixada acima do extintor?" />
                    <Answers.Button
                      disabled={!isEdit}
                      onClick={() => props.setFieldValue('OData__x0053_in1', !props.values.OData__x0053_in1)}
                      answersValue={props.values.OData__x0053_in1}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem>
                    <Answers.Label label="A sinalização está adequada ao tipo de extintor?" />
                    <Answers.Button
                      disabled={!isEdit}
                      onClick={() => props.setFieldValue('OData__x0053_in2', !props.values.OData__x0053_in2)}
                      answersValue={props.values.OData__x0053_in2}
                    />
                  </Answers.ContentItem>
                </Answers.Content>
              </Answers.Root>

              <Answers.Root label="Obstrução">
                <Answers.Content>
                  <Answers.ContentItem>
                    <Answers.Label label="O Extintor está desobstruído?" />
                    <Answers.Button
                      disabled={!isEdit}
                      onClick={() => props.setFieldValue('Obst1', !props.values.Obst1)}
                      answersValue={props.values.Obst1}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem>
                    <Answers.Label label="O Extintor está instalado no local adequado?" />
                    <Answers.Button
                      disabled={!isEdit}
                      onClick={() => props.setFieldValue('Obst2', !props.values.Obst2)}
                      answersValue={props.values.Obst2}
                    />
                  </Answers.ContentItem>
                </Answers.Content>
              </Answers.Root>

              <Answers.Root label="Lacre e Trava">
                <Answers.Content>
                  <Answers.ContentItem>
                    <Answers.Label label="O lacre está intacto?" />
                    <Answers.Button
                      disabled={!isEdit}
                      onClick={() => props.setFieldValue('OData__x004c_tv1', !props.values.OData__x004c_tv1)}
                      answersValue={props.values.OData__x004c_tv1}
                    />
                  </Answers.ContentItem>

                  <Answers.ContentItem>
                    <Answers.Label label="A trava está fixada na alavanca de acionamento?" />
                    <Answers.Button
                      disabled={!isEdit}
                      onClick={() => props.setFieldValue('OData__x004c_tv2', !props.values.OData__x004c_tv2)}
                      answersValue={props.values.OData__x004c_tv2}
                    />
                  </Answers.ContentItem>
                </Answers.Content>
              </Answers.Root>

              {props.values.Observacao && (
                <TextArea
                  id="Observacao"
                  name="Observacao"
                  label="Observações"
                  width="w-[50.5rem]"
                  value={props.values.Observacao}
                  onChange={props.handleChange}
                />
              )}
              <div className="flex w-full gap-2 justify-end items-center">
                {!isEdit && (
                  <Button.Root onClick={handleOnOpenChange} fill className="h-10">
                    <Button.Label>Exportar para PDF</Button.Label>
                    <Button.Icon icon={faDownload} />
                  </Button.Root>
                )}

                <Button.Root onClick={handleOnOpenChange} className="w-[10rem] h-10">
                  <Button.Label>Fechar</Button.Label>
                </Button.Root>

                {isEdit && (
                  <Button.Root onClick={() => handleSubmit(props.values)} fill className="w-[10rem] h-10">
                    {IsLoadingMutateEditExtinguisher ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
                  </Button.Root>
                )}
              </div>
            </div>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default ExtinguisherModal;
