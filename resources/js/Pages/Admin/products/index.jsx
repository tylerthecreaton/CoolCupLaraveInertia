import { isAbsoluteUrl } from "@/helpers";
import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Breadcrumb, Pagination, Table, TextInput, Badge } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome, HiSearch, HiPlus, HiPencil, HiTrash, HiTag } from "react-icons/hi";
import Swal from "sweetalert2";

export default function Index({ productsPaginate }) {
    const { current_page, next_page_url, prev_page_url } = productsPaginate;
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    const onPageChange = (page) => {
        page > current_page
            ? router.get(next_page_url)
            : router.get(prev_page_url);
    };

    useEffect(() => {
        setProducts(productsPaginate.data);
        setFilteredProducts(productsPaginate.data);
    }, [productsPaginate]);

    useEffect(() => {
        const results = products.filter(product =>
            Object.values({
                name: product.name,
                description: product.description,
                category: product.category?.name
            }).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredProducts(results);
    }, [searchTerm, products]);

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
                router.delete(route("admin.products.destroy", id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "สินค้าถูกลบเรียบร้อยแล้ว",
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
                    จัดการสินค้า
                </h2>
            }
        >
            <Head title="จัดการสินค้า" />
            <AdminLayout className="container p-8 mx-auto mt-5 bg-white rounded-lg shadow-sm">
                <div className="space-y-6">
                    <Breadcrumb aria-label="Breadcrumb navigation">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            หน้าแรก
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>สินค้าทั้งหมด</Breadcrumb.Item>
                    </Breadcrumb>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={HiSearch}
                                placeholder="ค้นหาสินค้า..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link
                            href={route("admin.products.create")}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        >
                            <HiPlus className="w-5 h-5 mr-2" />
                            เพิ่มสินค้า
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="px-6 py-3">ลําดับ</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">รูปภาพ</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">ชื่อสินค้า</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">หมวดหมู่สินค้า</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">คำอธิบาย</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {filteredProducts.map((product) => (
                                    <Table.Row
                                        className="bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                                        key={product.id}
                                    >
                                        <Table.Cell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {(current_page - 1) * productsPaginate.per_page +
                                                filteredProducts.indexOf(product) + 1}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="relative w-20 h-20 overflow-hidden rounded-lg group">
                                                <img
                                                    src={
                                                        isAbsoluteUrl(product.image)
                                                            ? product.image
                                                            : `/images/products/${product.image}`
                                                    }
                                                    alt={product.name}
                                                    className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
                                                />
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 font-medium">
                                            {product.name}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <Badge color="purple" icon={HiTag} className="gap-1">
                                                {product.category.name}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 max-w-xs">
                                            <p className="truncate">{product.description}</p>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={route("admin.products.edit", product.id)}
                                                    className="inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700"
                                                >
                                                    <HiPencil className="w-4 h-4 mr-1" />
                                                    แก้ไข
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700"
                                                >
                                                    <HiTrash className="w-4 h-4 mr-1" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            ไม่พบข้อมูลสินค้า
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row">
                        <div className="text-sm text-gray-700 dark:text-gray-400">
                            แสดง <span className="font-semibold text-gray-900">{productsPaginate.from}</span> ถึง{" "}
                            <span className="font-semibold text-gray-900">{productsPaginate.to}</span> จาก{" "}
                            <span className="font-semibold text-gray-900">{productsPaginate.total}</span> รายการ
                        </div>
                        <Pagination
                            currentPage={current_page}
                            totalPages={productsPaginate.last_page}
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
