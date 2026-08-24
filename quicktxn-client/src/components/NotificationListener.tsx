"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import { socket } from "@/lib/socket";

interface LiveNotification {
    title: string;
    message: string;
}

export default function NotificationListener() {
    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) return;

        socket.connect();

        socket.emit("join", userId);

        socket.on("notification", (data: LiveNotification) => {
            toast.custom(
                () => (
                    <div className="w-[360px] rounded-2xl border border-green-100 bg-white p-4 shadow-2xl">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-green-100 p-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900">
                                    {data.title}
                                </h3>

                                <p className="mt-1 text-sm text-slate-600">
                                    {data.message}
                                </p>
                            </div>
                        </div>
                    </div>
                ),
                {
                    duration: 5000,
                    position: "top-right",
                }
            );
        });

        return () => {
            socket.off("notification");
            socket.disconnect();
        };
    }, []);

    return null;
}