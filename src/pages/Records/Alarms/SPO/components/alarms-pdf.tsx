import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Page, Text, View, Document } from '@react-pdf/renderer';

import { styles } from '@/utils/PDFStyles';
import { AlarmsModal } from '../types/alarms.types';
import PDFInput from '@/components/PDFComponents/PDFInput';
import PDFHeader from '@/components/PDFComponents/PDFHeader';
import PDFFooter from '@/components/PDFComponents/PDFFooter';
import PDFTextArea from '@/components/PDFComponents/PDFTextArea';
import { PDFContainer } from '@/components/PDFComponents/PDFContainer';

interface IPdfProps {
  data: AlarmsModal;
}

export const AlarmsPdfSPO = ({ data }: IPdfProps) => {
  return (
    <Document>
      <Page size={[600, 'auto']} wrap style={styles.page}>
        <PDFHeader color="#00354F" title="Gestão de Emergências - Alarmes de Incêndio" />

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
          <PDFContainer.Header color="#00354F" title="Sirene" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>A sirene está funcionando?</Text>
              {!data?.Sirene && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.Sirene && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Luminoso" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O alarme luminoso está funcionando?</Text>
              {!data?.Luminoso && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.Luminoso && (
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
