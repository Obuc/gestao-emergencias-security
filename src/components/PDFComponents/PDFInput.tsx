import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { Style } from '@react-pdf/types/style';

const css = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
  },

  title: {
    fontWeight: 'extrabold',
    fontSize: 11,
    color: '#303030',
  },

  input: {
    flexDirection: 'row',
    height: 28,
    fontSize: 11,
    color: '#303030',
    borderRadius: 3,
    border: 1,
    borderColor: '#303030',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingLeft: 4,
  },
});

const PDFInput = ({
  title,
  value,
  width,
  className,
}: {
  title: string;
  value?: number | string | null;
  width?: number;
  className?: Style;
}) => {
  return (
    <View style={[css.container, { width: width ? width : '100%' }]}>
      <Text style={css.title}>{title}</Text>
      <View style={css.input}>
        <Text style={[css.title, {...className}]}>{value}</Text>
      </View>
    </View>
  );
};

export default PDFInput;
