import React, { useState, useEffect } from "react";
import {
    MdApps,
    MdDashboard,
    MdLocalOffer,
    MdHistory,
    MdAssessment,
    MdPerson,
    MdPersonAdd,
    MdBook,
    MdExitToApp,
    MdMenu,
    MdPointOfSale,
} from "react-icons/md";
import Swal from "sweetalert2";
import { Link, router } from "@inertiajs/react";

export default function SidebarMenu() {
    const [isOpen, setIsOpen] = useState(() => {
        // Check if we're on a different page (not home)
        const isHomePage = window.location.pathname === "/";
        // Get stored state or default to false if not home page
        const stored = localStorage.getItem("sidebarOpen");
        return stored ? JSON.parse(stored) : isHomePage;
    });

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
    }, [isOpen]);

    const handleLogout = () => {
        Swal.fire({
            title: 'ยืนยันการออกจากระบบ',
            text: 'คุณต้องการออกจากระบบใช่หรือไม่?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0891b2',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ออกจากระบบ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                // Show loading state
                Swal.fire({
                    title: 'กำลังออกจากระบบ',
                    text: 'กรุณารอสักครู่...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Clear sidebar state and logout
                localStorage.removeItem("sidebarOpen");
                router.post(route('logout'), {}, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'ออกจากระบบสำเร็จ',
                            text: 'ขอบคุณที่ใช้บริการ',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {
                            window.location.href = route('login');
                        });
                    }
                });
            }
        });
    };

    const MenuText = ({ children }) => (
        <span
            className={`whitespace-nowrap transition-all duration-300 ${
                isOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
            }`}
        >
            {children}
        </span>
    );

    return (
        <div
            className={`flex flex-col justify-between ${
                isOpen ? "w-[180px]" : "w-[100px]"
            } h-screen min-h-screen bg-gray-100 border border-gray-300 px-2 transition-all duration-300 overflow-hidden`}
        >
            <div>
                <div className="flex justify-center items-center h-24">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-full hover:bg-gray-200"
                    >
                        <MdMenu
                            className={`text-4xl transition-transform duration-300 ${
                                isOpen ? "" : "rotate-180"
                            }`}
                        />
                    </button>
                </div>
                <Link
                    href="/"
                    className="flex justify-center py-2 w-full border border-r-0 border-l-0 border-gray-500 hover:bg-gray-200"
                >
                    {isOpen ? (
                        <MenuText>หน้าหลัก</MenuText>
                    ) : (
                        <MdApps className="text-2xl" />
                    )}
                </Link>

                <ul className="flex flex-col gap-5 justify-center items-center py-5">
                    <li className="flex items-center">
                        {isOpen ? (
                            <MenuText>Dashboard</MenuText>
                        ) : (
                            <MdDashboard className="text-2xl" />
                        )}
                    </li>
                    <li className="flex items-center">
                        {isOpen ? (
                            <MenuText>โปรโมชั่น</MenuText>
                        ) : (
                            <MdLocalOffer className="text-2xl" />
                        )}
                    </li>
                    <li className="flex items-center">
                        {isOpen ? (
                            <MenuText>ประวัติใบเสร็จ</MenuText>
                        ) : (
                            <MdHistory className="text-2xl" />
                        )}
                    </li>
                    <li className="flex items-center">
                        {isOpen ? (
                            <MenuText>รายงาน</MenuText>
                        ) : (
                            <MdAssessment className="text-2xl" />
                        )}
                    </li>
                </ul>
            </div>
            <div>
                <ul className="flex flex-col gap-5 justify-center items-center py-5">
                    <li>
                        <Link
                            href="/member"
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <span className="text-base font-semibold flex items-center">
                                {isOpen ? (
                                    <MenuText>สมาชิก</MenuText>
                                ) : (
                                    <MdPerson className="text-2xl" />
                                )}
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/registermember"
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <span className="text-base font-semibold flex items-center">
                                {isOpen ? (
                                    <MenuText>สมัครสมาชิก</MenuText>
                                ) : (
                                    <MdPersonAdd className="text-2xl" />
                                )}
                            </span>
                        </Link>
                    </li>
                    <li className="flex items-center">
                        {isOpen ? (
                            <MenuText>แมนนวล</MenuText>
                        ) : (
                            <MdBook className="text-2xl" />
                        )}
                    </li>
                    <li>
                        <button
                            type="button"
                            className="text-red-500 w-full flex items-center justify-center"
                            onClick={handleLogout}
                        >
                            {isOpen ? (
                                <MenuText>ออกจากระบบ</MenuText>
                            ) : (
                                <MdExitToApp className="text-2xl hover:scale-110 transition-transform" />
                            )}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
