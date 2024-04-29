import { StyleSheet, Text, View } from '@react-pdf/renderer';

const css = StyleSheet.create({
  container: {
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
  content: {
    width: 85,
    height: 24,
    backgroundColor: '#FFFFFF99',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 10,
    fontWeight: 350,
  },
});

const PDFFooter = () => {
  return (
    <View style={css.container} fixed>
      <View style={css.content}>
        <Text style={css.title} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
      </View>
    </View>
  );
};

export default PDFFooter;
