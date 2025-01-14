import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Breadcrumb,
    Dropdown,
    Pagination,
    Table,
    TextInput,
    Button,
    Modal,
    Label,
} from "flowbite-react";
import {
    HiHome,
    HiSearch,
    HiPlus,
    HiPencil,
    HiTrash,
    HiPlus as HiPlusCircle,
} from "react-icons/hi";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { isAbsoluteUrl } from "@/helpers";
import CreateUnitModal from "@/Components/Admin/ingredients/CreateUnitModal";
import UnitModal from "@/Components/Admin/ingredients/UnitModal";
import EditUnitModal from "@/Components/Admin/ingredients/EditUnitModal";

export default function index({ ingredientsPaginate }) {
    const { current_page, next_page_url, prev_page_url } = ingredientsPaginate;
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [showCreateUnitModal, setShowCreateUnitModal] = useState(false);
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showEditUnitModal, setShowEditUnitModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [showIncreaseModal, setShowIncreaseModal] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [increaseQuantity, setIncreaseQuantity] = useState("");

    const onPageChange = (page) => {
        page > current_page
            ? router.get(next_page_url)
            : router.get(prev_page_url);
    };

    useEffect(() => {
        setIngredients(ingredientsPaginate.data);
        setFilteredIngredients(ingredientsPaginate.data);
    }, [ingredientsPaginate]);

    useEffect(() => {
        const results = ingredients.filter((ingredient) =>
            Object.values({
                name: ingredient.name,
                description: ingredient.description,
            }).some((value) =>
                value
                    ?.toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );
        setFilteredIngredients(results);
    }, [searchTerm, ingredients]);

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
                router.delete(route("admin.ingredients.destroy", id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "วัตถุดิบถูกลบเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    };

    const handleEditUnit = (unit) => {
        setSelectedUnit(unit);
        setShowEditUnitModal(true);
    };

    const handleIncreaseQuantity = () => {
        router.post(
            route("admin.ingredients.increase-quantity", selectedIngredient.id),
            {
                quantity: parseFloat(increaseQuantity),
            },
            {
                onSuccess: () => {
                    setShowIncreaseModal(false);
                    setIncreaseQuantity("");
                    setSelectedIngredient(null);
                },
            }
        );
    };

    const openIncreaseModal = (ingredient) => {
        setSelectedIngredient(ingredient);
        setShowIncreaseModal(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการวัตถุดิบ
                </h2>
            }
        >
            <Head title="จัดการวัตถุดิบ" />
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
                            <Breadcrumb.Item>วัตถุดิบทั้งหมด</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={HiSearch}
                                placeholder="ค้นหาวัตถุดิบ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Dropdown
                                label="จัดการหน่วยวัด"
                                className=""
                                dismissOnClick={true}
                            >
                                <Dropdown.Item
                                    onClick={() => setShowUnitModal(true)}
                                >
                                    หน่วยวัด
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => setShowCreateUnitModal(true)}
                                >
                                    เพิ่มหน่วยวัด
                                </Dropdown.Item>
                            </Dropdown>
                            <Link
                                href={route("admin.ingredients.create")}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:scale-105"
                            >
                                <HiPlus className="w-5 h-5 mr-2" />
                                เพิ่มวัตถุดิบ
                            </Link>
                        </div>
                    </div>

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
                                    เป็นสารให้ความหวาน
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ชื่อวัตถุดิบ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ปริมาณคงเหลือ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    วันหมดอายุ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    <span className="sr-only">Actions</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y divide-gray-200">
                                {filteredIngredients.map(
                                    (ingredient, index) => (
                                        <Table.Row
                                            key={ingredient.id}
                                            className="bg-white transition-colors duration-150 hover:bg-gray-50/60"
                                        >
                                            <Table.Cell className="px-6 py-4 font-medium text-gray-900">
                                                {(current_page - 1) *
                                                    ingredientsPaginate.per_page +
                                                    index +
                                                    1}
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                <div className="relative w-20 h-20 overflow-hidden rounded-lg group">
                                                    <img
                                                        src={
                                                            isAbsoluteUrl(
                                                                ingredient.image
                                                            )
                                                                ? ingredient.image
                                                                : `/images/ingredients/${ingredient.image}`
                                                        }
                                                        alt={ingredient.name}
                                                        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {ingredient.is_sweetness
                                                        ? "ใช่"
                                                        : "ไม่ใช่"}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {ingredient.name}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {ingredient.quantity}{" "}
                                                    {ingredient.unit}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {new Date(
                                                        ingredient.expiration_date
                                                    ).toLocaleDateString(
                                                        "th-TH",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4 max-w-xs">
                                                <p className="text-gray-600 truncate">
                                                    {ingredient.description}
                                                </p>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openIncreaseModal(
                                                                ingredient
                                                            )
                                                        }
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-150"
                                                    >
                                                        <HiPlusCircle className="w-4 h-4 mr-1.5" />
                                                        เพิ่มจำนวน
                                                    </button>
                                                    <Link
                                                        href={route(
                                                            "admin.ingredients.edit",
                                                            ingredient.id
                                                        )}
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors duration-150"
                                                    >
                                                        <HiPencil className="w-4 h-4 mr-1.5" />
                                                        แก้ไข
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                ingredient.id
                                                            )
                                                        }
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150"
                                                    >
                                                        <HiTrash className="w-4 h-4 mr-1.5" />
                                                        ลบ
                                                    </button>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                )}
                                {filteredIngredients.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell
                                            colSpan={5}
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
                                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                    />
                                                </svg>
                                                <p className="text-lg font-medium">
                                                    ไม่พบข้อมูลหมวดหมู่
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
                                {ingredientsPaginate.from}
                            </span>{" "}
                            ถึง{" "}
                            <span className="font-medium text-gray-900">
                                {ingredientsPaginate.to}
                            </span>{" "}
                            จาก{" "}
                            <span className="font-medium text-gray-900">
                                {ingredientsPaginate.total}
                            </span>{" "}
                            รายการ
                        </div>
                        <div className="flex justify-center">
                            <Pagination
                                currentPage={current_page}
                                onPageChange={onPageChange}
                                showIcons={true}
                                totalPages={Math.ceil(
                                    ingredientsPaginate.total /
                                        ingredientsPaginate.per_page
                                )}
                            />
                        </div>
                    </div>
                </div>
                <CreateUnitModal
                    isOpen={showCreateUnitModal}
                    setIsOpen={setShowCreateUnitModal}
                />
                <UnitModal
                    isOpen={showUnitModal}
                    setIsOpen={setShowUnitModal}
                    onEdit={handleEditUnit}
                />
                <EditUnitModal
                    isOpen={showEditUnitModal}
                    setIsOpen={setShowEditUnitModal}
                    unit={selectedUnit}
                />
                <Modal
                    show={showIncreaseModal}
                    onClose={() => setShowIncreaseModal(false)}
                >
                    <Modal.Header>
                        เพิ่มจำนวนวัตถุดิบ {selectedIngredient?.name}
                    </Modal.Header>
                    <Modal.Body>
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="quantity"
                                    value="จำนวนที่ต้องการเพิ่ม"
                                />
                                <div className="flex items-center gap-2">
                                    <TextInput
                                        id="quantity"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={increaseQuantity}
                                        onChange={(e) =>
                                            setIncreaseQuantity(e.target.value)
                                        }
                                        placeholder="ระบุจำนวน"
                                    />
                                    <span className="text-gray-500">
                                        {selectedIngredient?.unit}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            color="gray"
                            onClick={() => setShowIncreaseModal(false)}
                        >
                            ยกเลิก
                        </Button>
                        <Button onClick={handleIncreaseQuantity}>
                            เพิ่มจำนวน
                        </Button>
                    </Modal.Footer>
                </Modal>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
