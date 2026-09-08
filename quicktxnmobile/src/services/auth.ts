import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const getProfile = async () => {
    const token = await AsyncStorage.getItem("token");

    const res = await api.get("/user/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};