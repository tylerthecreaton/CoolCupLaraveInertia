import React, { useState } from "react";
import { Table, Badge, Breadcrumb, Card, Tooltip, Pagination, Select } from "flowbite-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { FaList, FaSearch, FaExchangeAlt, FaInfoCircle, FaPlus, FaMinus, FaFilter } from "react-icons/fa";
import { HiHome, HiTrash } from "react-icons/hi";

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
                    <Badge color="success" className="justify-center w-24">
                        <div className="flex gap-1 items-center">
                            <FaPlus className="w-3 h-3" />
                            <span>เพิ่มวัตถุดิบ</span>
                        </div>
                    </Badge>
                );
            case "USE":
                return (
                    <Badge color="warning" className="justify-center w-24">
                        <div className="flex gap-1 items-center">
                            <FaMinus className="w-3 h-3" />
                            <span>ใช้วัตถุดิบ</span>
                        </div>
                    </Badge>
                );
            case "DISPOSE":
                return (
                    <Badge color="failure" className="justify-center w-24">
                        <div className="flex gap-1 items-center">
                            <HiTrash className="w-3 h-3" />
                            <span>จำหน่าย</span>
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
                            <p className="text-gray-700 transition-colors hover:text-blue-600">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <p className="text-gray-700 transition-colors hover:text-blue-600">ประวัติการเคลื่อนไหว</p>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Card className="shadow-lg">
                    <div className="flex flex-col gap-4 justify-between items-start mb-6 lg:flex-row lg:items-center">
                        <div className="flex gap-3 items-center">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md">
                                <FaExchangeAlt className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">ประวัติการเคลื่อนไหว</h2>
                                <p className="text-sm text-gray-500">ประวัติการเพิ่มและใช้วัตถุดิบทั้งหมด</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full lg:flex-row lg:w-auto">
                            <div className="flex flex-col gap-2 w-full sm:flex-row">
                                <div className="relative flex-1">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <FaSearch className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block py-2 pr-3 pl-10 w-full text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
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
                                            className="w-full text-sm rounded-lg border-gray-200 sm:w-40 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                                            value={customStartDate}
                                            onChange={(e) => setCustomStartDate(e.target.value)}
                                        />
                                        <input
                                            type="date"
                                            className="w-full text-sm rounded-lg border-gray-200 sm:w-40 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                                            value={customEndDate}
                                            onChange={(e) => setCustomEndDate(e.target.value)}
                                        />
                                    </>
                                )}
                                <button
                                    onClick={handleFilterSubmit}
                                    className="flex gap-2 justify-center items-center px-4 py-2 w-full text-white bg-indigo-600 rounded-lg transition-colors sm:w-auto hover:bg-indigo-700"
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
                                <Table.HeadCell className="w-24 font-semibold text-gray-700">ลำดับ</Table.HeadCell>
                                <Table.HeadCell className="w-48 font-semibold text-gray-700">วัตถุดิบ</Table.HeadCell>
                                <Table.HeadCell className="w-32 font-semibold text-gray-700">ประเภท</Table.HeadCell>
                                <Table.HeadCell className="w-32 font-semibold text-gray-700">จำนวน</Table.HeadCell>
                                <Table.HeadCell className="w-80 font-semibold text-gray-700">หมายเหตุ</Table.HeadCell>
                                <Table.HeadCell className="w-52 font-semibold text-gray-700">วันที่</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {transactions.data?.map((transaction, index) => (
                                    <Table.Row
                                        key={transaction.id}
                                        className="bg-white transition-colors hover:bg-gray-50"
                                    >
                                        <Table.Cell className="w-24 font-medium text-gray-900 whitespace-nowrap">
                                            #{transactions.from + index}
                                        </Table.Cell>
                                        <Table.Cell className="w-48">
                                            <Tooltip
                                                content={
                                                    <div className="p-2 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="flex gap-2 items-center">
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
                                                                    <p className={`font-medium ${transaction.usage_type === 'USE' ? 'text-red-600' : 'text-green-600'}`}>
                                                                        {transaction.usage_type === 'USE' ? '-' : '+'}{formatAmount(transaction.amount)} {transaction.ingredient.unit?.abbreviation || transaction.ingredient.unit?.name}
                                                                    </p>
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
                                                <div className="flex gap-2 items-center cursor-pointer">
                                                    <span className="font-medium text-gray-900">{transaction.ingredient.name}</span>
                                                    <FaInfoCircle className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell className="w-32">{getTypeLabel(transaction.usage_type)}</Table.Cell>
                                        <Table.Cell className={`text-right font-medium w-32 ${transaction.usage_type === 'USE' ? 'text-red-600' : 'text-green-600'}`}>
                                            {transaction.usage_type === 'USE' ? '-' : '+'}{formatAmount(transaction.amount)} {transaction.ingredient.unit?.abbreviation || transaction.ingredient.unit?.name}
                                        </Table.Cell>
                                        <Table.Cell className="w-80">{transaction.note || '-'}</Table.Cell>
                                        <Table.Cell className="w-52">{formatDate(transaction.created_at)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    <div className="flex justify-center items-center mt-4 text-center">
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
