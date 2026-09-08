import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import api from "@/services/api";

const networks = [
    { name: "MTN", code: "mtn", color: "#FFCC00" },
    { name: "Airtel", code: "airtel", color: "#E60012" },
    { name: "Glo", code: "glo", color: "#009933" },
    { name: "9mobile", code: "etisalat", color: "#8DC63F" },
];

export default function AirtimeScreen() {
    const [network, setNetwork] = useState("mtn");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const purchase = async () => {
        if (!phone || !amount || !pin) {
            return Alert.alert("Missing Fields", "Complete all fields");
        }

        try {
            setLoading(true);

            const res = await api.post("/airtime/purchase", {
                network,
                phone,
                amount: Number(amount),
                pin,
            });

            Alert.alert("Success", res.data.message);

            setPhone("");
            setAmount("");
            setPin("");

            router.back();
        } catch (err: any) {
            Alert.alert(
                "Failed",
                err.response?.data?.message || "Purchase failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Buy Airtime</Text>

            <Text style={styles.label}>Network</Text>

            <View style={styles.networkRow}>
                {networks.map((item) => (
                    <Pressable
                        key={item.code}
                        onPress={() => setNetwork(item.code)}
                        style={[
                            styles.networkCard,
                            network === item.code && {
                                borderColor: item.color,
                                borderWidth: 2,
                            },
                        ]}
                    >
                        <View
                            style={[styles.dot, { backgroundColor: item.color }]}
                        />
                        <Text style={styles.networkText}>{item.name}</Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.label}>Phone Number</Text>

            <TextInput
                placeholder="08012345678"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
            />

            <Text style={styles.label}>Amount</Text>

            <TextInput
                placeholder="100"
                keyboardType="number-pad"
                value={amount}
                onChangeText={setAmount}
                style={styles.input}
            />

            <Text style={styles.label}>Transaction PIN</Text>

            <TextInput
                placeholder="****"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                value={pin}
                onChangeText={setPin}
                style={styles.input}
            />

            <Pressable style={styles.button} onPress={purchase}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Purchase Airtime</Text>
                )}
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        marginTop: 55,
        marginBottom: 25,
        color: "#111827",
    },
    label: {
        fontWeight: "700",
        marginBottom: 10,
        color: "#374151",
    },
    networkRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 22,
    },
    networkCard: {
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 10,
    },
    networkText: {
        fontWeight: "700",
    },
    input: {
        backgroundColor: "#FFF",
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#16A34A",
        padding: 18,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 40,
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 18,
    },
});