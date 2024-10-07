import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Dimensions } from "react-native";
import { GestureDetector, Gesture, Directions } from "react-native-gesture-handler";
import BottomContainer from "./components/BottomContainer";
import  { runOnJS } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState, useRef, useEffect } from "react";
import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  Skia,
  useImage,
} from '@shopify/react-native-skia';
import { useDerivedValue, useSharedValue, } from 'react-native-reanimated';


const { width, height } = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.8;
const IMAGE_HEIGHT = 250;



const source = Skia.RuntimeEffect.Make(`
  uniform shader image1;
  uniform shader image2;
  uniform float progress;
  uniform float2 resolution;
  
  vec4 getFromColor(vec2 p) {
    return image1.eval(p * resolution);
  }
  
  vec4 getToColor(vec2 p) {
    return image2.eval(p * resolution);
  }
  
  float scale = 4.0;
  float smoothness = 0.01;
  
  float seed = 12.9898;
  float random(vec2 co) {
    highp float a = seed;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt = dot(co.xy, vec2(a, b));
    highp float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
  }
  
  float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
  
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
  
    vec2 u = f * f * (3.0 - 2.0 * f);
  
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  vec4 transition(vec2 uv) {
    vec4 from = getFromColor(uv);
    vec4 to = getToColor(uv);
    float n = noise(uv * scale);
  
    float p = mix(-smoothness, 1.0 + smoothness, progress);
    float lower = p - smoothness;
    float higher = p + smoothness;
  
    float q = smoothstep(lower, higher, n);
  
    return mix(from, to, 1.0 - q);
  }
  
  half4 main(float2 xy) {
    vec2 uv = xy / resolution;
    return transition(uv);
  }`);


export default function App() {
  const [imgIndexState, setImgIndexState]=useState(0)
  const imgIndex = useSharedValue(0);
  const progress = useSharedValue(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const intervalRef: { current: NodeJS.Timeout | null } = useRef(null);

  const incrementImgIndex=()=>{
    setImgIndexState(prev=>(prev+1)%3)
    imgIndex.value = (imgIndex.value + 1) % 3;
  }
  const decrementImgIndex=()=>{
    setImgIndexState((prev) => ((prev - 1) + 3) % 3)
    imgIndex.value = ((imgIndex.value - 1) + 3) % 3;
  }

  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (isTimerRunning) {
          incrementImgIndex();
        }
      }, 3000);
    }
  };
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startTimer(); // Start the timer on component mount

    // Cleanup the timer on component unmount
    return () => stopTimer();
  }, [isTimerRunning]); // Depend on the timer running state

  const swipeRightGesture = Gesture.Fling()
  .direction(Directions.RIGHT)
  .onEnd(() => {
    runOnJS(incrementImgIndex)()
  })
  const swipeLeftGesture = Gesture.Fling()
  .direction(Directions.LEFT)
  .onEnd(() => {
    runOnJS(decrementImgIndex)()
  });
  const composed=Gesture.Simultaneous(swipeRightGesture,swipeLeftGesture)

  const uniforms = useDerivedValue(() => ({
    progress: progress.value,
    resolution: [width, height],
  }));

  const images = [
    useImage('https://s1.1zoom.me/big0/553/Cats_Kittens_Glance_Grey_480466.jpg'),
    useImage('https://i.pinimg.com/originals/a4/ca/c0/a4cac0fced06ffafa4dd549576c29f37.jpg'),
    useImage('https://hoponworld.com/wp-content/uploads/2021/02/view-of-wuji-tianyuan-temple-during-cherry-blossom-season-taiwan.jpg'),
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composed}>
        <View style={{ flex: 1, width: "100%" }}>
          <View style={{ flex: 1, backgroundColor: "red", width: "100%" }} />

          <Canvas style={{ flex: 1, backgroundColor: "red", width: "100%" }}>
        <Fill>
          <Shader source={source!} uniforms={uniforms}>
            <ImageShader
              image={images[imgIndex.value]}
              fit="cover"
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              x={(width - IMAGE_WIDTH) / 2}
              y={(height - IMAGE_HEIGHT) / 2}
            />
            <ImageShader
              image={images[(imgIndex.value + 1) % 3]}
              fit="cover"
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              x={(width - IMAGE_WIDTH) / 2}
              y={(height - IMAGE_HEIGHT) / 2}
            />
          </Shader>
        </Fill>
      </Canvas>




          <BottomContainer imgIndex={imgIndexState}/>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
});
