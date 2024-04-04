import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Page, Text, View, Document } from '@react-pdf/renderer';

import { styles } from '../../../../../utils/PDFStyles';
import { ExtinguisherModal } from '../types/ExtinguisherSPO';
import PDFInput from '../../../../../components/PDFComponents/PDFInput';
import PDFHeader from '../../../../../components/PDFComponents/PDFHeader';
import PDFFooter from '../../../../../components/PDFComponents/PDFFooter';
import PDFTextArea from '../../../../../components/PDFComponents/PDFTextArea';
import { PDFContainer } from '../../../../../components/PDFComponents/PDFContainer';

interface IExtinguisherPdfProps {
  data: ExtinguisherModal;
}

export const ExtinguisherPdfSPO = ({ data }: IExtinguisherPdfProps) => {
  return (
    <Document>
      <Page size={[600, 'auto']} wrap style={styles.page}>
        <PDFHeader color="#00354F" title="Gestão de Emergências - Extintor" />

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Informações Extintor" />

          <View style={styles.containerContent}>
            <View style={styles.containerContentItem}>
              <PDFInput width={100} title="Número" value={data?.Id} />

              <PDFInput
                width={150}
                title="Data"
                value={data.Created && format(data.Created as Date, 'dd MMM yyyy', { locale: ptBR })}
              />

              <PDFInput title="Responsável" value={data?.Responsavel1} />
            </View>

            <View style={styles.containerContentItem}>
              <PDFInput title="Cód. Área" value={data?.codigo} />
              <PDFInput title="UF" value={data?.UF} />
              <PDFInput title="Múnicipio" value={data?.Municipios} />
              <PDFInput width={160} title="Site" value={data?.Site} />
            </View>

            <View style={styles.containerContentItem}>
              <PDFInput title="Área" value={data?.Area} />
              <PDFInput title="Local" value={data?.Local} />
              <PDFInput title="Pavimento" value={data?.Pavimento} />
            </View>

            <View style={styles.containerContentItem}>
              <PDFInput title="Local Específico" value={data?.LocalEsp} />

              <PDFInput
                title="Data de Vencimento"
                value={data?.DataVenc && format(data?.DataVenc as Date, 'dd MMM yyyy', { locale: ptBR })}
              />
            </View>

            <View style={styles.containerContentItem}>
              <PDFInput title="Tipo" value={data?.Tipo} />
              <PDFInput title="Peso" value={data?.Massa} />
              <PDFInput title="Cód. Extintor" value={data?.Title} />
            </View>

            {data?.Observacao && <PDFTextArea title="Observações" value={data?.Observacao} />}
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Manômetro" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O ponteiro está marcando na área verde?</Text>
              {!data?.OData__x004d_an1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x004d_an1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O manômetro está sem avarias?</Text>
              {!data?.OData__x004d_an2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x004d_an2 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Carga" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>A carga nominal está dentro da validade normativa?</Text>
              {!data?.OData__x0043_ar1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0043_ar1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>
                O anel colorido está instalado na parte superior do cilindro?
              </Text>
              {!data?.OData__x0043_ar2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0043_ar2 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Cilindro" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O cilindro está intacto?</Text>
              {!data?.OData__x0043_il1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0043_il1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O cilindro está em bom estado de conservação?</Text>
              {!data?.OData__x0043_il2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0043_il2 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>
                O cilindro está fixado na parede ou sobre um suporte de piso?
              </Text>
              {!data?.OData__x0043_il3 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0043_il3 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Sinalização" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>A sinalização está afixada acima do extintor?</Text>
              {!data?.OData__x0053_in1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0053_in1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>A sinalização está adequada ao tipo de extintor?</Text>
              {!data?.OData__x0053_in2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0053_in2 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Obstrução" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O Extintor está desobstruído?</Text>
              {!data?.Obst1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.Obst1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O Extintor está instalado no local adequado?</Text>
              {!data?.Obst2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.Obst2 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Lacre e Trava" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O lacre está intacto?</Text>
              {!data?.OData__x004c_tv1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x004c_tv1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>A trava está fixada na alavanca de acionamento?</Text>
              {!data?.OData__x004c_tv2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x004c_tv2 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 24 }}></View>

        <PDFFooter />
      </Page>
    </Document>
  );
};
