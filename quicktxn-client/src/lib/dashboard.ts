import api from "@/lib/api";

export const getDashboardData = async () => {
    const [wallet, transactions, notifications] = await Promise.all([
        api.get("/wallet/balance"),
        api.get("/transactions"),
        api.get("/notifications"),
    ]);

    return {
        wallet: wallet.data.data,
        transactions: transactions.data.transactions,
        notifications: notifications.data.data,
    };
};