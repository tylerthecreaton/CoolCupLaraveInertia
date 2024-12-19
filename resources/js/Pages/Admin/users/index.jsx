import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Breadcrumb, Pagination, Table, TextInput, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome, HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import Swal from "sweetalert2";

export default function index({ usersPaginate }) {
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
        const results = users.filter(user =>
            Object.values(user).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
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
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.users.destroy", id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "ผู้ใช้ถูกลบเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false
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
                    <Breadcrumb aria-label="Breadcrumb navigation">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            หน้าแรก
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>ผู้ใช้งานทั้งหมด</Breadcrumb.Item>
                    </Breadcrumb>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={HiSearch}
                                placeholder="ค้นหาผู้ใช้..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link
                            href={route("admin.users.create")}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        >
                            <HiPlus className="w-5 h-5 mr-2" />
                            เพิ่มผู้ใช้
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="px-6 py-3">ลําดับ</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">ชื่อ</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">ชื่อผู้ใช้</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">อีเมล</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">บทบาท</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {filteredUsers.map((user) => (
                                    <Table.Row
                                        className="bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                                        key={user.id}
                                    >
                                        <Table.Cell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {(current_page - 1) * usersPaginate.per_page + filteredUsers.indexOf(user) + 1}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">{user.name}</Table.Cell>
                                        <Table.Cell className="px-6 py-4">{user.username}</Table.Cell>
                                        <Table.Cell className="px-6 py-4">{user.email}</Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={route("admin.users.edit", user.id)}
                                                    className="inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700"
                                                >
                                                    <HiPencil className="w-4 h-4 mr-1" />
                                                    แก้ไข
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700"
                                                >
                                                    <HiTrash className="w-4 h-4 mr-1" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            ไม่พบข้อมูลผู้ใช้
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row">
                        <div className="text-sm text-gray-700 dark:text-gray-400">
                            แสดง <span className="font-semibold text-gray-900">{usersPaginate.from}</span> ถึง{" "}
                            <span className="font-semibold text-gray-900">{usersPaginate.to}</span> จาก{" "}
                            <span className="font-semibold text-gray-900">{usersPaginate.total}</span> รายการ
                        </div>
                        <Pagination
                            currentPage={current_page}
                            totalPages={usersPaginate.last_page}
                            onPageChange={onPageChange}
                            showIcons
                            className="inline-flex mt-2 sm:mt-0"
                        />
                    </div>
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
