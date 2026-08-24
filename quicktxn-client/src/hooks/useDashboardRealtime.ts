"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function useDashboardRealtime(
    userId: string | undefined,
    onRefresh: () => void
) {
    useEffect(() => {
        if (!userId) return;

        socket.connect();
        socket.emit("join", userId);

        socket.on("wallet_updated", onRefresh);
        socket.on("new_transaction", onRefresh);

        return () => {
            socket.off("wallet_updated", onRefresh);
            socket.off("new_transaction", onRefresh);
            socket.disconnect();
        };
    }, [userId, onRefresh]);
}