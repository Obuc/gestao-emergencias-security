import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Page, Text, View, Document } from '@react-pdf/renderer';

import { TestCmiModal } from '../types/cmitest.types';
import { styles } from '@/utils/PDFStyles';
import PDFInput from '@/components/PDFComponents/PDFInput';
import PDFHeader from '@/components/PDFComponents/PDFHeader';
import PDFFooter from '@/components/PDFComponents/PDFFooter';
import PDFTextArea from '@/components/PDFComponents/PDFTextArea';
import { PDFContainer } from '@/components/PDFComponents/PDFContainer';

interface IPdfProps {
  data: TestCmiModal;
}

export const TestCmiPdfSPO = ({ data }: IPdfProps) => {
  return (
    <Document>
      <Page size={[600, 'auto']} wrap style={styles.page}>
        <PDFHeader color="#00354F" title="Gestão de Emergências - Bombas de Incêndio" />

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Informações Bombas de Incêndio" />

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
              <PDFInput title="Local" value={data?.Local} />
            </View>

            {data?.Observacao && <PDFTextArea title="Observações" value={data?.Observacao} />}
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Bomba Jockey 1" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica de partida(A):" value={data?.OData__x0042_j11} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica nominal(A):" value={data?.OData__x0042_j12} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput
                title="Indicação da pressão no manômetro dos cavaletes durante o teste (KgF/cm²):"
                value={data?.OData__x0042_j13}
              />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>
                O teste foi realizado com a chave de comando na posição Automática?
              </Text>
              {!data?.OData__x0042_j14 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0042_j14 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Bomba Jockey 2" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica de partida(A):" value={data?.OData__x0042_j21} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica nominal(A):" value={data?.OData__x0042_j22} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput
                title="Indicação da pressão no manômetro dos cavaletes durante o teste (KgF/cm²):"
                value={data?.OData__x0042_j23}
              />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>
                O teste foi realizado com a chave de comando na posição Automática?
              </Text>
              {!data?.OData__x0042_j24 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0042_j24 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Bomba Principal 1" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica de partida(A):" value={data?.OData__x0042_p11} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica nominal(A):" value={data?.OData__x0042_p12} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput
                title="Hidrante Favorável (622) – Pressão Indicada no Manômetro (KgF/cm²):"
                value={data?.OData__x0042_p13}
              />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput
                title="Hidrante Desfavorável (110) – Pressão Indicada no Manômetro (KgF/cm²):"
                value={data?.OData__x0042_p14}
              />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Tempo de abertura dos hidrantes(min):" value={data?.OData__x0042_p15} />
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Bomba Principal 2" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica de partida(A):" value={data?.OData__x0042_p21} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica nominal(A):" value={data?.OData__x0042_p22} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput
                title="Hidrante Favorável (622) – Pressão Indicada no Manômetro (KgF/cm²):"
                value={data?.OData__x0042_p23}
              />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput
                title="Hidrante Desfavorável (110) – Pressão Indicada no Manômetro (KgF/cm²):"
                value={data?.OData__x0042_p24}
              />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Tempo de abertura dos hidrantes(min):" value={data?.OData__x0042_p25} />
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Bomba Booster 1" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica de partida (A):" value={data?.OData__x0042_b11} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica nominal(A):" value={data?.OData__x0042_b12} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Pressão Indicada no Manômetro (KgF/cm²):" value={data?.OData__x0042_b13} />
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Bomba Booster 2" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica de partida (A):" value={data?.OData__x0042_b21} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Corrente elétrica nominal(A):" value={data?.OData__x0042_b22} />
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <PDFInput title="Pressão Indicada no Manômetro (KgF/cm²):" value={data?.OData__x0042_b23} />
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Gerador" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>
                As Bombas de Incêndio foram testadas com energia da Concessionária?
              </Text>
              {!data?.OData__x0047_er1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0047_er1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>As Bombas de Incêndio foram testadas com o Gerador ligado?</Text>
              {!data?.OData__x0047_er2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0047_er2 && (
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
