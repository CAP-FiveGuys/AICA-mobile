import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  FlatList,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  useWindowDimensions,
} from "react-native";
import OnboardingSlide from "../components/OnboardingSlide";

interface Slide {
  id: number;
  image: ImageSourcePropType;
  text: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: require("../assets/images/onboarding1.png"),
    text: "AICA를 이용해\n어디서든 단어공부를!",
  },
  {
    id: 2,
    image: require("../assets/images/onboarding2.png"),
    text: "AICA모바일을 사용하려면\n데스크탑에서 회원가입을 해야해요!",
  },
  {
    id: 3,
    image: require("../assets/images/onboarding3.png"),
    text: "이제 같이 영어공부 시작해요!",
  },
];

export default function Main() {
  const [fontsLoaded] = useFonts({
    AppleSDGothicNeoM00: require("../assets/fonts/AppleSDGothicNeoM.ttf"),
  });

  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<Slide> | null>(null);
  const { width } = useWindowDimensions();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={({ item }) => <OnboardingSlide item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        ref={slidesRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
      />

      {/* 인디케이터 */}
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.4, 1],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: "clamp",
          });


          const backgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: ["#CCCCCC", "#A0F5DD", "#CCCCCC"], 
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor,
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>

      {/* 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>로그인 하고 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  indicator: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#CCCCCC",
    marginHorizontal: 11,
  },
  button: {
    backgroundColor: "#A0F5DD",
    marginHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 130,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "AppleSDGothicNeoM00",
  },
});