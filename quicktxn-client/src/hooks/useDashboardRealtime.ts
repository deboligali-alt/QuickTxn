"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function useDashboardRealtime(
    userId: string | undefined,
    refresh: () => void,
    onSuccess?: () => void
) {
    useEffect(() => {
        if (!userId) return;

        socket.connect();

        socket.emit("join", userId);

        const update = () => {
            refresh();
            onSuccess?.();
        };

        socket.on("wallet_updated", update);
        socket.on("new_transaction", update);

        return () => {
            socket.off("wallet_updated", update);
            socket.off("new_transaction", update);
            socket.disconnect();
        };
    }, [userId, refresh, onSuccess]);
}