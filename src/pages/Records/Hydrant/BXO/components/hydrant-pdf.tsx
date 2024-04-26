import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Page, Text, View, Document } from '@react-pdf/renderer';

import { styles } from '@/utils/PDFStyles';
import { HydrantsDataModal } from '../types/hydrant.types';
import PDFInput from '@/components/PDFComponents/PDFInput';
import PDFHeader from '@/components/PDFComponents/PDFHeader';
import PDFFooter from '@/components/PDFComponents/PDFFooter';
import PDFTextArea from '@/components/PDFComponents/PDFTextArea';
import { PDFContainer } from '@/components/PDFComponents/PDFContainer';

interface IHydrantPdfProps {
  data: HydrantsDataModal;
}

export const HydrantPdfBXO = ({ data }: IHydrantPdfProps) => {
  return (
    <Document>
      <Page size={[600, 'auto']} wrap style={styles.page}>
        <PDFHeader color="#00354F" title="Gestão de Emergências - Hidrante" />

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Informações Hidrante" />

          <View style={styles.containerContent}>
            <View style={styles.containerContentItem}>
              <PDFInput width={100} title="Número" value={data?.Id} />

              <PDFInput
                width={150}
                title="Data e hora"
                value={data.Created && format(data.Created as Date, 'dd MMM yyyy', { locale: ptBR })}
              />

              <PDFInput title="Responsável" value={data?.bombeiro} />
            </View>

            <View style={styles.containerContentItem}>
              <PDFInput title="Site" value={data?.hidrante?.site} />
              <PDFInput title="Prédio" value={data?.hidrante?.predio} />
              <PDFInput title="Pavimento" value={data?.hidrante?.pavimento} />
            </View>

            <View style={styles.containerContentItem}>
              <PDFInput title="Local Específico" value={data?.hidrante?.local} />
            </View>

            <View style={styles.containerContentItem}>
              <PDFInput title="Cód. Hidrante" value={data?.hidrante?.cod_hidrante} />
              <PDFInput title="Possui Abrigo?" value={data?.hidrante?.possui_abrigo ? 'Sim' : 'Não'} />
            </View>

            {data?.observacao && <PDFTextArea title="Observações" value={data?.observacao} />}
          </View>
        </View>

        {data?.respostas &&
          Object.keys(data?.respostas).map((categoria) => (
            <View style={styles.container} key={categoria}>
              <PDFContainer.Header color="#00354F" title={categoria} />

              <View style={styles.containerContent}>
                {data?.respostas &&
                  data?.respostas[categoria].map((resposta) => (
                    <View key={resposta.Id} style={[styles.containerItem, { width: '100%' }]}>
                      <Text style={styles.containerItemTitle}>{resposta.pergunta_id.Title}</Text>
                      {!resposta.resposta && (
                        <View style={styles.containerResponseFalse}>
                          <Text style={styles.containerItemTitle}>Não</Text>
                        </View>
                      )}

                      {resposta.resposta && (
                        <View style={styles.containerResponseTrue}>
                          <Text style={styles.containerItemTitle}>Sim</Text>
                        </View>
                      )}
                    </View>
                  ))}
              </View>
            </View>
          ))}

        <View style={{ marginBottom: 24 }}></View>

        <PDFFooter />
      </Page>
    </Document>
  );
};
