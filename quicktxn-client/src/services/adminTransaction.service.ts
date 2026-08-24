import api from "@/lib/axios";

export const getAllTransactions = async () => {
    const response = await api.get("/admin/transactions");
    return response.data;
};

export const getTransaction = async (id: string) => {
    const response = await api.get(`/admin/transactions/${id}`);
    return response.data;
};

export const updateTransactionStatus = async (
    id: string,
    status: string
) => {
    const response = await api.patch(
        `/admin/transactions/${id}/status`,
        { status }
    );

    return response.data;
};

export const exportTransactions = async () => {
    const response = await api.get(
        "/admin/transactions/export",
        {
            responseType: "blob",
        }
    );

    return response.data;
};