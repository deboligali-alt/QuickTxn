import api from "@/lib/api";

export interface ContactPayload {
    fullName: string;
    email: string;
    subject: string;
    message: string;
}

export const sendContactMessage = async (
    data: ContactPayload
) => {
    const response = await api.post(
        "/contact",
        data
    );

    return response.data;
};