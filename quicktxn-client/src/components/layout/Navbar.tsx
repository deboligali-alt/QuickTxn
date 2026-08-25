// "use client";

// import useNotifications from "@/hooks/useNotifications";
// import {
//     markNotificationAsRead,
//     markAllNotificationsAsRead,
//     deleteNotification,
// } from "@/services/notification.service";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import {
//     Bell,
//     Search,
//     Settings,
//     Wallet,
//     LogOut,
//     CheckCircle2,
//     X,
//     Trash2,
//     CheckCheck,
// } from "lucide-react";

// interface User {
//     full_name?: string;
//     fullName?: string;
// }

// export default function Navbar() {
//     const {
//         notifications,
//         count,
//         loading,
//         refresh,
//     } = useNotifications();

//     const router = useRouter();

//     const [userName, setUserName] = useState("User");
//     const [showNotifications, setShowNotifications] =
//         useState(false);

//     useEffect(() => {
//         const user = localStorage.getItem("user");

//         if (user) {
//             try {
//                 const parsed: User = JSON.parse(user);

//                 setUserName(
//                     parsed.full_name ||
//                     parsed.fullName ||
//                     "User"
//                 );
//             } catch (error) {
//                 console.error(
//                     "Failed to read user:",
//                     error
//                 );
//             }
//         }
//     }, []);

//     const logout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");

//         router.push("/login");
//     };

//     const handleNotificationClick = () => {
//         setShowNotifications(
//             (previous) => !previous
//         );
//     };

//     const handleMarkAsRead = async (
//         id: string
//     ) => {
//         try {
//             const token =
//                 localStorage.getItem("token");

//             if (!token) return;

//             await markNotificationAsRead(
//                 token,
//                 id
//             );

//             await refresh();

//         } catch (error) {
//             console.error(
//                 "Failed to mark notification as read:",
//                 error
//             );
//         }
//     };

//     const handleMarkAllAsRead = async () => {
//         try {
//             const token =
//                 localStorage.getItem("token");

//             if (!token) return;

//             await markAllNotificationsAsRead(
//                 token
//             );

//             await refresh();

//         } catch (error) {
//             console.error(
//                 "Failed to mark all notifications as read:",
//                 error
//             );
//         }
//     };

//     const handleDeleteNotification = async (
//         id: string
//     ) => {
//         try {
//             const token =
//                 localStorage.getItem("token");

//             if (!token) return;

//             await deleteNotification(
//                 token,
//                 id
//             );

//             await refresh();

//         } catch (error) {
//             console.error(
//                 "Failed to delete notification:",
//                 error
//             );
//         }
//     };

//     return (
//         <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">

//             {/* Search */}

//             <div className="relative w-full max-w-md">

//                 <Search
//                     size={18}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 />

//                 <input
//                     type="text"
//                     placeholder="Search transactions..."
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
//                 />

//             </div>

//             {/* Right Side */}

//             <div className="ml-4 flex items-center gap-3 sm:gap-5">

//                 {/* Wallet */}

//                 <button
//                     onClick={() =>
//                         router.push("/wallet")
//                     }
//                     className="hidden items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-green-700 transition hover:bg-green-100 md:flex"
//                 >

//                     <Wallet size={18} />

//                     <span className="font-semibold">
//                         Wallet
//                     </span>

//                 </button>

//                 {/* Notifications */}

//                 <div className="relative">

//                     <button
//                         onClick={
//                             handleNotificationClick
//                         }
//                         aria-label="Notifications"
//                         className="relative rounded-xl bg-slate-100 p-3 transition hover:bg-slate-200"
//                     >

//                         <Bell size={20} />

//                         {count > 0 && (
//                             <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
//                                 {count > 99
//                                     ? "99+"
//                                     : count}
//                             </span>
//                         )}

//                     </button>

//                     {/* Notification Dropdown */}

//                     {showNotifications && (
//                         <div className="absolute right-0 top-14 z-[100] w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[400px]">

//                             {/* Header */}

//                             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

//                                 <div>

//                                     <h3 className="font-bold text-slate-900">
//                                         Notifications
//                                     </h3>

//                                     <p className="text-xs text-slate-500">
//                                         {count > 0
//                                             ? `${count} unread notification${count > 1 ? "s" : ""}`
//                                             : "You're all caught up"}
//                                     </p>

//                                 </div>

//                                 <div className="flex items-center gap-1">

//                                     {count > 0 && (
//                                         <button
//                                             onClick={
//                                                 handleMarkAllAsRead
//                                             }
//                                             title="Mark all as read"
//                                             className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
//                                         >
//                                             <CheckCheck
//                                                 size={18}
//                                             />
//                                         </button>
//                                     )}

//                                     <button
//                                         onClick={() =>
//                                             setShowNotifications(
//                                                 false
//                                             )
//                                         }
//                                         className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//                                     >
//                                         <X size={18} />
//                                     </button>

//                                 </div>

//                             </div>

//                             {/* Loading */}

//                             {loading ? (

//                                 <div className="flex items-center justify-center px-6 py-12">

//                                     <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-green-600" />

//                                 </div>

//                             ) : notifications.length === 0 ? (

//                                 /* Empty */

//                                 <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

//                                     <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">

//                                         <CheckCircle2
//                                             size={28}
//                                             className="text-green-500"
//                                         />

//                                     </div>

//                                     <h4 className="mt-4 font-semibold text-slate-900">
//                                         No notifications
//                                     </h4>

//                                     <p className="mt-1 text-sm text-slate-500">
//                                         You're all caught up.
//                                     </p>

//                                 </div>

//                             ) : (

//                                 /* Notifications */

//                                 <div className="max-h-[420px] overflow-y-auto">

//                                     {notifications.map(
//                                         (notification) => (
//                                             <div
//                                                 key={
//                                                     notification.id
//                                                 }
//                                                 className={`group border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 ${notification.is_read
//                                                         ? "bg-white"
//                                                         : "bg-green-50/50"
//                                                     }`}
//                                             >

//                                                 <div className="flex gap-3">

//                                                     {/* Icon */}

//                                                     <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">

//                                                         <Bell
//                                                             size={16}
//                                                             className="text-green-600"
//                                                         />

//                                                     </div>

//                                                     {/* Content */}

//                                                     <div className="min-w-0 flex-1">

//                                                         <div className="flex items-start justify-between gap-2">

//                                                             <h4 className="font-semibold text-slate-900">
//                                                                 {notification.title ||
//                                                                     "Notification"}
//                                                             </h4>

//                                                             {!notification.is_read && (
//                                                                 <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-600" />
//                                                             )}

//                                                         </div>

//                                                         <p className="mt-1 text-sm leading-5 text-slate-600">
//                                                             {notification.message ||
//                                                                 "You have a new notification."}
//                                                         </p>

//                                                         {notification.created_at && (
//                                                             <p className="mt-2 text-xs text-slate-400">
//                                                                 {new Date(
//                                                                     notification.created_at
//                                                                 ).toLocaleString()}
//                                                             </p>
//                                                         )}

//                                                         {/* Actions */}

//                                                         <div className="mt-3 flex items-center gap-3">

//                                                             {!notification.is_read && (
//                                                                 <button
//                                                                     onClick={() =>
//                                                                         handleMarkAsRead(
//                                                                             notification.id
//                                                                         )
//                                                                     }
//                                                                     className="text-xs font-semibold text-green-600 hover:text-green-700"
//                                                                 >
//                                                                     Mark as read
//                                                                 </button>
//                                                             )}

//                                                             <button
//                                                                 onClick={() =>
//                                                                     handleDeleteNotification(
//                                                                         notification.id
//                                                                     )
//                                                                 }
//                                                                 className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600"
//                                                             >
//                                                                 <Trash2
//                                                                     size={13}
//                                                                 />
//                                                                 Delete
//                                                             </button>

//                                                         </div>

//                                                     </div>

//                                                 </div>

//                                             </div>
//                                         )
//                                     )}

//                                 </div>

//                             )}

//                         </div>
//                     )}

//                 </div>

//                 {/* Settings */}

//                 <button
//                     onClick={() =>
//                         router.push("/settings")
//                     }
//                     className="rounded-xl bg-slate-100 p-3 transition hover:bg-slate-200"
//                     aria-label="Settings"
//                 >

//                     <Settings size={20} />

//                 </button>

//                 {/* User */}

//                 <div className="flex items-center gap-3">

//                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white">

//                         {userName
//                             .charAt(0)
//                             .toUpperCase()}

//                     </div>

//                     <div className="hidden md:block">

//                         <p className="font-semibold text-slate-900">
//                             {userName}
//                         </p>

//                         <p className="text-sm text-slate-500">
//                             Welcome back
//                         </p>

//                     </div>

//                 </div>

//                 {/* Logout */}

//                 <button
//                     onClick={logout}
//                     className="rounded-xl bg-red-50 p-3 text-red-600 transition hover:bg-red-100"
//                     aria-label="Logout"
//                 >

//                     <LogOut size={20} />

//                 </button>

//             </div>

//         </header>
//     );
// }