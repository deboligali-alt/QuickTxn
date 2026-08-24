import api from "@/lib/axios";

export const getWallet = async (token: string) => {
    const response = await api.get("/wallet/balance", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const fundWallet = async (
    token: string,
    amount: number
) => {
    const response = await api.post(
        "/wallet/fund",
        { amount },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getBanks = async (token: string) => {
    const response = await api.get("/wallet/banks", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};


export const resolveAccount = async (
    token: string,
    accountNumber: string,
    bankCode: string
) => {
    const response = await api.post(
        "/wallet/resolve-account",
        {
            accountNumber,
            bankCode,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


export const bankTransfer = async (
    token: string,
    data: {
        accountNumber: string;
        bankCode: string;
        accountName: string;
        amount: number;
        pin: string;
    }
) => {
    const response = await api.post(
        "/wallet/bank-transfer",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};