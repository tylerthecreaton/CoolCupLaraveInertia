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
    Card,
    Badge,
    Tooltip,
} from "flowbite-react";
import {
    HiHome,
    HiSearch,
    HiPlus,
    HiPencil,
    HiTrash,
    HiPlus as HiPlusCircle,
} from "react-icons/hi";
import { FaList, FaBox, FaCalendarAlt, FaBalanceScale, FaInfoCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { isAbsoluteUrl } from "@/helpers";
import CreateUnitModal from "@/Components/Admin/ingredients/CreateUnitModal";
import UnitModal from "@/Components/Admin/ingredients/UnitModal";
import EditUnitModal from "@/Components/Admin/ingredients/EditUnitModal";

export default function index({ ingredientsPaginate }) {
    const { current_page, next_page_url, prev_page_url, data, from, to, total, last_page } = ingredientsPaginate;
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [showCreateUnitModal, setShowCreateUnitModal] = useState(false);
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showEditUnitModal, setShowEditUnitModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการวัตถุดิบ
                </h2>
            }
        >
            <Head title="จัดการวัตถุดิบ" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <div className="mb-6">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item href={route("dashboard")} icon={HiHome}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <p className="text-gray-700">วัตถุดิบ</p>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Card className="shadow-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-md">
                                <FaBox className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">รายการวัตถุดิบ</h2>
                                <p className="text-sm text-gray-500">จัดการข้อมูลวัตถุดิบทั้งหมด</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HiSearch className="w-4 h-4 text-gray-400" />
                                </div>
                                <TextInput
                                    type="text"
                                    className="pl-10"
                                    placeholder="ค้นหาวัตถุดิบ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Dropdown
                                    label="จัดการหน่วยวัด"
                                    className="w-full sm:w-auto"
                                    dismissOnClick={true}
                                >
                                    <Dropdown.Item onClick={() => setShowUnitModal(true)}>
                                        หน่วยวัด
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setShowCreateUnitModal(true)}>
                                        เพิ่มหน่วยวัด
                                    </Dropdown.Item>
                                </Dropdown>
                                <Link href={route("admin.ingredients.create")}>
                                    <Button gradientDuoTone="cyanToBlue" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200">
                                        <HiPlus className="mr-2 w-4 h-4" />
                                        เพิ่มวัตถุดิบ
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable className="shadow-sm">
                            <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <Table.HeadCell className="font-semibold text-gray-700">ลําดับ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">รูปภาพ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">เป็นสารให้ความหวาน</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">ชื่อวัตถุดิบ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">ปริมาณคงเหลือ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">วันหมดอายุ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 text-right">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {filteredIngredients.map((ingredient, index) => (
                                    <Table.Row
                                        key={ingredient.id}
                                        className="bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <Table.Cell className="font-medium text-gray-900">
                                            {(current_page - 1) * ingredientsPaginate.per_page + index + 1}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="relative w-16 h-16 overflow-hidden rounded-lg group">
                                                <img
                                                    src={
                                                        isAbsoluteUrl(ingredient.image)
                                                            ? ingredient.image
                                                            : `/images/ingredients/${ingredient.image}`
                                                    }
                                                    alt={ingredient.name}
                                                    className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="font-medium text-gray-900">
                                                {ingredient.is_sweetness ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        ใช่
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        ไม่ใช่
                                                    </span>
                                                )}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Tooltip
                                                content={
                                                    <div className="p-2 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <FaBox className="w-4 h-4 text-cyan-400" />
                                                                <span className="font-medium">{ingredient.name}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <div>
                                                                    <p className="text-gray-500">ปริมาณ:</p>
                                                                    <p className="font-medium">
                                                                        {ingredient.quantity} {ingredient.unit?.name}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500">วันหมดอายุ:</p>
                                                                    <p className="font-medium">
                                                                        {new Date(ingredient.expiration_date).toLocaleDateString("th-TH", {
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric",
                                                                        })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="font-medium text-gray-900 cursor-help">
                                                    {ingredient.name}
                                                </div>
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="font-medium text-gray-900">
                                                {ingredient.quantity}{" "}
                                                {ingredient.unit?.name}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="font-medium text-gray-900">
                                                {new Date(ingredient.expiration_date).toLocaleDateString("th-TH", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route("admin.ingredients.edit", ingredient.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-cyan-700 bg-cyan-50 rounded-md hover:bg-cyan-100 transition-colors duration-150"
                                                >
                                                    <HiPencil className="w-4 h-4 mr-1.5" />
                                                    แก้ไข
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ingredient.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150"
                                                >
                                                    <HiTrash className="w-4 h-4 mr-1.5" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                    {data.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-6">
                            <div className="text-sm text-gray-600">
                                แสดง {from} ถึง {to} จากทั้งหมด{" "}
                                {total} รายการ
                            </div>
                            <Pagination
                                currentPage={current_page}
                                totalPages={last_page}
                                onPageChange={(page) => {
                                    router.get(
                                        route("admin.ingredients.index"),
                                        { page: page },
                                        { preserveState: true, preserveScroll: true }
                                    );
                                }}
                                showIcons
                                layout="pagination"
                                theme={{
                                    pages: {
                                        base: "xs:mt-0 mt-2 inline-flex items-center -space-x-px",
                                        showIcon: "inline-flex",
                                        previous: {
                                            base: "ml-0 rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700",
                                            icon: "h-5 w-5"
                                        },
                                        next: {
                                            base: "rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700",
                                            icon: "h-5 w-5"
                                        },
                                        selector: {
                                            base: "w-12 border border-gray-300 bg-white py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700",
                                            active: "bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700",
                                            disabled: "opacity-50 cursor-normal"
                                        }
                                    }
                                }}
                            />
                        </div>
                    )}
                </Card>
            </div>

            {/* Modals */}
            {showCreateUnitModal && (
                <CreateUnitModal
                    show={showCreateUnitModal}
                    onClose={() => setShowCreateUnitModal(false)}
                />
            )}
            {showUnitModal && (
                <UnitModal
                    show={showUnitModal}
                    onClose={() => setShowUnitModal(false)}
                    onEdit={handleEditUnit}
                />
            )}
            {showEditUnitModal && selectedUnit && (
                <EditUnitModal
                    show={showEditUnitModal}
                    onClose={() => {
                        setShowEditUnitModal(false);
                        setSelectedUnit(null);
                    }}
                    unit={selectedUnit}
                />
            )}
        </AuthenticatedLayout>
    );
}
