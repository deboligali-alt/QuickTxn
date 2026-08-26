import api from "@/lib/api";

export const getDataPlans = async (token: string) => {
    const response = await api.get("/data/plans", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const purchaseData = async (
    token: string,
    data: {
        network: string;
        planCode: string;
        phoneNumber: string;
        pin: string;
    }
) => {
    const response = await api.post(
        "/data/purchase",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getDataHistory = async (token: string) => {
    const response = await api.get("/data/history", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};