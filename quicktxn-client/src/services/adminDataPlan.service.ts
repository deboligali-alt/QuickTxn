import api from "@/lib/axios";

export const getAllDataPlans = async (token: string) => {
    const response = await api.get("/admin/data-plans", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const createDataPlan = async (
    token: string,
    data: {
        network: string;
        plan_name: string;
        plan_code: string;
        amount: number;
    }
) => {
    const response = await api.post(
        "/admin/data-plans",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const updateDataPlan = async (
    token: string,
    id: string,
    data: {
        network: string;
        plan_name: string;
        plan_code: string;
        amount: number;
        is_active: boolean;
    }
) => {
    const response = await api.put(
        `/admin/data-plans/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const deleteDataPlan = async (
    token: string,
    id: string
) => {
    const response = await api.delete(
        `/admin/data-plans/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const toggleDataPlanStatus = async (
    token: string,
    id: string
) => {
    const response = await api.patch(
        `/admin/data-plans/${id}/status`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};