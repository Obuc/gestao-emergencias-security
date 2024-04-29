import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams as useParamsRouterDom, useSearchParams } from 'react-router-dom';

import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import useParams from '@/hooks/useParams';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import TextField from '@/components/TextField';
import DatePicker from '@/components/DatePicker';
import { FileImport } from '@/components/FileImport';
import { RadioGroup } from '@/components/RadioGroup';
import { useReportModal } from '../hooks/report-modal.hook';

export const ReportsModal = () => {
  const params = useParamsRouterDom();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const localSite = localStorage.getItem('user_site');
  const isEdit = searchParams.get('edit') === 'true' || params.id === 'new' ? true : false;

  const [errorAddFile, setErrorAddFile] = useState<boolean>(false);

  const { tipoLaudo } = useParams();
  const { formik, reportModal, mutateReport, mutateAddAttachments, mutateRemoveAttachments, reporItem, setReportItem } =
    useReportModal();

  useEffect(() => {
    if (params?.id) {
      setReportItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setReportItem(null);
    navigate(`/${localSite?.toLocaleLowerCase()}/reports`);
  };

  const handleRemoveItem = async (index: number, isLocalFile: boolean) => {
    if (isLocalFile) {
      const updatedFiles = formik.values.file?.filter((_, indexItem) => indexItem !== index);
      formik.setFieldValue('file', updatedFiles);
    }
    if (!isLocalFile) {
      // Lógica para apagar 'AttachmentFiles' somente localmente
      const updatedAttachmentFiles = formik.values.AttachmentFiles?.filter((_, indexItem) => indexItem !== index);
      formik.setFieldValue('AttachmentFiles', updatedAttachmentFiles);
      // await mutateRemoveAttachments({ attachments: formik.values.AttachmentFiles, itemId: formik.values.Id });
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
        <form className="flex flex-col w-full gap-6" onSubmit={formik.handleSubmit}>
          <>
            <div className="py-6 px-8">
              <div className="flex gap-2 py-2">
                {params.id !== 'new' && (
                  <TextField
                    id="Id"
                    name="Id"
                    label="Número"
                    width="w-[6.25rem]"
                    disabled
                    value={formik.values.Id}
                    onChange={formik.handleChange}
                    isLoading={reportModal.isLoading}
                  />
                )}

                <TextField
                  id="Created"
                  name="Created"
                  label="Data Criação"
                  disabled
                  onChange={formik.handleChange}
                  isLoading={reportModal.isLoading}
                  value={
                    params.id === 'new'
                      ? format(new Date(), 'dd/MM/yyyy', { locale: ptBR })
                      : (formik.values.Created && format(formik.values.Created, 'dd/MM/yyyy', { locale: ptBR })) || ''
                  }
                />

                <TextField
                  label="Site"
                  id="site.Title"
                  name="site.Title"
                  disabled
                  isLoading={reportModal.isLoading}
                  value={params.id === 'new' ? localSite ?? '' : formik.values.site?.Title}
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
                      formik.values.emissao && typeof formik.values.emissao !== 'string'
                        ? format(formik.values.emissao, 'dd/MM/yyyy', { locale: ptBR })
                        : ''
                    }
                    isLoading={reportModal.isLoading}
                  />
                )}

                {isEdit && (
                  <DatePicker
                    name="emissao"
                    label="Data Emissão"
                    width="w-[33rem]"
                    errors={formik.errors.emissao}
                    touched={formik.touched.emissao}
                    isLoading={reportModal.isLoading}
                    value={formik.values.emissao ? new Date(formik.values.emissao) : null}
                    onChange={(date: any) => formik.setFieldValue('emissao', date)}
                  />
                )}

                {!isEdit && (
                  <TextField
                    id="validade"
                    name="validade"
                    label="Data Validade"
                    disabled
                    value={
                      formik.values.validade && typeof formik.values.validade !== 'string'
                        ? format(formik.values.validade, 'dd/MM/yyyy', { locale: ptBR })
                        : ''
                    }
                    isLoading={reportModal.isLoading}
                  />
                )}

                {isEdit && (
                  <DatePicker
                    name="validade"
                    label="Data Validade"
                    width="w-[33rem]"
                    isLoading={reportModal.isLoading}
                    value={formik.values.validade ? new Date(formik.values.validade) : null}
                    onChange={(date: any) => formik.setFieldValue('validade', date)}
                    errors={formik.errors.validade}
                    touched={formik.touched.validade}
                  />
                )}

                <TextField
                  type="number"
                  disabled={!isEdit}
                  id="dias_antecedentes_alerta"
                  name="dias_antecedentes_alerta"
                  label="Dias antecedentes para aviso"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dias_antecedentes_alerta}
                  isLoading={reportModal.isLoading}
                  errors={formik.errors.dias_antecedentes_alerta}
                  touched={formik.touched.dias_antecedentes_alerta}
                />
              </div>

              <div className="flex gap-2 py-2">
                {!isEdit && (
                  <TextField
                    id="tipo_laudo.Title"
                    name="tipo_laudo.Title"
                    label="Tipo"
                    disabled
                    value={formik.values.tipo_laudo?.Title}
                    isLoading={reportModal.isLoading}
                  />
                )}

                {isEdit && (
                  <Select.Component
                    id="tipo_laudo"
                    name="tipo_laudo"
                    label="Tipo"
                    value={tipoLaudo.data?.find((laudo) => laudo.Id === +formik.values.tipo_laudoId!)?.Title ?? ''}
                    className="w-[50.625rem]"
                    popperWidth="w-[50.625rem]"
                    isLoading={reportModal.isLoading || tipoLaudo.isLoading}
                    onValueChange={(value) => {
                      if (value) {
                        formik.setFieldValue('tipo_laudoId', value);
                      }
                    }}
                    error={!!formik.errors.tipo_laudoId && formik.touched.tipo_laudoId}
                  >
                    {tipoLaudo.data?.map((form) => (
                      <Select.Item key={form.Id} value={form.Id.toString()}>
                        {form.Title}
                      </Select.Item>
                    ))}
                  </Select.Component>
                )}
              </div>

              {params.id === 'new' && (
                <div className="flex gap-2 py-2">
                  <div className="flex flex-col gap-4">
                    <RadioGroup.Label>Revalidar Laudo ? </RadioGroup.Label>
                    <RadioGroup.Root
                      id="isRevalidate"
                      name="isRevalidate"
                      defaultValue={formik.values.isRevalidate}
                      orientation="horizontal"
                      onValueChange={(value) => {
                        formik.setFieldValue('isRevalidate', value);
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
                {formik.values.isRevalidate === 'true' && (
                  <TextField
                    id="revalidateValue"
                    name="revalidateValue"
                    label="Número do laudo a ser revalidado"
                    isLoading={reportModal.isLoading}
                    type="number"
                    value={formik.values.revalidateValue ?? 0}
                    onChange={formik.handleChange}
                    errors={formik.errors.revalidateValue}
                    touched={formik.touched.revalidateValue}
                  />
                )}

                {formik.values.numero_laudo_revalidado && (
                  <TextField
                    type="number"
                    disabled
                    id="numero_laudo_revalidado"
                    name="numero_laudo_revalidado"
                    isLoading={reportModal.isLoading}
                    label="Número do laudo revalidado"
                    value={formik.values.numero_laudo_revalidado ?? ''}
                  />
                )}
              </div>

              <div className="flex gap-2 py-2">
                {!reportModal.isLoading && (
                  <FileImport.Root>
                    {isEdit && <FileImport.Label error={!!formik.errors.file}>Anexo Laudo</FileImport.Label>}
                    <FileImport.Input
                      accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
                      // onChange={(event) => {
                      //   event.target.files &&
                      //     event.target?.files?.length > 0 &&
                      //     formik.setFieldValue('file', Array.from(event.target.files));
                      // }}
                      onChange={(event) => {
                        if (event.target.files && event.target.files.length > 0) {
                          const file = event.target.files[0];
                          const fileSize = file.size;
                          const maxSize = 8 * 1024 * 1024; // 8 MB em bytes

                          if (fileSize <= maxSize) {
                            formik.setFieldValue('file', Array.from(event.target.files));
                          } else {
                            // alert('O arquivo é muito grande. O tamanho máximo permitido é 8 MB.');
                            setErrorAddFile(true);
                          }
                        }
                      }}
                    />
                    {formik.values.Attachments &&
                      formik.values.AttachmentFiles?.map((item, index) => (
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
                              <FileImport.Action onClick={() => handleRemoveItem(index, false)} />
                            </>
                          )}
                        </FileImport.RootItem>
                      ))}

                    {formik.values.file?.map((file, index) => (
                      <FileImport.RootItem key={file.size}>
                        <FileImport.Icon fileType="application/pdf" />
                        <FileImport.ItemLabel>{file.name}</FileImport.ItemLabel>
                        <FileImport.Action onClick={() => handleRemoveItem(index, true)} />
                      </FileImport.RootItem>
                    ))}
                  </FileImport.Root>
                )}

                {reportModal.isLoading && params.id !== 'new' && <Skeleton className="w-full p-2" />}
              </div>
            </div>
            <div className="w-full h-px bg-primary-opacity" />

            <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
              <Button.Root
                type="button"
                onClick={handleOnOpenChange}
                disabled={reportModal.isLoading}
                className="w-[10rem] h-10"
              >
                <Button.Label>Fechar</Button.Label>
              </Button.Root>

              {isEdit && (
                <Button.Root
                  fill
                  type="submit"
                  className="w-[10rem] h-10"
                  disabled={mutateReport.isLoading || mutateAddAttachments.isLoading || mutateRemoveAttachments.isLoading}
                >
                  {mutateReport.isLoading || mutateAddAttachments.isLoading || mutateRemoveAttachments.isLoading ? (
                    <Button.Spinner />
                  ) : (
                    <Button.Label>{params.id === 'new' ? 'Criar' : 'Atualizar'}</Button.Label>
                  )}
                </Button.Root>
              )}
            </div>
          </>
        </form>
      </Modal>

      {errorAddFile && (
        <Toast type="error" open={errorAddFile} onOpenChange={setErrorAddFile}>
          O arquivo é muito grande. O tamanho máximo permitido é 8 MB.
        </Toast>
      )}

      {mutateReport.isError && (
        <Toast type="error" open={mutateReport.isError} onOpenChange={mutateReport.reset}>
          O sistema encontrou um erro ao tentar atualizar o registro. Recarregue a página e tente novamente. Se o problema
          persistir, entre em contato com o administrador do sistema.
        </Toast>
      )}

      {mutateReport.isSuccess && (
        <Toast type="success" open={mutateReport.isSuccess} onOpenChange={mutateReport.reset}>
          O registro foi criado/atualizado com sucesso do sistema. Operação concluída.
        </Toast>
      )}
    </>
  );
};
