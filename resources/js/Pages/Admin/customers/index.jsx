import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, Button, Table, TextInput, Pagination } from "flowbite-react";
import { HiHome, HiSearch, HiPlus, HiPencil, HiTrash, HiUser } from "react-icons/hi";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Index({ customersPaginate }) {
    const { current_page, next_page_url, prev_page_url, last_page } = customersPaginate;
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(current_page);

    useEffect(() => {
        setCustomers(customersPaginate.data);
        setFilteredCustomers(customersPaginate.data);
    }, [customersPaginate]);

    useEffect(() => {
        const results = customers.filter((customer) =>
            Object.values({
                name: customer.name,
                phone_number: customer.phone_number,
                birthdate: customer.birthdate
            }).some((value) =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredCustomers(results);
    }, [searchTerm, customers]);

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
                router.delete(route("admin.customers.destroy", id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "ลูกค้าถูกลบเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
        router.get(
            route("admin.customers.index"),
            { page },
            {
                preserveState: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการสมาชิก
                </h2>
            }
        >
            <Head title="จัดการสมาชิก" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="overflow-hidden">
                        <div className="p-6 space-y-6">
                            {/* Header Section */}
                            <div className="flex items-center gap-4">
                                <div className="p-3 text-white bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                                    <HiUser className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">รายชื่อสมาชิก</h2>
                                    <p className="text-sm text-gray-500">จัดการข้อมูลสมาชิกทั้งหมด</p>
                                </div>
                            </div>

                            {/* Search and Add Button */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="w-full sm:max-w-xs">
                                    <TextInput
                                        icon={HiSearch}
                                        placeholder="ค้นหาสมาชิก..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <Link href={route("admin.customers.create")}>
                                    <Button gradientDuoTone="greenToBlue" className="w-full sm:w-auto">
                                        <HiPlus className="w-4 h-4 mr-2" />
                                        เพิ่มสมาชิก
                                    </Button>
                                </Link>
                            </div>

                            {/* Customers Table */}
                            <div className="overflow-x-auto">
                                <Table hoverable>
                                    <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <Table.HeadCell className="font-semibold text-gray-900">ลำดับ</Table.HeadCell>
                                        <Table.HeadCell className="font-semibold text-gray-900">ชื่อ</Table.HeadCell>
                                        <Table.HeadCell className="font-semibold text-gray-900">เบอร์โทร</Table.HeadCell>
                                        <Table.HeadCell className="font-semibold text-gray-900">วันเกิด</Table.HeadCell>
                                        <Table.HeadCell className="font-semibold text-gray-900">วันที่เป็นสมาชิก</Table.HeadCell>
                                        <Table.HeadCell className="font-semibold text-gray-900">
                                            <span className="sr-only">Actions</span>
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y divide-gray-200">
                                        {filteredCustomers.map((customer, index) => (
                                            <Table.Row
                                                key={customer.id}
                                                className="bg-white hover:bg-gray-50/60 transition-colors"
                                            >
                                                <Table.Cell className="font-medium text-gray-900">
                                                    {(current_page - 1) * customersPaginate.per_page + index + 1}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="font-medium text-gray-900">{customer.name}</div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="text-gray-600">{customer.phone_number}</div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="text-gray-600">{formatDate(customer.birthdate)}</div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="text-gray-600">{formatDate(customer.created_at)}</div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={route("admin.customers.edit", customer.id)}>
                                                            <Button color="info" size="sm">
                                                                <HiPencil className="w-4 h-4 mr-1" />
                                                                แก้ไข
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            color="failure"
                                                            size="sm"
                                                            onClick={() => handleDelete(customer.id)}
                                                        >
                                                            <HiTrash className="w-4 h-4 mr-1" />
                                                            ลบ
                                                        </Button>
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                        {filteredCustomers.length === 0 && (
                                            <Table.Row>
                                                <Table.Cell colSpan={6} className="text-center py-10">
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <svg
                                                            className="w-12 h-12 mb-4 text-gray-400"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        <p className="text-lg font-medium">ไม่พบข้อมูลสมาชิก</p>
                                                        <p className="mt-1 text-sm">
                                                            ลองค้นหาด้วยคำค้นอื่น หรือล้างตัวกรอง
                                                        </p>
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                            </div>

                            {/* Pagination Section */}
                            <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 bg-gray-50 rounded-lg sm:flex-row">
                                <div className="text-sm text-gray-700">
                                    แสดง{" "}
                                    <span className="font-medium">{customersPaginate.from || 0}</span>{" "}
                                    ถึง{" "}
                                    <span className="font-medium">{customersPaginate.to || 0}</span>{" "}
                                    จาก{" "}
                                    <span className="font-medium">{customersPaginate.total || 0}</span>{" "}
                                    รายการ
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* <Button
                                        size="sm"
                                        disabled={currentPage === 1}
                                        onClick={() => onPageChange(1)}
                                    >
                                        หน้าแรก
                                    </Button> */}
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={last_page}
                                        onPageChange={onPageChange}
                                        showIcons
                                        layout="pagination"
                                        theme={{
                                            pages: {
                                                base: "xs:mt-0 mt-2 inline-flex items-center -space-x-px",
                                                showIcon: "inline-flex",
                                                previous: {
                                                    base: "ml-0 rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                                                    icon: "h-5 w-5"
                                                },
                                                next: {
                                                    base: "rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                                                    icon: "h-5 w-5"
                                                },
                                                selector: {
                                                    base: "border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                                                    active: "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
                                                    disabled: "opacity-50 cursor-normal"
                                                }
                                            }
                                        }}
                                    />
                                    {/* <Button
                                        size="sm"
                                        disabled={currentPage === last_page}
                                        onClick={() => onPageChange(last_page)}
                                    >
                                        หน้าสุดท้าย
                                    </Button> */}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
