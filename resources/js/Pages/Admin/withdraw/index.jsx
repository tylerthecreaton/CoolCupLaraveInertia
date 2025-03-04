import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Breadcrumb,
    Button,
    Pagination,
    Table,
    Card,
    Badge,
    Modal,
} from "flowbite-react";
import { useState } from "react";
import { FaList, FaPlus, FaEdit, FaTrash, FaBoxes, FaCalendarAlt, FaUser, FaFolder, FaInfoCircle, FaSearch } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import Swal from "sweetalert2";

export default function Index({ auth, withdraws }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedWithdraw, setSelectedWithdraw] = useState(null);
    const [search, setSearch] = useState("");

    const handleShowDetails = (withdraw) => {
        setSelectedWithdraw(withdraw);
        setShowModal(true);
    };

    const onPageChange = (page) => {
        router.get(route("admin.withdraw.index", { page }));
    };

    // ฟังก์ชันแปลงวันที่เป็นรูปแบบไทย
    const formatThaiDate = (dateString) => {
        const date = new Date(dateString);
        const thaiYear = date.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${thaiYear}`;
    };

    const getStatusColor = (status) => {
        const colors = {
            'completed': 'success',
            'pending': 'warning',
            'cancelled': 'failure'
        };
        return colors[status] || 'info';
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

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(route("admin.withdraw.index", { search: e.target.value }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการการเบิกวัตถุดิบ/วัตถุดิบสิ้นเปลือง
                </h2>
            }
        >
            <AdminLayout>
                <Head title="รายการเบิกวัตถุดิบ/วัตถุดิบสิ้นเปลือง" />
                <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                    <div className="mb-6">
                        <Breadcrumb aria-label="Default breadcrumb example">
                            <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                                <p className="text-gray-700 transition-colors hover:text-blue-600">หน้าแรก</p>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href={route("admin.withdraw.index")}>
                                <p className="text-gray-700 transition-colors hover:text-blue-600">การเบิก</p>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <Card className="max-w-full shadow-lg">
                        <div className="flex flex-col gap-4 justify-between items-start mb-6 lg:flex-row lg:items-center">
                            <div className="flex gap-3 items-center">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                                    <FaBoxes className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">รายการเบิก</h2>
                                    <p className="text-sm text-gray-500">จัดการข้อมูลการเบิกทั้งหมด</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full sm:flex-row lg:w-auto">
                                <div className="relative flex-1 lg:w-64">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <FaSearch className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block py-2 pr-3 pl-10 w-full text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        placeholder="ค้นหาการเบิก..."
                                        value={search}
                                        onChange={handleSearch}
                                    />
                                </div>
                                <Link href={route("admin.withdraw.create")}>
                                    <Button gradientDuoTone="greenToBlue" size="sm" className="w-full shadow-sm transition-all duration-200 sm:w-auto hover:shadow-md">
                                        <FaPlus className="mr-2 w-4 h-4" />
                                        เพิ่มการเบิก
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table hoverable className="shadow-sm">
                                <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <Table.HeadCell className="w-16 font-semibold text-gray-700">รหัส</Table.HeadCell>
                                    <Table.HeadCell className="font-semibold text-gray-700">ผู้เบิก</Table.HeadCell>
                                    <Table.HeadCell className="font-semibold text-gray-700">รายการ</Table.HeadCell>
                                    <Table.HeadCell className="w-32 font-semibold text-gray-700">สถานะ</Table.HeadCell>
                                    <Table.HeadCell className="w-32 font-semibold text-gray-700">วันที่</Table.HeadCell>
                                    <Table.HeadCell className="w-32 font-semibold text-right text-gray-700">จัดการ</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {withdraws.data.map((withdraw) => (
                                        <Table.Row
                                            key={withdraw.id}
                                            className="bg-white transition-colors hover:bg-gray-50"
                                        >
                                            <Table.Cell className="font-medium text-gray-900 whitespace-nowrap">
                                                #{withdraw.id}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex gap-2 items-center">
                                                    <div className="flex justify-center items-center w-8 h-8 font-medium text-blue-600 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full">
                                                        {withdraw.user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium">{withdraw.user?.name}</span>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="space-y-1.5">
                                                    {withdraw.items.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center text-sm"
                                                        >
                                                            <Badge
                                                                color={item.type === "ingredient" ? "info" : "warning"}
                                                                className="mr-2"
                                                            >
                                                                {item.type === "ingredient" ? "วัตถุดิบ" : "วัตถุดิบสิ้นเปลือง"}
                                                            </Badge>
                                                            <span className="font-medium">
                                                                {item.transformer?.name}
                                                            </span>
                                                            <span className="mx-1">-</span>
                                                            <div className="flex items-center space-x-1">
                                                                <Badge
                                                                    color="success"
                                                                    className="px-2 py-1"
                                                                >
                                                                    {Math.floor(item.quantity)} ชิ้น
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge color={getStatusColor(withdraw.status)} className="w-fit">
                                                    {getStatusColor(withdraw.status) === 'warning' ? 'รอดำเนินการ' :
                                                    getStatusColor(withdraw.status) === 'info' ? 'กําลังดำเนินการ' :
                                                    getStatusColor(withdraw.status) === 'success' ? 'สําเร็จ' :
                                                    getStatusColor(withdraw.status) === 'failure' ? 'ยกเลิก' : ''}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="text-sm text-gray-900">
                                                    {formatThaiDate(withdraw.created_at)}

                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        gradientDuoTone="purpleToBlue"
                                                        size="sm"
                                                        className="transition-all duration-200 hover:shadow-md"
                                                        onClick={() => {
                                                            setSelectedWithdraw(withdraw);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <FaInfoCircle className="w-4 h-4" />
                                                    </Button>
                                                    {withdraw.status !== "cancelled" && (
                                                        <Button
                                                            color="failure"
                                                            size="sm"
                                                            className="transition-all duration-200 hover:shadow-md"
                                                            onClick={() => {
                                                                Swal.fire({
                                                                    title: "คุณต้องการยกเลิกการเบิกนี้ใช่หรือไม่?",
                                                                    icon: "warning",
                                                                    showCancelButton: true,
                                                                    confirmButtonColor: "#3085d6",
                                                                    cancelButtonColor: "#d33",
                                                                    confirmButtonText: "ใช่, ยกเลิก",
                                                                    cancelButtonText: "ไม่",
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        router.post(
                                                                            route(
                                                                                "admin.withdraw.rollback",
                                                                                withdraw.id
                                                                            ),
                                                                            {
                                                                                _method: "DELETE",
                                                                            }
                                                                        );
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>

                        <div className="mt-4">
                            <Pagination
                                currentPage={withdraws.current_page}
                                totalPages={withdraws.last_page}
                                onPageChange={(page) => {
                                    router.get(route("admin.withdraw.index", { page }));
                                }}
                                showIcons={true}
                                className="flex justify-center"
                            />
                        </div>
                    </Card>
                </div>

                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    size="xl"
                    className="dark:bg-gray-800"
                    dismissible
                >
                    <Modal.Header className="border-b border-gray-200 !p-6 bg-gradient-to-r from-blue-50 to-white">
                        <div className="flex gap-3 items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaBoxes className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">รายละเอียดการเบิก</h3>
                                <p className="mt-1 text-sm text-gray-500">ข้อมูลเพิ่มเติมเกี่ยวกับการเบิก</p>
                            </div>
                        </div>
                    </Modal.Header>
                    <Modal.Body className="!p-6">
                        {selectedWithdraw && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex gap-3 items-center mb-4">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <FaUser className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900">ข้อมูลผู้เบิก</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="mb-1 text-sm font-medium text-gray-500">ผู้เบิก</p>
                                                <div className="flex gap-2 items-center">
                                                    <div className="flex justify-center items-center w-8 h-8 font-medium text-blue-600 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full">
                                                        {selectedWithdraw.user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <Badge color="gray" size="md" className="w-fit">
                                                        {selectedWithdraw.user?.name}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex gap-3 items-center mb-4">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900">วันที่เบิก</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-white px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700">
                                                <div className="flex gap-2 items-center">
                                                    <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                                    <span>{formatThaiDate(selectedWithdraw.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 space-y-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex gap-3 items-center">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FaBoxes className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900">รายการที่เบิก</h4>
                                    </div>
                                    <div className="space-y-3">
                                        {selectedWithdraw.items.map((item, index) => (
                                            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2 items-center">
                                                            <Badge
                                                                color={item.type === "ingredient" ? "info" : "warning"}
                                                                className="px-2.5 py-0.5"
                                                            >
                                                                {item.type === "ingredient" ? "วัตถุดิบ" : "วัตถุดิบสิ้นเปลือง"}
                                                            </Badge>
                                                            <span className="font-medium text-gray-900">
                                                                {item.transformer?.name}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-600">
                                                                จำนวน: {item.quantity} ชิ้น{item.transformer?.unit?.name}
                                                            </p>
                                                            <div className="text-sm text-gray-600">
                                                                <p>ชื่อวัตถุดิบ: {item.type === "ingredient"
                                                                    ? item.ingredient_lot?.details?.[0]?.ingredient?.name
                                                                    : item.consumable_lot?.details?.[0]?.consumable?.name || "-"}
                                                                </p>
                                                                <p>Lot ID: #{item.type === "ingredient"
                                                                    ? item.ingredient_lot?.id
                                                                    : item.consumable_lot?.id || "-"}
                                                                </p>
                                                                <p>วันที่เบิก: {formatThaiDate(selectedWithdraw.created_at)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge color={getStatusColor(item.status)}>
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="border-t border-gray-200 !p-6 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex gap-3 justify-end w-full">
                            <Button
                                color="gray"
                                size="sm"
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 shadow-sm hover:bg-gray-100"
                            >
                                ปิด
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
