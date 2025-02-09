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
    Card,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
    HiHome,
    HiSearch,
} from "react-icons/hi";
import { FaList, FaPlus, FaEdit, FaTrash, FaBox, FaSearch } from "react-icons/fa";
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
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <div className="mb-6">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href={route("admin.products.index")}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">สินค้า</p>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Card className="shadow-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                                <FaBox className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">รายการสินค้า</h2>
                                <p className="text-sm text-gray-500">จัดการข้อมูลสินค้าทั้งหมด</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaSearch className="w-4 h-4 text-gray-500" />
                                </div>
                                <TextInput
                                    type="text"
                                    placeholder="ค้นหาสินค้า..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Link
                                href={route("admin.products.create")}
                                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                <FaPlus className="w-4 h-4 mr-2" />
                                เพิ่มสินค้า
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
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
                                                product.sale_price || 0
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
                                                    <FaEdit className="w-4 h-4 mr-1.5" />
                                                    แก้ไข
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(product.id)
                                                    }
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150"
                                                >
                                                    <FaTrash className="w-4 h-4 mr-1.5" />
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
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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

                    <div className="flex items-center justify-center mt-4">
                        <Pagination
                            currentPage={current_page}
                            onPageChange={onPageChange}
                            showIcons
                            layout="pagination"
                            totalPages={Math.ceil(
                                productsPaginate.total / productsPaginate.per_page
                            )}
                        />
                    </div>
                </Card>
            </div>

            {/* Ingredients Modal */}
            <Modal
                show={showIngredientsModal}
                onClose={() => setShowIngredientsModal(false)}
                size="xl"
            >
                <Modal.Header>
                    รายละเอียดสูตร {selectedProduct?.name}
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        {/* Ingredients Section */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">วัตถุดิบที่ใช้</h3>
                            <div className="overflow-x-auto">
                                <Table>
                                    <Table.Head>
                                        <Table.HeadCell>ชื่อวัตถุดิบ</Table.HeadCell>
                                        <Table.HeadCell>ปริมาณที่ใช้</Table.HeadCell>
                                        <Table.HeadCell>หน่วย</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {selectedProduct?.ingredients?.map((item) => (
                                            <Table.Row key={item.id}>
                                                <Table.Cell>{item.ingredient?.name || 'ไม่ระบุชื่อ'}</Table.Cell>
                                                <Table.Cell>{item.quantity_used}</Table.Cell>
                                                <Table.Cell>{item.ingredient?.unit?.name || 'ไม่ระบุหน่วย'}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                        {(!selectedProduct?.ingredients || selectedProduct.ingredients.length === 0) && (
                                            <Table.Row>
                                                <Table.Cell colSpan={3}>
                                                    <div className="flex items-center justify-center py-4 text-gray-500">
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        ไม่มีวัตถุดิบที่ใช้ในสินค้านี้
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>

                        {/* Consumables Section */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">วัตถุดิบสิ้นเปลืองที่ใช้</h3>
                            <div className="overflow-x-auto">
                                <Table>
                                    <Table.Head>
                                        <Table.HeadCell>ชื่อวัตถุดิบสิ้นเปลือง</Table.HeadCell>
                                        <Table.HeadCell>ปริมาณที่ใช้</Table.HeadCell>
                                        <Table.HeadCell>หน่วย</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {selectedProduct?.consumables?.map((item) => (
                                            <Table.Row key={item.id}>
                                                <Table.Cell>{item.consumable?.name || 'ไม่ระบุชื่อ'}</Table.Cell>
                                                <Table.Cell>{item.quantity_used}</Table.Cell>
                                                <Table.Cell>{item.consumable?.unit?.name || 'ไม่ระบุหน่วย'}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                        {(!selectedProduct?.consumables || selectedProduct.consumables.length === 0) && (
                                            <Table.Row>
                                                <Table.Cell colSpan={3}>
                                                    <div className="flex items-center justify-center py-4 text-gray-500">
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        ไม่มีวัตถุดิบสิ้นเปลืองที่ใช้ในสินค้านี้
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </AuthenticatedLayout>
    );
}
