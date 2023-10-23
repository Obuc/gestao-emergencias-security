import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

import BXOLogo from '../../../../assets/BXOLogo.png';
import HeaderBg from '../../../../assets/Caminho 3692.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 4,
    flexWrap: 'wrap',
    gap: 10,
  },

  container: {
    display: 'flex',
    alignItems: 'center',
    width: '6cm',
    height: '8.5cm',
    border: 1,
    gap: 4,
    borderColor: '#000',
  },
  header: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: 600,
    color: '#FFF',
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  containerQrCode: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  footerTitle: {
    fontSize: 10,
  },
  containerSiteLogo: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  siteLogo: {
    width: 30,
    height: 32,
  },
});

interface IEqExtinguisherQRCodePdfProps {
  data: Array<any>;
  qrCodeValue: string;
}

export const EqExtinguisherQRCodePdf = ({ data }: IEqExtinguisherQRCodePdfProps) => {
  const generateQRCodeURL = (value: any) => {
    const qrCodeValue = `Extintor;${value?.site};${value?.cod_qrcode};${value?.tipo_extintor}`;
    return `https://chart.googleapis.com/chart?chs=95x75&cht=qr&chl=${qrCodeValue}`;
  };

  return (
    <Document>
      <Page size="A0" wrap style={styles.page}>
        {data.map((value) => (
          <View style={styles.container} key={value.Id} wrap={false}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Gestão de Emergência</Text>
              <Image src={HeaderBg} style={styles.headerBg} />
            </View>

            <View style={styles.containerQrCode}>
              <Image src={generateQRCodeURL(value)} />
              <Text
                style={styles.footerTitle}
              >{`Extintor/${value?.predio}/${value?.pavimento}/${value?.local}/${value.tipo_extintor}`}</Text>
              <Image src={BXOLogo} style={styles.siteLogo} />
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};
