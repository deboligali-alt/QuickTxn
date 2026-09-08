import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert("Missing Fields", "Enter email and password");
        }

        try {
            setLoading(true);

            const res = await api.post("/auth/login", {
                email,
                password,
            });

            // Support both response formats
            const token = res.data.token || res.data.data?.token;
            const user = res.data.user || res.data.data?.user;

            if (!token) {
                Alert.alert("Login Error", "Token not returned from server");
                return;
            }

            await AsyncStorage.setItem("token", token);

            if (user) {
                await AsyncStorage.setItem("user", JSON.stringify(user));
            }

            router.replace("/(tabs)/home");
        } catch (error: any) {
            Alert.alert(
                "Login Failed",
                error.response?.data?.message || "Invalid credentials"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <Text style={styles.logo}>QuickTxn</Text>
            <Text style={styles.heading}>Welcome Back</Text>

            <TextInput
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <Pressable style={styles.button} onPress={handleLogin}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </Pressable>

            <Pressable>
                <Text style={styles.register}>
                    Don't have an account? Register
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        justifyContent: "center",
        padding: 24,
    },

    logo: {
        fontSize: 36,
        fontWeight: "800",
        color: "#16A34A",
        textAlign: "center",
    },

    heading: {
        fontSize: 18,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 8,
        marginBottom: 40,
    },

    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
    },

    button: {
        backgroundColor: "#16A34A",
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: "center",
        marginTop: 8,
    },

    buttonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 18,
    },

    register: {
        marginTop: 24,
        textAlign: "center",
        color: "#16A34A",
        fontWeight: "600",
    },
});