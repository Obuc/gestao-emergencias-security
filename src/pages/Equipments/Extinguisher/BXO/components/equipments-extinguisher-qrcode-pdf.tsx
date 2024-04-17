import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

import BXOLogo from '../../../../../assets/BXOLogo.png';
import HeaderBg from '../../../../../assets/Caminho 3692.png';
import { EquipmentsExtinguisherProps } from '../types/equipments-extinguisher.types';

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
    height: '9.2cm',
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
    textAlign: 'center',
  },
  containerSiteLogo: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  siteLogo: {
    height: 36,
    marginVertical: 8,
  },
});

const EquipmentsExtinguisherQrcodePdf = ({ data }: { data: Array<EquipmentsExtinguisherProps> }) => {
  const generateQRCodeURL = (value: any) => {
    const qrCodeValue = `Extintor${value?.site};${value?.cod_qrcode}`;

    return `https://quickchart.io/qr?text=${qrCodeValue}`;
  };

  return (
    <Document>
      <Page size={'A4'} wrap style={styles.page}>
        {data.map((value) => (
          <View style={styles.container} key={value.Id} wrap={false}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Gestão de Emergência BXO</Text>
              <Image src={HeaderBg} style={styles.headerBg} />
            </View>

            <View style={styles.containerQrCode}>
              <Image src={generateQRCodeURL(value)} />
              <Text style={styles.footerTitle}>{`Extintor/${value?.site}/${value?.predio}/${value?.pavimento}`}</Text>

              <Image src={BXOLogo} style={styles.siteLogo} />
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default EquipmentsExtinguisherQrcodePdf;
