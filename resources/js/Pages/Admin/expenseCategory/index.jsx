import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Button, Card, Table, Tooltip } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { FaList, FaPlus, FaEdit, FaTrash, FaSearch, FaTags } from "react-icons/fa";
import Swal from "sweetalert2";
import { useState } from "react";
import { router } from "@inertiajs/react";

export default function Index({ categories }) {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(
            route("admin.expense-categories.index"),
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

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
                router.delete(route("admin.expense-categories.destroy", id), {
                    preserveState: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "หมวดหมู่ถูกลบเรียบร้อยแล้ว",
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
                    จัดการหมวดหมู่ค่าใช้จ่าย
                </h2>
            }
        >
            <Head title="จัดการหมวดหมู่ค่าใช้จ่าย" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <div className="mb-6">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href={route("admin.expense-categories.index")}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หมวดหมู่ค่าใช้จ่าย</p>
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
                                <h2 className="text-xl font-bold text-gray-900">รายการหมวดหมู่ค่าใช้จ่าย</h2>
                                <p className="text-sm text-gray-500">จัดการข้อมูลหมวดหมู่ค่าใช้จ่ายทั้งหมด</p>
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
                                    placeholder="ค้นหาหมวดหมู่..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                            <Link href={route("admin.expense-categories.create")}>
                                <Button gradientDuoTone="greenToBlue" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200">
                                    <FaPlus className="mr-2 w-4 h-4" />
                                    เพิ่มหมวดหมู่
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable className="shadow-sm">
                            <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <Table.HeadCell className="font-semibold text-gray-700 w-16">รหัส</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">ชื่อหมวดหมู่</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 w-32 text-right">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {categories.data.map((category) => (
                                    <Table.Row
                                        key={category.id}
                                        className="bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <Table.Cell className="font-medium text-gray-900 whitespace-nowrap">
                                            #{category.id}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Tooltip
                                                content={
                                                    <div className="p-2 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <FaTags className="w-4 h-4 text-blue-400" />
                                                                <span className="font-medium">{category.name}</span>
                                                            </div>
                                                            <div className="text-sm">
                                                                <p className="text-gray-500">รหัส: #{category.id}</p>
                                                                <p className="text-gray-500">จำนวนรายการ: {category.expenses_count || 0}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="font-medium text-gray-900 cursor-pointer">
                                                    {category.name}
                                                </div>
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={route("admin.expense-categories.edit", category.id)}>
                                                    <Button size="xs" color="info" className="gap-1">
                                                        <FaEdit className="w-4 h-4" />
                                                        แก้ไข
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="xs"
                                                    color="failure"
                                                    onClick={() => handleDelete(category.id)}
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

                    {categories.total > categories.per_page && (
                        <div className="flex items-center justify-center mt-4">
                            <Button.Group>
                                {categories.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        disabled={!link.url || link.active}
                                        onClick={() => router.get(link.url)}
                                        color={link.active ? "blue" : "gray"}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                                    </Button>
                                ))}
                            </Button.Group>
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
