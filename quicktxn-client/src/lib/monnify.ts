import api from "./api";

export const initializeMonnify = async (amount: number) => {
    const { data } = await api.post("/monnify/initialize", {
        amount,
    });

    return data;
};

export const verifyMonnify = async (reference: string) => {
    const { data } = await api.get(
        `/monnify/verify/${reference}`
    );

    return data;
};