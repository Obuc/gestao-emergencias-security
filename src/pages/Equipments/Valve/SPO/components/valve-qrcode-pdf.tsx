import { StandardPageSize } from '@react-pdf/types/page';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';

import SPOLogo from '@/assets/SPO.png';
import HeaderBg from '@/assets/Caminho 3692.png';
import { stylesQRCode } from '@/utils/PDFStyles';
import { ValveProps } from '../types/valve.types';

const ValveQrcodePdf = ({ data, pageSize }: { data: Array<ValveProps>; pageSize: StandardPageSize }) => {
  const generateQRCodeURL = (value: any) => {
    const qrCodeValue = `Valvula;SP;São Paulo;SPO - Site São Paulo;${value?.Predio};${value?.Codigo};${value?.LocEsp};${value?.Title}`;

    return `https://quickchart.io/qr?text=${qrCodeValue}`;
  };

  return (
    <Document>
      <Page size={pageSize} wrap style={stylesQRCode.page}>
        {data.map((value) => (
          <View style={stylesQRCode.container} key={value.Id} wrap={false}>
            <View style={stylesQRCode.header}>
              <Text style={stylesQRCode.headerTitle}>Gestão de Emergência</Text>
              <Image src={HeaderBg} style={stylesQRCode.headerBg} />
            </View>

            <View style={stylesQRCode.containerQrCode}>
              <Image src={generateQRCodeURL(value)} />
              <Text style={stylesQRCode.footerTitle}>{`Valvula/${value?.Predio || ''}/${value?.Codigo || ''}/${
                value?.Title || ''
              }/${value?.LocEsp || ''}`}</Text>

              <Image src={SPOLogo} style={stylesQRCode.siteLogo} />
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default ValveQrcodePdf;
