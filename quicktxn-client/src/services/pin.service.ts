import api from "@/lib/api";

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

export const changePin = async (
    token: string,
    oldPin: string,
    newPin: string
) => {
    const response = await api.patch(
        "/pin/change",
        {
            oldPin,
            newPin,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};