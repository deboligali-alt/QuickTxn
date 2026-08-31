import api from "@/lib/api";

// ========================================
// Admin Dashboard
// ========================================

export const getDashboardStats = async (token: string) => {
    const response = await api.get("/admin/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// ========================================
// Users
// ========================================

export const getAllUsers = async (token: string) => {
    const response = await api.get("/admin/users", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// ========================================
// Transactions
// ========================================

export const getAdminTransactions = async (token: string) => {
    const response = await api.get("/admin/transactions", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// ========================================
// Airtime Swaps
// ========================================

export const getAllSwaps = async (token: string) => {
    const response = await api.get("/admin/airtime-swaps", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const getSwap = async (token: string, id: string) => {
    const response = await api.get(`/admin/airtime-swaps/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// ========================================
// Approve Airtime Swap
// ========================================

export const approveSwap = async (token: string, id: string) => {
    const response = await api.patch(
        `/admin/airtime-swaps/${id}/approve`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ========================================
// Reject Airtime Swap
// ========================================

export const rejectSwap = async (
    token: string,
    id: string,
    rejectionReason: string,
    adminNote?: string
) => {
    const response = await api.patch(
        `/admin/airtime-swaps/${id}/reject`,
        {
            rejectionReason,
            adminNote,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ========================================
// Broadcast Notification
// ========================================

export const sendBroadcast = async (
    token: string,
    title: string,
    message: string
) => {
    const response = await api.post(
        "/admin/broadcast",
        {
            title,
            message,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};