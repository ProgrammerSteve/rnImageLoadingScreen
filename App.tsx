import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BottomContainer from './components/BottomContainer';

export default function App() {
  return (
    <View style={styles.container}>
      <BottomContainer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position:"relative",
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
