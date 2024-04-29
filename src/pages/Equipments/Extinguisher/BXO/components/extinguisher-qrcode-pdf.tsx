import { StandardPageSize } from '@react-pdf/types/page';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';

import BXOLogo from '@/assets/BXOLogo.png';
import HeaderBg from '@/assets/Caminho 3692.png';
import { stylesQRCode } from '@/utils/PDFStyles';
import { ExtinguisherProps } from '../types/extinguisher.types';

export const ExtinguisherQrcodePdf = ({
  data,
  pageSize,
}: {
  data: Array<ExtinguisherProps>;
  pageSize: StandardPageSize;
}) => {
  const generateQRCodeURL = (value: any) => {
    const qrCodeValue = `Extintor${value?.site};${value?.cod_qrcode}`;

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
              <Text style={stylesQRCode.footerTitle}>{`Extintor/${value?.site}/${value?.predio}/${value?.pavimento}`}</Text>

              <Image src={BXOLogo} style={stylesQRCode.siteLogo} />
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};
