import * as yup from 'yup';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { IReports } from '../../types/Reports';
import useReports from '../../hooks/useReports';
import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import TextField from '../../../../components/TextField';
import DatePicker from '../../../../components/DatePicker';
import { appContext } from '../../../../context/appContext';
import { FileImport } from '../../../../components/FileImport';
import { RadioGroup } from '../../../../components/RadioGroup';
import { arraysAreEqual } from '../../../../utils/arraysAreEqual';
import Select, { SelectItem } from '../../../../components/Select';

interface IReportsModal extends Partial<IReports> {
  isRevalidate: string;
  revalidateValue: number | null;
}

const ReportsModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { sites } = appContext();
  const [searchParams] = useSearchParams();
  const localSite = localStorage.getItem('user_site');
  const [reporItem, setReportItem] = useState<boolean | null>(null);
  const isEdit = searchParams.get('edit') === 'true' || params.id === 'new' ? true : false;

  const {
    reportModal,
    isLoadingReportModal,
    tipoLaudo,
    mutateReport,
    isLoadingMutateReport,
    isLoadingTipoLaudo,
    mutateRemoveAttachments,
    mutateAddAttachments,
    isLoadingMutateRemoveAttachments,
    isLoadingMutateAddAttachments,
  } = useReports();

  useEffect(() => {
    if (params?.id) {
      setReportItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setReportItem(null);
    navigate('/reports');
  };

  const validationSchema = yup.object().shape({
    emissao: yup.string().required(),
    validade: yup.string().required(),
    dias_antecedentes_alerta: yup.number().min(1).required(),
    tipo_laudoId: yup.number().min(1).required(),

    AttachmentFiles: yup.array().of(yup.object()),

    isRevalidate: yup.string(),
    revalidateValue: yup
      .number()
      .test('is-required', 'Este campo é obrigatório quando isRevalidate é verdadeiro', function (value) {
        const isRevalidate = this.parent.isRevalidate;
        if (isRevalidate === 'true') {
          console.log(value);
          return value !== undefined && value > 0;
        }
        return true;
      }),

    file: yup.array().test('hasFile', 'Pelo menos 1 anexo é necessário', function (value) {
      const { AttachmentFiles } = this.parent;
      if (!AttachmentFiles || AttachmentFiles.length === 0) {
        return value && value.length > 0;
      }
      return true;
    }),
  });

  const initialRequestBadgeValues: IReportsModal = {
    Attachments: params.id !== 'new' ? reportModal?.Attachments || false : false,
    AttachmentFiles: params.id !== 'new' ? reportModal?.AttachmentFiles || [] : [],
    Created: params.id !== 'new' ? reportModal?.Created || null : null,
    dias_antecedentes_alerta: params.id !== 'new' ? reportModal?.dias_antecedentes_alerta || 0 : 0,
    emissao: params.id !== 'new' ? reportModal?.emissao || null : null,
    excluido: params.id !== 'new' ? reportModal?.excluido || false : false,
    Id: params.id !== 'new' ? reportModal?.Id || 0 : 0,
    site: params.id !== 'new' ? reportModal?.site || { Title: '' } : { Title: '' },
    tipo_laudo: params.id !== 'new' ? reportModal?.tipo_laudo || { Title: '', Id: 0 } : { Title: '', Id: 0 },
    validade: params.id !== 'new' ? reportModal?.validade || null : null,
    tipo_laudoId: params.id !== 'new' ? reportModal?.tipo_laudoId || null : null,
    siteId:
      params.id !== 'new' ? reportModal?.siteId || null : sites?.find((site) => site.Title === localSite)?.Id || null,

    revalidado: params.id !== 'new' ? reportModal?.revalidado || false : false,

    numero_laudo_revalidado: params.id !== 'new' ? reportModal?.numero_laudo_revalidado || null : null,

    file: [],
    isRevalidate: 'false',
    revalidateValue: 0,
  };

  const handleSubmit = async (values: IReportsModal) => {
    if (values) {
      const isFormEdit = searchParams.get('edit') === 'true';
      const newData = await mutateReport({ values, isEdit: isFormEdit });

      if (values.file && values.file?.length > 0 && newData.Id) {
        await mutateAddAttachments({ attachments: values.file, itemId: newData.Id });
      }
      // Lógica para excluir anexos
      const isAttachmentFilesChanged =
        values.AttachmentFiles && !arraysAreEqual(values.AttachmentFiles, reportModal?.AttachmentFiles || []);
      if (isAttachmentFilesChanged) {
        await mutateRemoveAttachments({ attachments: reportModal?.AttachmentFiles, itemId: reportModal?.Id });
      }
      handleOnOpenChange();
    }
  };

  const handleRemoveItem = async (index: number, props: FormikProps<IReportsModal>, isLocalFile: boolean) => {
    if (isLocalFile) {
      const updatedFiles = props.values.file?.filter((_, indexItem) => indexItem !== index);
      props.setFieldValue('file', updatedFiles);
    }
    if (!isLocalFile) {
      // Lógica para apagar 'AttachmentFiles' somente localmente
      const updatedAttachmentFiles = props.values.AttachmentFiles?.filter((_, indexItem) => indexItem !== index);
      props.setFieldValue('AttachmentFiles', updatedAttachmentFiles);
      // await mutateRemoveAttachments({ attachments: props.values.AttachmentFiles, itemId: props.values.Id });
    }
  };

  return (
    <>
      <Modal
        className="w-[71rem]"
        open={reporItem !== null}
        onOpenChange={handleOnOpenChange}
        title={params.id === 'new' ? 'Novo Laudo' : `Laudo ${params.id}`}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initialRequestBadgeValues}
          validationSchema={validationSchema}
          onSubmit={(values: IReportsModal) => handleSubmit(values)}
        >
          {(props: FormikProps<IReportsModal>) => (
            <>
              <form onSubmit={props.handleSubmit}>
                <div className="py-6 px-8">
                  <div className="flex gap-2 py-2">
                    {params.id !== 'new' && (
                      <TextField
                        id="Id"
                        name="Id"
                        label="Número"
                        width="w-[6.25rem]"
                        disabled
                        value={props.values.Id}
                        onChange={props.handleChange}
                        isLoading={isLoadingReportModal}
                      />
                    )}

                    <TextField
                      id="Created"
                      name="Created"
                      label="Data Criação"
                      disabled
                      onChange={props.handleChange}
                      isLoading={isLoadingReportModal}
                      value={
                        params.id === 'new'
                          ? format(new Date(), 'dd/MM/yyyy', { locale: ptBR })
                          : (props.values.Created && format(props.values.Created, 'dd/MM/yyyy', { locale: ptBR })) || ''
                      }
                    />

                    <TextField
                      label="Site"
                      id="site.Title"
                      name="site.Title"
                      disabled
                      isLoading={isLoadingReportModal}
                      value={params.id === 'new' ? localSite ?? '' : props.values.site?.Title}
                    />
                  </div>

                  <div className="flex gap-2 py-2">
                    {!isEdit && (
                      <TextField
                        id="emissao_view"
                        name="emissao_view"
                        label="Data Emissão"
                        disabled
                        value={
                          props.values.emissao && typeof props.values.emissao !== 'string'
                            ? format(props.values.emissao, 'dd/MM/yyyy', { locale: ptBR })
                            : ''
                        }
                        isLoading={isLoadingReportModal}
                      />
                    )}

                    {isEdit && (
                      <DatePicker
                        name="emissao"
                        label="Data Emissão"
                        width="w-[33rem]"
                        errors={props.errors.emissao}
                        touched={props.touched.emissao}
                        isLoading={isLoadingReportModal}
                        value={props.values.emissao ? new Date(props.values.emissao) : null}
                        onChange={(date: any) => props.setFieldValue('emissao', date.toISOString())}
                      />
                    )}

                    {!isEdit && (
                      <TextField
                        id="validade"
                        name="validade"
                        label="Data Validade"
                        disabled
                        value={
                          props.values.validade && typeof props.values.validade !== 'string'
                            ? format(props.values.validade, 'dd/MM/yyyy', { locale: ptBR })
                            : ''
                        }
                        isLoading={isLoadingReportModal}
                      />
                    )}

                    {isEdit && (
                      <DatePicker
                        name="validade"
                        label="Data Validade"
                        width="w-[33rem]"
                        isLoading={isLoadingReportModal}
                        value={props.values.validade ? new Date(props.values.validade) : null}
                        onChange={(date: any) => props.setFieldValue('validade', date.toISOString())}
                        errors={props.errors.validade}
                        touched={props.touched.validade}
                      />
                    )}

                    <TextField
                      type="number"
                      disabled={!isEdit}
                      id="dias_antecedentes_alerta"
                      name="dias_antecedentes_alerta"
                      label="Dias antecedentes para aviso"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.dias_antecedentes_alerta}
                      isLoading={isLoadingReportModal}
                      errors={props.errors.dias_antecedentes_alerta}
                      touched={props.touched.dias_antecedentes_alerta}
                    />
                  </div>

                  <div className="flex gap-2 py-2">
                    {!isEdit && (
                      <TextField
                        id="tipo_laudo.Title"
                        name="tipo_laudo.Title"
                        label="Tipo"
                        disabled
                        value={props.values.tipo_laudo?.Title}
                        isLoading={isLoadingReportModal}
                      />
                    )}

                    {isEdit && (
                      <Select
                        id="tipo_laudo"
                        name="tipo_laudo"
                        label="Tipo"
                        value={props.values.tipo_laudoId ? props.values.tipo_laudoId.toString() : ''}
                        className="w-[50.625rem]"
                        isLoading={isLoadingReportModal || isLoadingTipoLaudo}
                        onValueChange={(value) => {
                          props.setFieldValue('tipo_laudoId', value);
                        }}
                        error={!!props.errors.tipo_laudoId && props.touched.tipo_laudoId}
                      >
                        {tipoLaudo?.map((form) => (
                          <SelectItem key={form.Id} value={form.Id.toString()}>
                            {form.Title}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  </div>

                  {params.id === 'new' && (
                    <div className="flex gap-2 py-2">
                      <div className="flex flex-col gap-4">
                        <RadioGroup.Label>Revalidar Laudo ? </RadioGroup.Label>
                        <RadioGroup.Root
                          id="isRevalidate"
                          name="isRevalidate"
                          defaultValue={props.values.isRevalidate}
                          orientation="horizontal"
                          onValueChange={(value) => {
                            props.setFieldValue('isRevalidate', value);
                          }}
                        >
                          <RadioGroup.Content>
                            <RadioGroup.Item
                              className="bg-white w-6 h-6 rounded-full shadow-md-app hover:bg-primary-opacity focus:shadow-2xl outline-none cursor-default"
                              value="true"
                              id="1"
                            >
                              <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[.6875rem] after:h-[.6875rem] after:rounded-[50%] after:bg-primary" />
                            </RadioGroup.Item>
                            <RadioGroup.Label htmlFor="1">Sim</RadioGroup.Label>
                          </RadioGroup.Content>

                          <RadioGroup.Content>
                            <RadioGroup.Item
                              className="bg-white w-6 h-6 rounded-full shadow-md-app hover:bg-primary-opacity focus:shadow-2xl outline-none cursor-default"
                              value="false"
                              id="2"
                            >
                              <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[.6875rem] after:h-[.6875rem] after:rounded-[50%] after:bg-primary" />
                            </RadioGroup.Item>
                            <RadioGroup.Label htmlFor="2">Não</RadioGroup.Label>
                          </RadioGroup.Content>
                        </RadioGroup.Root>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 py-2">
                    {props.values.isRevalidate === 'true' && (
                      <TextField
                        id="revalidateValue"
                        name="revalidateValue"
                        label="Número do laudo a ser revalidado"
                        isLoading={isLoadingReportModal}
                        type="number"
                        value={props.values.revalidateValue ?? 0}
                        onChange={props.handleChange}
                        errors={props.errors.revalidateValue}
                        touched={props.touched.revalidateValue}
                      />
                    )}

                    {props.values.numero_laudo_revalidado && (
                      <TextField
                        type="number"
                        disabled
                        id="numero_laudo_revalidado"
                        name="numero_laudo_revalidado"
                        isLoading={isLoadingReportModal}
                        label="Número do laudo revalidado"
                        value={props.values.numero_laudo_revalidado ?? ''}
                      />
                    )}
                  </div>

                  <div className="flex gap-2 py-2">
                    {!isLoadingReportModal && (
                      <FileImport.Root>
                        {isEdit && <FileImport.Label error={!!props.errors.file}>Anexo Laudo</FileImport.Label>}
                        <FileImport.Input
                          accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
                          onChange={(event) => {
                            event.target.files &&
                              event.target?.files?.length > 0 &&
                              props.setFieldValue('file', Array.from(event.target.files));
                          }}
                        />
                        {props.values.Attachments &&
                          props.values.AttachmentFiles?.map((item, index) => (
                            <FileImport.RootItem key={index}>
                              {item.ServerRelativeUrl && (
                                <>
                                  <FileImport.Icon fileType="application/pdf" />
                                  <FileImport.ItemLabel
                                    href={'https://bayergroup.sharepoint.com' + item.ServerRelativeUrl}
                                    target="_blank"
                                  >
                                    {item.FileName}
                                  </FileImport.ItemLabel>
                                  <FileImport.Action onClick={() => handleRemoveItem(index, props, false)} />
                                </>
                              )}
                            </FileImport.RootItem>
                          ))}

                        {props.values.file?.map((file, index) => (
                          <FileImport.RootItem key={file.size}>
                            <FileImport.Icon fileType="application/pdf" />
                            <FileImport.ItemLabel>{file.name}</FileImport.ItemLabel>
                            <FileImport.Action onClick={() => handleRemoveItem(index, props, true)} />
                          </FileImport.RootItem>
                        ))}
                      </FileImport.Root>
                    )}

                    {isLoadingReportModal && params.id !== 'new' && <Skeleton className="w-full p-2" />}
                  </div>
                </div>
                <div className="w-full h-px bg-primary-opacity" />

                <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
                  <Button.Root
                    type="button"
                    onClick={handleOnOpenChange}
                    disabled={isLoadingReportModal}
                    className="w-[10rem] h-10"
                  >
                    <Button.Label>Fechar</Button.Label>
                  </Button.Root>

                  {isEdit && (
                    <Button.Root
                      type="submit"
                      disabled={
                        isLoadingMutateReport || isLoadingMutateAddAttachments || isLoadingMutateRemoveAttachments
                      }
                      fill
                      className="w-[10rem] h-10"
                    >
                      {isLoadingMutateReport || isLoadingMutateAddAttachments || isLoadingMutateRemoveAttachments ? (
                        <Button.Spinner />
                      ) : (
                        <Button.Label>Atualizar</Button.Label>
                      )}
                    </Button.Root>
                  )}
                </div>
              </form>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default ReportsModal;
