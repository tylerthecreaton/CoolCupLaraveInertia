import { can, hasPermissions, hasRole, hasRoles } from "@/helpers";
import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    Breadcrumb,
    Pagination,
    Table,
    TextInput,
    Button,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome, HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import Swal from "sweetalert2";

export default function index({ usersPaginate }) {
    const { roles, permissions } = usePage().props.auth;
    const { current_page, next_page_url, prev_page_url } = usersPaginate;
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const onPageChange = (page) => {
        page > current_page
            ? router.get(next_page_url)
            : router.get(prev_page_url);
    };

    useEffect(() => {
        setUsers(usersPaginate.data);
        setFilteredUsers(usersPaginate.data);
    }, [usersPaginate]);

    useEffect(() => {
        const results = users.filter((user) =>
            Object.values(user).some((value) =>
                value
                    ?.toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณไม่สามารถย้อนกลับการกระทำนี้ได้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.users.destroy", id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "ผู้ใช้ถูกลบเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการผู้ใช้
                </h2>
            }
        >
            <Head title="จัดการผู้ใช้" />

            <AdminLayout className="container p-8 mx-auto mt-5 bg-white rounded-lg shadow-sm">
                <div className="space-y-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-between">
                        <Breadcrumb
                            aria-label="Breadcrumb navigation"
                            className="py-2"
                        >
                            <Breadcrumb.Item
                                href={route("dashboard")}
                                icon={HiHome}
                            >
                                หน้าแรก
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>ผู้ใช้งานทั้งหมด</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    {/* Search and Add User */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={HiSearch}
                                placeholder="ค้นหาผู้ใช้..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <Link
                            href={route("admin.users.create")}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:scale-105"
                        >
                            <HiPlus className="w-5 h-5 mr-2" />
                            เพิ่มผู้ใช้
                        </Link>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ลําดับ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ชื่อ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ชื่อผู้ใช้
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    อีเมล
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    บทบาท
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    <span className="sr-only">Actions</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y divide-gray-200">
                                {filteredUsers.map((user, index) => (
                                    <Table.Row
                                        key={user.id}
                                        className="bg-white transition-colors duration-150 hover:bg-gray-50/60"
                                    >
                                        <Table.Cell className="px-6 py-4 font-medium text-gray-900">
                                            {(current_page - 1) *
                                                usersPaginate.per_page +
                                                index +
                                                1}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex-shrink-0 w-10 h-10">
                                                    {user.image ? (
                                                        <img
                                                            src={`/images/users/${user.image}`}
                                                            alt={user.name}
                                                            className="object-cover w-full h-full rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-white bg-primary-600 rounded-full">
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 text-gray-600">
                                            {user.username}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 text-gray-600">
                                            {user.email}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${user.role === "admin"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : user.role ===
                                                            "manager"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {user.role === "admin"
                                                    ? "ผู้ดูแลระบบ"
                                                    : user.role === "manager"
                                                        ? "ผู้จัดการ"
                                                        : "พนักงาน"}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route(
                                                        "admin.users.edit",
                                                        user.id
                                                    )}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors duration-150"
                                                >
                                                    <HiPencil className="w-4 h-4 mr-1.5" />
                                                    แก้ไข
                                                </Link>
                                                {hasRoles(['admin'], roles) &&
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(user.id)
                                                        }
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150"
                                                    >
                                                        <HiTrash className="w-4 h-4 mr-1.5" />
                                                        ลบ
                                                    </button>

                                                }
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell
                                            colSpan={6}
                                            className="px-6 py-8 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-12 h-12 mb-4 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                <p className="text-lg font-medium">
                                                    ไม่พบข้อมูลผู้ใช้
                                                </p>
                                                <p className="mt-1 text-sm">
                                                    ลองค้นหาด้วยคำค้นอื่น
                                                    หรือล้างตัวกรอง
                                                </p>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-700">
                            แสดง{" "}
                            <span className="font-medium text-gray-900">
                                {usersPaginate.from}
                            </span>{" "}
                            ถึง{" "}
                            <span className="font-medium text-gray-900">
                                {usersPaginate.to}
                            </span>{" "}
                            จาก{" "}
                            <span className="font-medium text-gray-900">
                                {usersPaginate.total}
                            </span>{" "}
                            รายการ
                        </div>
                        <div className="flex justify-center">
                            <Pagination
                                currentPage={current_page}
                                onPageChange={onPageChange}
                                showIcons={true}
                                totalPages={Math.ceil(
                                    usersPaginate.total / usersPaginate.per_page
                                )}
                            />
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
