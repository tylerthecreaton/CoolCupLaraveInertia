import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Badge,
    Breadcrumb,
    Button,
    Modal,
    Pagination,
    Table,
} from "flowbite-react";
import { useState } from "react";
import { FaBoxes, FaPlus } from "react-icons/fa";
import { HiHome } from "react-icons/hi2";
import Swal from "sweetalert2";

export default function Index({ auth, withdraws }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedWithdraw, setSelectedWithdraw] = useState(null);

    const handleShowDetails = (withdraw) => {
        setSelectedWithdraw(withdraw);
        setShowModal(true);
    };

    const onPageChange = (page) => {
        router.get(route("admin.withdraw.index", { page }));
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            pending: "warning",
            approved: "success",
            rejected: "failure",
            processing: "info",
        };
        return (
            <Badge
                color={statusColors[status.toLowerCase()] || "default"}
                className="px-3 py-1"
            >
                {status}
            </Badge>
        );
    };

    return (
        <AdminLayout>
            <Head title="รายการเบิกวัตถุดิบ/วัตถุดิบสิ้นเปลือง" />
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        รายการเบิกวัตถุดิบ/วัตถุดิบสิ้นเปลือง
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <Breadcrumb className="mb-4">
                            <Breadcrumb.Item
                                href={route("dashboard")}
                                icon={HiHome}
                            >
                                หน้าแรก
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                จัดการการเบิกวัตถุดิบ
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="flex items-center text-xl font-semibold text-gray-800">
                                        <FaBoxes className="mr-2 w-6 h-6 text-gray-600" />
                                        รายการเบิกวัตถุดิบ/วัตถุดิบสิ้นเปลือง
                                    </h2>
                                    <Link href={route("admin.withdraw.create")}>
                                        <Button gradientDuoTone="greenToBlue">
                                            <div className="flex items-center gap-x-2">
                                                <FaPlus className="w-4 h-4" />
                                                สร้างรายการเบิก
                                            </div>
                                        </Button>
                                    </Link>
                                </div>

                                <div className="overflow-x-auto">
                                    <Table hoverable>
                                        <Table.Head>
                                            <Table.HeadCell className="bg-gray-50">
                                                ID
                                            </Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-50">
                                                ผู้เบิก
                                            </Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-50">
                                                รายการ
                                            </Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-50">
                                                สถานะ
                                            </Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-50">
                                                วันที่ทำรายการ
                                            </Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-50">
                                                การจัดการ
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y">
                                            {withdraws.data.map((withdraw) => (
                                                <Table.Row
                                                    key={withdraw.id}
                                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                                >
                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                        {withdraw.id}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {withdraw.user?.name}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className="space-y-2">
                                                            {withdraw.items.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="text-sm"
                                                                    >
                                                                        {item.type ===
                                                                        "ingredient" ? (
                                                                            <>
                                                                                {
                                                                                    item
                                                                                        .ingredient_lot
                                                                                        ?.details?.[0]
                                                                                        ?.ingredient
                                                                                        ?.name
                                                                                }{" "}
                                                                                -
                                                                                {
                                                                                    item.quantity
                                                                                }{" "}
                                                                                {
                                                                                    item.unit
                                                                                }
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {
                                                                                    item
                                                                                        .consumable_lot
                                                                                        ?.details?.[0]
                                                                                        ?.consumable
                                                                                        ?.name
                                                                                }{" "}
                                                                                -
                                                                                {
                                                                                    item.quantity
                                                                                }{" "}
                                                                                {
                                                                                    item.unit
                                                                                }
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {withdraw.status}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {withdraw.created_at}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedWithdraw(
                                                                        withdraw
                                                                    );
                                                                    setShowModal(
                                                                        true
                                                                    );
                                                                }}
                                                                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                                            >
                                                                ดูรายละเอียด
                                                            </button>
                                                            {withdraw.status !==
                                                                "cancelled" && (
                                                                <button
                                                                    onClick={() => {
                                                                        Swal.fire(
                                                                            {
                                                                                title: "คุณต้องการยกเลิกการเบิกนี้ใช่หรือไม่?",
                                                                                icon: "warning",
                                                                                showCancelButton: true,
                                                                                confirmButtonColor:
                                                                                    "#3085d6",
                                                                                cancelButtonColor:
                                                                                    "#d33",
                                                                                confirmButtonText:
                                                                                    "ใช่, ยกเลิก",
                                                                                cancelButtonText:
                                                                                    "ไม่",
                                                                            }
                                                                        ).then(
                                                                            (
                                                                                result
                                                                            ) => {
                                                                                if (
                                                                                    result.isConfirmed
                                                                                ) {
                                                                                    router.post(
                                                                                        route(
                                                                                            "admin.withdraw.rollback",
                                                                                            withdraw.id
                                                                                        ),
                                                                                        {
                                                                                            _method:
                                                                                                "DELETE",
                                                                                        }
                                                                                    );
                                                                                }
                                                                            }
                                                                        );
                                                                    }}
                                                                    className="font-medium text-red-600 hover:underline dark:text-red-500"
                                                                >
                                                                    ยกเลิก
                                                                </button>
                                                            )}
                                                            {/* <Link href={route('admin.withdraw.edit', withdraw.id)}>
                                                                <Button
                                                                    size="sm"
                                                                    gradientDuoTone="cyanToBlue"
                                                                >
                                                                    <HiOutlinePencilAlt className="mr-2 w-4 h-4" />
                                                                    แก้ไข
                                                                </Button>
                                                            </Link> */}
                                                            {/* <Button
                                                                size="sm"
                                                                gradientDuoTone="pinkToOrange"
                                                                onClick={() => handleDelete(withdraw.id)}
                                                            >
                                                                <HiOutlineTrash className="mr-2 w-4 h-4" />
                                                                ลบ
                                                            </Button> */}
                                                        </div>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>

                                {withdraws.links &&
                                    withdraws.links.length > 3 && (
                                        <div className="flex items-center justify-center mt-4">
                                            <Pagination
                                                currentPage={
                                                    withdraws.current_page
                                                }
                                                totalPages={withdraws.last_page}
                                                onPageChange={onPageChange}
                                                showIcons={true}
                                            />
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    size="xl"
                >
                    <Modal.Header>
                        <div className="flex items-center">
                            <FaBoxes className="mr-2 w-5 h-5 text-gray-600" />
                            รายละเอียดการเบิก #{selectedWithdraw?.id}
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedWithdraw && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            ผู้เบิก
                                        </p>
                                        <p>
                                            {selectedWithdraw.user?.name || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            สถานะ
                                        </p>
                                        <div>
                                            {getStatusBadge(
                                                selectedWithdraw.status
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            วันที่ทำรายการ
                                        </p>
                                        <p>
                                            {formatDate(
                                                selectedWithdraw.created_at
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            อัพเดทล่าสุด
                                        </p>
                                        <p>
                                            {formatDate(
                                                selectedWithdraw.updated_at
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {selectedWithdraw.items &&
                                    selectedWithdraw.items.length > 0 && (
                                        <div className="mt-6">
                                            <p className="font-medium mb-3">
                                                รายการที่เบิก:
                                            </p>
                                            <Table>
                                                <Table.Head>
                                                    <Table.HeadCell>
                                                        รายการ
                                                    </Table.HeadCell>
                                                    <Table.HeadCell>
                                                        จำนวน
                                                    </Table.HeadCell>
                                                    <Table.HeadCell>
                                                        หน่วย
                                                    </Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body>
                                                    {selectedWithdraw.items.map(
                                                        (item, index) => (
                                                            <Table.Row
                                                                key={index}
                                                            >
                                                                <Table.Cell>
                                                                    {item.type ===
                                                                    "ingredient"
                                                                        ? item
                                                                              .ingredient_lot
                                                                              ?.details?.[0]
                                                                              ?.ingredient
                                                                              ?.name
                                                                        : item
                                                                              .consumable_lot
                                                                              ?.details?.[0]
                                                                              ?.consumable
                                                                              ?.name}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {item.unit}
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    )}
                                                </Table.Body>
                                            </Table>
                                        </div>
                                    )}
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
            </AuthenticatedLayout>
        </AdminLayout>
    );
}
