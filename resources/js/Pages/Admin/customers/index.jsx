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
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-between">
                        <Breadcrumb aria-label="Breadcrumb navigation" className="py-2">
                            <Breadcrumb.Item href={route('dashboard')} icon={HiHome}>
                                หน้าแรก
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>สมาชิกทั้งหมด</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    {/* Search and Add Customer */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={HiSearch}
                                placeholder="ค้นหาสมาชิก..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <Link
                            href={route("admin.customers.create")}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:scale-105"
                        >
                            <HiPlus className="w-5 h-5 mr-2" />
                            เพิ่มสมาชิก
                        </Link>
                    </div>

                    {/* Customers Table */}
                    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ลําดับ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ชื่อ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    เบอร์โทร
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    วันเกิด
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    วันที่เป็นสมาชิก
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    <span className="sr-only">Actions</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y divide-gray-200">
                                {filteredCustomers.map((customer, index) => (
                                    <Table.Row
                                        key={customer.id}
                                        className="bg-white transition-colors duration-150 hover:bg-gray-50/60"
                                    >
                                        <Table.Cell className="px-6 py-4 font-medium text-gray-900">
                                            {(current_page - 1) * customersPaginate.per_page + index + 1}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex-shrink-0 w-10 h-10 overflow-hidden rounded-full">
                                                    {customer.image ? (
                                                        <img
                                                            src={`/images/customers/${customer.image}`}
                                                            alt={customer.name}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-white bg-primary-600 rounded-full">
                                                            {customer.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {customer.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 text-gray-600">
                                            {customer.phone_number}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 text-gray-600">
                                            {new Date(customer.birthdate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="inline-flex items-center text-gray-600">
                                                <HiClock className="w-4 h-4 mr-1" />
                                                {formatDate(customer.created_at)}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route("admin.customers.edit", customer.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors duration-150"
                                                >
                                                    <HiPencil className="w-4 h-4 mr-1.5" />
                                                    แก้ไข
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150"
                                                >
                                                    <HiTrash className="w-4 h-4 mr-1.5" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} className="px-6 py-8 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <p className="text-lg font-medium">ไม่พบข้อมูลสมาชิก</p>
                                                <p className="mt-1 text-sm">ลองค้นหาด้วยคำค้นอื่น หรือล้างตัวกรอง</p>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-700">
                            แสดง <span className="font-medium text-gray-900">{customersPaginate.from}</span> ถึง{" "}
                            <span className="font-medium text-gray-900">{customersPaginate.to}</span> จาก{" "}
                            <span className="font-medium text-gray-900">{customersPaginate.total}</span> รายการ
                        </div>
                        <div className="flex justify-center">
                            <Pagination
                                currentPage={current_page}
                                onPageChange={onPageChange}
                                showIcons={true}
                                totalPages={Math.ceil(customersPaginate.total / customersPaginate.per_page)}
                            />
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
