import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from "react-native";
import {
    Bell,
    Eye,
    Smartphone,
    Wifi,
    Zap,
    Tv,
} from "lucide-react-native";

import {
    getDashboard,
    getProfile,
    getTransactions,
} from "@/services/dashboard";
export default function HomeScreen() {
    const [loading, setLoading] = useState(true);
    const [hideBalance, setHideBalance] = useState(false);

    const [user, setUser] = useState({
        fullName: "",
        walletBalance: 0,
    });

    const [notificationCount, setNotificationCount] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [profile, dashboard, tx] = await Promise.all([
                getProfile(),
                getDashboard(),
                getTransactions(),
            ]);

            setUser({
                fullName: profile.full_name,
                walletBalance: Number(dashboard.walletBalance),
            });

            setNotificationCount(dashboard.unreadNotifications);
            setTransactions(tx);
        } catch (err: any) {
            console.log("Dashboard Error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#16A34A" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Evening 👋</Text>
                    <Text style={styles.name}>{user.fullName}</Text>
                </View>

                <Pressable style={styles.notify}>
                    <Bell color="#111827" size={22} />

                    {notificationCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {notificationCount}
                            </Text>
                        </View>
                    )}
                </Pressable>
            </View>

            {/* Wallet Card */}
            <View style={styles.walletCard}>
                <Text style={styles.walletLabel}>Available Balance</Text>

                <View style={styles.balanceRow}>
                    <Text style={styles.balance}>
                        {hideBalance
                            ? "₦ ••••••"
                            : `₦${user.walletBalance.toLocaleString()}.00`}
                    </Text>

                    <Pressable
                        onPress={() => setHideBalance(!hideBalance)}
                    >
                        <Eye color="#FFFFFF" size={20} />
                    </Pressable>
                </View>

                <View style={styles.actions}>
                    <Pressable style={styles.actionBtn}>
                        <Text style={styles.actionText}>Fund Wallet</Text>
                    </Pressable>

                    <Pressable style={styles.actionBtn}>
                        <Text style={styles.actionText}>Transfer</Text>
                    </Pressable>
                </View>
            </View>

            {/* Quick Services */}
            <Text style={styles.sectionTitle}>Quick Services</Text>

            <View style={styles.grid}>
                <Pressable
                    style={styles.service}
                    onPress={() => router.push("/(tabs)/home")}
                >
                    <Smartphone color="#16A34A" size={28} />
                    <Text style={styles.serviceText}>Airtime</Text>
                </Pressable>
                <ServiceCard
                    icon={<Wifi color="#16A34A" size={28} />}
                    title="Data"
                />
                <ServiceCard
                    icon={<Zap color="#16A34A" size={28} />}
                    title="Electricity"
                />
                <ServiceCard
                    icon={<Tv color="#16A34A" size={28} />}
                    title="Cable TV"
                />
            </View>

            {/* Recent Transactions */}
            <Text style={styles.sectionTitle}>
                Recent Transactions
            </Text>

            {transactions.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>
                        No transactions yet
                    </Text>
                </View>
            ) : (
                transactions.slice(0, 5).map((item) => (
                    <TransactionItem
                        key={item.id}
                        title={item.type}
                        time={new Date(
                            item.created_at
                        ).toLocaleDateString()}
                        amount={`₦${Number(item.amount).toLocaleString()}`}
                        color={
                            item.type === "credit"
                                ? "#16A34A"
                                : "#DC2626"
                        }
                    />
                ))
            )}
        </ScrollView>
    );
}

function ServiceCard({ icon, title }: any) {
    return (
        <Pressable style={styles.service}>
            {icon}
            <Text style={styles.serviceText}>{title}</Text>
        </Pressable>
    );
}

function TransactionItem({
    title,
    time,
    amount,
    color,
}: any) {
    return (
        <View style={styles.transaction}>
            <View>
                <Text style={styles.txTitle}>{title}</Text>
                <Text style={styles.txTime}>{time}</Text>
            </View>

            <Text style={[styles.amount, { color }]}>
                {amount}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
    },

    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    greeting: {
        color: "#6B7280",
        fontSize: 15,
    },

    name: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111827",
    },

    notify: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },

    badge: {
        position: "absolute",
        top: -3,
        right: -3,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#DC2626",
        justifyContent: "center",
        alignItems: "center",
    },

    badgeText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "700",
    },

    walletCard: {
        backgroundColor: "#16A34A",
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 22,
    },

    walletLabel: {
        color: "#D1FAE5",
        fontSize: 14,
    },

    balanceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },

    balance: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "800",
    },

    actions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 22,
    },

    actionBtn: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.18)",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
    },

    actionText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },

    sectionTitle: {
        marginTop: 28,
        marginBottom: 14,
        marginHorizontal: 20,
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },

    service: {
        width: "47%",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        alignItems: "center",
        paddingVertical: 24,
        marginBottom: 14,
    },

    serviceText: {
        marginTop: 10,
        fontWeight: "600",
        color: "#374151",
    },

    transaction: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 18,
        padding: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    txTitle: {
        fontWeight: "700",
        color: "#111827",
    },

    txTime: {
        marginTop: 4,
        color: "#9CA3AF",
        fontSize: 13,
    },

    amount: {
        fontWeight: "700",
        fontSize: 16,
    },

    empty: {
        marginHorizontal: 20,
        backgroundColor: "#FFFFFF",
        padding: 30,
        borderRadius: 18,
        alignItems: "center",
    },

    emptyText: {
        color: "#9CA3AF",
        fontSize: 15,
    },
});