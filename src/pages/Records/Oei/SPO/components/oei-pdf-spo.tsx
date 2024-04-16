import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Page, Text, View, Document } from '@react-pdf/renderer';

import { OeiModal } from '../types/oei.types';
import { styles } from '../../../../../utils/PDFStyles';
import PDFInput from '../../../../../components/PDFComponents/PDFInput';
import PDFHeader from '../../../../../components/PDFComponents/PDFHeader';
import PDFFooter from '../../../../../components/PDFComponents/PDFFooter';
import PDFTextArea from '../../../../../components/PDFComponents/PDFTextArea';
import { PDFContainer } from '../../../../../components/PDFComponents/PDFContainer';

interface IPdfProps {
  data: OeiModal;
}

export const OeiPdfSPO = ({ data }: IPdfProps) => {
  return (
    <Document>
      <Page size={[600, 'auto']} wrap style={styles.page}>
        <PDFHeader color="#00354F" title="Gestão de Emergências - Operação OEI" />

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Informações" />

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
              <PDFInput title="UF" value={data?.UF} />
              <PDFInput title="Município" value={data?.Municipios} />
              <PDFInput width={160} title="Site" value={data?.Site} />
            </View>

            <View style={styles.containerContentItem}>
              <PDFInput title="Área" value={data?.Area} />
              <PDFInput title="Local" value={data?.Area} />
            </View>

            {data?.Observacao && <PDFTextArea title="Observações" value={data?.Observacao} />}
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Localização" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>Qual prédio e elevador foi testado?</Text>
              {!data?.OData__x004c_oc1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x004c_oc1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Funcionamento OEI" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O bombeiro estava no elevador correspondente à chave acionada?</Text>
              {!data?.OData__x0046_cn1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0046_cn1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}

              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>A chave para operação foi acionada corretamente?</Text>
                {!data?.OData__x0046_cn2 && (
                  <View style={styles.containerResponseFalse}>
                    <Text style={styles.containerItemTitle}>Não</Text>
                  </View>
                )}

                {data?.OData__x0046_cn2 && (
                  <View style={styles.containerResponseTrue}>
                    <Text style={styles.containerItemTitle}>Sim</Text>
                  </View>
                )}
              </View>

              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>
                  Após o acionamento da chave na Central, o elevador foi para o térreo e abriu as portas?
                </Text>
                {!data?.OData__x0046_cn3 && (
                  <View style={styles.containerResponseFalse}>
                    <Text style={styles.containerItemTitle}>Não</Text>
                  </View>
                )}

                {data?.OData__x0046_cn3 && (
                  <View style={styles.containerResponseTrue}>
                    <Text style={styles.containerItemTitle}>Sim</Text>
                  </View>
                )}
              </View>

              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>
                  Após o acionamento da chave na Central, o elevador foi para o térreo e abriu as portas?
                </Text>
                {!data?.OData__x0046_cn3 && (
                  <View style={styles.containerResponseFalse}>
                    <Text style={styles.containerItemTitle}>Não</Text>
                  </View>
                )}

                {data?.OData__x0046_cn3 && (
                  <View style={styles.containerResponseTrue}>
                    <Text style={styles.containerItemTitle}>Sim</Text>
                  </View>
                )}
              </View>

              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>
                  Após o desligamento da chave na Central, o elevador voltou para a operação normal?
                </Text>
                {!data?.OData__x0046_cn4 && (
                  <View style={styles.containerResponseFalse}>
                    <Text style={styles.containerItemTitle}>Não</Text>
                  </View>
                )}

                {data?.OData__x0046_cn4 && (
                  <View style={styles.containerResponseTrue}>
                    <Text style={styles.containerItemTitle}>Sim</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Interfone" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O Bombeiro ouve bem o Operador da Central de emergencia?</Text>
              {!data?.OData__x0049_nt1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0049_nt1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O Operador da Central de Emergência ouve bem o Bombeiro?</Text>
              {!data?.OData__x0049_nt2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0049_nt2 && (
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
