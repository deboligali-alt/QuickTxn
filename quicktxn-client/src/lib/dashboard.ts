import api from "@/lib/api";

export interface DashboardData {
    user: {
        id: string;
        full_name: string;
        email: string;
    };

    wallet: {
        balance: number;
    };

    notifications: {
        unread: number;
    };

    transactions: {
        id: string;
        type: string;
        amount: number;
        status: string;
        reference: string;
        description: string;
        created_at: string;
    }[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
    const response = await api.get("/dashboard");

    if (!response.data.success) {
        throw new Error("Failed to load dashboard");
    }

    return response.data;
};