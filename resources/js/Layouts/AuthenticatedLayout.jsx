import React, { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage, router } from "@inertiajs/react";
import { Dropdown, Avatar, Badge } from "flowbite-react";
import Swal from "sweetalert2";
import { hasPermissions, hasRole, hasRoles } from "@/helpers";

export default function AuthenticatedLayout({ header, children }) {
    const auth = usePage().props.auth;
    const user = auth.user;
    const roles = auth.roles ?? [];
    const permissions = auth.permissions ?? [];

    // console.log('Auth:', auth);
    // console.log('Roles:', roles);
    // console.log('Permissions:', permissions);

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        const fetchNotifications = async () => {
            try {
                const response = await fetch("/api/admin/notifications", {  // ปรับจาก /api/admin/notifications เป็น /notifications/api ตาม Route ใหม่
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "same-origin",
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setNotifications(data.data || []);
                setUnreadNotifications(data.total || 0);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
        const notificationTimer = setInterval(fetchNotifications, 60000);

        return () => {
            clearInterval(timer);
            clearInterval(notificationTimer);
        };
    }, []);
    const getNotificationIcon = (type) => {
        switch (type) {
            case "low_stock":
                return (
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                );
            case "expiring":
                return (
                    <div className="p-2 bg-red-100 rounded-lg">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            case "product_low_stock":
                return (
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H5z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                );
        }
    };

    const renderNotificationDropdown = () => (
        <div className="relative">
            <Dropdown
                label={
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 transition-colors hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadNotifications > 0 && (
                            <div className="absolute -top-1 -right-1">
                                <Badge color="failure" className="px-1.5 !text-xs">
                                    {unreadNotifications}
                                </Badge>
                            </div>
                        )}
                    </div>
                }
                arrowIcon={false}
                inline
                className="w-96 !p-0"
            >
                <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <h6 className="text-sm font-semibold text-gray-900">การแจ้งเตือน</h6>
                            {notifications.length > 0 && (
                                <span className="text-xs text-gray-500">{notifications.length} รายการ</span>
                            )}
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <Dropdown.Item
                                    key={notification.id}
                                    className="flex items-start space-x-3 !p-4 hover:bg-gray-50 transition-colors duration-150"
                                    onClick={() => router.get(notification.url)}
                                >
                                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 mb-0.5">{notification.title}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">เมื่อสักครู่</p>
                                    </div>
                                </Dropdown.Item>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-sm text-center text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="mt-2">ไม่มีการแจ้งเตือนใหม่</p>
                            </div>
                        )}
                    </div>
                    <div className="py-2 text-center border-t border-gray-100 bg-gray-50">
                        <Link href={route("notifications.index")} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-150">
                            ดูการแจ้งเตือนทั้งหมด
                        </Link>
                    </div>
                </div>
            </Dropdown>
        </div>
    );

    const handleLogout = () => {
        Swal.fire({
            title: "ยืนยันการออกจากระบบ",
            text: "คุณต้องการออกจากระบบใช่หรือไม่?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0891b2",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ออกจากระบบ",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route("logout"), {}, {
                    onSuccess: () => {
                        Swal.fire({
                            title: "ออกจากระบบสำเร็จ",
                            text: "กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        }).then(() => {
                            window.location.href = route("login");
                        });
                    },
                });
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-md">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex items-center transition-transform shrink-0 hover:scale-105">
                                <Link href="/" className="flex items-center space-x-2">
                                    <ApplicationLogo className="block w-auto h-10 fill-current text-primary-600" />
                                    <span className="hidden text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r via-purple-500 md:block from-primary-600 to-primary-600 animate-gradient">
                                        CoolCup
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:flex sm:items-center sm:ms-10">
                                {/* Dashboard (Admin & Manager) */}
                                {hasPermissions(['view dashboard'], permissions) && (
                                    <NavLink
                                        href={route("dashboard")}
                                        active={route().current("dashboard")}
                                        className="flex items-center space-x-1 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-primary-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span>หน้าหลัก</span>
                                    </NavLink>
                                )}

                                {/* จัดการระบบ (Admin Only) */}
                                {hasRoles(['admin'], roles) && (
                                    <Dropdown
                                        label={
                                            <div className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>จัดการระบบ</span>
                                            </div>
                                        }
                                        inline
                                        className="mt-2 bg-white rounded-xl border border-gray-100 shadow-lg"
                                    >
                                        <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                            <Link href="/admin/settings" className="flex items-center space-x-2 w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>ตั้งค่าระบบ</span>
                                            </Link>
                                        </Dropdown.Item>
                                    </Dropdown>
                                )}

                                {/* จัดการวัตถุดิบและของสิ้นเปลือง (Admin & Manager) */}

                                <Dropdown
                                    label={
                                        <div className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>จัดการวัตถุดิบและของสิ้นเปลือง</span>
                                        </div>
                                    }
                                    inline
                                    className="mt-2 bg-white rounded-xl border border-gray-100 shadow-lg"
                                >
                                    {hasPermissions(['manage inventory'], permissions) && (
                                        <>
                                            <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                                <Link href="/admin/ingredients" className="flex items-center space-x-2 w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                    </svg>
                                                    <span>วัตถุดิบ</span>
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                                <Link href="/admin/consumables" className="flex items-center space-x-2 w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span>วัตถุดิบสิ้นเปลือง</span>
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                                <Link href="/admin/transformers" className="flex items-center space-x-2 w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span>ตัวแปรรูปปริมาณวัตถุดิบ</span>
                                                </Link>
                                            </Dropdown.Item>

                                            <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                                <Link href="/admin/ingredient-lots" className="flex items-center space-x-2 w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    <span>เพิ่ม Lot วัตถุดิบ</span>
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                                <Link href="/admin/consumables/lots" className="flex items-center space-x-2 w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    <span>เพิ่ม Lot วัตถุดิบสิ้นเปลือง</span>
                                                </Link>
                                            </Dropdown.Item>

                                        </>
                                    )}
                                    <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                        <Link href="/admin/transactions" className="flex items-center space-x-2 w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span>ประวัติการเคลื่อนไหวของวัตถุดิบ</span>
                                        </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                        <Link href="/admin/withdraw" className="flex items-center space-x-2 w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <span>เบิกวัตถุดิบ/วัตถุดิบสิ้นเปลือง</span>
                                        </Link>
                                    </Dropdown.Item>

                                </Dropdown>

                                {/* จัดการทั่วไป (ตาม Permission) */}
                                <Dropdown
                                    label={
                                        <div className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>จัดการทั่วไป</span>
                                        </div>
                                    }
                                    inline
                                    className="mt-2 bg-white rounded-xl border border-gray-100 shadow-lg"
                                >
                                    {hasPermissions(['manage users'], permissions) && (
                                        <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                            <Link href="/admin/users" className="flex items-center space-x-2 w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M7 20H6v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span>ผู้ใช้งาน</span>
                                            </Link>
                                        </Dropdown.Item>
                                    )}
                                    {hasPermissions(['manage categories'], permissions) && (
                                        <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                            <Link href="/admin/categories" className="flex items-center space-x-2 w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                <span>หมวดหมู่</span>
                                            </Link>
                                        </Dropdown.Item>
                                    )}
                                    {hasPermissions(['manage inventory'], permissions) && (
                                        <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                            <Link href="/admin/expense-categories" className="flex items-center space-x-2 w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <span>หมวดหมู่รายจ่าย</span>
                                            </Link>
                                        </Dropdown.Item>
                                    )}
                                    {hasPermissions(['manage inventory'], permissions) && (
                                        <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                            <Link href="/admin/expenses" className="flex items-center space-x-2 w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span>รายจ่าย</span>
                                            </Link>
                                        </Dropdown.Item>
                                    )}
                                    {hasPermissions(['manage products'], permissions) && (
                                        <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                            <Link href="/admin/products" className="flex items-center space-x-2 w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H5z" />
                                                </svg>
                                                <span>สินค้า</span>
                                            </Link>
                                        </Dropdown.Item>
                                    )}
                                    {hasPermissions(['manage inventory'], permissions) && (
                                        <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                            <Link href="/admin/customers" className="flex items-center space-x-2 w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                                <span>สมาชิก</span>
                                            </Link>
                                        </Dropdown.Item>
                                    )}
                                    {hasPermissions(['manage products'], permissions) && (
                                        <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                            <Link href="/admin/promotions" className="flex items-center space-x-2 w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>โปรโมชั่น</span>
                                            </Link>
                                        </Dropdown.Item>
                                    )}
                                    {/* Role 4 (All) */}
                                    <Dropdown.Item className="rounded-lg transition-colors duration-150 hover:bg-gray-50">
                                        <Link href="/receipt-history" className="flex items-center space-x-2 w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                            </svg>
                                            <span>ประวัติใบเสร็จ</span>
                                        </Link>
                                    </Dropdown.Item>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="hidden gap-x-4 space-x-4 sm:flex sm:items-center sm:ms-6">
                            {/* Notifications (Admin & Manager) */}
                            {hasPermissions(['view dashboard'], permissions) && renderNotificationDropdown()}

                            {/* Profile Dropdown */}
                            <Dropdown
                                label={
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <Avatar
                                                img={user?.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=6366f1&color=fff`}
                                                rounded
                                                bordered
                                                className="!w-10 !h-10"
                                            />
                                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></div>
                                        </div>
                                        <div className="hidden text-left md:block">
                                            <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                                            <div className="text-xs text-gray-500">{time}</div>
                                        </div>
                                    </div>
                                }
                                inline
                                className="w-56"
                            >
                                <div className="px-1 py-1">
                                    <Dropdown.Item className="rounded-lg">
                                        <Link href="/profile" className="flex items-center space-x-2 w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>โปรไฟล์</span>
                                        </Link>
                                    </Dropdown.Item>
                                    {/* Settings (Admin Only) */}
                                    {hasPermissions(['manage settings'], permissions) && (
                                        <Dropdown.Item className="rounded-lg">
                                            <Link href="/admin/settings" className="flex items-center space-x-2 w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>ตั้งค่า</span>
                                            </Link>
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Divider />
                                    <Dropdown.Item
                                        className="text-red-600 rounded-lg hover:text-red-700 hover:bg-red-50"
                                        onClick={handleLogout}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            <span>ออกจากระบบ</span>
                                        </div>
                                    </Dropdown.Item>
                                </div>
                            </Dropdown>
                        </div>

                        <div className="flex items-center -me-2 sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex justify-center items-center p-2 text-gray-400 rounded-lg transition duration-150 ease-in-out hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? "inline-flex" : "hidden"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? "inline-flex" : "hidden"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? "block" : "hidden") + " sm:hidden fixed inset-x-0 top-[65px] bottom-0 bg-white overflow-y-auto"}>
                    <div className="pb-3">
                        {/* Dashboard */}
                        {hasPermissions(['view dashboard'], permissions) && (
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                                className="flex items-center space-x-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>หน้าหลัก</span>
                            </ResponsiveNavLink>
                        )}

                        {/* จัดการระบบ (Admin Only) */}
                        {hasRoles(['admin'], roles) && (
                            <>
                                <div className="px-4 py-2 text-xs text-gray-500">จัดการระบบ</div>
                                <ResponsiveNavLink href="/admin/settings" className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>ตั้งค่าระบบ</span>
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* จัดการวัตถุดิบและของสิ้นเปลือง */}
                        {hasPermissions(['manage inventory'], permissions) && (
                            <>
                                <div className="px-4 py-2 text-xs text-gray-500">จัดการวัตถุดิบและของสิ้นเปลือง</div>
                                <ResponsiveNavLink href="/admin/ingredients" className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    <span>วัตถุดิบ</span>
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="/admin/consumables" className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>วัตถุดิบสิ้นเปลือง</span>
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="/admin/transformers" className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>ตัวแปรรูปปริมาณวัตถุดิบ</span>
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="/admin/ingredient-lots" className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span>ล็อตวัตถุดิบ</span>
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* จัดการสินค้า */}
                        {hasPermissions(['manage products'], permissions) && (
                            <>
                                <div className="px-4 py-2 text-xs text-gray-500">จัดการสินค้า</div>
                                <ResponsiveNavLink href="/admin/products" className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H5z" />
                                    </svg>
                                    <span>สินค้า</span>
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="/admin/categories" className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span>หมวดหมู่</span>
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="/admin/promotions" className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>โปรโมชั่น</span>
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* ประวัติใบเสร็จ */}
                        <div className="px-4 py-2 text-xs text-gray-500">ประวัติ</div>
                        <ResponsiveNavLink href="/receipt-history" className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <span>ประวัติใบเสร็จ</span>
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center px-4 space-x-3">
                            <div className="relative">
                                <img
                                    className="object-cover w-10 h-10 rounded-full ring-2 ring-offset-2 ring-primary-500"
                                    src={user?.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=6366f1&color=fff`}
                                    alt={user?.name}
                                />
                                <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                                <div className="text-sm text-primary-600">{time}</div>
                            </div>
                        </div>

                        <div className="px-2 mt-3 space-y-1">
                            {hasPermissions(['view dashboard'], permissions) && (
                                <ResponsiveNavLink href="/notifications" className="flex justify-between items-center space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        <span>การแจ้งเตือน</span>
                                    </div>
                                    {unreadNotifications > 0 && (
                                        <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">{unreadNotifications}</span>
                                    )}
                                </ResponsiveNavLink>
                            )}
                            <ResponsiveNavLink href={route("profile.edit")} className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>โปรไฟล์</span>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                as="button"
                                onClick={handleLogout}
                                className="flex items-center space-x-2 w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>ออกจากระบบ</span>
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main className="py-6">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}
