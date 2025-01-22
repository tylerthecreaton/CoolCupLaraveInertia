import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Breadcrumb, Table, Button, Modal, Badge, Pagination } from "flowbite-react";
import { HiHome, HiCalendar, HiEye } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ConsumableLotDetail from "@/Components/ConsumableLotDetail";

export default function ConsumableLotHistory({ lots }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedLot, setSelectedLot] = useState(null);

    const handleShowDetails = (lot) => {
        setSelectedLot(lot);
        setShowModal(true);
    };

    const onPageChange = (page) => {
        router.get(route('admin.consumables.lots.index', { page }));
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    ประวัติการเพิ่ม Lot วัตถุดิบสิ้นเปลือง
                </h2>
            }
        >
            <AdminLayout>
                <Head title="ประวัติการเพิ่ม Lot วัตถุดิบสิ้นเปลือง" />

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
                                จัดการวัตถุดิบสิ้นเปลือง
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="flex items-center text-xl font-semibold text-gray-800">
                                        <HiCalendar className="mr-2 w-6 h-6 text-gray-600" />
                                        ประวัติการเพิ่ม Lot วัตถุดิบสิ้นเปลือง
                                    </h2>
                                    <Link
                                        href={route(
                                            "admin.consumables.lots.create"
                                        )}
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
                                                        <Badge
                                                            color="success"
                                                            className="px-3 py-1"
                                                        >
                                                            {lot.details.length}{" "}
                                                            รายการ
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {lot.user.name}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Button
                                                            size="sm"
                                                            gradientDuoTone="purpleToBlue"
                                                            onClick={() => handleShowDetails(lot)}
                                                        >
                                                            <HiEye className="mr-2 w-4 h-4" />
                                                            ดูรายละเอียด
                                                        </Button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                    <div className="flex items-center justify-center text-center">
                                        <Pagination
                                            currentPage={lots.current_page}
                                            totalPages={lots.last_page}
                                            onPageChange={onPageChange}
                                        />
                                    </div>
                                </div>

                                <Modal
                                    show={showModal}
                                    onClose={() => setShowModal(false)}
                                    size="7xl"
                                >
                                    <Modal.Header className="bg-gray-50">
                                        <div className="flex items-center">
                                            <HiCalendar className="mr-2 w-5 h-5 text-gray-600" />
                                            รายละเอียด Lot #{selectedLot?.lot_number} วันที่{" "}
                                            <span className="ml-1 font-medium">
                                                {selectedLot && formatDate(selectedLot.created_at)}
                                            </span>
                                        </div>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <ConsumableLotDetail lot={selectedLot} />
                                    </Modal.Body>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
