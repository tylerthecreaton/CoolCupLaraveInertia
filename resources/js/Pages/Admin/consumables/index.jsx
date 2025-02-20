import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Button, Table, Card, Badge, Tooltip, Pagination } from "flowbite-react";
import { FaList, FaPlus, FaEdit, FaTrash, FaBoxOpen, FaCalendarAlt, FaUser, FaInfoCircle, FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { useState } from "react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function Index({ consumables }) {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(
            route("admin.consumables.index"),
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id, name) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            html: `คุณต้องการลบ <span class="font-medium text-red-600">${name}</span> ใช่หรือไม่?<br/><small class="text-gray-500">การกระทำนี้ไม่สามารถย้อนกลับได้</small>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.consumables.destroy", id), {
                    preserveState: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "วัตถุดิบสิ้นเปลืองถูกลบเรียบร้อยแล้ว",
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
                    จัดการวัตถุดิบสิ้นเปลือง
                </h2>
            }
        >
            <Head title="จัดการวัตถุดิบสิ้นเปลือง" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <div className="mb-6">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href={route("admin.consumables.index")}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">วัตถุดิบสิ้นเปลือง</p>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Card className="shadow-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                                <FaBoxOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">รายการวัตถุดิบสิ้นเปลือง</h2>
                                <p className="text-sm text-gray-500">จัดการข้อมูลวัตถุดิบสิ้นเปลืองทั้งหมด</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-sm"
                                    placeholder="ค้นหาวัตถุดิบสิ้นเปลือง..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                            <Link href={route("admin.consumables.create")}>
                                <Button gradientDuoTone="purpleToBlue" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200">
                                    <FaPlus className="mr-2 w-4 h-4" />
                                    เพิ่มวัตถุดิบสิ้นเปลือง
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable className="shadow-sm">
                            <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <Table.HeadCell className="font-semibold text-gray-700 w-20 px-6">
                                    รหัส
                                </Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 px-6">
                                    ชื่อ
                                </Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 w-28 px-6 text-center">
                                    จำนวน
                                </Table.HeadCell>

                                <Table.HeadCell className="font-semibold text-gray-700 w-36 px-6 text-center">
                                    ใช้ในการขาย
                                </Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 w-44 px-6 text-right">
                                    จัดการ
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {consumables.data.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <FaBoxOpen className="w-12 h-12 mb-4 text-gray-400" />
                                                <h3 className="mb-2 text-base font-medium text-gray-900">ไม่พบข้อมูล</h3>
                                                <p className="text-sm text-gray-500">เริ่มต้นโดยการเพิ่มวัตถุดิบสิ้นเปลือง</p>
                                                <div className="mt-6">
                                                    <Link href={route("admin.consumables.create")}>
                                                        <Button gradientDuoTone="purpleToBlue" size="sm">
                                                            <FaPlus className="w-4 h-4 mr-2" />
                                                            เพิ่มวัตถุดิบสิ้นเปลือง
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    consumables.data.map((consumable) => (
                                        <Table.Row
                                            key={consumable.id}
                                            className="bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <Table.Cell className="font-medium text-gray-900 whitespace-nowrap px-6">
                                                #{consumable.id}
                                            </Table.Cell>
                                            <Table.Cell className="px-6">
                                                <Tooltip
                                                    content={
                                                        <div className="p-2 max-w-xs">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <FaBoxOpen className="w-4 h-4 text-purple-400" />
                                                                    <span className="font-medium">{consumable.name}</span>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                                    <div>
                                                                        <p className="text-gray-500">จำนวน:</p>
                                                                        <p className="font-medium">{consumable.quantity} {consumable.unit.name}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500">ใช้ในการขาย:</p>
                                                                        <p className="font-medium">
                                                                            {consumable.is_depend_on_sale ? (
                                                                                <span className="text-green-600">ใช่</span>
                                                                            ) : (
                                                                                <span className="text-red-600">ไม่</span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    <span className="cursor-help border-b border-dashed border-gray-400">
                                                        {consumable.name}
                                                    </span>
                                                </Tooltip>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 text-center">
                                                <Badge color="purple" className="w-fit mx-auto">
                                                    {consumable.quantity} {consumable.unit.name}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 text-center">
                                                {consumable.is_depend_on_sale ? (
                                                    <Badge color="success" className="w-fit mx-auto">
                                                        <FaCheckCircle className="w-3 h-3 mr-1" />
                                                        ใช้งาน
                                                    </Badge>
                                                ) : (
                                                    <Badge color="failure" className="w-fit mx-auto">
                                                        <FaTimesCircle className="w-3 h-3 mr-1" />
                                                        ไม่ใช้งาน
                                                    </Badge>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell className="px-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route("admin.consumables.edit", consumable.id)}
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-cyan-700 bg-cyan-50 rounded-md hover:bg-cyan-100 transition-colors duration-150"
                                                    >
                                                        <FaEdit className="w-4 h-4 mr-1.5" />
                                                        แก้ไข
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(consumable.id, consumable.name)}
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150"
                                                    >
                                                        <FaTrash className="w-4 h-4 mr-1.5" />
                                                        ลบ
                                                    </button>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                    {consumables.data.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-6">
                            <div className="text-sm text-gray-600">
                                แสดง {consumables.from} ถึง {consumables.to} จากทั้งหมด{" "}
                                {consumables.total} รายการ
                            </div>
                            <Pagination
                                currentPage={consumables.current_page}
                                totalPages={consumables.last_page}
                                onPageChange={(page) => {
                                    router.get(
                                        route("admin.consumables.index"),
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
        </AuthenticatedLayout>
    );
}
