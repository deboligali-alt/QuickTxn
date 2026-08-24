import api from "@/lib/axios";

export const getPublicStats = async () => {
    const response = await api.get("/public/stats");
    return response.data;
};

export const getPublicTestimonials = async () => {
    const response = await api.get("/public/testimonials");
    return response.data;
};