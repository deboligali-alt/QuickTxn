import api from "@/lib/axios";

export interface BettingProvider {
    provider_name: string;
    provider_code: string;
}

export interface BettingFunding {
    provider_name: string;
    betting_user_id: string;
    amount: number;
    status: string;
    reference: string;
    created_at: string;
}

export const getBettingProviders = async (
    token: string
) => {
    const response = await api.get(
        "/betting/history/providers",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const fundBettingWallet = async (
    token: string,
    data: {
        providerCode: string;
        bettingUserId: string;
        amount: number;
        pin: string;
    }
) => {
    const response = await api.post(
        "/betting/fund",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getBettingHistory = async (
    token: string
) => {
    const response = await api.get(
        "/betting/history",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};