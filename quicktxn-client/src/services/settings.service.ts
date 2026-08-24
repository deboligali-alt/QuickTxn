import api from "@/lib/axios";

// ===============================
// Get Profile
// ===============================
export const getProfile = async (token: string) => {
    const response = await api.get("/user/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// ===============================
// Update Profile
// ===============================
export const updateProfile = async (
    token: string,
    data: {
        fullName: string;
        phone: string;
    }
) => {
    const response = await api.put("/user/profile", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// ===============================
// Change Password
// ===============================
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

// ===============================
// Change Transaction PIN
// ===============================
export const changePin = async (
    token: string,
    data: {
        oldPin: string;
        newPin: string;
    }
) => {
    const response = await api.post(
        "/pin/change",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ===============================
// Create Transaction PIN
// ===============================
export const createPin = async (
    token: string,
    pin: string
) => {
    const response = await api.post(
        "/pin/create",
        { pin },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};