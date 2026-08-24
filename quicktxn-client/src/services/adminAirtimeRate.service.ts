import api from "@/lib/axios";

export const getAllAirtimeRates = async (token: string) => {
    const response = await api.get("/admin/airtime-rates", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const createAirtimeRate = async (
    token: string,
    data: {
        network: string;
        rate: number;
    }
) => {
    const response = await api.post(
        "/admin/airtime-rates",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const updateAirtimeRate = async (
    token: string,
    id: string,
    data: {
        network: string;
        rate: number;
        is_active: boolean;
    }
) => {
    const response = await api.put(
        `/admin/airtime-rates/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const deleteAirtimeRate = async (
    token: string,
    id: string
) => {
    const response = await api.delete(
        `/admin/airtime-rates/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const toggleAirtimeRateStatus = async (
    token: string,
    id: string
) => {
    const response = await api.patch(
        `/admin/airtime-rates/${id}/status`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};