import React, { useState, useCallback, useEffect, useRef } from "react";
import {
    Button,
    Datepicker,
    Label,
    TextInput,
    Card,
    Badge,
    Table,
    Pagination
} from "flowbite-react";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import debounce from "lodash/debounce";
import dayjs from "dayjs";
import "dayjs/locale/th";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {
    FaUser,
    FaPhone,
    FaCalendarAlt,
    FaClock,
    FaSearch,
    FaStar,
    FaShoppingBag,
    FaCreditCard,
    FaFilter,
    FaUndo,
    FaFileInvoice,
} from "react-icons/fa";
import ViewReceiptModal from "@/Components/home/ViewReceiptModal";
import Swal from 'sweetalert2';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("th");

export default function MainContent({ customer }) {
    const [formData, setFormData] = useState({
        name: customer?.name || "",
        phone_number: customer?.phone_number || "",
        birthdate: customer?.birthdate ? new Date(customer.birthdate) : "",
        created_at: customer?.created_at || "",
        search: "",
    });

    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null,
    });

    const [pointDateRange, setPointDateRange] = useState({
        startDate: null,
        endDate: null,
    });

    const [filteredOrders, setFilteredOrders] = useState(customer?.orders?.data || []);
    const [filteredPointUsages, setFilteredPointUsages] = useState(
        customer?.point_usages?.data || []
    );

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);

    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    const formatDate = (date) => {
        return dayjs(date).format("DD/MM/YYYY HH:mm");
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat("th-TH").format(number);
    };

    const getPointTypeColor = (type) => {
        return type === "plus" ? "success" : "failure";
    };

    const getPointTypeText = (type) => {
        return type === "plus" ? "รับคะแนน" : "ใช้คะแนน";
    };

    const formatPoints = (points) => {
        return points ? formatNumber(parseFloat(points).toFixed(2)) : "0.00";
    };

    const renderPagination = (paginationData, type) => {
        if (!paginationData?.total) return null;

        const onPageChange = (page) => {
            const customerId = customer?.id;
            if (!customerId) return;

            const pageParam = type === 'orders' ? 'orders_page' : 'point_usages_page';

            router.get(
                `/member?id=${customerId}&${pageParam}=${page}&type=${type}`,
                {},
                { preserveState: true, preserveScroll: true }
            );
        };

        return (
            <div className="flex flex-col gap-4 items-center mt-4">
                <Pagination
                    currentPage={paginationData.current_page}
                    totalPages={Math.ceil(paginationData.total / paginationData.per_page)}
                    onPageChange={onPageChange}
                    showIcons={true}
                    layout="pagination"
                    previousLabel="ย้อนกลับ"
                    nextLabel="ถัดไป"
                />
                <div className="text-sm text-gray-700">
                    แสดง {((paginationData.current_page - 1) * paginationData.per_page) + 1} ถึง {Math.min(paginationData.current_page * paginationData.per_page, paginationData.total)} จากทั้งหมด {paginationData.total} รายการ
                </div>
            </div>
        );
    };

    // Create a debounced search function for auto-suggestion
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.length >= 2) {
                try {
                    const response = await axios.get("/member/search", {
                        params: { query },
                    });
                    setSuggestions(response.data.suggestions);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Search error:", error);
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300),
        []
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "search") {
            debouncedSearch(value);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setFormData({
            name: suggestion.name,
            phone_number: suggestion.phone_number,
            birthdate: suggestion.birthdate
                ? new Date(suggestion.birthdate)
                : "",
            created_at: suggestion.created_at,
            search: "",
        });
        setSuggestions([]);
        setShowSuggestions(false);
        router.get(`/member?id=${suggestion.id}`);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".search-container")) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            completed: "success",
            pending: "warning",
            cancelled: "failure",
        };
        return colors[status] || "info";
    };

    const handleViewReceipt = (receiptPath) => {
        if (!receiptPath) {
            Swal.fire({
                icon: "error",
                title: "ไม่สามารถแสดงใบเสร็จได้",
                text: "ไม่พบไฟล์ใบเสร็จในระบบ",
            });
            return;
        }

        // Remove any leading slash if present
        const cleanPath = receiptPath.startsWith('/') ? receiptPath.slice(1) : receiptPath;

        fetch(`/images/receipt/${cleanPath}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('ไม่พบไฟล์ใบเสร็จ');
                }
                setSelectedReceipt(`/images/receipt/${cleanPath}`);
                setShowReceiptModal(true);
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "ไม่สามารถแสดงใบเสร็จได้",
                    text: "ไม่พบไฟล์ใบเสร็จในระบบ",
                });
            });
    };

    const handleDateChange = (type, date) => {
        const customerId = customer?.id;
        if (!customerId) return;

        if (type === 'start') {
            setDateRange(prev => ({ ...prev, startDate: date }));
            if (dateRange.endDate) {
                router.get(
                    `/member?id=${customerId}&startDate=${dayjs(date).format('YYYY-MM-DD')}&endDate=${dayjs(dateRange.endDate).format('YYYY-MM-DD')}&type=orders`,
                    {},
                    { preserveState: true, preserveScroll: true }
                );
            }
        } else {
            setDateRange(prev => ({ ...prev, endDate: date }));
            if (dateRange.startDate) {
                router.get(
                    `/member?id=${customerId}&startDate=${dayjs(dateRange.startDate).format('YYYY-MM-DD')}&endDate=${dayjs(date).format('YYYY-MM-DD')}&type=orders`,
                    {},
                    { preserveState: true, preserveScroll: true }
                );
            }
        }
    };

    const handlePointDateChange = (type, date) => {
        const customerId = customer?.id;
        if (!customerId) return;

        if (type === 'start') {
            setPointDateRange(prev => ({ ...prev, startDate: date }));
            if (pointDateRange.endDate) {
                router.get(
                    `/member?id=${customerId}&pointStartDate=${dayjs(date).format('YYYY-MM-DD')}&pointEndDate=${dayjs(pointDateRange.endDate).format('YYYY-MM-DD')}&type=point_usages`,
                    {},
                    { preserveState: true, preserveScroll: true }
                );
            }
        } else {
            setPointDateRange(prev => ({ ...prev, endDate: date }));
            if (pointDateRange.startDate) {
                router.get(
                    `/member?id=${customerId}&pointStartDate=${dayjs(pointDateRange.startDate).format('YYYY-MM-DD')}&pointEndDate=${dayjs(date).format('YYYY-MM-DD')}&type=point_usages`,
                    {},
                    { preserveState: true, preserveScroll: true }
                );
            }
        }
    };

    const clearDateFilter = () => {
        const customerId = customer?.id;
        if (!customerId) return;

        // Reset orders date range
        setDateRange({
            startDate: null,
            endDate: null,
        });

        // Reset filtered data
        setFilteredOrders(customer?.orders?.data || []);

        // Reset date picker values
        const startDatePicker = document.getElementById('startDate');
        const endDatePicker = document.getElementById('endDate');
        if (startDatePicker) startDatePicker.value = '';
        if (endDatePicker) endDatePicker.value = '';

        router.get(
            `/member?id=${customerId}&type=orders`,
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearPointDateFilter = () => {
        const customerId = customer?.id;
        if (!customerId) return;

        // Reset point usages date range
        setPointDateRange({
            startDate: null,
            endDate: null,
        });

        // Reset filtered data
        setFilteredPointUsages(customer?.point_usages?.data || []);

        // Reset date picker values
        const startDatePicker = document.getElementById('pointStartDate');
        const endDatePicker = document.getElementById('pointEndDate');
        if (startDatePicker) startDatePicker.value = '';
        if (endDatePicker) endDatePicker.value = '';

        router.get(
            `/member?id=${customerId}&type=point_usages`,
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearCustomerData = () => {
        setFormData({
            name: "",
            phone_number: "",
            birthdate: "",
            created_at: "",
            search: "",
        });

        // Reset date filters
        setDateRange({
            startDate: null,
            endDate: null,
        });
        setPointDateRange({
            startDate: null,
            endDate: null,
        });

        // Reset filtered data
        setFilteredOrders([]);
        setFilteredPointUsages([]);

        router.get("/member");
    };

    return (
        <main className="relative flex-1 px-6 py-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="mx-auto space-y-8 max-w-screen-2xl">
                {!customer && (
                    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg">
                        <div className="relative mb-6 search-container">
                            <Label
                                htmlFor="search"
                                className="block mb-2 text-lg font-medium"
                            >
                                ค้นหาสมาชิก
                            </Label>
                            <div className="relative">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <FaSearch className="w-4 h-4 text-gray-400" />
                                </div>
                                <TextInput
                                    id="search"
                                    type="text"
                                    name="search"
                                    placeholder="ค้นหาด้วยชื่อหรือเบอร์โทรศัพท์"
                                    value={formData.search}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full"
                                    autoComplete="off"
                                />
                            </div>
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-xl">
                                    {suggestions.map((suggestion) => (
                                        <div
                                            key={suggestion.id}
                                            className="p-4 border-b transition-colors duration-150 cursor-pointer hover:bg-blue-50 last:border-b-0"
                                            onClick={() =>
                                                handleSuggestionClick(
                                                    suggestion
                                                )
                                            }
                                        >
                                            <div className="flex gap-2 items-center font-medium">
                                                <FaUser className="w-4 h-4 text-blue-500" />
                                                {suggestion.name}
                                            </div>
                                            <div className="flex gap-2 items-center mt-1 text-sm text-gray-600">
                                                <FaPhone className="w-3 h-3 text-gray-400" />
                                                {suggestion.phone_number}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {customer && (
                    <>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* ข้อมูลสมาชิก */}
                            <Card className="col-span-2 border border-gray-100 shadow-lg">
                                <div className="flex gap-2 items-center mb-6">
                                    <FaUser className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-2xl font-semibold">
                                        ข้อมูลสมาชิก
                                    </h2>
                                    <div className="ml-auto">
                                        <Button
                                            onClick={clearCustomerData}
                                            color="warning"
                                            className="flex gap-2 items-center mb-2"
                                        >
                                            <FaUndo className="w-4 h-4" />
                                            ล้างข้อมูลสมาชิก
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <Label
                                            htmlFor="name"
                                            className="flex gap-2 items-center mb-2"
                                        >
                                            <FaUser className="w-4 h-4 text-gray-400" />
                                            ชื่อ
                                        </Label>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="phone_number"
                                            className="flex gap-2 items-center mb-2"
                                        >
                                            <FaPhone className="w-4 h-4 text-gray-400" />
                                            เบอร์โทรศัพท์
                                        </Label>
                                        <TextInput
                                            id="phone_number"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleInputChange}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="birthdate"
                                            className="flex gap-2 items-center mb-2"
                                        >
                                            <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                            วันเกิด
                                        </Label>
                                        <TextInput
                                            id="birthdate"
                                            name="birthdate"
                                            value={dayjs(
                                                formData.birthdate
                                            ).format("DD/MM/YYYY")}
                                            onChange={handleInputChange}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="created_at"
                                            className="flex gap-2 items-center mb-2"
                                        >
                                            <FaClock className="w-4 h-4 text-gray-400" />
                                            วันที่สมัครสมาชิก
                                        </Label>
                                        <TextInput
                                            id="created_at"
                                            name="created_at"
                                            value={formatDate(
                                                formData.created_at
                                            )}
                                            onChange={handleInputChange}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* คะแนนสะสม */}
                            <Card className="bg-gradient-to-br from-blue-50 to-white border border-gray-100 shadow-lg">
                                <div className="text-center">
                                    <div className="flex gap-2 justify-center items-center">
                                        <FaStar className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            คะแนนสะสม
                                        </h3>
                                    </div>
                                    <div className="mt-6">
                                        <p className="text-5xl font-bold tracking-tight text-blue-600">
                                            {formatPoints(
                                                customer.loyalty_points
                                            )}
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-gray-600">
                                            คะแนน
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* ประวัติการใช้คะแนน */}
                        <Card className="border border-gray-100 shadow-lg">
                            <div className="flex flex-col space-y-4">
                                <div className="flex gap-2 items-center">
                                    <FaCreditCard className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-xl font-semibold">
                                        ประวัติการใช้คะแนน
                                    </h3>
                                </div>

                                <div className="flex flex-col gap-4 justify-end items-start md:flex-row md:items-end">
                                    <div className="w-full md:w-auto">
                                        <Label
                                            htmlFor="pointStartDate"
                                            className="flex gap-2 items-center mb-2"
                                        >
                                            <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                            วันที่เริ่มต้น
                                        </Label>
                                        <Datepicker
                                            id="pointStartDate"
                                            language="th"
                                            value={pointDateRange.startDate}
                                            onChange={(date) =>
                                                handlePointDateChange(
                                                    "start",
                                                    date
                                                )
                                            }
                                            onSelectedDateClear={() => {
                                                setPointDateRange(prev => ({
                                                    ...prev,
                                                    startDate: null
                                                }));
                                            }}
                                            className="w-full md:w-48"
                                        />
                                    </div>
                                    <div className="w-full md:w-auto">
                                        <Label
                                            htmlFor="pointEndDate"
                                            className="flex gap-2 items-center mb-2"
                                        >
                                            <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                            วันที่สิ้นสุด
                                        </Label>
                                        <Datepicker
                                            id="pointEndDate"
                                            language="th"
                                            value={pointDateRange.endDate}
                                            onChange={(date) =>
                                                handlePointDateChange(
                                                    "end",
                                                    date
                                                )
                                            }
                                            onSelectedDateClear={() => {
                                                setPointDateRange(prev => ({
                                                    ...prev,
                                                    endDate: null
                                                }));
                                            }}
                                            className="w-full md:w-48"
                                        />
                                    </div>
                                    <Button
                                        color="light"
                                        size="sm"
                                        onClick={clearPointDateFilter}
                                        className="w-full md:w-auto"
                                    >
                                        <FaFilter className="mr-2 w-3 h-3" />
                                        ล้างตัวกรอง
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Table hoverable>
                                    <Table.Head className="bg-gray-50">
                                        <Table.HeadCell className="font-semibold">
                                            วันที่
                                        </Table.HeadCell>
                                        <Table.HeadCell className="font-semibold">
                                            รายการ
                                        </Table.HeadCell>
                                        <Table.HeadCell className="font-semibold">
                                            ประเภท
                                        </Table.HeadCell>
                                        <Table.HeadCell className="font-semibold text-right">
                                            คะแนน
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {customer?.point_usages?.data?.map((usage) => (
                                            <Table.Row
                                                key={usage.id}
                                                className="transition-colors duration-150 hover:bg-blue-50"
                                            >
                                                <Table.Cell>
                                                    {formatDate(
                                                        usage.created_at
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {usage.description}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Badge
                                                        color={getPointTypeColor(
                                                            usage.type
                                                        )}
                                                        className="font-medium"
                                                    >
                                                        {getPointTypeText(
                                                            usage.type
                                                        )}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell
                                                    className={`text-right font-medium ${
                                                        usage.type === "plus"
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {usage.type === "plus"
                                                        ? "+"
                                                        : "-"}
                                                    {formatPoints(usage.points)}
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                        {(!customer?.point_usages?.data || customer.point_usages.data.length === 0) && (
                                            <Table.Row>
                                                <Table.Cell
                                                    colSpan={4}
                                                    className="py-8 text-center text-gray-500"
                                                >
                                                    ไม่พบรายการในช่วงเวลาที่เลือก
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                                {/* Point Usage Pagination */}
                                {renderPagination(customer?.point_usages, 'point_usages')}
                            </div>
                        </Card>

                        {/* ประวัติการสั่งซื้อ */}
                        <Card className="border border-gray-100 shadow-lg">
                            <div className="flex flex-col space-y-4">
                                <div className="flex gap-2 items-center">
                                    <FaShoppingBag className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-xl font-semibold">
                                        ประวัติการสั่งซื้อ
                                    </h3>
                                </div>

                                <div className="flex flex-col gap-4 justify-end items-start md:flex-row md:items-end">
                                    <div className="w-full md:w-auto">
                                        <Label
                                            htmlFor="startDate"
                                            className="flex gap-2 items-center mb-2"
                                        >
                                            <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                            วันที่เริ่มต้น
                                        </Label>
                                        <Datepicker
                                            id="startDate"
                                            language="th"
                                            value={dateRange.startDate}
                                            onChange={(date) =>
                                                handleDateChange(
                                                    "start",
                                                    date
                                                )
                                            }
                                            className="w-full md:w-48"
                                        />
                                    </div>
                                    <div className="w-full md:w-auto">
                                        <Label
                                            htmlFor="endDate"
                                            className="flex gap-2 items-center mb-2"
                                        >
                                            <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                            วันที่สิ้นสุด
                                        </Label>
                                        <Datepicker
                                            id="endDate"
                                            language="th"
                                            value={dateRange.endDate}
                                            onChange={(date) =>
                                                handleDateChange(
                                                    "end",
                                                    date
                                                )
                                            }
                                            className="w-full md:w-48"
                                        />
                                    </div>
                                    <Button
                                        color="light"
                                        size="sm"
                                        onClick={clearDateFilter}
                                        className="w-full md:w-auto"
                                    >
                                        <FaFilter className="mr-2 w-3 h-3" />
                                        ล้างตัวกรอง
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Table hoverable>
                                    <Table.Head className="bg-gray-50">
                                        <Table.HeadCell className="font-semibold">
                                            วันที่
                                        </Table.HeadCell>
                                        <Table.HeadCell className="font-semibold">
                                            รายการ
                                        </Table.HeadCell>
                                        <Table.HeadCell className="font-semibold">
                                            บิลใบเสร็จรับเงิน
                                        </Table.HeadCell>
                                        <Table.HeadCell className="font-semibold">
                                            สถานะ
                                        </Table.HeadCell>
                                        <Table.HeadCell className="font-semibold text-right">
                                            ยอดรวม
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {customer?.orders?.data?.map((order) => (
                                            <Table.Row
                                                key={order.id}
                                                className="transition-colors duration-150 hover:bg-blue-50"
                                            >
                                                <Table.Cell>
                                                    {formatDate(
                                                        order.created_at
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="space-y-1.5">
                                                        {order.items.map(
                                                            (item, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex gap-2 items-center text-sm"
                                                                >
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                                    {
                                                                        item.product_name
                                                                    }{" "}
                                                                    x{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex items-center space-x-2">
                                                        <span>{order.invoice_number}</span>
                                                        <Button
                                                            size="xs"
                                                            color="light"
                                                            onClick={() =>
                                                                handleViewReceipt(
                                                                    order.receipt_path
                                                                )
                                                            }
                                                            className="ml-2"
                                                        >
                                                            <FaFileInvoice className="w-4 h-4" />
                                                            <span className="ml-1">ดูใบเสร็จ</span>
                                                        </Button>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Badge
                                                        color={getStatusColor(
                                                            order.status
                                                        )}
                                                        className="font-medium"
                                                    >
                                                        {order.status ===
                                                        "completed"
                                                            ? "สำเร็จ"
                                                            : order.status ===
                                                              "pending"
                                                            ? "รอดำเนินการ"
                                                            : order.status ===
                                                              "cancelled"
                                                            ? "ยกเลิก"
                                                            : order.status}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell className="font-medium text-right">
                                                    ฿{formatNumber(order.total)}
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                        {(!customer?.orders?.data || customer.orders.data.length === 0) && (
                                            <Table.Row>
                                                <Table.Cell
                                                    colSpan={5}
                                                    className="py-8 text-center text-gray-500"
                                                >
                                                    ไม่พบรายการในช่วงเวลาที่เลือก
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                                {/* Orders Pagination */}
                                {renderPagination(customer?.orders, 'orders')}
                            </div>
                        </Card>
                    </>
                )}
            </div>

            {/* Receipt Modal */}
            <ViewReceiptModal
                show={showReceiptModal}
                onClose={() => setShowReceiptModal(false)}
                receiptUrl={selectedReceipt}
            />
        </main>
    );
}
