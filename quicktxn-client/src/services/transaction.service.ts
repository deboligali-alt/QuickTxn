import api from "@/lib/axios";

export interface Transaction {
    id: string;
    reference: string;
    type: string;
    amount: number;
    status: string;
    description: string;
    created_at: string;
}

export interface TransactionResponse {
    success: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    count: number;
    transactions: Transaction[];
}

export const getTransactions = async (
    token: string,
    params?: {
        page?: number;
        limit?: number;
        type?: string;
        status?: string;
        reference?: string;
        from?: string;
        to?: string;
    }
) => {
    const response = await api.get<TransactionResponse>(
        "/transactions",
        {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getTransactionByReference = async (
    token: string,
    reference: string
) => {
    const response =
        await api.get(
            `/transactions/${encodeURIComponent(reference)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

    return response.data;
};