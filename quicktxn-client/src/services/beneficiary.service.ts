import api from "@/lib/api";

export const getBeneficiaries = async (token: string) => {
    const response = await api.get("/beneficiaries", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const addBeneficiary = async (
    token: string,
    data: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        bankCode: string;
    }
) => {
    const response = await api.post(
        "/beneficiaries",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const deleteBeneficiary = async (
    token: string,
    id: string
) => {
    const response = await api.delete(
        `/beneficiaries/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};