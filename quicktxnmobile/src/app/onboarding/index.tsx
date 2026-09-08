import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const slides = [
  {
    icon: "📱",
    title: "Instant Airtime & Data",
    subtitle: "Purchase airtime and data for all Nigerian networks in seconds."
  },
  {
    icon: "⚡",
    title: "Pay Bills Easily",
    subtitle: "Electricity, Cable TV, WAEC and Betting all in one secure app."
  },
  {
    icon: "🛡️",
    title: "Secure Wallet",
    subtitle: "Fund your wallet, transfer money and track every transaction safely."
  }
];

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      router.replace("/auth/login");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.card}>
        <Text style={styles.icon}>{slides[current].icon}</Text>

        <Text style={styles.title}>{slides[current].title}</Text>

        <Text style={styles.subtitle}>
          {slides[current].subtitle}
        </Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                current === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {current === 2 ? "Get Started" : "Continue"}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.replace("/auth/login")}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16A34A",
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },

  card: {
    width: width - 48,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 30,
    alignItems: "center",
    marginTop: 40,
  },

  icon: {
    fontSize: 82,
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#6B7280",
  },

  bottom: {
    gap: 22,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#86EFAC",
  },

  activeDot: {
    width: 30,
    backgroundColor: "#FFFFFF",
  },

  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#16A34A",
    fontSize: 18,
    fontWeight: "700",
  },

  skip: {
    textAlign: "center",
    color: "#DCFCE7",
    fontWeight: "600",
  },
});