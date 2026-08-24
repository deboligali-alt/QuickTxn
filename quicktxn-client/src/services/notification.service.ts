import api from "@/lib/axios";

export const getNotifications = async (token: string) => {
    const response = await api.get("/notifications", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const markNotificationAsRead = async (
    token: string,
    id: string
) => {
    const response = await api.patch(
        `/notifications/${id}/read`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const markAllNotificationsAsRead = async (
    token: string
) => {
    const response = await api.patch(
        "/notifications/read-all",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const deleteNotification = async (
    token: string,
    id: string
) => {
    const response = await api.delete(
        `/notifications/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};