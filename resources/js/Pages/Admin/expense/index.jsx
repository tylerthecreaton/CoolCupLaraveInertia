import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Button, Pagination, Table, Card, Badge, Modal, Tooltip } from "flowbite-react";
import { FaList, FaPlus, FaEdit, FaTrash, FaDollarSign, FaCalendarAlt, FaUser, FaFolder, FaInfoCircle, FaSearch } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { useState } from "react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function Index({ expenses }) {
    const [search, setSearch] = useState("");
    const [selectedExpense, setSelectedExpense] = useState(null);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(
            route("admin.expenses.index"),
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

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
                router.delete(route("admin.expenses.destroy", id), {
                    preserveState: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "รายจ่ายถูกลบเรียบร้อยแล้ว",
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
                    จัดการรายจ่าย
                </h2>
            }
        >
            <Head title="จัดการรายจ่าย" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <div className="mb-6">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href={route("admin.expenses.index")}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">รายจ่าย</p>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Card className="shadow-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                                <FaList className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">รายการรายจ่าย</h2>
                                <p className="text-sm text-gray-500">จัดการข้อมูลรายจ่ายทั้งหมด</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
                                    placeholder="ค้นหารายจ่าย..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                            <Link href={route("admin.expenses.create")}>
                                <Button gradientDuoTone="greenToBlue" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200">
                                    <FaPlus className="mr-2 w-4 h-4" />
                                    เพิ่มรายจ่าย
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable className="shadow-sm">
                            <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <Table.HeadCell className="font-semibold text-gray-700 w-16">รหัส</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">ชื่อ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 w-32">หมวดหมู่</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 w-32">ราคา</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 w-32">โดย</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 w-32">วันที่</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 w-32 text-right">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {expenses.data.map((expense) => (
                                    <Table.Row
                                        key={expense.id}
                                        className="bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <Table.Cell className="font-medium text-gray-900 whitespace-nowrap">
                                            #{expense.id}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Tooltip 
                                                content={
                                                    <div className="p-2 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <FaFolder className="w-4 h-4 text-blue-400" />
                                                                <span className="font-medium">{expense.name}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <div>
                                                                    <p className="text-gray-500">หมวดหมู่:</p>
                                                                    <p className="font-medium">{expense.expense_category?.name || 'ไม่มีหมวดหมู่'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500">ราคา:</p>
                                                                    <p className="font-medium text-red-600">{formatAmount(expense.amount)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm">
                                                                <p className="text-gray-500">รายละเอียด:</p>
                                                                <p className="font-medium">{expense.description || 'ไม่มีรายละเอียด'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                animation="duration-300"
                                                style="light"
                                                placement="right"
                                            >
                                                <button
                                                    onClick={() => setSelectedExpense(expense)}
                                                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
                                                >
                                                    {expense.name}
                                                    <FaInfoCircle className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                                                </button>
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge color="info" className="w-fit whitespace-nowrap">
                                                {expense.expense_category?.name || 'ไม่มีหมวดหมู่'}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell className="font-semibold text-red-600 whitespace-nowrap">
                                            {formatAmount(expense.amount)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge color="gray" className="w-fit whitespace-nowrap">
                                                {expense.user?.name}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge color="success" className="w-fit whitespace-nowrap">
                                                {expense.created_at ? formatDate(expense.created_at) : 'ไม่มีวันที่'}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    color="failure"
                                                    size="sm"
                                                    className="transition-all duration-200 hover:shadow-md"
                                                    onClick={() => handleDelete(expense.id)}
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    <div className="mt-4">
                        <Pagination
                            currentPage={expenses.current_page}
                            totalPages={expenses.last_page}
                            onPageChange={(page) => {
                                router.get(route("admin.expenses.index", { page }));
                            }}
                            showIcons={true}
                            className="flex justify-center"
                        />
                    </div>
                </Card>
            </div>

            <Modal
                show={selectedExpense !== null}
                onClose={() => setSelectedExpense(null)}
                size="xl"
                className="dark:bg-gray-800"
                dismissible
            >
                <Modal.Header className="border-b border-gray-200 !p-6 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                            <FaDollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">รายละเอียดรายจ่าย</h3>
                            <p className="text-sm text-gray-500 mt-1">ข้อมูลเพิ่มเติมเกี่ยวกับรายจ่าย</p>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="!p-6">
                    {selectedExpense && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FaUser className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900">ข้อมูลผู้บันทึก</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">ผู้บันทึก</p>
                                            <Badge color="gray" size="md" className="w-fit">
                                                {selectedExpense.user?.name}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900">วันที่บันทึก</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                                <span>{formatDate(selectedExpense.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 space-y-5 border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FaDollarSign className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900">ราคา</h4>
                                    </div>
                                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-xl shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <FaDollarSign className="w-4 h-4" />
                                            <span className="text-lg font-bold">{formatAmount(selectedExpense.amount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 space-y-5 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FaFolder className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900">รายละเอียดเพิ่มเติม</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 min-h-[140px] relative">
                                        <div className="absolute -top-2.5 right-3 bg-gray-100 px-3 py-0.5 rounded-full text-xs text-gray-500">
                                            รายละเอียด
                                        </div>
                                        {selectedExpense.description ? (
                                            <div className="space-y-2">
                                                {selectedExpense.description.split('\n').map((item, index) => (
                                                    item.trim() && (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <div className="mt-1.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                            </div>
                                                            <p className="flex-1">{item.trim()}</p>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-[100px] text-gray-500">
                                                <p>ไม่มีรายละเอียด</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-t border-gray-200 !p-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-end w-full gap-3">
                        <Button
                            color="gray"
                            size="sm"
                            onClick={() => setSelectedExpense(null)}
                            className="px-5 py-2.5 shadow-sm hover:bg-gray-100"
                        >
                            ปิด
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </AuthenticatedLayout>
    );
}
