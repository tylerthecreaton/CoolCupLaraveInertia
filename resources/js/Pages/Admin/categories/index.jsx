import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Pagination, Table, TextInput } from "flowbite-react";
import { HiHome, HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { isAbsoluteUrl } from "@/helpers";

export default function index({ categoriesPaginate }) {
    const { current_page, next_page_url, prev_page_url } = categoriesPaginate;
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCategories, setFilteredCategories] = useState([]);

    const onPageChange = (page) => {
        page > current_page
            ? router.get(next_page_url)
            : router.get(prev_page_url);
    };

    useEffect(() => {
        setCategories(categoriesPaginate.data);
        setFilteredCategories(categoriesPaginate.data);
    }, [categoriesPaginate]);

    useEffect(() => {
        const results = categories.filter(category =>
            Object.values({
                name: category.name,
                description: category.description
            }).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredCategories(results);
    }, [searchTerm, categories]);

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
                router.delete(route("admin.categories.destroy", id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "หมวดหมู่ถูกลบเรียบร้อยแล้ว",
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
                    จัดการหมวดหมู่
                </h2>
            }
        >
            <Head title="จัดการหมวดหมู่" />
            <AdminLayout className="container p-8 mx-auto mt-5 bg-white rounded-lg shadow-sm">
                <div className="space-y-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-between">
                        <Breadcrumb aria-label="Breadcrumb navigation" className="py-2">
                            <Breadcrumb.Item href={route('dashboard')} icon={HiHome}>
                                หน้าแรก
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>หมวดหมู่ทั้งหมด</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    {/* Search and Add Category */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={HiSearch}
                                placeholder="ค้นหาหมวดหมู่..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <Link
                            href={route("admin.categories.create")}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:scale-105"
                        >
                            <HiPlus className="w-5 h-5 mr-2" />
                            เพิ่มหมวดหมู่
                        </Link>
                    </div>

                    {/* Categories Table */}
                    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ลําดับ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    รูปภาพ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ชื่อหมวดหมู่
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    คำอธิบาย
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    <span className="sr-only">Actions</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y divide-gray-200">
                                {filteredCategories.map((category, index) => (
                                    <Table.Row
                                        key={category.id}
                                        className="bg-white transition-colors duration-150 hover:bg-gray-50/60"
                                    >
                                        <Table.Cell className="px-6 py-4 font-medium text-gray-900">
                                            {(current_page - 1) * categoriesPaginate.per_page + index + 1}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="relative w-20 h-20 overflow-hidden rounded-lg group">
                                                <img
                                                    src={
                                                        isAbsoluteUrl(category.image)
                                                            ? category.image
                                                            : `/images/categories/${category.image}`
                                                    }
                                                    alt={category.name}
                                                    className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{category.name}</div>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 max-w-xs">
                                            <p className="text-gray-600 truncate">{category.description}</p>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route("admin.categories.edit", category.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors duration-150"
                                                >
                                                    <HiPencil className="w-4 h-4 mr-1.5" />
                                                    แก้ไข
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150"
                                                >
                                                    <HiTrash className="w-4 h-4 mr-1.5" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {filteredCategories.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={5} className="px-6 py-8 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                <p className="text-lg font-medium">ไม่พบข้อมูลหมวดหมู่</p>
                                                <p className="mt-1 text-sm">ลองค้นหาด้วยคำค้นอื่น หรือล้างตัวกรอง</p>
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
                            แสดง <span className="font-medium text-gray-900">{categoriesPaginate.from}</span> ถึง{" "}
                            <span className="font-medium text-gray-900">{categoriesPaginate.to}</span> จาก{" "}
                            <span className="font-medium text-gray-900">{categoriesPaginate.total}</span> รายการ
                        </div>
                        <div className="flex justify-center">
                            <Pagination
                                currentPage={current_page}
                                onPageChange={onPageChange}
                                showIcons={true}
                                totalPages={Math.ceil(categoriesPaginate.total / categoriesPaginate.per_page)}
                            />
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
