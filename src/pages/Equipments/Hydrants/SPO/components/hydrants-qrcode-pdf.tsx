import { StandardPageSize } from '@react-pdf/types/page';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';

import SPOLogo from '@/assets/SPO.png';
import HeaderBg from '@/assets/Caminho 3692.png';
import { stylesQRCode } from '@/utils/PDFStyles';
import { HydrantsProps } from '../types/hydrants.types';

const HydrantQrcodePdf = ({ data, pageSize }: { data: Array<HydrantsProps>; pageSize: StandardPageSize }) => {
  const generateQRCodeURL = (value: any) => {
    const qrCodeValue = `Hidrante;SP;São Paulo;SPO - Site São Paulo;${value?.Predio};;;${value?.diametro};${value?.comprimento};${value?.Pavimento};${value?.LocEsp};${value?.NumLacre};${value?.Title}`;

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
              <Text style={stylesQRCode.footerTitle}>{`Hidrante/${value?.Predio || ''}/${value?.Pavimento || ''}/${
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

export default HydrantQrcodePdf;
