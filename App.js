import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import tw from 'tailwind-react-native-classnames';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={tw.style("text-red-600 font-bold text-xl")}>Open up App.js to start working on shreedhar!</Text>
      <Text style={tw.style("text-xl")}>
        Version 1
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
