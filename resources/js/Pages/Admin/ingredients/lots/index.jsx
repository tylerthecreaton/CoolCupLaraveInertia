import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Breadcrumb,
    Table,
    Button,
    Modal,
    Badge,
    Pagination,
} from "flowbite-react";
import { HiHome, HiCalendar, HiEye } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa";
import { HiOutlineTrash, HiOutlineRefresh } from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, lots }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedLot, setSelectedLot] = useState(null);

    const handleShowDetails = (lot) => {
        setSelectedLot(lot);
        setShowModal(true);
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
                                                    <Badge
                                                        color="success"
                                                        className="px-3 py-1"
                                                    >
                                                        {lot.details.length}{" "}
                                                        รายการ
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {lot.user?.name || "-"}
                                                </Table.Cell>
                                                <Table.Cell>
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
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>

                            {lots.links && lots.links.length > 3 && (
                                <div className="flex items-center justify-center space-x-1 mt-4">
                                    {lots.links.map((link, index) => (
                                        <button
                                            key={index}
                                            className={`px-4 py-2 text-sm rounded-lg ${
                                                link.active
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-white text-gray-500 hover:bg-gray-50"
                                            }`}
                                            onClick={() =>
                                                onPageChange(
                                                    link.url?.split("page=")[1]
                                                )
                                            }
                                            disabled={!link.url}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                size="7xl"
            >
                <Modal.Header>
                    รายละเอียด Lot #{selectedLot?.lot_number}
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
                                        หมายเหตุ
                                    </Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">
                                        <span className="sr-only">Actions</span>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {selectedLot?.details.map((detail, index) => (
                                        <Table.Row
                                            key={index}
                                            className="bg-white"
                                        >
                                            <Table.Cell>
                                                {detail.ingredient.name}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {detail.quantity}{" "}

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
                                                {detail.note || "-"}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('คุณแน่ใจหรือไม่ที่จะคืนค่าข้อมูล Lot นี้?')) {
                                                                router.delete(route("admin.ingredient-lots.revert", selectedLot.id));
                                                            }
                                                        }}
                                                        className="text-yellow-700 hover:text-yellow-900"
                                                    >
                                                        <HiOutlineRefresh className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูล Lot นี้?')) {
                                                                router.delete(route("admin.ingredient-lots.destroy", selectedLot.id));
                                                            }
                                                        }}
                                                        className="text-red-700 hover:text-red-900"
                                                    >
                                                        <HiOutlineTrash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </AuthenticatedLayout>
    );
}
