"use client";

import { useCallback, useEffect, useState } from "react";
import { getNotifications } from "@/services/notification.service";

export interface Notification {
    id: string;
    title?: string;
    message?: string;
    is_read: boolean;
    created_at?: string;
}

export default function useNotifications() {
    const [notifications, setNotifications] =
        useState<Notification[]>([]);

    const [count, setCount] = useState(0);

    const [loading, setLoading] = useState(true);

    const loadNotifications = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setNotifications([]);
                setCount(0);
                return;
            }

            const response = await getNotifications(token);

            const data = response.data || [];

            const notificationList =
                data as Notification[];

            setNotifications(notificationList);

            const unread =
                notificationList.filter(
                    (item) => !item.is_read
                ).length;

            setCount(unread);

        } catch (error) {
            console.error(
                "Failed to load notifications:",
                error
            );

            setNotifications([]);
            setCount(0);

        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    return {
        notifications,
        count,
        loading,
        refresh: loadNotifications,
    };
}