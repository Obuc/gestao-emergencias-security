import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
  },

  headerContainer: {
    height: 35,
    width: '100%',
    backgroundColor: '#FCFCFC',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 14,
    color: '#303030',
    fontWeight: 'bold',
  },
  headerTitleBars: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});

const Container = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>;
};

const Header = ({ title, color }: { title: string; color: string }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>
        <Text style={[styles.headerTitleBars, { color: color }]}>/////</Text> {title}
      </Text>
    </View>
  );
};

export const PDFContainer = {
  Container: Container,
  Header: Header,
};
