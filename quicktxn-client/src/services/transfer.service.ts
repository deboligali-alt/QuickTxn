import api from "@/lib/api";

export const transferMoney = async (
    token: string,
    data: {
        receiverEmail: string;
        amount: number;
    }
) => {
    const response = await api.post(
        "/wallet/transfer",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};