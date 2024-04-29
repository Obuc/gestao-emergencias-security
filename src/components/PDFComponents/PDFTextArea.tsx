import { StyleSheet, Text, View } from '@react-pdf/renderer';

const css = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
  },

  title: {
    fontSize: 11,
    color: '#303030',
  },

  input: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    fontSize: 11,
    color: '#303030',
    borderRadius: 3,
    border: 1,
    borderColor: '#303030',
    backgroundColor: '#FFF',
    paddingLeft: 4,
    paddingVertical: 4,
  },
});

const PDFTextArea = ({ title, value, width }: { title: string; value?: number | string | null; width?: number }) => {
  return (
    <View wrap={false} style={[css.container, { width: width ? width : '100%' }]}>
      <Text style={css.title}>{title}</Text>
      <View style={css.input}>
        <Text style={[css.title, { flex: 1, paddingLeft: 4, paddingRight: 4 }]}>{value}</Text>
      </View>
    </View>
  );
};

export default PDFTextArea;
