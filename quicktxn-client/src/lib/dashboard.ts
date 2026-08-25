import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const getDashboardData = async (token: string) => {
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const [wallet, transactions, notifications] = await Promise.all([
        axios.get(`${API}/wallet/balance`, { headers }),
        axios.get(`${API}/transactions`, { headers }),
        axios.get(`${API}/notifications`, { headers }),
    ]);

    return {
        wallet: wallet.data.data,
        transactions: transactions.data.transactions,
        notifications: notifications.data.data,
    };
};