import api from "@/lib/axios";

export const createSwap = async (
    token: string,
    data: {
        network: string;
        phoneNumber: string;
        airtimeAmount: number;
    }
) => {
    const response = await api.post(
        "/airtime/swap",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getRates = async (token: string) => {
    const response = await api.get(
        "/airtime/rates",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getSwapHistory = async (token: string) => {
    const response = await api.get(
        "/airtime/history",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};