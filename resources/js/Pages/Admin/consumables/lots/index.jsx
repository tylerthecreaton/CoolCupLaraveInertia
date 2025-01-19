import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Breadcrumb, Table, Button, Modal, Badge } from "flowbite-react";
import { HiHome, HiCalendar, HiEye } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ConsumableLotHistory({ lots }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedLotDetails, setSelectedLotDetails] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleShowDetails = async (date) => {
        try {
            const response = await axios.get(
                route("admin.consumables.lots.details", date)
            );
            setSelectedLotDetails(response.data);
            setSelectedDate(date);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching lot details:", error);
        }
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
                                                วันที่บันทึก
                                            </Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-50">
                                                จำนวนรายการ
                                            </Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-50">
                                                การจัดการ
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y">
                                            {lots.data.map((lot) => (
                                                <Table.Row
                                                    key={lot.created_at}
                                                    className="bg-white transition-colors duration-150 hover:bg-gray-50"
                                                >
                                                    <Table.Cell className="whitespace-nowrap">
                                                        <button
                                                            onClick={() =>
                                                                handleShowDetails(
                                                                    lot.created_at.split("T")[0]
                                                                )
                                                            }
                                                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                        >
                                                            {formatDate(lot.created_at)}
                                                        </button>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Badge
                                                            color="info"
                                                            className="px-3 py-1"
                                                        >
                                                            {lot.total_items}{" "}
                                                            รายการ
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Button
                                                            size="sm"
                                                            gradientDuoTone="purpleToBlue"
                                                            onClick={() =>
                                                                handleShowDetails(
                                                                    lot.created_at.split("T")[0]
                                                                )
                                                            }
                                                        >
                                                            <HiEye className="mr-2 w-4 h-4" />
                                                            ดูรายละเอียด
                                                        </Button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>

                                <Modal
                                    show={showModal}
                                    onClose={() => setShowModal(false)}
                                    size="7xl"
                                >
                                    <Modal.Header className="bg-gray-50">
                                        <div className="flex items-center">
                                            <HiCalendar className="mr-2 w-5 h-5 text-gray-600" />
                                            รายละเอียด Lot วันที่{" "}
                                            <span className="ml-1 font-medium">
                                                {selectedDate && formatDate(selectedDate)}
                                            </span>
                                        </div>
                                    </Modal.Header>
                                    <Modal.Body>
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
                                                        ราคาต่อหน่วย
                                                    </Table.HeadCell>
                                                    <Table.HeadCell className="bg-gray-50">
                                                        จำนวนต่อแพ็ค
                                                    </Table.HeadCell>
                                                    <Table.HeadCell className="bg-gray-50">
                                                        ราคา
                                                    </Table.HeadCell>
                                                    <Table.HeadCell className="bg-gray-50">
                                                        ผู้จำหน่าย
                                                    </Table.HeadCell>
                                                    <Table.HeadCell className="bg-gray-50">
                                                        หมายเหตุ
                                                    </Table.HeadCell>
                                                    <Table.HeadCell className="bg-gray-50">
                                                        ผู้บันทึก
                                                    </Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body className="divide-y">
                                                    {selectedLotDetails.map((detail) => (
                                                        <Table.Row
                                                            key={detail.id}
                                                            className="bg-white hover:bg-gray-50"
                                                        >
                                                            <Table.Cell>
                                                                <div className="font-medium text-gray-900">
                                                                    {detail.consumable.name}
                                                                </div>
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <span className="font-medium">
                                                                    {detail.quantity}{" "}
                                                                    {detail.consumable.unit}
                                                                </span>
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <span className="font-medium">
                                                                    ฿{detail.cost_per_unit.toLocaleString()}
                                                                </span>
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <span className="font-medium">
                                                                    {detail.per_pack}
                                                                </span>
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <span className="font-medium">
                                                                    ฿{detail.price.toLocaleString()}
                                                                </span>
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {detail.supplier}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {detail.note}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {detail.user.name}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    ))}
                                                </Table.Body>
                                            </Table>
                                        </div>
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
