import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { faArrowUpRightFromSquare, faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Modal from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import TextArea from '../../../../components/TextArea';
import TextField from '../../../../components/TextField';
import { Answers } from '../../../../components/Answers';
import useEquipments from '../../hooks/useEquipments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EquipmentCard } from '../ui/Card';

const EqExtinguisherModal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [extinguisherItem, setExtinguisherItem] = useState<boolean | null>(null);

  const { eqExtinguisherModal, isLoadingEqExtinguisherModal } = useEquipments();

  console.log(eqExtinguisherModal);

  useEffect(() => {
    if (params?.id) {
      setExtinguisherItem(true);
    }
  }, [params.id]);

  const handleOnOpenChange = () => {
    setExtinguisherItem(null);
    navigate('/records');
  };

  return (
    <Modal
      className="w-[65.125rem]"
      open={extinguisherItem !== null}
      onOpenChange={handleOnOpenChange}
      title={`Registro Extintor N°${params.id}`}
    >
      <>
        <div className="pt-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="cod_extintor"
              name="cod_extintor"
              label="N° Extintor"
              value={eqExtinguisherModal?.cod_extintor}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="site"
              name="site"
              label="Site"
              width="w-[10rem]"
              value={eqExtinguisherModal?.site}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="predio"
              name="predio"
              label="Prédio"
              width="w-[10rem]"
              value={eqExtinguisherModal?.predio}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="tipo_extintor"
              name="tipo_extintor"
              label="Tipo Extintor"
              width="w-[8rem]"
              value={eqExtinguisherModal?.tipo_extintor}
              isLoading={isLoadingEqExtinguisherModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              disabled
              id="pavimento"
              name="pavimento"
              label="Pavimento"
              value={eqExtinguisherModal?.pavimento}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="local"
              name="local"
              label="Local"
              value={eqExtinguisherModal?.local}
              isLoading={isLoadingEqExtinguisherModal}
            />

            <TextField
              disabled
              id="massa"
              name="massa"
              label="Massa"
              width="w-[8rem]"
              value={eqExtinguisherModal?.massa}
              isLoading={isLoadingEqExtinguisherModal}
            />
          </div>
        </div>

        <div className="w-full h-[6.25rem] flex justify-center items-center my-10 bg-primary-opacity">
          <Button.Root className="w-[11.375rem] h-10" fill>
            <Button.Label>Gerar QRCode</Button.Label>
            <Button.Icon icon={faExpand} />
          </Button.Root>
        </div>

        <div className="py-6 px-8">
          {/* <div className="w-full h-[11rem] rounded-lg p-6 flex flex-col bg-[#282828]/5 text-[#282828]">
            <div className="flex w-full h-10 justify-between pb-4  border-b-[.0625rem] border-b-[#ADADAD]">
              <span className="text-xl h-10 font-semibold">Verificação Inconforme</span>
              <div className="uppercase flex gap-2 justify-center items-center cursor-default">
                Visualizar Registro <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </div>
            </div>

            <div className="flex gap-4 flex-col mt-4">
              <div className="flex w-full justify-between">
                <span>
                  <strong className="text-[#282828]">Responsável:</strong> Davi Alves dos Santos
                </span>
                <span>
                  <strong className="text-[#282828]">Data:</strong> 25 Ago 2023
                </span>
              </div>
              <span className="flex w-full ">Ação: Verificação de Extintor</span>
            </div>
          </div> */}

          <EquipmentCard.Root>
            <EquipmentCard.Header title="Teste" link="#" />
            <EquipmentCard.Content date="ss" responsible="ss" action="ss" />
          </EquipmentCard.Root>
        </div>
      </>

      {/* <div ref={componentRef} id="container">
        <div className="py-6 px-8">
          <div className="flex gap-2 py-2">
            <TextField
              id="Id"
              name="Id"
              label="Número"
              width="w-[6.25rem]"
              disabled
              onChange={props.handleChange}
              value={props.values.Id}
              isLoading={isLoadingExtinguisherModal}
            />

            <TextField
              id="Created"
              name="Created"
              label="Data"
              disabled
              onChange={props.handleChange}
              value={props.values?.Created && format(new Date(props.values?.Created), 'dd MMM yyyy', { locale: ptBR })}
              isLoading={isLoadingExtinguisherModal}
            />

            <TextField
              id="bombeiro"
              name="bombeiro"
              label="Responsável"
              width="w-[25rem]"
              disabled
              onChange={props.handleChange}
              value={props.values.bombeiro}
              isLoading={isLoadingExtinguisherModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              id="extintor.cod_qrcode"
              name="extintor.cod_qrcode"
              label="Cód. Área"
              width="w-[16.25rem]"
              disabled
              onChange={props.handleChange}
              value={props.values.extintor.cod_qrcode}
              isLoading={isLoadingExtinguisherModal}
            />

            <TextField
              id="extintor.site"
              name="extintor.site"
              label="Site"
              disabled
              onChange={props.handleChange}
              value={props.values.extintor.site}
              isLoading={isLoadingExtinguisherModal}
            />

            <TextField
              id="extintor.predio"
              name="extintor.predio"
              label="Prédio"
              width="w-[12.5rem]"
              disabled
              onChange={props.handleChange}
              value={props.values.extintor.predio}
              isLoading={isLoadingExtinguisherModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              id="extintor.pavimento"
              name="extintor.pavimento"
              label="Pavimento"
              width="w-[12.5rem]"
              disabled
              onChange={props.handleChange}
              value={props.values.extintor.pavimento}
              isLoading={isLoadingExtinguisherModal}
            />

            <TextField
              id="extintor.local"
              name="extintor.local"
              label="Local Específico"
              disabled
              onChange={props.handleChange}
              value={props.values.extintor.local}
              isLoading={isLoadingExtinguisherModal}
            />
          </div>

          <div className="flex gap-2 py-2">
            <TextField
              id="extintor.validade"
              name="extintor.validade"
              label="Data de Vencimento"
              disabled
              onChange={props.handleChange}
              value={
                props.values?.extintor.validade &&
                format(new Date(props.values?.extintor.validade), 'dd MMM yyyy', { locale: ptBR })
              }
              isLoading={isLoadingExtinguisherModal}
            />

            <TextField
              id="extintor.tipo_extintor"
              name="extintor.tipo_extintor"
              label="Tipo"
              width="w-[6.25rem]"
              disabled
              onChange={props.handleChange}
              value={props.values.extintor.tipo_extintor}
              isLoading={isLoadingExtinguisherModal}
            />

            <TextField
              id="extintor.massa"
              name="extintor.massa"
              label="Peso"
              width="w-[6.25rem]"
              disabled
              onChange={props.handleChange}
              value={props.values.extintor.massa}
              isLoading={isLoadingExtinguisherModal}
            />

            <TextField
              id="extintor.cod_extintor"
              name="extintor.cod_extintor"
              label="Cód. Extintor"
              disabled
              onChange={props.handleChange}
              value={props.values.extintor.cod_extintor}
              isLoading={isLoadingExtinguisherModal}
            />
          </div>
        </div>
        <div className="w-full h-px bg-primary-opacity" />

        <div className="bg-[#F1F3F5] w-full py-6 px-8 text-[#474747]">
          {props.values.respostas &&
            Object.keys(props.values.respostas).map((categoria) => (
              <Answers.Root key={categoria} label={categoria} isLoading={isLoadingExtinguisherModal}>
                <Answers.Content key={categoria}>
                  {props.values.respostas &&
                    props.values.respostas[categoria].map((pergunta: RespostaExtintor, index) => (
                      <Answers.ContentItem key={index} isLoading={isLoadingExtinguisherModal}>
                        <Answers.Label label={pergunta.pergunta_id.Title} />
                        <Answers.Button
                          disabled={!isEdit}
                          onClick={() => {
                            const updatedResposta = !pergunta.resposta;
                            props.setFieldValue(`respostas.${categoria}[${index}].resposta`, updatedResposta);
                          }}
                          answersValue={pergunta.resposta}
                        />
                      </Answers.ContentItem>
                    ))}
                </Answers.Content>
              </Answers.Root>
            ))}

          {props.values.observacao && (
            <TextArea
              id="observacao"
              name="observacao"
              label="Observações"
              disabled
              value={props.values.observacao}
              onChange={props.handleChange}
              isLoading={isLoadingExtinguisherModal}
            />
          )}
        </div>

        <div className="flex w-full gap-2 py-4 justify-end items-center pr-8">
          {!isEdit && (
            <Button.Root onClick={expotToPdf} disabled={isLoadingExtinguisherModal} fill className="h-10">
              <Button.Label>Exportar para PDF</Button.Label>
              <Button.Icon icon={faDownload} />
            </Button.Root>
          )}

          <Button.Root onClick={handleOnOpenChange} disabled={isLoadingExtinguisherModal} className="w-[10rem] h-10">
            <Button.Label>Fechar</Button.Label>
          </Button.Root>

          {isEdit && (
            <Button.Root
              onClick={() => handleSubmit(props.values)}
              disabled={isLoadingExtinguisherModal}
              fill
              className="w-[10rem] h-10"
            >
              {IsLoadingMutateEditExtinguisher ? <Button.Spinner /> : <Button.Label>Atualizar</Button.Label>}
            </Button.Root>
          )}
        </div>
      </div> */}
    </Modal>
  );
};

export default EqExtinguisherModal;
