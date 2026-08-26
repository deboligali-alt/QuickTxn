import api from "@/lib/api";

// ========================================
// GET PROFILE
// ========================================

export const getProfile = async (
    token: string
) => {
    const response = await api.get(
        "/user/profile",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ========================================
// UPDATE PROFILE
// ========================================

export const updateProfile = async (
    token: string,
    data: {
        fullName: string;
        phone: string;
    }
) => {
    const response = await api.put(
        "/user/profile",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ========================================
// CHANGE PASSWORD
// ========================================

export const changePassword = async (
    token: string,
    data: {
        currentPassword: string;
        newPassword: string;
    }
) => {
    const response = await api.patch(
        "/user/change-password",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ========================================
// SET TRANSACTION PIN
// ========================================

export const setTransactionPin = async (
    token: string,
    pin: string
) => {
    const response = await api.post(
        "/user/set-pin",
        {
            pin,
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
// CHANGE TRANSACTION PIN
// ========================================

export const changeTransactionPin = async (
    token: string,
    data: {
        currentPin: string;
        newPin: string;
    }
) => {
    const response = await api.patch(
        "/user/change-pin",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};