import { useFonts } from "expo-font";
import React from "react";
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

interface OnboardingSlideProps {
  item: {
    image: ImageSourcePropType; 
    text: string;
  };
}

export default function OnboardingSlide({ item }: OnboardingSlideProps) {

  const { width } = useWindowDimensions();

  const [fontsLoaded] = useFonts({
    AppleSDGothicNeoB00: require("../assets/fonts/AppleSDGothicNeoB.ttf"),
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={[styles.slide, { width }]}>
      <Image
        source={item.image}
        style={[styles.image, { height: width * 0.5 }]}
        resizeMode="contain"
      />
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {

    width: "100%",
    marginBottom: 70,
    marginTop: 80,
  },
  text: {
    fontSize: 24,
    color: "#000",
    textAlign: "center",
    lineHeight: 40,
    fontFamily: "AppleSDGothicNeoB00",
  },
});