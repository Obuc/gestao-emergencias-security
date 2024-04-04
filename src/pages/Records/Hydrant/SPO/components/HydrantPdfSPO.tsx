import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Page, Text, View, Document } from '@react-pdf/renderer';

import { HydrantModal } from '../types/HydrantSPO';
import { styles } from '../../../../../utils/PDFStyles';
import PDFInput from '../../../../../components/PDFComponents/PDFInput';
import PDFHeader from '../../../../../components/PDFComponents/PDFHeader';
import PDFFooter from '../../../../../components/PDFComponents/PDFFooter';
import PDFTextArea from '../../../../../components/PDFComponents/PDFTextArea';
import { PDFContainer } from '../../../../../components/PDFComponents/PDFContainer';

interface IHydrantPdfProps {
  data: HydrantModal;
}

export const HydrantPdfSPO = ({ data }: IHydrantPdfProps) => {
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
                title="Data"
                value={data.Created && format(data.Created as Date, 'dd MMM yyyy', { locale: ptBR })}
              />

              <PDFInput title="Responsável" value={data?.Responsavel1} />
            </View>

            <View style={styles.containerContentItem}>
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
              <PDFInput title="Código do lacre" value={data?.CodLacre ? data.CodLacre : 'N/A'} />
            </View>

            <View style={styles.containerContentItem}>
              <PDFInput title="Código da(s) mangueira(s)" value={data?.CodMangueira} />
              <PDFInput title="Diâmetro" value={data?.Diametro} />
              <PDFInput title="Comprimento" value={data?.Comprimento} />
            </View>

            {data?.Observacao && <PDFTextArea title="Observações" value={data?.Observacao} />}
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Hidrante" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O hidrante está sem avarias?</Text>
              {!data?.OData__x0048_id1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0048_id1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O hidrante está em bom estado de conservação?</Text>
              {!data?.OData__x0048_id2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0048_id2 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Abrigo" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O abrigo de mangueira está sem avarias?</Text>
              {!data?.OData__x0041_bg1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0041_bg1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O abrigo está em bom esteado de conservação?</Text>
              {!data?.OData__x0041_bg2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0041_bg2 && (
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
              <Text style={styles.containerItemTitle}>A sinalização está fixada adequadamente?</Text>
              {!data?.OData__x0053_nl1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0053_nl1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>A sinalização está de acordo com as normas?</Text>
              {!data?.OData__x0053_nl2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x0053_nl2 && (
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
              <Text style={styles.containerItemTitle}>O hidrante está desobstruído?</Text>
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
              <Text style={styles.containerItemTitle}>Está sem objetos estranhos no abrigo?</Text>
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
          <PDFContainer.Header color="#00354F" title="Lacre" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O abrigo está lacrado corretamente?</Text>
              {!data?.OData__x004c_cr1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x004c_cr1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>O lacre do abrigo está intacto?</Text>
              {!data?.OData__x004c_cr2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.OData__x004c_cr2 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <PDFContainer.Header color="#00354F" title="Inspeção" />

          <View style={styles.containerContent}>
            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>A etiqueta de Inspeção está instalada?</Text>
              {!data?.Insp1 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.Insp1 && (
                <View style={styles.containerResponseTrue}>
                  <Text style={styles.containerItemTitle}>Sim</Text>
                </View>
              )}
            </View>

            <View style={[styles.containerItem, { width: '100%' }]}>
              <Text style={styles.containerItemTitle}>A trava está fixada na alavanca de acionamento?</Text>
              {!data?.Insp2 && (
                <View style={styles.containerResponseFalse}>
                  <Text style={styles.containerItemTitle}>Não</Text>
                </View>
              )}

              {data?.Insp2 && (
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
