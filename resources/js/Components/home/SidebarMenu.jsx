import { Link } from "lucide-react";
import React from "react";
import { MdApps } from "react-icons/md";
import Swal from "sweetalert2";

export default function SidebarMenu() {
    return (
        <div className="flex flex-col justify-between w-[150px] h-screen min-h-screen bg-gray-100 border border-gray-300 px-2">
            <div>
                <div className="flex justify-center items-center h-24">
                    <MdApps className="text-4xl" />
                </div>
                <a
                    href="/"
                    className="flex justify-center py-2 w-full border border-r-0 border-l-0 border-gray-500 hover:bg-gray-200"
                >
                    เมนู
                </a>
                <ul className="flex flex-col gap-5 justify-center items-center py-5">
                    <li>Dashboard</li>
                    <li>โปรโมชั่น</li>
                    <li>ประวัติใบเสร็จ</li>
                    <li>รายงาน</li>
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
                                className="text-base font-semibold"
                            >
                                สมาชิก
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
                                className="text-base font-semibold"
                            >
                                สมัครสมาชิก
                            </button>
                        </a>
                    </li>
                    <li>แมนนวล</li>
                    <li>
                        <button
                            type="button"
                            className="text-red-500 w-full"
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
                            ออกจากระบบ
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
