//    https://gl-transitions.com/editor/LinearBlur
//    https://www.youtube.com/watch?v=aGsN8b9aHYI

import {
  StyleSheet,
  View,
  Dimensions,
  LayoutChangeEvent,
  Platform,
} from "react-native";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import BottomContainer from "./components/BottomContainer";
import { runOnJS, withTiming,cancelAnimation } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  Canvas,Fill,
  ImageShader,Shader,Skia,
  Text,useImage,useFont,
} from "@shopify/react-native-skia";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
const { width, height } = Dimensions.get("window");

const source = Skia.RuntimeEffect.Make(`
  uniform shader image1;
  uniform shader image2;
  uniform float progress;
  uniform float2 resolution;
  
  vec4 getFromColor(vec2 p) {
    return image2.eval(p * resolution);
  }
  vec4 getToColor(vec2 p) {
    return image1.eval(p * resolution);
  }

  float intensity = 0.1;
  const int passes = 6;


  vec4 transition(vec2 uv) {
    vec4 c1 = vec4(0.0);
    vec4 c2 = vec4(0.0);

    float disp = intensity*(0.5-distance(0.5, progress));
    for (int xi=0; xi<passes; xi++)
    {
        float x = float(xi) / float(passes) - 0.5;
        for (int yi=0; yi<passes; yi++)
        {
            float y = float(yi) / float(passes) - 0.5;
            vec2 v = vec2(x,y);
            float d = disp;
            c1 += getFromColor( uv + d*v);
            c2 += getToColor( uv + d*v);
        }
    }
    c1 /= float(passes*passes);
    c2 /= float(passes*passes);
    return mix(c1, c2, progress);
}
  
  half4 main(float2 xy) {
    vec2 uv = xy / resolution;
    return transition(uv);
  }
`);

export default function App() {
  const [imgIndexState, setImgIndexState] = useState(0);
  const [current, next] = [useSharedValue(0), useSharedValue(1)];
  const progress = useSharedValue(0);

  //const font = useFont(require("./lockwood-free.ttf"), 20);
  const [canvasLayout, setCanvasLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleCanvasLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setCanvasLayout({ x, y, width, height });
  }, []);

  let images = [
    useImage(
      "https://s1.1zoom.me/big0/553/Cats_Kittens_Glance_Grey_480466.jpg"
    ),
    useImage(
      "https://i.pinimg.com/originals/a4/ca/c0/a4cac0fced06ffafa4dd549576c29f37.jpg"
    ),
    useImage(
      "https://hoponworld.com/wp-content/uploads/2021/02/view-of-wuji-tianyuan-temple-during-cherry-blossom-season-taiwan.jpg"
    ),
  ];

  const incrementImgIndex = useCallback(() => {
    setImgIndexState(prevState => (prevState + 1) % images.length);
    cancelAnimation(progress);
    progress.value = 0
  }, [progress]);

  const swipeRightGesture = Gesture.Fling()
  .direction(Directions.RIGHT)
  .onFinalize(()=>{
    progress.value = withTiming(1, { duration: 650 }, (finished,) => {
      if(finished){
        current.value = next.value;
        next.value = (next.value + 1) % images.length;
        runOnJS(incrementImgIndex)();        
      }  
    });
  })
  const swipeLeftGesture = Gesture.Fling()
  .direction(Directions.LEFT)
  .onFinalize(()=>{
    progress.value = withTiming(1, { duration: 650 }, (finished,) => {
      if(finished){
        current.value = next.value;
        next.value = (next.value + 1) % images.length;
        runOnJS(incrementImgIndex)();        
      }  
    });
  })
  const swipeGestureComposed = Gesture.Simultaneous(swipeRightGesture, swipeLeftGesture);

  const tapGesture= Gesture.Tap()
  .onFinalize(()=>{
    progress.value = withTiming(1, { duration: 650 }, (finished,) => {
      if(finished){
        current.value = next.value;
        next.value = (next.value + 1) % images.length;
        runOnJS(incrementImgIndex)();        
      }  
    });
  })

  const composedGesture= Gesture.Race(swipeGestureComposed,tapGesture)


  const uniforms = useDerivedValue(() => ({
    progress: progress.value,
    resolution: [width, height],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <View style={{ flex: 1, width: "100%" }}>
          <Canvas
            onLayout={handleCanvasLayout}
            style={{ flex: 1, width: "100%" }}
          >
            {images[current.value] && images[next.value] ? (
              <Fill>
                <Shader source={source!} uniforms={uniforms}>
                  <ImageShader
                    image={images[next.value]}
                    fit="cover"
                    width={canvasLayout.width}
                    height={canvasLayout.height}
                    x={0}
                    y={0}
                  />
                  <ImageShader
                    image={images[current.value]}
                    fit="cover"
                    width={canvasLayout.width}
                    height={canvasLayout.height}
                    x={0}
                    y={0}
                  />
                </Shader>
              </Fill>
            ) : null}
            {/* <Text
              font={font}
              text={`imgIndexValue:${current.value} progress:${progress.value}`}
              x={10}
              y={40}
            />
            <Text
              font={font}
              text={`current:${current.value} next:${next.value}`}
              x={10}
              y={70}
            /> */}
          </Canvas>
          <BottomContainer imgIndex={imgIndexState} />
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





  // const [isTimerRunning, setIsTimerRunning] = useState(true);
  // const intervalRef: { current: NodeJS.Timeout | null } = useRef(null);


  // const startTransition = useCallback(() => {
    // progress.value = withTiming(1, { duration: 650 }, (finished,) => {
    //   if(finished){
    //     current.value = next.value;
    //     next.value = (next.value + 1) % images.length;
    //     runOnJS(incrementImgIndex)();        
    //   }  
    // });
  // }, [progress, incrementImgIndex]);

  
  // const startTimer = useCallback(() => {
  //   if (!intervalRef.current) {
  //     intervalRef.current = setInterval(() => {
  //       if (isTimerRunning) {
  //         startTransition();
  //       }
  //     }, 3000);
  //   }
  // }, [isTimerRunning, startTransition]);

  // const stopTimer = () => {
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //     intervalRef.current = null;
  //   }
  // };
  // useEffect(() => {
  //   startTimer();
  //   return () => stopTimer();
  // }, [isTimerRunning]);