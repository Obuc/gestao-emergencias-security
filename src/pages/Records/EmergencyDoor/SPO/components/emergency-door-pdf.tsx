import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Page, Text, View, Document } from '@react-pdf/renderer';

import { styles } from '@/utils/PDFStyles';
import PDFInput from '@/components/PDFComponents/PDFInput';
import PDFHeader from '@/components/PDFComponents/PDFHeader';
import PDFFooter from '@/components/PDFComponents/PDFFooter';
import PDFTextArea from '@/components/PDFComponents/PDFTextArea';
import { EmergencyDoorModal } from '../types/emergency-door.types';
import { PDFContainer } from '@/components/PDFComponents/PDFContainer';

interface IPdfProps {
  data: EmergencyDoorModal;
}

export const EmergencyDoorPdfSPO = ({ data }: IPdfProps) => {
  return (
    <Document>
      <Page size={[600, 'auto']} wrap style={styles.page}>
        <PDFHeader color="#00354F" title="Gestão de Emergências - Portas de Emergência" />

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
              <PDFInput title="Local Específico" value={data?.LocalEsp} />
            </View>

            {data?.Observacao && <PDFTextArea title="Observações" value={data?.Observacao} />}
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Portas de Emergência" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>A barra anti-pânico ou maçanetas estão funcionando?</Text>
              {!data?.Func && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.Func && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>A porta está obstruída?</Text>
              {!data?.Obst && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.Obst && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>Precisa de reparos?</Text>
              {!data?.Reparo && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.Reparo && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>Está abrindo e fechando corretamente?</Text>
              {!data?.Abertura && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.Abertura && (
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
