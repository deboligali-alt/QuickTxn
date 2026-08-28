import api from "@/lib/api";

export const getBeneficiaries = async () => {
    const res = await api.get("/beneficiaries");
    return res.data;
};

export const addBeneficiary = async (data: any) => {
    const res = await api.post("/beneficiaries", data);
    return res.data;
};

export const deleteBeneficiary = async (id: string) => {
    const res = await api.delete(`/beneficiaries/${id}`);
    return res.data;
};

export const transferToBeneficiary = async (data: any) => {
    const res = await api.post("/beneficiaries/transfer", data);
    return res.data;
};