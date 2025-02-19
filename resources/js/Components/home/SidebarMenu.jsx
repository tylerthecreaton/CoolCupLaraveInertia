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
import { TbSlideshow } from "react-icons/tb";

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
                // Show loading state
                Swal.fire({
                    title: "กำลังออกจากระบบ",
                    text: "กรุณารอสักครู่...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                // Clear sidebar state and logout
                localStorage.removeItem("sidebarOpen");
                router.post(
                    route("logout"),
                    {},
                    {
                        onSuccess: () => {
                            Swal.fire({
                                title: "ออกจากระบบสำเร็จ",
                                text: "ขอบคุณที่ใช้บริการ",
                                icon: "success",
                                timer: 1500,
                                showConfirmButton: false,
                            }).then(() => {
                                window.location.href = route("login");
                            });
                        },
                    }
                );
            }
        });
    };

    const MenuText = ({ children }) => (
        <span
            className={`ml-3 whitespace-nowrap transition-all duration-300 ${isOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
        >
            {children}
        </span>
    );

    return (
        <div
            className={`flex flex-col justify-between ${isOpen ? "w-[240px]" : "w-[80px]"
                } h-screen min-h-screen bg-white shadow-lg transition-all duration-500 ease-in-out overflow-hidden`}
        >
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600"></div>

            <div>
                <div className="flex justify-center items-center h-20 bg-gradient-to-r from-cyan-600 to-cyan-700 relative overflow-hidden">
                    {/* Animated background effect */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:200%_200%] animate-shimmer"></div>
                    </div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110 active:scale-95"
                    >
                        <MdMenu
                            className={`text-3xl text-white transition-transform duration-500 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"}`}
                        />
                    </button>
                </div>

                <ul className="flex flex-col gap-1 py-4 px-2">
                    <li>
                        <Link
                            href="/"
                            className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:bg-cyan-50 text-gray-700 hover:text-cyan-600 group"
                        >
                            <MdApps className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${!isOpen && 'mx-auto'}`} />
                            {isOpen && <MenuText>หน้าขาย</MenuText>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("sale.dashboard")}
                            className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:bg-cyan-50 text-gray-700 hover:text-cyan-600 group"
                        >
                            <MdDashboard className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${!isOpen && 'mx-auto'}`} />
                            {isOpen && <MenuText>แดชบอร์ด</MenuText>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("promotion.index")}
                            className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:bg-cyan-50 text-gray-700 hover:text-cyan-600 group"
                        >
                            <MdLocalOffer className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${!isOpen && 'mx-auto'}`} />
                            {isOpen && <MenuText>โปรโมชั่น</MenuText>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/receipt-history"
                            className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:bg-cyan-50 text-gray-700 hover:text-cyan-600 group"
                        >
                            <MdHistory className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${!isOpen && 'mx-auto'}`} />
                            {isOpen && <MenuText>ประวัติใบเสร็จ</MenuText>}
                        </Link>
                    </li>
                </ul>
            </div>
            <div>
                <ul className="flex flex-col gap-1 py-4 px-2">
                    <li>
                        <Link
                            href="/client"
                            className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:bg-cyan-50 text-gray-700 hover:text-cyan-600 group"
                        >
                            <TbSlideshow className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${!isOpen && 'mx-auto'}`} />
                            {isOpen && <MenuText>Carousal</MenuText>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/member"
                            className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:bg-cyan-50 text-gray-700 hover:text-cyan-600 group"
                        >
                            <MdPerson className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${!isOpen && 'mx-auto'}`} />
                            {isOpen && <MenuText>สมาชิก</MenuText>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/registermember"
                            className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:bg-cyan-50 text-gray-700 hover:text-cyan-600 group"
                        >
                            <MdPersonAdd className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${!isOpen && 'mx-auto'}`} />
                            {isOpen && <MenuText>สมัครสมาชิก</MenuText>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:bg-cyan-50 text-gray-700 hover:text-cyan-600 group"
                        >
                            <MdBook className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${!isOpen && 'mx-auto'}`} />
                            {isOpen && <MenuText>แมนนวล</MenuText>}
                        </Link>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 hover:bg-red-50 text-gray-700 hover:text-red-600 group"
                        >
                            <MdExitToApp className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${!isOpen && 'mx-auto'}`} />
                            {isOpen && <MenuText>ออกจากระบบ</MenuText>}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

const style = document.createElement('style');
style.textContent = `
@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
.animate-shimmer {
    animation: shimmer 3s linear infinite;
}
`;
document.head.appendChild(style);
