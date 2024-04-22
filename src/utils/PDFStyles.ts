import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    padding: 4,
    color: '#303030',
    paddingBottom: 300,
  },
  container: {
    flexDirection: 'column',
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 4,
  },
  containerContent: {
    backgroundColor: '#FCFCFC',
    flexDirection: 'column',
    padding: 12,
    gap: 16,
    border: '1px solid #303030',
    borderRadius: '4px',
  },
  containerContentItem: {
    flexDirection: 'row',
    gap: 8,
  },

  containerItemTitle: {
    fontSize: 12,
    color: '#303030',
  },
  containerItem: {
    flexDirection: 'column',
    gap: 8,
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

  containerResponseFalse: {
    height: 25,
    width: 75,
    backgroundColor: '#FFB3C1',
    border: 1,
    borderColor: '#FF012F',
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FF012F',
  },
});

export const stylesQRCode = StyleSheet.create({
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
    textAlign: 'center',
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
