import api from "@/lib/api";

// ==============================
// Wallet
// ==============================
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

// ==============================
// Bank Transfer
// ==============================
export const getBanks = async (token: string) => {
    const response = await api.get("/bank/banks", {
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
        "/bank/resolve",
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
        "/bank/transfer",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getTransferHistory = async (token: string) => {
    const response = await api.get("/bank/history", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};