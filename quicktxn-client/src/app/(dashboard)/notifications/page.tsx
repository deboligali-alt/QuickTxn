"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Bell, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-5 flex items-center gap-2 text-gray-700"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="mb-6 text-3xl font-bold">Notifications</h1>

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
            <Bell size={40} className="mx-auto text-gray-300" />
            <p className="mt-4 text-gray-500">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm ${!item.is_read
                    ? "border-green-200"
                    : "border-gray-200"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <Bell size={20} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-bold">{item.title}</h3>

                      <span className="text-xs text-gray-500">
                        {new Date(
                          item.created_at
                        ).toLocaleDateString("en-NG")}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {item.message}
                    </p>

                    {!item.is_read && (
                      <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        New
                      </span>
                    )}
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