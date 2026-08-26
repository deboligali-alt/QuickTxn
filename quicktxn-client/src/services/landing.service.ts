import api from "@/lib/api";

export const getLandingRates = async () => {
   const response = await api.get("/airtime/rates");
    return response.data;
};

export const getLandingDataPlans = async () => {
    const response = await api.get("/data/plans");
    return response.data;
};