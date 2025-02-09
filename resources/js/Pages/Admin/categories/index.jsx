import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Button, Pagination, Table, Card, Tooltip } from "flowbite-react";
import { FaList, FaPlus, FaEdit, FaTrash, FaFolder, FaInfoCircle, FaSearch } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { useState } from "react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function index({ categoriesPaginate }) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(
            route("admin.categories.index"),
            { search: e.target.value, page: currentPage },
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
                router.delete(route("admin.categories.destroy", id), {
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

    const { current_page, next_page_url, prev_page_url } = categoriesPaginate;

    const onPageChange = (page) => {
        setCurrentPage(page);
        router.get(
            route("admin.categories.index"),
            { search, page },
            {
                preserveState: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการหมวดหมู่
                </h2>
            }
        >
            <Head title="จัดการหมวดหมู่" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <div className="mb-6">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href={route("admin.categories.index")}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หมวดหมู่</p>
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
                                <h2 className="text-xl font-bold text-gray-900">รายการหมวดหมู่</h2>
                                <p className="text-sm text-gray-500">จัดการข้อมูลหมวดหมู่ทั้งหมด</p>
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
                            <Link href={route("admin.categories.create")}>
                                <Button gradientDuoTone="greenToBlue" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200">
                                    <FaPlus className="mr-2 w-4 h-4" />
                                    เพิ่มหมวดหมู่
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg shadow-sm">
                        <Table hoverable>
                            <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <Table.HeadCell className="font-semibold text-gray-900">ลำดับ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-900">ชื่อหมวดหมู่</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-900">คำอธิบาย</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-900 w-32 text-right">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {categoriesPaginate.data.map((category, index) => (
                                    <Table.Row
                                        key={category.id}
                                        className="bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <Table.Cell className="font-medium text-gray-900">
                                            {(current_page - 1) * categoriesPaginate.per_page + index + 1}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Tooltip
                                                content={
                                                    <div className="p-2 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <FaFolder className="w-4 h-4 text-blue-400" />
                                                                <span className="font-medium">{category.name}</span>
                                                            </div>
                                                            <div className="text-sm">
                                                                <p className="text-gray-500">คำอธิบาย:</p>
                                                                <p className="font-medium">{category.description || 'ไม่มีคำอธิบาย'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="flex items-center gap-2 cursor-pointer">
                                                    <FaFolder className="w-4 h-4 text-blue-500" />
                                                    <span className="font-medium text-gray-900">{category.name}</span>
                                                </div>
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="text-gray-600 line-clamp-2">{category.description || '-'}</div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={route("admin.categories.edit", category.id)}>
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
                                {categoriesPaginate.data.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={4} className="text-center py-10">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <FaInfoCircle className="w-12 h-12 mb-4 text-gray-400" />
                                                <p className="text-lg font-medium">ไม่พบข้อมูลหมวดหมู่</p>
                                                <p className="mt-1 text-sm">
                                                    ลองค้นหาด้วยคำค้นอื่น หรือล้างตัวกรอง
                                                </p>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row bg-gray-0 rounded-lg mt-4">
                        <div className="text-sm text-gray-700">
                            แสดง{" "}
                            <span className="font-medium">{categoriesPaginate.from || 0}</span>{" "}
                            ถึง{" "}
                            <span className="font-medium">{categoriesPaginate.to || 0}</span>{" "}
                            จาก{" "}
                            <span className="font-medium">{categoriesPaginate.total || 0}</span>{" "}
                            รายการ
                        </div>
                        <div className="flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(
                                    (categoriesPaginate.total || 0) / (categoriesPaginate.per_page || 10)
                                )}
                                onPageChange={onPageChange}
                                showIcons
                                layout="pagination"
                                theme={{
                                    pages: {
                                        base: "xs:mt-0 mt-2 inline-flex items-center -space-x-px",
                                        showIcon: "inline-flex",
                                    },
                                }}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
