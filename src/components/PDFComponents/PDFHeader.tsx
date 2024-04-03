import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { BayerLogoWhitePDF } from '../Icons/BayerLogoWhitePDF';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    height: '80px',
    alignItems: 'center',
    paddingLeft: '16px',
    paddingRight: '16px',
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
    fontSize: 11,
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
});

const PDFHeader = ({ color, title }: { color: string; title: string }) => {
  const formattedDate = new Date().toLocaleString('pt-BR');

  return (
    <View fixed style={[styles.header, { backgroundColor: color }]}>
      <BayerLogoWhitePDF />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Business Security Brasil</Text>
        <Text style={styles.mainTitle}>{title}</Text>
      </View>

      <View style={styles.infoArea}>
        <Text style={styles.infoAreaTitle}>PDF Gerado em</Text>
        <Text style={styles.infoAreaTitle}>{formattedDate}</Text>
      </View>
    </View>
  );
};

export default PDFHeader;
