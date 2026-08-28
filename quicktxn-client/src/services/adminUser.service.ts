import api from "@/lib/api";

export const getAllUsers = async (token: string) => {
    const response = await api.get("/admin/users", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const getUser = async (
    token: string,
    id: string
) => {
    const response = await api.get(`/admin/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const fundUserWallet = async (
    token: string,
    id: string,
    amount: number
) => {
    const response = await api.post(
        `/admin/users/${id}/fund`,
        { amount },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const toggleUserStatus = async (
    token: string,
    id: string
) => {
    const response = await api.patch(
        `/admin/users/${id}/status`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const resetUserPin = async (
    token: string,
    id: string
) => {
    const response = await api.patch(
        `/admin/users/${id}/reset-pin`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const resetPassword = async (
    token: string,
    id: string
) => {
    const response = await api.patch(
        `/admin/users/${id}/reset-password`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const deleteUser = async (
    token: string,
    id: string
) => {
    const response = await api.delete(`/admin/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};