import { isAbsoluteUrl } from "@/helpers";
import { UnitConverter } from "@/helpers/UnitConverter";
import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Listbox, Transition } from '@headlessui/react';
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
    HiFilter,
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
    const [selectedCategory, setSelectedCategory] = useState("all");

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
        const results = products.filter((product) => {
            const matchesSearch = Object.values({
                name: product.name,
                description: product.description,
                category: product.category?.name,
            }).some((value) =>
                value
                    ?.toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );

            const matchesCategory = selectedCategory === "all" || product.category?.name === selectedCategory;

            return matchesSearch && matchesCategory;
        });
        setFilteredProducts(results);
    }, [searchTerm, selectedCategory, products]);

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

    // Get unique categories
    const categories = [...new Set(products.map(product => product.category?.name).filter(Boolean))];

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
                                    <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                                        <div className="relative">
                                            <Listbox.Button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-150 font-medium">
                                                <span>หมวดหมู่</span>
                                                <HiFilter className="w-4 h-4" />
                                                {selectedCategory !== "all" && (
                                                    <span className="text-sm font-medium text-blue-600">
                                                        ({selectedCategory})
                                                    </span>
                                                )}
                                            </Listbox.Button>
                                            <Transition
                                                enter="transition duration-100 ease-out"
                                                enterFrom="transform scale-95 opacity-0"
                                                enterTo="transform scale-100 opacity-100"
                                                leave="transition duration-75 ease-out"
                                                leaveFrom="transform scale-100 opacity-100"
                                                leaveTo="transform scale-95 opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-10 mt-1 w-56 bg-gray-50 shadow-lg max-h-60 overflow-auto focus:outline-none">
                                                    <Listbox.Option
                                                        value="all"
                                                        className={({ active, selected }) =>
                                                            `relative cursor-pointer select-none py-2 px-4 ${
                                                                selected ? 'text-blue-600' : 'text-gray-700'
                                                            } ${active ? 'bg-gray-100' : ''}`
                                                        }
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                            ทั้งหมด
                                                        </div>
                                                    </Listbox.Option>
                                                    {categories.map((category) => (
                                                        <Listbox.Option
                                                            key={category}
                                                            value={category}
                                                            className={({ active, selected }) =>
                                                                `relative cursor-pointer select-none py-2 px-4 ${
                                                                    selected ? 'text-blue-600' : 'text-gray-700'
                                                                } ${active ? 'bg-gray-100' : ''}`
                                                            }
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                                {category}
                                                            </div>
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </Listbox>
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
                size="5xl"
            >
                <Modal.Header className="border-b border-gray-200 !p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h2 className="text-xl font-semibold text-gray-800">รายละเอียดสูตร {selectedProduct?.name}</h2>
                    </div>
                </Modal.Header>
                <Modal.Body className="!p-6">
                    <div className="space-y-8">
                        {/* Ingredients Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    วัตถุดิบที่ใช้
                                </h3>
                            </div>
                            <div className="p-4">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <Table.Head>
                                            <Table.HeadCell className="bg-gray-50/80">ชื่อวัตถุดิบ</Table.HeadCell>

                                            <Table.HeadCell className="bg-gray-50/80 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span>ปริมาณ</span>
                                                    <span className="text-xs text-gray-500 font-normal">(กรัม/มิลลิลิตร)</span>
                                                </div>
                                            </Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-50/80">หน่วย</Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-50/80 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span>ปริมาณที่ใช้จริง</span>
                                                    <span className="text-xs text-gray-500 font-normal">(ช้อนชา/ช้อนโต๊ะ)</span>
                                                </div>
                                            </Table.HeadCell>
                                            {/* <Table.HeadCell className="bg-gray-50/80 w-24 text-center">จัดการ</Table.HeadCell> */}
                                        </Table.Head>
                                        <Table.Body className="divide-y divide-gray-200">
                                            {selectedProduct?.ingredients?.map((item) => (
                                                <Table.Row key={item.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                                                    <Table.Cell className="font-medium text-gray-900">
                                                        {item.ingredient?.name || 'ไม่ระบุชื่อ'}
                                                    </Table.Cell>
                                                    <Table.Cell className="text-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            {[
                                                                { size: 'S', value: item.quantity_size_s },
                                                                { size: 'M', value: item.quantity_size_m },
                                                                { size: 'L', value: item.quantity_size_l }
                                                            ].map((sizeData, index) => sizeData.value && (
                                                                <div key={sizeData.size} className={`flex items-center justify-center w-full ${index > 0 ? 'border-t border-gray-100 pt-2' : ''}`}>
                                                                    <div className="flex items-center gap-2 bg-gray-50/80 px-4 py-2 rounded-lg min-w-[120px]">
                                                                        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                                                                            sizeData.size === 'S' ? 'bg-blue-100 text-blue-600' :
                                                                            sizeData.size === 'M' ? 'bg-green-100 text-green-600' :
                                                                            'bg-purple-100 text-purple-600'
                                                                        }`}>
                                                                            <span className="text-xs font-semibold">{sizeData.size}</span>
                                                                        </div>
                                                                        <span className="font-medium text-gray-900">{sizeData.value}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <span className="text-sm text-gray-600">
                                                            {item.ingredient?.unit?.name || 'ไม่ระบุหน่วย'}
                                                        </span>
                                                    </Table.Cell>

                                                    <Table.Cell className="text-center">
                                                        {(item.ingredient?.unit?.name === 'กรัม' || item.ingredient?.unit?.name === 'มิลลิลิตร') && (
                                                            <div className="flex flex-col items-center gap-2">
                                                                {item.quantity_size_s && (
                                                                    <div className="flex flex-col items-start gap-0.5 bg-gray-50/50 px-3 py-1.5 rounded-lg">
                                                                        <span className="text-xs font-semibold text-blue-600">ไซส์ S:</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge color="blue" className="text-xs w-24">
                                                                                {UnitConverter.convert(item.quantity_size_s, item.ingredient.unit.name === 'กรัม' ? 'gram' : 'ml', 'teaspoon').toFixed(1)} ช้อนชา
                                                                            </Badge>
                                                                            <span className="text-xs text-gray-400">หรือ</span>
                                                                            <Badge color="purple" className="text-xs w-24">
                                                                                {UnitConverter.convert(item.quantity_size_s, item.ingredient.unit.name === 'กรัม' ? 'gram' : 'ml', 'tablespoon').toFixed(1)} ช้อนโต๊ะ
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {item.quantity_size_m && (
                                                                    <div className="flex flex-col items-start gap-0.5 bg-gray-50/50 px-3 py-1.5 rounded-lg">
                                                                        <span className="text-xs font-semibold text-blue-600">ไซส์ M:</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge color="blue" className="text-xs w-24">
                                                                                {UnitConverter.convert(item.quantity_size_m, item.ingredient.unit.name === 'กรัม' ? 'gram' : 'ml', 'teaspoon').toFixed(1)} ช้อนชา
                                                                            </Badge>
                                                                            <span className="text-xs text-gray-400">หรือ</span>
                                                                            <Badge color="purple" className="text-xs w-24">
                                                                                {UnitConverter.convert(item.quantity_size_m, item.ingredient.unit.name === 'กรัม' ? 'gram' : 'ml', 'tablespoon').toFixed(1)} ช้อนโต๊ะ
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {item.quantity_size_l && (
                                                                    <div className="flex flex-col items-start gap-0.5 bg-gray-50/50 px-3 py-1.5 rounded-lg">
                                                                        <span className="text-xs font-semibold text-blue-600">ไซส์ L:</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge color="blue" className="text-xs w-24">
                                                                                {UnitConverter.convert(item.quantity_size_l, item.ingredient.unit.name === 'กรัม' ? 'gram' : 'ml', 'teaspoon').toFixed(1)} ช้อนชา
                                                                            </Badge>
                                                                            <span className="text-xs text-gray-400">หรือ</span>
                                                                            <Badge color="purple" className="text-xs w-24">
                                                                                {UnitConverter.convert(item.quantity_size_l, item.ingredient.unit.name === 'กรัม' ? 'gram' : 'ml', 'tablespoon').toFixed(1)} ช้อนโต๊ะ
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Table.Cell>
                                                    {/* <Table.Cell className="text-center">
                                                        <Link
                                                            href={route("admin.ingredients.edit", item.id)}
                                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors duration-150"
                                                        >
                                                            <FaEdit className="w-4 h-4 mr-1.5" />
                                                            แก้ไข
                                                        </Link>
                                                    </Table.Cell> */}
                                                </Table.Row>
                                            ))}
                                            {(!selectedProduct?.ingredients || selectedProduct.ingredients.length === 0) && (
                                                <Table.Row>
                                                    <Table.Cell colSpan={5}>
                                                        <div className="flex items-center justify-center py-8 text-gray-500">
                                                            <svg className="w-6 h-6 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="text-sm">ไม่มีวัตถุดิบที่ใช้ในสินค้านี้</span>
                                                        </div>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </Table.Body>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        {/* Consumables Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100/50">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    วัตถุดิบสิ้นเปลืองที่ใช้
                                </h3>
                            </div>
                            <div className="p-4">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <Table.Head>
                                            <Table.HeadCell className="bg-gray-50/80">ชื่อวัตถุดิบสิ้นเปลือง</Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-50/80 text-center">ปริมาณที่ใช้</Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-50/80">หน่วย</Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y divide-gray-200">
                                            {selectedProduct?.consumables?.map((item) => (
                                                <Table.Row key={item.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                                                    <Table.Cell className="font-medium text-gray-900">
                                                        {item.consumable?.name || 'ไม่ระบุชื่อ'}
                                                    </Table.Cell>
                                                    <Table.Cell className="text-center">
                                                        <Badge color="purple" className="w-20 bg-opacity-90">
                                                            {item.quantity_used || '-'}
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <span className="text-sm text-gray-600">
                                                            {item.consumable?.unit?.name || 'ไม่ระบุหน่วย'}
                                                        </span>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                            {(!selectedProduct?.consumables || selectedProduct.consumables.length === 0) && (
                                                <Table.Row>
                                                    <Table.Cell colSpan={3}>
                                                        <div className="flex items-center justify-center py-8 text-gray-500">
                                                            <svg className="w-6 h-6 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="text-sm">ไม่มีวัตถุดิบสิ้นเปลืองที่ใช้ในสินค้านี้</span>
                                                        </div>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </Table.Body>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </AuthenticatedLayout>
    );
}
