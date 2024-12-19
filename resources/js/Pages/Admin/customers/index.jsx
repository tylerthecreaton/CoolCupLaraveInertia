import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Breadcrumb, Pagination, Table, TextInput, Badge } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome, HiSearch, HiPlus, HiPencil, HiTrash, HiPhone, HiCalendar, HiClock } from "react-icons/hi";
import Swal from "sweetalert2";

export default function index({ customersPaginate }) {
    const { current_page, next_page_url, prev_page_url } = customersPaginate;
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    const onPageChange = (page) => {
        page > current_page
            ? router.get(next_page_url)
            : router.get(prev_page_url);
    };

    useEffect(() => {
        setCustomers(customersPaginate.data);
        setFilteredCustomers(customersPaginate.data);
    }, [customersPaginate]);

    useEffect(() => {
        const results = customers.filter(customer =>
            Object.values({
                name: customer.name,
                phone_number: customer.phone_number,
                birthdate: customer.birthdate
            }).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredCustomers(results);
    }, [searchTerm, customers]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
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
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.customers.destroy", id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "สมาชิกถูกลบเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false
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
                    จัดการสมาชิก
                </h2>
            }
        >
            <Head title="จัดการสมาชิก" />
            <AdminLayout className="container p-8 mx-auto mt-5 bg-white rounded-lg shadow-sm">
                <div className="space-y-6">
                    <Breadcrumb aria-label="Breadcrumb navigation">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            หน้าแรก
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>สมาชิกทั้งหมด</Breadcrumb.Item>
                    </Breadcrumb>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={HiSearch}
                                placeholder="ค้นหาสมาชิก..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link
                            href={route("admin.customers.create")}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        >
                            <HiPlus className="w-5 h-5 mr-2" />
                            เพิ่มสมาชิก
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="px-6 py-3">ลําดับ</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">ชื่อ</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">เบอร์โทร</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">วันเกิด</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">วันที่เป็นสมาชิก</Table.HeadCell>
                                <Table.HeadCell className="px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {filteredCustomers.map((customer) => (
                                    <Table.Row
                                        className="bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                                        key={customer.id}
                                    >
                                        <Table.Cell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {(current_page - 1) * customersPaginate.per_page +
                                                filteredCustomers.indexOf(customer) + 1}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 font-medium">
                                            {customer.name}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="inline-flex items-center text-gray-600">
                                                <HiPhone className="w-4 h-4 mr-1" />
                                                {customer.phone_number}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="inline-flex items-center text-gray-600">
                                                <HiCalendar className="w-4 h-4 mr-1" />
                                                {customer.birthdate}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="inline-flex items-center text-gray-600">
                                                <HiClock className="w-4 h-4 mr-1" />
                                                {formatDate(customer.created_at)}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={route("admin.customers.edit", customer.id)}
                                                    className="inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700"
                                                >
                                                    <HiPencil className="w-4 h-4 mr-1" />
                                                    แก้ไข
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700"
                                                >
                                                    <HiTrash className="w-4 h-4 mr-1" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            ไม่พบข้อมูลสมาชิก
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row">
                        <div className="text-sm text-gray-700 dark:text-gray-400">
                            แสดง <span className="font-semibold text-gray-900">{customersPaginate.from}</span> ถึง{" "}
                            <span className="font-semibold text-gray-900">{customersPaginate.to}</span> จาก{" "}
                            <span className="font-semibold text-gray-900">{customersPaginate.total}</span> รายการ
                        </div>
                        <Pagination
                            currentPage={current_page}
                            totalPages={customersPaginate.last_page}
                            onPageChange={onPageChange}
                            showIcons
                            className="inline-flex mt-2 sm:mt-0"
                        />
                    </div>
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
