import { Link } from "lucide-react";
import React, { useState } from "react";
import { MdApps, MdDashboard, MdLocalOffer, MdHistory, MdAssessment, MdPerson, MdPersonAdd, MdBook, MdExitToApp, MdMenu, MdPointOfSale } from "react-icons/md";
import Swal from "sweetalert2";

export default function SidebarMenu() {
    const [isOpen, setIsOpen] = useState(true);

    const MenuText = ({ children }) => (
        <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {children}
        </span>
    );

    return (
        <div className={`flex flex-col justify-between ${isOpen ? 'w-[150px]' : 'w-[100px]'} h-screen min-h-screen bg-gray-100 border border-gray-300 px-2 transition-all duration-300 overflow-hidden`}>
            <div>
                <div className="flex justify-center items-center h-24">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-full hover:bg-gray-200"
                    >
                        <MdMenu className={`text-4xl transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
                    </button>
                </div>
                <a
                    href="/"
                    className="flex justify-center py-2 w-full border border-r-0 border-l-0 border-gray-500 hover:bg-gray-200"
                >
                    {isOpen ? <MenuText>เมนู</MenuText> : <MdPointOfSale className="text-2xl" />}
                </a>
                <ul className="flex flex-col gap-5 justify-center items-center py-5">
                    <li className="flex items-center">
                        {isOpen ? <MenuText>Dashboard</MenuText> : <MdDashboard className="text-2xl" />}
                    </li>
                    <li className="flex items-center">
                        {isOpen ? <MenuText>โปรโมชั่น</MenuText> : <MdLocalOffer className="text-2xl" />}
                    </li>
                    <li className="flex items-center">
                        {isOpen ? <MenuText>ประวัติใบเสร็จ</MenuText> : <MdHistory className="text-2xl" />}
                    </li>
                    <li className="flex items-center">
                        {isOpen ? <MenuText>รายงาน</MenuText> : <MdAssessment className="text-2xl" />}
                    </li>
                </ul>
            </div>
            <div>
                <ul className="flex flex-col gap-5 justify-center items-center py-5">
                    <li>
                        <a
                            href="member"
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <button
                                type="button"
                                className="text-base font-semibold flex items-center"
                            >
                                {isOpen ? <MenuText>สมาชิก</MenuText> : <MdPerson className="text-2xl" />}
                            </button>
                        </a>
                    </li>
                    <li>
                        <a
                            href="registermember"
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <button
                                type="button"
                                className="text-base font-semibold flex items-center"
                            >
                                {isOpen ? <MenuText>สมัครสมาชิก</MenuText> : <MdPersonAdd className="text-2xl" />}
                            </button>
                        </a>
                    </li>
                    <li className="flex items-center">
                        {isOpen ? <MenuText>แมนนวล</MenuText> : <MdBook className="text-2xl" />}
                    </li>
                    <li>
                        <button
                            type="button"
                            className="text-red-500 w-full flex items-center justify-center"
                            onClick={() => {
                                Swal.fire({
                                    title: "ออกจากระบบ?",
                                    text: "คุณต้องการออกจากระบบใช่หรือไม่?",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "ใช่",
                                    cancelButtonText: "ไม่",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        window.location.href = "/logout";
                                    }
                                });
                            }}
                        >
                            {isOpen ? <MenuText>ออกจากระบบ</MenuText> : <MdExitToApp className="text-2xl" />}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
