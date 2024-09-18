import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import BottomContainer from './components/BottomContainer';
import Animated, {SlideOutDown, SlideInDown, FadeOut, useSharedValue, withTiming, useAnimatedStyle, withSpring, runOnJS} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const DISMISS_POSITION: number = WIDTH*0.40;


export default function App() {



  const offset = useSharedValue(0);

  const pan = Gesture.Pan()

  .onChange((event) => {
      offset.value += event.changeX;
  })
  .onFinalize(() => {
      if (offset.value < DISMISS_POSITION) {
          offset.value = withSpring(0);
      } else {
          offset.value = withTiming(WIDTH, {}, () => {
              runOnJS(()=>console.log("test test"))();
          });
      }
  });




  return (
    
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={pan} >
        <>
      <View style={{flex:1,backgroundColor:"red", width:"100%"}}/>
      <BottomContainer/>
      </>
      </GestureDetector>
    </GestureHandlerRootView>
    
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
