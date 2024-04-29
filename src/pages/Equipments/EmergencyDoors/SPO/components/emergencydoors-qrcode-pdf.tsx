import { StandardPageSize } from '@react-pdf/types/page';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';

import SPOLogo from '@/assets/SPO.png';
import HeaderBg from '@/assets/Caminho 3692.png';
import { stylesQRCode } from '@/utils/PDFStyles';
import { EmergencyDoorsProps } from '../types/emergencydoors.types';

export const EmergencyDoorsQrcodePdf = ({
  data,
  pageSize,
}: {
  data: Array<EmergencyDoorsProps>;
  pageSize: StandardPageSize;
}) => {
  const generateQRCodeURL = (value: any) => {
    const qrCodeValue = `Porta;SP;São Paulo;SPO - Site São Paulo;${value?.Predio};${value?.Pavimento};;${value?.Title}`;

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
              <Text style={stylesQRCode.footerTitle}>{`Porta/${value?.Predio || ''}/${value?.Pavimento || ''}/${
                value?.Title || ''
              }`}</Text>

              <Image src={SPOLogo} style={stylesQRCode.siteLogo} />
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};
