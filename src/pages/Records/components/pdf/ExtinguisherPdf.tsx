import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Page, Text, View, Document, StyleSheet, } from '@react-pdf/renderer';

import { ExtinguisherDataModal } from '../../types/Extinguisher';
import { BayerLogoWhitePDF } from '../../../../components/Icons/BayerLogoWhitePDF';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    height: '80px',
    alignItems: 'center',
    paddingLeft: '16px',
    paddingRight: '16px',
    backgroundColor: '#10384F',
    color: 'white',
    marginBottom: '16px',
  },
  logo: {
    width: 60,
    height: 60,
  },
  titleContainer: {
    flexDirection: 'column',
    marginLeft: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  mainTitle: {
    fontSize: '18px',
    fontWeight: 600,
  },

  infoArea: {
    width: 125,
    height: 40,
    backgroundColor: '#FFFFFF0D',
    borderRadius: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },

  infoAreaTitle: {
    fontSize: 10,
    fontWeight: 350,
  },

  container: {
    flexDirection: 'column',
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
  },

  containerHeader: {
    height: 35,
    width: '100%',
    backgroundColor: '#4FB9F91A',
    borderBottom: 2,
    borderColor: '#4FB9F9',
    paddingLeft: 16,
    justifyContent: 'center',
  },

  containerTitle: {
    fontSize: 14,
    color: '#303030',
    fontWeight: 600,
  },

  containerContent: {
    backgroundColor: '#FCFCFC',
    flexDirection: 'column',
    padding: 12,
    gap: 16,
  },

  containerContentItem: {
    flexDirection: 'row',
    gap: 8,
  },

  containerItem: {
    flexDirection: 'column',
    gap: 8,
  },

  containerItemTitle: {
    fontSize: 12,
    color: '#303030',
  },

  containerItemInput: {
    flexDirection: 'row',
    height: 30,
    fontSize: 12,
    color: '#303030',
    borderRadius: 3,
    border: 1,
    borderColor: '#E4E4E4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  containerResponseTrue: {
    height: 25,
    width: 75,
    backgroundColor: '#F1FEEB',
    border: 1,
    borderColor: '#86EF54',
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footer: {
    height: 40,
    backgroundColor: '#E0E0E0',
    flexDirection: 'row',
    paddingRight: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
  },

  footerItem: {
    width: 85,
    height: 24,
    backgroundColor: '#FFFFFF99',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerItemTitle: {
    color: '#303030',
    fontSize: 10,
    fontWeight: 350,
  },
});

interface IExtinguisherPdfProps {
  data: ExtinguisherDataModal;
}

export const ExtinguisherPdf = ({ data }: IExtinguisherPdfProps) => {
  const formattedDate = new Date().toLocaleString('pt-BR');

  return (
    <Document>
      <Page size="A4" wrap style={styles.page}>
        <View fixed style={styles.header}>

          <BayerLogoWhitePDF />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Business Security Brasil</Text>
            <Text style={styles.mainTitle}>Gestão Sistema de Emergência</Text>
          </View>

          <View style={styles.infoArea}>
            <Text style={styles.infoAreaTitle}>PDF Gerado em</Text>
            <Text style={styles.infoAreaTitle}>{formattedDate}</Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.containerHeader}>
            <Text style={styles.containerTitle}>Informações Extintor</Text>
          </View>
          <View style={styles.containerContent}>
            <View style={styles.containerContentItem}>
              {/* ID */}
              <View style={[styles.containerItem, { width: 100 }]}>
                <Text style={styles.containerItemTitle}>Número</Text>
                <View style={styles.containerItemInput}>
                  <Text style={styles.containerItemTitle}>{data?.Id}</Text>
                </View>
              </View>

              {/* DATA */}
              <View style={[styles.containerItem, { width: 150 }]}>
                <Text style={styles.containerItemTitle}>Data</Text>
                <View style={styles.containerItemInput}>
                  <Text style={styles.containerItemTitle}>
                    {data?.Created && format(data.Created, 'dd MMM yyyy', { locale: ptBR })}
                  </Text>
                </View>
              </View>

              {/* RESPONSAVEL */}
              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>Responsável</Text>
                <View style={styles.containerItemInput}>
                  <Text style={styles.containerItemTitle}>{data?.bombeiro}</Text>
                </View>
              </View>
            </View>

            <View style={styles.containerContentItem}>
              {/* SITE */}
              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>Site</Text>
                <View style={styles.containerItemInput}>
                  <Text style={styles.containerItemTitle}>{data?.extintor?.site}</Text>
                </View>
              </View>

              {/* PREDIO */}
              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>Prédio</Text>
                <View style={styles.containerItemInput}>
                  <Text style={styles.containerItemTitle}>{data?.extintor?.predio}</Text>
                </View>
              </View>

              {/* PAVIMENTO */}
              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>Pavimento</Text>
                <View style={styles.containerItemInput}>
                  <Text style={styles.containerItemTitle}>{data?.extintor?.pavimento}</Text>
                </View>
              </View>
            </View>

            <View style={styles.containerContentItem}>
              {/* Local Específico */}
              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>Local Específico</Text>
                <View style={styles.containerItemInput}>
                  <Text style={styles.containerItemTitle}>{data?.extintor?.local}</Text>
                </View>
              </View>

              {/* Data de Vencimento */}
              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>Data de Vencimento</Text>
                <View style={styles.containerItemInput}>
                  <Text style={styles.containerItemTitle}>
                    {data?.extintor?.validade && format(data?.extintor?.validade, 'dd MMM yyyy', { locale: ptBR })}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.containerContentItem}>
              {/* Tipo */}
              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>Tipo</Text>
                <View style={styles.containerItemInput}>
                  <Text style={styles.containerItemTitle}>{data?.extintor?.tipo_extintor}</Text>
                </View>
              </View>

              {/* Peso */}
              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>Peso</Text>
                <View style={styles.containerItemInput}>
                  <Text style={styles.containerItemTitle}>{data?.extintor?.massa}</Text>
                </View>
              </View>

              {/* Cód. Extintor */}
              <View style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>Cód. Extintor</Text>
                <View style={styles.containerItemInput}>
                  <Text style={styles.containerItemTitle}>{data?.extintor?.cod_extintor}</Text>
                </View>
              </View>
            </View>

            {/* Observações */}
            {data?.observacao && (
              <View wrap={false} style={[styles.containerItem, { width: '100%' }]}>
                <Text style={styles.containerItemTitle}>Observações</Text>
                <View style={styles.containerItemInput}>
                  <Text style={[styles.containerItemTitle, { flex: 1, paddingLeft: 8 }]}>{data?.observacao}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {data?.respostas &&
          Object.keys(data?.respostas).map((categoria) => (
            <View style={styles.container} key={categoria} wrap={false}>
              <View style={styles.containerHeader}>
                <Text style={styles.containerTitle}>{categoria}</Text>
              </View>

              <View style={styles.containerContent}>
                {data?.respostas &&
                  data?.respostas[categoria].map((resposta) => (
                    <View key={resposta.Id} style={[styles.containerItem, { width: '100%' }]}>
                      <Text style={styles.containerItemTitle}>{resposta.pergunta_id.Title}</Text>
                      <View style={styles.containerResponseTrue}>
                        <Text style={styles.containerItemTitle}>{!resposta?.resposta ? 'Sim' : 'Não'}</Text>
                      </View>
                    </View>
                  ))}
              </View>
            </View>
          ))}

        <View style={styles.footer} fixed>
          <View style={styles.footerItem}>
            <Text
              style={styles.infoAreaTitle}
              render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
};
