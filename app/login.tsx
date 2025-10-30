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
    ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Login() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const isButtonEnabled = id.length > 0 && password.length > 0;

    const handleLogin = async () => {
        if (!isButtonEnabled) return;
        setErrorMessage("");
        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/api/login`,
                {
                    userId: id,
                    password: password,
                    rememberMe: true
                }
            );
            const { accessToken, refreshToken } = response.data.data;
            if (accessToken && refreshToken) {
                await SecureStore.setItemAsync("accessToken", accessToken);
                await SecureStore.setItemAsync("refreshToken", refreshToken);
                router.replace("/home");
            } else {
                setErrorMessage("로그인 처리 중 문제가 발생했습니다. 다시 시도해 주세요.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    const msg = error.response.data.message || "아이디 또는 비밀번호가 잘못 되었습니다.";
                    setErrorMessage(msg + " 아이디와 비밀번호를 정확히 입력해 주세요.");
                } else if (error.response.status === 401) {
                    setErrorMessage("인증에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.");
                } else {
                    setErrorMessage(`로그인 중 문제가 발생했습니다. (코드: ${error.response.status})`);
                }
            } else {
                setErrorMessage("서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.");
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back-outline" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContentContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>
                        아이디와 비밀번호를{"\n"}입력하세요
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>ID</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="아이디를 입력하세요"
                            value={id}
                            onChangeText={(text) => {
                                setId(text);
                                setErrorMessage("");
                            }}
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
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setErrorMessage("");
                                }}
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
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                    </View>
                </ScrollView>

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
        justifyContent: "center",
        paddingBottom: 10,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 20,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 10,
    },
    backButton: {
        padding: 8,
        marginLeft: 5,
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
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 8,
        textAlign: "left",
        marginLeft: 5,
    },
});