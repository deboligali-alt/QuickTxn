import api from "@/lib/api";

interface AirtimeData {
    network: string;
    phoneNumber: string;
    amount: number;
    pin: string;
}

export const buyAirtime = async (
    token: string,
    data: AirtimeData
) => {
    const response = await api.post(
        "/airtime-purchase/purchase",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getAirtimeHistory = async (
    token: string
) => {
    const response = await api.get(
        "/airtime-purchase/history",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};