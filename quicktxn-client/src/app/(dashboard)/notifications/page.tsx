"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Bell,
  ArrowLeft,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useDashboardRealtime from "@/hooks/useDashboardRealtime";

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>();

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data || []);
    } catch {
      toast.error("Unable to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserId(payload.id);
        }

        const res = await api.get("/notifications");
        const data = res.data.data || [];

        setNotifications(data);
        setLoading(false);

        const hasUnread = data.some(
          (item: Notification) => !item.is_read
        );

        if (hasUnread) {
          await api.patch("/notifications/read-all");

          setNotifications((prev) =>
            prev.map((item) => ({
              ...item,
              is_read: true,
            }))
          );

          sessionStorage.setItem("refresh_dashboard", "true");
          window.dispatchEvent(
            new Event("notifications-updated")
          );
        }
      } catch {
        setLoading(false);
        toast.error("Unable to load notifications");
      }
    };

    initialize();
  }, []);

  // REALTIME SOCKET.IO
  useDashboardRealtime(userId, loadNotifications, async () => {
    await loadNotifications();

    sessionStorage.setItem("refresh_dashboard", "true");
    window.dispatchEvent(
      new Event("notifications-updated")
    );

    toast.success("New notification received");
  });

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.filter((item) => item.id !== id)
      );

      sessionStorage.setItem("refresh_dashboard", "true");
      window.dispatchEvent(
        new Event("notifications-updated")
      );

      toast.success("Notification deleted");
    } catch {
      toast.error("Unable to delete notification");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 pb-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">
            <CheckCheck size={16} />
            <span className="text-xs font-semibold">
              All Read
            </span>
          </div>
        </div>

        <h1 className="mb-6 text-3xl font-bold">
          Notifications
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <Bell
              size={42}
              className="mx-auto text-gray-300"
            />

            <p className="mt-4 font-medium text-gray-700">
              No notifications yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              You'll receive wallet and transaction updates here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <Bell size={20} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold">
                          {item.title}
                        </h3>

                        <span className="text-xs text-gray-500">
                          {new Date(
                            item.created_at
                          ).toLocaleString("en-NG", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          deleteNotification(item.id)
                        }
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {item.message}
                    </p>

                    <div className="mt-3">
                      {item.is_read ? (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          Read
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}