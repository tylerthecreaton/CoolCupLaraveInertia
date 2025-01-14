import React, { useEffect, useState } from "react";
import { Table, Badge, Breadcrumb, TextInput, Pagination } from "flowbite-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { HiHome, HiSearch } from "react-icons/hi";

export default function Index({ transactions }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (value) => {
        setSearchTerm(value);
        router.get(
            route("admin.transactions.index"),
            { search: value },
            { preserveState: true }
        );
    };

    const handlePageChange = (page) => {
        router.get(
            route("admin.transactions.index"),
            { page, search: searchTerm },
            { preserveState: true }
        );
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case "ADD":
                return (
                    <Badge color="success" className="w-24 justify-center">
                        เพิ่มวัตถุดิบ
                    </Badge>
                );
            case "USE":
                return (
                    <Badge color="warning" className="w-24 justify-center">
                        ใช้วัตถุดิบ
                    </Badge>
                );
            default:
                return type;
        }
    };

    const formatDate = (dateString) => {
        try {
            const utcDate = new Date(dateString);
            const date = new Date(utcDate.getTime());

            if (isNaN(date.getTime())) {
                return "-";
            }

            const thaiMonths = [
                "มกราคม",
                "กุมภาพันธ์",
                "มีนาคม",
                "เมษายน",
                "พฤษภาคม",
                "มิถุนายน",
                "กรกฎาคม",
                "สิงหาคม",
                "กันยายน",
                "ตุลาคม",
                "พฤศจิกายน",
                "ธันวาคม",
            ];

            const day = date.getDate();
            const month = thaiMonths[date.getMonth()];
            const year = date.getFullYear() + 543;
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            return `${day} ${month} ${year} ${hours}:${minutes} น.`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "-";
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("th-TH", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(Math.abs(amount));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    ประวัติการเคลื่อนไหวของวัตถุดิบ
                </h2>
            }
        >
            <Head title="ประวัติการเคลื่อนไหวของวัตถุดิบ" />
            <AdminLayout className="container p-8 mx-auto mt-5 bg-white rounded-lg shadow-sm">
                <div className="space-y-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-between">
                        <Breadcrumb
                            aria-label="Breadcrumb navigation"
                            className="py-2"
                        >
                            <Breadcrumb.Item
                                href={route("dashboard")}
                                icon={HiHome}
                            >
                                หน้าแรก
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                ประวัติการเคลื่อนไหวของวัตถุดิบ
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={HiSearch}
                                placeholder="ค้นหาประวัติ..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ลำดับ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    วัตถุดิบ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ประเภท
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    จำนวน
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    หมายเหตุ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    วันที่
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y divide-gray-200">
                                {transactions.data?.map((transaction, index) => (
                                    <Table.Row
                                        key={transaction.id}
                                        className="bg-white transition-colors hover:bg-gray-50"
                                    >
                                        <Table.Cell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {transactions.from + index}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 font-medium">
                                            {transaction.ingredient.name}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            {getTypeLabel(transaction.usage_type)}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4 text-right font-medium">
                                            {formatAmount(transaction.amount)}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            {transaction.note}
                                        </Table.Cell>
                                        <Table.Cell className="px-6 py-4">
                                            {formatDate(transaction.created_at)}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center">
                        <Pagination
                            currentPage={transactions.current_page}
                            totalPages={transactions.last_page}
                            onPageChange={handlePageChange}
                            showIcons={true}
                        />
                    </div>
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
