import { Tabs } from "expo-router";
import { House, Wallet, Grid2x2, User } from "lucide-react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#16A34A",
                tabBarInactiveTintColor: "#9CA3AF",
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <House color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: "Wallet",
                    tabBarIcon: ({ color, size }) => (
                        <Wallet color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: "Services",
                    tabBarIcon: ({ color, size }) => (
                        <Grid2x2 color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <User color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}