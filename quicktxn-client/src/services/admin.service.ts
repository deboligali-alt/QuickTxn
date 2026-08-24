import api from "@/lib/axios";

// ========================================
// Admin Dashboard
// ========================================

export const getDashboardStats = async (
    token: string
) => {
    const response = await api.get(
        "/admin/dashboard",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ========================================
// Users
// ========================================

export const getAllUsers = async (
    token: string
) => {
    const response = await api.get(
        "/admin/users",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ========================================
// Airtime Swaps
// ========================================

export const getAllSwaps = async (
    token: string
) => {
    const response = await api.get(
        "/admin/airtime-swaps",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ========================================
// Get Single Airtime Swap
// ========================================

export const getSwap = async (
    token: string,
    id: string
) => {
    const response = await api.get(
        `/admin/airtime-swaps/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ========================================
// Airtime Swap Statistics
// ========================================

export const getSwapStats = async (
    token: string
) => {
    const response = await api.get(
        "/admin/airtime-swaps/stats",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ========================================
// Approve Airtime Swap
// ========================================

export const approveSwap = async (
    token: string,
    id: string
) => {
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
    adminNote: string
) => {
    const response = await api.patch(
        `/admin/airtime-swaps/${id}/reject`,
        {
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