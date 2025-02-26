import React, { useState, useCallback, useEffect } from "react";
import {
    Button,
    Datepicker,
    Label,
    TextInput,
    Card,
    Badge,
    Table,
} from "flowbite-react";
import { router } from "@inertiajs/react";
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
} from "react-icons/fa";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("th");

export default function MainContent({ member }) {
    console.log(member);
    const [formData, setFormData] = useState({
        name: member?.name || "",
        phone_number: member?.phone_number || "",
        birthdate: member?.birthdate ? new Date(member.birthdate) : "",
        created_at: member?.created_at || "",
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

    const [filteredOrders, setFilteredOrders] = useState(member?.orders || []);
    const [filteredPointUsages, setFilteredPointUsages] = useState(
        member?.point_usages || []
    );

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

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

    useEffect(() => {
        if (member?.orders) {
            let filtered = [...member.orders];

            if (dateRange.startDate && dateRange.endDate) {
                filtered = filtered.filter((order) => {
                    const orderDate = dayjs(order.created_at).startOf("day");
                    const start = dayjs(dateRange.startDate).startOf("day");
                    const end = dayjs(dateRange.endDate).endOf("day");
                    return (
                        orderDate.isSameOrAfter(start) &&
                        orderDate.isSameOrBefore(end)
                    );
                });
            }

            setFilteredOrders(filtered);
        }
    }, [member?.orders, dateRange]);

    useEffect(() => {
        if (member?.point_usages) {
            let filtered = [...member.point_usages];

            if (pointDateRange.startDate && pointDateRange.endDate) {
                filtered = filtered.filter((usage) => {
                    const usageDate = dayjs(usage.created_at).startOf("day");
                    const start = dayjs(pointDateRange.startDate).startOf(
                        "day"
                    );
                    const end = dayjs(pointDateRange.endDate).endOf("day");
                    return (
                        usageDate.isSameOrAfter(start) &&
                        usageDate.isSameOrBefore(end)
                    );
                });
            }

            setFilteredPointUsages(filtered);
        }
    }, [member?.point_usages, pointDateRange]);

    const handleDateChange = (type, date) => {
        setDateRange((prev) => ({
            ...prev,
            [type]: date,
        }));
    };

    const handlePointDateChange = (type, date) => {
        setPointDateRange((prev) => ({
            ...prev,
            [type]: date,
        }));
    };

    const clearDateFilter = () => {
        setDateRange({
            startDate: null,
            endDate: null,
        });
    };

    const clearPointDateFilter = () => {
        setPointDateRange({
            startDate: null,
            endDate: null,
        });
    };

    return (
        <main className="relative flex-1 px-6 py-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="mx-auto space-y-8 max-w-screen-2xl">
                {!member && (
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

                {member && (
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
                                            onClick={() => setEditMember(true)}
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
                                                member.loyalty_points
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
                                                    "startDate",
                                                    date
                                                )
                                            }
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
                                                    "endDate",
                                                    date
                                                )
                                            }
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
                                        {filteredPointUsages.map((usage) => (
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
                                        {filteredPointUsages.length === 0 && (
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
                                                    "startDate",
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
                                                    "endDate",
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
                                        {filteredOrders.map((order) => (
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
                                                    {order.invoice_number}
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
                                        {filteredOrders.length === 0 && (
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
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </main>
    );
}
