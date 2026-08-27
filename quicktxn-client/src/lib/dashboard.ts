import api from "@/lib/api";

export const getDashboardData = async () => {
    const [user, wallet, transactions, notifications] =
        await Promise.all([
            api.get("/user/profile"),
            api.get("/wallet/balance"),
            api.get("/transactions"),
            api.get("/notifications"),
        ]);

    return {
        user: user.data.data,
        wallet: wallet.data.data,
        transactions: transactions.data.transactions,
        notifications: notifications.data.data,
    };
};