import { can, hasPermissions, hasRole, hasRoles } from "@/helpers";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    Breadcrumb,
    Button,
    Card,
    Table,
    Tooltip,
    Pagination,
} from "flowbite-react";
import { useState } from "react";
import { HiHome } from "react-icons/hi";
import { FaList, FaPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaUserTag, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Index({ usersPaginate }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(
            route("admin.users.index"),
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id, role) => {
        // Check if trying to delete an admin user while not being an admin
        if (role === 'admin' && auth.user.role !== 'admin') {
            Swal.fire({
                title: 'ไม่สามารถลบได้',
                text: 'คุณไม่มีสิทธิ์ในการลบข้อมูลของ Admin',
                icon: 'warning',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

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
                    preserveState: true,
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

    const { current_page, next_page_url, prev_page_url } = usersPaginate;

    const onPageChange = (page) => {
        page > current_page
            ? router.get(next_page_url)
            : router.get(prev_page_url);
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
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <div className="mb-6">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href={route("admin.users.index")}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">ผู้ใช้</p>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Card className="shadow-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                                <FaList className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">รายการผู้ใช้</h2>
                                <p className="text-sm text-gray-500">จัดการข้อมูลผู้ใช้ทั้งหมด</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
                                    placeholder="ค้นหาผู้ใช้..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                            <Link href={route("admin.users.create")}>
                                <Button gradientDuoTone="greenToBlue" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200">
                                    <FaPlus className="mr-2 w-4 h-4" />
                                    เพิ่มผู้ใช้
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg shadow-sm">
                        <Table hoverable>
                            <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <Table.HeadCell className="font-semibold text-gray-700 w-16">รหัส</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">ชื่อ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">ชื่อผู้ใช้</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">อีเมล</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 w-32">บทบาท</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 w-32 text-right">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {usersPaginate.data.map((user) => (
                                    <Table.Row
                                        key={user.id}
                                        className="bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <Table.Cell className="font-medium text-gray-900 whitespace-nowrap">
                                            #{user.id}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Tooltip
                                                content={
                                                    <div className="p-2 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <FaUser className="w-4 h-4 text-blue-400" />
                                                                <span className="font-medium">{user.name}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <div>
                                                                    <p className="text-gray-500">อีเมล:</p>
                                                                    <p className="font-medium">{user.email}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500">บทบาท:</p>
                                                                    <p className="font-medium">{user.role}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="flex items-center gap-3 cursor-pointer">
                                                    <div className="relative flex-shrink-0 w-10 h-10">
                                                        {user.image ? (
                                                            <img
                                                                src={`/images/users/${user.image}`}
                                                                alt={user.name}
                                                                className="object-cover w-full h-full rounded-full"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full text-white bg-blue-600 rounded-full">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell className="text-gray-600">
                                            {user.username}
                                        </Table.Cell>
                                        <Table.Cell className="text-gray-600">
                                            {user.email}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${user.role === "admin" ? "bg-purple-100 text-purple-800" :
                                                  user.role === "manager" ? "bg-blue-100 text-blue-800" :
                                                  "bg-green-100 text-green-800"}`}>
                                                {user.role}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="xs"
                                                    color="info"
                                                    className="gap-1"
                                                    onClick={() => {
                                                        if (user.role === 'admin' && auth.user.role !== 'admin') {
                                                            Swal.fire({
                                                                title: 'ไม่สามารถแก้ไขได้',
                                                                text: 'คุณไม่มีสิทธิ์ในการแก้ไขข้อมูลของ Admin',
                                                                icon: 'warning',
                                                                confirmButtonText: 'ตกลง',
                                                                confirmButtonColor: '#3085d6',
                                                            });
                                                            return;
                                                        }
                                                        router.get(route("admin.users.edit", user.id));
                                                    }}
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                    แก้ไข
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    color="failure"
                                                    onClick={() => handleDelete(user.id, user.role)}
                                                    className="gap-1"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                    ลบ
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row bg-gray-0 rounded-lg">
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
                                    usersPaginate.total /
                                        usersPaginate.per_page
                                )}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
