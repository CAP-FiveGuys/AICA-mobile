import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Index() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    JosefinSans: require("../assets/fonts/JosefinSansBold.ttf"),
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fontsLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        router.replace("/main");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Text style={styles.logo}>
          <Text style={styles.ai}>AI</Text>
          <Text style={styles.ca}>CA</Text>
        </Text>
        <Text style={styles.subtitle}>나만의 AI 단어장</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 48,
    fontFamily: "JosefinSans",

  },
  ai: {
    color: "#7AE2C9",
  },
  ca: {
    color: "#4A4A4A",
  },
  subtitle: {
    fontSize: 14,
    color: "#B0B0B0",
    marginTop: 8,
  },
});