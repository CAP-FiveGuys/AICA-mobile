import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { API_URL } from '@env';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Login() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isButtonEnabled = id.length > 0 && password.length > 0;

    const handleLogin = async () => {
        if (!isButtonEnabled) return;

        try {
            const response = await axios.post(
                `${API_URL}/api/login`,
                {
                    userId: id,
                    password: password,
                    rememberMe: true
                }
            );

            const { accessToken, refreshToken } = response.data.data;
            const { message, data } = response.data;

            if (accessToken && refreshToken) {
                await SecureStore.setItemAsync("accessToken", accessToken);
                await SecureStore.setItemAsync("refreshToken", refreshToken);

                router.replace("/home");
            } else {
                Alert.alert("토큰을 받아오지 못했습니다.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            if (axios.isAxiosError(error) && error.response) {
                 if (error.response.status === 409) {
                const errorMessage = error.response.data.message || "로그인에 실패했습니다.";
                Alert.alert(errorMessage);
                } else {
                    Alert.alert(`로그인 중 문제가 발생했습니다. (코드: ${error.response.status})`);
                }
            } else {
                Alert.alert("서버에 연결할 수 없습니다.");
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back-outline" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>
                        아이디와 비밀번호를{"\n"}입력하세요
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>ID</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="아이디를 입력하세요"
                            value={id}
                            onChangeText={setId}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>PW</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Ionicons
                                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color="#8E8E93"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            isButtonEnabled ? styles.buttonEnabled : styles.buttonDisabled,
                        ]}
                        disabled={!isButtonEnabled}
                        onPress={handleLogin}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                isButtonEnabled ? styles.buttonTextEnabled : styles.buttonTextDisabled,
                            ]}
                        >
                            로그인
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
    },
    header: {
        // height: 60,
        justifyContent: "center",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        marginTop: -300,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    backButton: {
        padding: 8,
        marginLeft: 5,
        marginTop: 30,

    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 34,
        marginBottom: 60,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        color: "#8E8E93",
        marginBottom: 8,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
        paddingBottom: 8,
        fontSize: 16,
    },
    passwordWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
    },
    passwordInput: {
        flex: 1,
        paddingBottom: 8,
        fontSize: 16,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: -200,
    },
    buttonDisabled: {
        backgroundColor: "#F2F2F7",
    },
    buttonEnabled: {
        backgroundColor: "#A0F5DD",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonTextDisabled: {
        color: "#C7C7CC",
    },
    buttonTextEnabled: {
        color: "#000",
    },
});