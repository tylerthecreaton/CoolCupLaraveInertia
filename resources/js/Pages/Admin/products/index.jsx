import { isAbsoluteUrl } from "@/helpers";
import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Breadcrumb,
    Pagination,
    Table,
    TextInput,
    Badge,
    Modal,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
    HiHome,
    HiSearch,
    HiPlus,
    HiPencil,
    HiTrash,
    HiTag,
} from "react-icons/hi";
import Swal from "sweetalert2";

export default function Index({ productsPaginate }) {
    const { current_page, next_page_url, prev_page_url } = productsPaginate;
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showIngredientsModal, setShowIngredientsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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
        const results = products.filter((product) =>
            Object.values({
                name: product.name,
                description: product.description,
                category: product.category?.name,
            }).some((value) =>
                value
                    ?.toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
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
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.products.destroy", id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "สินค้าถูกลบเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    };

    const handleShowIngredients = (product) => {
        setSelectedProduct(product);
        setShowIngredientsModal(true);
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
                            <Breadcrumb.Item>สินค้าทั้งหมด</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    {/* Search and Add Product */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={HiSearch}
                                placeholder="ค้นหาสินค้า..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <Link
                            href={route("admin.products.create")}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:scale-105"
                        >
                            <HiPlus className="w-5 h-5 mr-2" />
                            เพิ่มสินค้า
                        </Link>
                    </div>

                    {/* Products Table */}
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
                                    ชื่อสินค้า
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    หมวดหมู่
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ราคาขาย
                                </Table.HeadCell>

                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    <span className="sr-only">Actions</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y divide-gray-200">
                                {filteredProducts.map((product, index) => (
                                    <Table.Row
                                        key={product.id}
                                        className="bg-white transition-colors duration-150 hover:bg-gray-50/60"
                                    >
                                        <Table.Cell className="px-6 py-4 font-medium text-gray-900">
                                            {(current_page - 1) *
                                                productsPaginate.per_page +
                                                index +
                                                1}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="relative w-20 h-20 overflow-hidden rounded-lg group">
                                                <img
                                                    src={
                                                        isAbsoluteUrl(
                                                            product.image
                                                        )
                                                            ? product.image
                                                            : `/images/products/${product.image}`
                                                    }
                                                    alt={product.name}
                                                    className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    handleShowIngredients(product)
                                                }
                                                className="text-blue-600 hover:underline"
                                            >
                                                {product.name}
                                            </button>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {product.description}
                                            </p>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {product.category.name}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 font-medium text-gray-900">
                                            ฿
                                            {(
                                                product.cost_price || 0
                                            ).toLocaleString()}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route(
                                                        "admin.products.edit",
                                                        product.id
                                                    )}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors duration-150"
                                                >
                                                    <HiPencil className="w-4 h-4 mr-1.5" />
                                                    แก้ไข
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(product.id)
                                                    }
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150"
                                                >
                                                    <HiTrash className="w-4 h-4 mr-1.5" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell
                                            colSpan={7}
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
                                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                                    />
                                                </svg>
                                                <p className="text-lg font-medium">
                                                    ไม่พบข้อมูลสินค้า
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
                                {productsPaginate.from}
                            </span>{" "}
                            ถึง{" "}
                            <span className="font-medium text-gray-900">
                                {productsPaginate.to}
                            </span>{" "}
                            จาก{" "}
                            <span className="font-medium text-gray-900">
                                {productsPaginate.total}
                            </span>{" "}
                            รายการ
                        </div>
                        <div className="flex justify-center">
                            <Pagination
                                currentPage={current_page}
                                onPageChange={onPageChange}
                                showIcons={true}
                                totalPages={Math.ceil(
                                    productsPaginate.total /
                                        productsPaginate.per_page
                                )}
                            />
                        </div>
                    </div>

                    {/* Ingredients Modal */}
                    <Modal
                        show={showIngredientsModal}
                        onClose={() => setShowIngredientsModal(false)}
                    >
                        <Modal.Header>
                            วัตถุดิบที่ใช้ใน {selectedProduct?.name}
                        </Modal.Header>
                        <Modal.Body>
                            {selectedProduct?.ingredients?.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedProduct.ingredients.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {item?.ingredient?.name || 'ไม่ระบุชื่อวัตถุดิบ'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    จำนวนที่ใช้: {item?.quantity_used || 0}{" "}
                                                    {item?.ingredient?.unit?.name || 'หน่วย'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">
                                    ไม่มีวัตถุดิบที่ใช้ในสินค้านี้
                                </p>
                            )}
                        </Modal.Body>
                    </Modal>
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
