import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Breadcrumb, Table, Button, Modal } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function IngredientLotHistory({ lots }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedLotDetails, setSelectedLotDetails] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleShowDetails = async (date) => {
        try {
            const response = await axios.get(
                route("admin.ingredient-lots.details", date)
            );
            setSelectedLotDetails(response.data);
            setSelectedDate(date);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching lot details:", error);
        }
    };

    const handleRevert = (id) => {
        Swal.fire({
            title: "ยืนยันการคืนค่า",
            text: "การคืนค่าจะลบ Lot นี้และลดจำนวนวัตถุดิบ คุณต้องการดำเนินการต่อหรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.ingredient-lots.revert", id), {
                    onSuccess: () => {
                        setShowModal(false);
                        Swal.fire({
                            title: "สำเร็จ!",
                            text: "คืนค่า Lot เรียบร้อยแล้ว",
                            icon: "success",
                        });
                    },
                });
            }
        });
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
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    ประวัติการเพิ่ม Lot วัตถุดิบ
                </h2>
            }
        >
            <Head title="ประวัติการเพิ่ม Lot วัตถุดิบ" />

            <div className="py-12">
                <Breadcrumb className="px-4 lg:px-6 py-2 mb-4">
                    <Breadcrumb.Item href={route("dashboard")} icon={HiHome}>
                        หน้าแรก
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>จัดการวัตถุดิบ</Breadcrumb.Item>
                </Breadcrumb>

                <AdminLayout>
                    <div className="flex justify-end mb-4">
                        <Link href={route("admin.ingredient-lots.create")}>
                            <Button>
                                <FaPlus className="mr-2 h-4 w-4" />
                                เพิ่ม Lot ใหม่
                            </Button>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>วันที่บันทึก</Table.HeadCell>
                                <Table.HeadCell>จำนวนรายการ</Table.HeadCell>
                                <Table.HeadCell>การจัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {lots.data.map((lot) => (
                                    <Table.Row
                                        key={lot.created_at}
                                        className="bg-white"
                                    >
                                        <Table.Cell>
                                            <button
                                                onClick={() =>
                                                    handleShowDetails(
                                                        lot.created_at.split(
                                                            "T"
                                                        )[0]
                                                    )
                                                }
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {formatDate(lot.created_at)}
                                            </button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {lot.total_items} รายการ
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                color="info"
                                                size="sm"
                                                onClick={() =>
                                                    handleShowDetails(
                                                        lot.created_at.split(
                                                            "T"
                                                        )[0]
                                                    )
                                                }
                                            >
                                                ดูรายละเอียด
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    {/* Lot Details Modal */}
                    <Modal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        size="4xl"
                    >
                        <Modal.Header>
                            รายละเอียด Lot วันที่{" "}
                            {selectedDate && formatDate(selectedDate)}
                        </Modal.Header>
                        <Modal.Body>
                            <div className="overflow-x-auto">
                                <Table hoverable>
                                    <Table.Head>
                                        <Table.HeadCell>
                                            วัตถุดิบ
                                        </Table.HeadCell>
                                        <Table.HeadCell>จำนวน</Table.HeadCell>
                                        <Table.HeadCell>
                                            วันหมดอายุ
                                        </Table.HeadCell>
                                        <Table.HeadCell>
                                            หมายเหตุ
                                        </Table.HeadCell>
                                        <Table.HeadCell>
                                            ผู้บันทึก
                                        </Table.HeadCell>
                                        <Table.HeadCell>
                                            การจัดการ
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {selectedLotDetails.map((detail) => (
                                            <Table.Row
                                                key={detail.id}
                                                className="bg-white"
                                            >
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                                    {detail.ingredient.name}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {detail.quantity}{" "}
                                                    {
                                                        detail.ingredient.unit
                                                            ?.abbreviation
                                                    }
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {formatDate(
                                                        detail.expiration_date
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {detail.notes}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {detail.user.name}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Button
                                                        color="failure"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRevert(
                                                                detail.id
                                                            )
                                                        }
                                                    >
                                                        คืนค่า
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                        <div className="flex flex-1 justify-between sm:hidden">
                            {lots.prev_page_url && (
                                <Link
                                    href={lots.prev_page_url}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    ก่อนหน้า
                                </Link>
                            )}
                            {lots.next_page_url && (
                                <Link
                                    href={lots.next_page_url}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    ถัดไป
                                </Link>
                            )}
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    แสดง{" "}
                                    <span className="font-medium">
                                        {lots.from || 0}
                                    </span>{" "}
                                    ถึง{" "}
                                    <span className="font-medium">
                                        {lots.to || 0}
                                    </span>{" "}
                                    จากทั้งหมด{" "}
                                    <span className="font-medium">
                                        {lots.total}
                                    </span>{" "}
                                    รายการ
                                </p>
                            </div>
                            <div>
                                <nav
                                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                    aria-label="Pagination"
                                >
                                    {lots.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                link.active
                                                    ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                            } ${
                                                !link.url
                                                    ? "cursor-not-allowed opacity-50"
                                                    : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                </AdminLayout>
            </div>
        </AuthenticatedLayout>
    );
}
