import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Breadcrumb, Table, Button, Modal, Badge } from "flowbite-react";
import { HiHome, HiCalendar, HiEye, HiArrowPath } from "react-icons/hi2";
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

    const getExpirationStatus = (expirationDate) => {
        const today = new Date();
        const expDate = new Date(expirationDate);
        const daysUntilExpiration = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiration < 0) {
            return { color: "failure", text: "หมดอายุแล้ว" };
        } else if (daysUntilExpiration <= 7) {
            return { color: "warning", text: `อีก ${daysUntilExpiration} วันจะหมดอายุ` };
        } else {
            return { color: "success", text: `อีก ${daysUntilExpiration} วันจะหมดอายุ` };
        }
    };

    return (
        <AuthenticatedLayout
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
                        <Breadcrumb.Item href={route("dashboard")} icon={HiHome}>
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
                                <Link href={route("admin.ingredient-lots.create")}>
                                    <Button gradientDuoTone="greenToBlue">
                                        <FaPlus className="mr-2 w-4 h-4" />
                                        เพิ่ม Lot ใหม่
                                    </Button>
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <Table hoverable>
                                    <Table.Head>
                                        <Table.HeadCell className="bg-gray-50">วันที่บันทึก</Table.HeadCell>
                                        <Table.HeadCell className="bg-gray-50">จำนวนรายการ</Table.HeadCell>
                                        <Table.HeadCell className="bg-gray-50">การจัดการ</Table.HeadCell>
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
                                                    <Badge color="info" className="px-3 py-1">
                                                        {lot.total_items} รายการ
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

                            {/* Lot Details Modal */}
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
                                                <Table.HeadCell className="bg-gray-50">วัตถุดิบ</Table.HeadCell>
                                                <Table.HeadCell className="bg-gray-50">จำนวน</Table.HeadCell>
                                                <Table.HeadCell className="bg-gray-50">วันหมดอายุ</Table.HeadCell>
                                                <Table.HeadCell className="bg-gray-50">สถานะ</Table.HeadCell>
                                                <Table.HeadCell className="bg-gray-50">หมายเหตุ</Table.HeadCell>
                                                <Table.HeadCell className="bg-gray-50">ผู้บันทึก</Table.HeadCell>
                                                <Table.HeadCell className="bg-gray-50">การจัดการ</Table.HeadCell>
                                            </Table.Head>
                                            <Table.Body className="divide-y">
                                                {selectedLotDetails.map((detail) => {
                                                    const expirationStatus = getExpirationStatus(detail.expiration_date);
                                                    return (
                                                        <Table.Row
                                                            key={detail.id}
                                                            className="bg-white transition-colors duration-150 hover:bg-gray-50"
                                                        >
                                                            <Table.Cell className="font-medium text-gray-900">
                                                                {detail.ingredient.name}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <span className="font-medium">
                                                                    {detail.quantity}{" "}
                                                                    {detail.ingredient.unit?.abbreviation}
                                                                </span>
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {formatDate(detail.expiration_date)}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <Badge color={expirationStatus.color}>
                                                                    {expirationStatus.text}
                                                                </Badge>
                                                            </Table.Cell>
                                                            <Table.Cell>{detail.notes}</Table.Cell>
                                                            <Table.Cell>{detail.user.name}</Table.Cell>
                                                            <Table.Cell>
                                                                <div className="flex items-center space-x-2">
                                                                    {/* ปุ่มจำหน่าย - แสดงเฉพาะเมื่อวัตถุดิบหมดอายุ */}
                                                                    {new Date(detail.expiration_date) < new Date() && detail.status !== 'disposed' && (
                                                                        <form onSubmit={(e) => {
                                                                            e.preventDefault();
                                                                            Swal.fire({
                                                                                title: 'ยืนยันการจำหน่าย?',
                                                                                text: "คุณต้องการจำหน่ายวัตถุดิบนี้ใช่หรือไม่?",
                                                                                icon: 'warning',
                                                                                showCancelButton: true,
                                                                                confirmButtonColor: '#3085d6',
                                                                                cancelButtonColor: '#d33',
                                                                                confirmButtonText: 'ยืนยัน',
                                                                                cancelButtonText: 'ยกเลิก'
                                                                            }).then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    router.post(route('admin.ingredient-lots.dispose', detail.id));
                                                                                }
                                                                            });
                                                                        }}>
                                                                            <button
                                                                                type="submit"
                                                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 w-4 h-4">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                                </svg>
                                                                                จำหน่าย
                                                                            </button>
                                                                        </form>
                                                                    )}
                                                                    <Button
                                                                        size="sm"
                                                                        color="failure"
                                                                        onClick={() => handleRevert(detail.id)}
                                                                    >
                                                                        <HiArrowPath className="mr-2 w-4 h-4" />
                                                                        คืนค่า
                                                                    </Button>
                                                                </div>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    );
                                                })}
                                            </Table.Body>
                                        </Table>
                                    </div>
                                </Modal.Body>
                            </Modal>

                            {/* Pagination */}
                            <div className="flex justify-between items-center px-4 py-3 mt-4 bg-white border-t border-gray-200 sm:px-6">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    {lots.prev_page_url && (
                                        <Link
                                            href={lots.prev_page_url}
                                            className="inline-flex relative items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="mr-1 w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                            </svg>
                                            ก่อนหน้า
                                        </Link>
                                    )}
                                    {lots.next_page_url && (
                                        <Link
                                            href={lots.next_page_url}
                                            className="inline-flex relative items-center px-3 py-2 ml-3 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                        >
                                            ถัดไป
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-1 w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            แสดง{" "}
                                            <span className="font-medium">{lots.from || 0}</span>{" "}
                                            ถึง{" "}
                                            <span className="font-medium">{lots.to || 0}</span>{" "}
                                            จากทั้งหมด{" "}
                                            <span className="font-medium">{lots.total}</span>{" "}
                                            รายการ
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="inline-flex isolate -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                            {lots.links.map((link, i) => {
                                                // ข้าม link ที่เป็น prev/next เพราะเราจะแสดงปุ่มของเราเอง
                                                if (link.label.includes('Previous') || link.label.includes('Next')) {
                                                    return null;
                                                }

                                                // แปลงข้อความ Previous/Next เป็นภาษาไทย
                                                let label = link.label;
                                                if (label === '&laquo; Previous') {
                                                    label = 'ก่อนหน้า';
                                                } else if (label === 'Next &raquo;') {
                                                    label = 'ถัดไป';
                                                }

                                                return (
                                                    <Link
                                                        key={i}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                            link.active
                                                                ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                                : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                                        } ${!link.url ? "cursor-not-allowed opacity-50" : ""}`}
                                                    >
                                                        {label}
                                                    </Link>
                                                );
                                            })}
                                            {lots.next_page_url && (
                                                <Link
                                                    href={lots.next_page_url}
                                                    className="inline-flex relative items-center px-3 py-2 text-gray-900 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                >
                                                    <span className="sr-only">ถัดไป</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </Link>
                                            )}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
