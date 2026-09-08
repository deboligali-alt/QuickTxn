import { View, Text, StyleSheet } from "react-native";

export default function WalletScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Wallet Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
    },
});