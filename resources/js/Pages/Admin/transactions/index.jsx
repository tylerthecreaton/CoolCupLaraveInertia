import React, { useState } from "react";
import { Table, Badge, Breadcrumb, Card, Tooltip, Pagination, Select } from "flowbite-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { FaList, FaSearch, FaExchangeAlt, FaInfoCircle, FaPlus, FaMinus, FaFilter } from "react-icons/fa";
import { HiHome } from "react-icons/hi";

export default function Index({ auth, transactions, filters }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState(filters?.type || "today");
    const [customStartDate, setCustomStartDate] = useState(filters?.startDate || "");
    const [customEndDate, setCustomEndDate] = useState(filters?.endDate || "");

    const handleSearch = (value) => {
        setSearchTerm(value);
        router.get(
            route("admin.transactions.index"),
            { 
                search: value,
                filterType: filterType,
                startDate: filterType === 'custom' ? customStartDate : null,
                endDate: filterType === 'custom' ? customEndDate : null,
            },
            { preserveState: true }
        );
    };

    const handleFilterSubmit = () => {
        router.get(
            route("admin.transactions.index"),
            {
                search: searchTerm,
                filterType: filterType,
                startDate: filterType === 'custom' ? customStartDate : null,
                endDate: filterType === 'custom' ? customEndDate : null,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handlePageChange = (page) => {
        router.get(
            route("admin.transactions.index"),
            { 
                page, 
                search: searchTerm,
                filterType: filterType,
                startDate: filterType === 'custom' ? customStartDate : null,
                endDate: filterType === 'custom' ? customEndDate : null,
            },
            { preserveState: true }
        );
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case "ADD":
                return (
                    <Badge color="success" className="w-24 justify-center">
                        <div className="flex items-center gap-1">
                            <FaPlus className="w-3 h-3" />
                            <span>เพิ่มวัตถุดิบ</span>
                        </div>
                    </Badge>
                );
            case "USE":
                return (
                    <Badge color="warning" className="w-24 justify-center">
                        <div className="flex items-center gap-1">
                            <FaMinus className="w-3 h-3" />
                            <span>ใช้วัตถุดิบ</span>
                        </div>
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
                "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
                "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
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
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <div className="mb-6">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">ประวัติการเคลื่อนไหว</p>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Card className="shadow-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md">
                                <FaExchangeAlt className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">ประวัติการเคลื่อนไหว</h2>
                                <p className="text-sm text-gray-500">ประวัติการเพิ่มและใช้วัตถุดิบทั้งหมด</p>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaSearch className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm"
                                        placeholder="ค้นหาประวัติ..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                                <Select
                                    className="w-full sm:w-40"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="today">วันนี้</option>
                                    <option value="week">สัปดาห์นี้</option>
                                    <option value="custom">กำหนดเอง</option>
                                    <option value="all">ทั้งหมด</option>
                                </Select>
                                {filterType === "custom" && (
                                    <>
                                        <input
                                            type="date"
                                            className="w-full sm:w-40 rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm"
                                            value={customStartDate}
                                            onChange={(e) => setCustomStartDate(e.target.value)}
                                        />
                                        <input
                                            type="date"
                                            className="w-full sm:w-40 rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm"
                                            value={customEndDate}
                                            onChange={(e) => setCustomEndDate(e.target.value)}
                                        />
                                    </>
                                )}
                                <button
                                    onClick={handleFilterSubmit}
                                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaFilter className="w-4 h-4" />
                                    กรอง
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable className="shadow-sm">
                            <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <Table.HeadCell className="font-semibold text-gray-700">ลำดับ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">วัตถุดิบ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">ประเภท</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">จำนวน</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">หมายเหตุ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">วันที่</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {transactions.data?.map((transaction, index) => (
                                    <Table.Row
                                        key={transaction.id}
                                        className="bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <Table.Cell className="font-medium text-gray-900 whitespace-nowrap">
                                            #{transactions.from + index}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Tooltip
                                                content={
                                                    <div className="p-2 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <FaExchangeAlt className="w-4 h-4 text-indigo-400" />
                                                                <span className="font-medium">{transaction.ingredient.name}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <div>
                                                                    <p className="text-gray-500">ประเภท:</p>
                                                                    <div className="mt-1">
                                                                        {getTypeLabel(transaction.usage_type)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500">จำนวน:</p>
                                                                    <p className="font-medium">{formatAmount(transaction.amount)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm">
                                                                <p className="text-gray-500">หมายเหตุ:</p>
                                                                <p className="font-medium">{transaction.note || 'ไม่มีหมายเหตุ'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="flex items-center gap-2 cursor-pointer">
                                                    <span className="font-medium text-gray-900">{transaction.ingredient.name}</span>
                                                    <FaInfoCircle className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell>{getTypeLabel(transaction.usage_type)}</Table.Cell>
                                        <Table.Cell className="font-medium">
                                            {formatAmount(transaction.amount)}
                                        </Table.Cell>
                                        <Table.Cell>{transaction.note || '-'}</Table.Cell>
                                        <Table.Cell>{formatDate(transaction.created_at)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    <div className="flex items-center justify-center text-center mt-4">
                        <Pagination
                            currentPage={transactions.current_page}
                            totalPages={transactions.last_page}
                            onPageChange={handlePageChange}
                            showIcons={true}
                        />
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
