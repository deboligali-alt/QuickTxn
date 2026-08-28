"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export default function useDashboardRealtime(
    userId?: string,
    refresh?: () => void,
    onSuccess?: () => void
) {
    useEffect(() => {
        if (!userId) return;

        if (!socket) {
            socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
                transports: ["websocket"],
            });
        }

        socket.emit("join", userId);

        socket.on("wallet_updated", () => {
            refresh?.();
            onSuccess?.();
        });

        socket.on("new_transaction", () => {
            refresh?.();
            onSuccess?.();
        });

        socket.on("notification", () => {
            refresh?.();
        });

        return () => {
            socket?.off("wallet_updated");
            socket?.off("new_transaction");
            socket?.off("notification");
        };
    }, [userId, refresh, onSuccess]);
}