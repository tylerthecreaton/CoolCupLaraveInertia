import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Breadcrumb,
    Table,
    Button,
    Modal,
    Badge,
    Pagination,
    Tooltip,
} from "flowbite-react";
import { HiHome, HiCalendar, HiEye } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa";
import { HiOutlineTrash, HiOutlineRefresh } from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Swal from "sweetalert2";

export default function Index({ auth, lots }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedLot, setSelectedLot] = useState(null);

    const handleShowDetails = (lot) => {
        setSelectedLot(lot);
        setShowModal(true);
    };

    const handleRevert = (lotId) => {
        Swal.fire({
            title: "ยืนยันการคืนค่า Lot",
            text: "คุณต้องการคืนค่า Lot นี้ใช่หรือไม่? การกระทำนี้จะลบ Lot และคืนค่าจำนวนวัตถุดิบกลับไปยังค่าก่อนหน้า",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.ingredient-lots.revert", lotId), {
                    preserveScroll: true,
                    onBefore: () => {
                        Swal.fire({
                            title: "กำลังดำเนินการ...",
                            text: "กรุณารอสักครู่",
                            allowOutsideClick: false,
                            showConfirmButton: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                        });
                    },
                    onSuccess: () => {
                        Swal.fire({
                            title: "สำเร็จ!",
                            text: "คืนค่า Lot เรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                        });
                    },
                    onError: (errors) => {
                        Swal.fire({
                            title: "เกิดข้อผิดพลาด!",
                            text: errors.message || "ไม่สามารถคืนค่า Lot ได้",
                            icon: "error",
                        });
                    },
                });
            }
        });
    };

    const handleDispose = (lotId, ingredientName) => {
        Swal.fire({
            title: "ยืนยันการจำหน่ายวัตถุดิบ",
            text: `คุณต้องการจำหน่าย ${ingredientName} ที่หมดอายุใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "จำหน่าย",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.ingredient-lots.expired.dispose", lotId), {
                    preserveScroll: true,
                    onBefore: () => {
                        Swal.fire({
                            title: "กำลังดำเนินการ...",
                            text: "กรุณารอสักครู่",
                            allowOutsideClick: false,
                            showConfirmButton: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                        });
                    },
                    onSuccess: () => {
                        Swal.fire({
                            title: "สำเร็จ!",
                            text: "จำหน่ายวัตถุดิบหมดอายุเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                        });
                    },
                    onError: (errors) => {
                        Swal.fire({
                            title: "เกิดข้อผิดพลาด!",
                            text: errors.message || "ไม่สามารถจำหน่ายวัตถุดิบได้",
                            icon: "error",
                        });
                    },
                });
            }
        });
    };

    const handleDelete = (lotId) => {
        Swal.fire({
            title: "ยืนยันการลบ Lot",
            text: "คุณต้องการลบ Lot นี้ใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.ingredient-lots.destroy", lotId), {
                    preserveScroll: true,
                    onBefore: () => {
                        Swal.fire({
                            title: "กำลังดำเนินการ...",
                            text: "กรุณารอสักครู่",
                            allowOutsideClick: false,
                            showConfirmButton: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                        });
                    },
                    onSuccess: () => {
                        Swal.fire({
                            title: "สำเร็จ!",
                            text: "ลบ Lot เรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                        });
                    },
                    onError: (errors) => {
                        Swal.fire({
                            title: "เกิดข้อผิดพลาด!",
                            text: errors.message || "ไม่สามารถลบ Lot ได้",
                            icon: "error",
                        });
                    },
                });
            }
        });
    };

    const onPageChange = (page) => {
        router.get(route("admin.ingredient-lots.index", { page }));
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

    const calculateRemainingDays = (expirationDate) => {
        if (!expirationDate) return null;
        const today = new Date();
        const expDate = new Date(expirationDate);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getRemainingDaysDisplay = (remainingDays) => {
        if (remainingDays === null) return "-";
        if (remainingDays < 0) {
            return <Badge color="failure">หมดอายุแล้ว {Math.abs(remainingDays)} วัน</Badge>;
        } else if (remainingDays === 0) {
            return <Badge color="failure">หมดอายุวันนี้</Badge>;
        } else if (remainingDays <= 7) {
            return <Badge color="warning">เหลือ {remainingDays} วัน</Badge>;
        } else {
            return <Badge color="success">เหลือ {remainingDays} วัน</Badge>;
        }
    };

    const getIngredientListTooltip = (details) => {
        return (
            <div className="max-w-xs">
                <p className="font-medium mb-2">รายการวัตถุดิบที่เพิ่ม:</p>
                <ul className="list-disc list-inside space-y-1">
                    {details.map((detail) => (
                        <li key={detail.id} className="text-sm">
                            {detail.ingredient?.name} ({detail.quantity} x {detail.per_pack} {detail.ingredient?.unit?.name || ""})
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    ประวัติการเพิ่ม Lot วัตถุดิบ
                </h2>
            }
        >
            <Head title="ประวัติการเพิ่ม Lot วัตถุดิบ" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item
                            href={route("dashboard")}
                            icon={HiHome}
                        >
                            หน้าแรก
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>จัดการวัตถุดิบ</Breadcrumb.Item>
                    </Breadcrumb>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="flex items-center text-xl font-semibold text-gray-800">
                                    <HiCalendar className="mr-2 w-6 h-6 text-gray-600" />
                                    ประวัติการเพิ่ม Lot วัตถุดิบ
                                </h2>
                                <Link
                                    href={route("admin.ingredient-lots.create")}
                                >
                                    <Button gradientDuoTone="greenToBlue">
                                        <FaPlus className="mr-2 w-4 h-4" />
                                        เพิ่ม Lot ใหม่
                                    </Button>
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <Table hoverable>
                                    <Table.Head>
                                        <Table.HeadCell className="bg-gray-50">
                                            Lot Number
                                        </Table.HeadCell>
                                        <Table.HeadCell className="bg-gray-50">
                                            วันที่บันทึก
                                        </Table.HeadCell>
                                        <Table.HeadCell className="bg-gray-50">
                                            จำนวนรายการ
                                        </Table.HeadCell>
                                        <Table.HeadCell className="bg-gray-50">
                                            ผู้บันทึก
                                        </Table.HeadCell>
                                        <Table.HeadCell className="bg-gray-50">
                                            การจัดการ
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {lots.data.map((lot) => (
                                            <Table.Row
                                                key={lot.id}
                                                className="bg-white transition-colors duration-150 hover:bg-gray-50"
                                            >
                                                <Table.Cell className="whitespace-nowrap">
                                                    <Badge
                                                        color="info"
                                                        className="px-3 py-1"
                                                    >
                                                        #{lot.lot_number}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {formatDate(lot.created_at)}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Tooltip
                                                        content={getIngredientListTooltip(lot.details)}
                                                        style="auto"
                                                        placement="right"
                                                        animation="duration-300"
                                                    >
                                                        <Badge
                                                            color="success"
                                                            className="px-3 py-1 cursor-help"
                                                        >
                                                            {lot.details.length}{" "}
                                                            รายการ
                                                        </Badge>
                                                    </Tooltip>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {lot.user?.name || "-"}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            gradientDuoTone="purpleToBlue"
                                                            onClick={() =>
                                                                handleShowDetails(
                                                                    lot
                                                                )
                                                            }
                                                        >
                                                            <HiEye className="mr-2 w-4 h-4" />
                                                            ดูรายละเอียด
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            gradientDuoTone="pinkToOrange"
                                                            onClick={() =>
                                                                handleRevert(lot.id)
                                                            }
                                                        >
                                                            <HiOutlineRefresh className="mr-2 w-4 h-4" />
                                                            คืนค่า
                                                        </Button>
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>

                            {lots.links && lots.links.length > 3 && (
                                <div className="flex items-center justify-center mt-4">
                                    <Pagination
                                        currentPage={lots.current_page}
                                        totalPages={lots.last_page}
                                        onPageChange={onPageChange}
                                        showIcons={true}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} size="7xl">
                <Modal.Header>
                    <div className="flex items-center">
                        <HiCalendar className="mr-2 w-5 h-5 text-gray-600" />
                        รายละเอียด Lot #{selectedLot?.lot_number} วันที่{" "}
                        <span className="ml-1 font-medium">
                            {selectedLot && formatDate(selectedLot.created_at)}
                        </span>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="overflow-x-auto">
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell className="bg-gray-50">
                                        วัตถุดิบ
                                    </Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">
                                        จำนวน
                                    </Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">
                                        ปริมาณต่อแพ็ค
                                    </Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">
                                        ปริมาณรวม
                                    </Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">
                                        ราคาต่อหน่วย
                                    </Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">
                                        ราคารวม
                                    </Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">
                                        วันหมดอายุ
                                    </Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">
                                        จำนวนวันที่หมดอายุ
                                    </Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">
                                        หมายเหตุ
                                    </Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">
                                        การจัดการ
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {selectedLot?.details.map((detail) => {
                                        const remainingDays = calculateRemainingDays(detail.expiration_date);
                                        const isExpired = remainingDays !== null && remainingDays <= 0;

                                        return (
                                            <Table.Row
                                                key={detail.id}
                                                className="bg-white"
                                            >
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                                    {detail.ingredient?.name}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {detail.quantity}{" "}
                                                    {detail.ingredient?.unit?.name}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {detail.per_pack}{" "}
                                                    {detail.ingredient?.unit?.name || ""}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {detail.per_pack *
                                                        detail.quantity}{" "}
                                                    {detail.ingredient?.unit?.name || ""}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {detail.cost_per_unit.toLocaleString()}{" "}
                                                    บาท
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {detail.price.toLocaleString()}{" "}
                                                    บาท
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {detail.expiration_date
                                                        ? new Date(
                                                        detail.expiration_date
                                                        ).toLocaleDateString()
                                                        : "-"}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {getRemainingDaysDisplay(remainingDays)}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {detail.notes || "-"}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {isExpired && (
                                                        <Button
                                                            size="sm"
                                                            gradientDuoTone="redToYellow"
                                                            onClick={() =>
                                                                handleDispose(detail.id, detail.ingredient?.name)
                                                            }
                                                        >
                                                            <HiOutlineTrash className="mr-2 w-4 h-4" />
                                                            จำหน่าย
                                                        </Button>
                                                    )}
                                                </Table.Cell>
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        gradientDuoTone="pinkToOrange"
                        onClick={() => handleRevert(selectedLot?.id)}
                    >
                        <HiOutlineRefresh className="mr-2 w-4 h-4" />
                        คืนค่า Lot
                    </Button>
                    <Button
                        color="gray"
                        onClick={() => setShowModal(false)}
                    >
                        ปิด
                    </Button>
                </Modal.Footer>
            </Modal>
        </AuthenticatedLayout>
    );
}
