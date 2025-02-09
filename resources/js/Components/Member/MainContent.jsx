import React, { useState, useCallback, useEffect } from "react";
import { Button, Datepicker, Label, TextInput, Card, Badge, Table } from "flowbite-react";
import { router } from '@inertiajs/react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { 
    FaUser, 
    FaPhone, 
    FaCalendarAlt, 
    FaClock, 
    FaSearch, 
    FaStar, 
    FaShoppingBag, 
    FaCreditCard, 
    FaFilter 
} from 'react-icons/fa';

dayjs.locale('th');

export default function MainContent({ member }) {
    console.log(member);
    const [formData, setFormData] = useState({
        name: member?.name || '',
        phone_number: member?.phone_number || '',
        birthdate: member?.birthdate ? new Date(member.birthdate) : '',
        created_at: member?.created_at || '',
        search: ''
    });

    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });

    const [pointDateRange, setPointDateRange] = useState({
        startDate: null,
        endDate: null
    });

    const [filteredOrders, setFilteredOrders] = useState(member?.orders || []);
    const [filteredPointUsages, setFilteredPointUsages] = useState(member?.point_usages || []);

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const formatDate = (date) => {
        return dayjs(date).format('DD/MM/YYYY HH:mm');
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('th-TH').format(number);
    };

    const getPointTypeColor = (type) => {
        return type === 'plus' ? 'success' : 'failure';
    };

    const getPointTypeText = (type) => {
        return type === 'plus' ? 'รับคะแนน' : 'ใช้คะแนน';
    };

    const formatPoints = (points) => {
        return points ? formatNumber(parseFloat(points).toFixed(2)) : '0.00';
    };

    // Create a debounced search function for auto-suggestion
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.length >= 2) {
                try {
                    const response = await axios.get('/member/search', {
                        params: { query }
                    });
                    setSuggestions(response.data.suggestions);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Search error:', error);
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
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'search') {
            debouncedSearch(value);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setFormData({
            name: suggestion.name,
            phone_number: suggestion.phone_number,
            birthdate: suggestion.birthdate ? new Date(suggestion.birthdate) : '',
            created_at: suggestion.created_at,
            search: ''
        });
        setSuggestions([]);
        setShowSuggestions(false);
        router.get(`/member?id=${suggestion.id}`);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-container')) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            'completed': 'success',
            'pending': 'warning',
            'cancelled': 'failure'
        };
        return colors[status] || 'info';
    };

    useEffect(() => {
        if (member?.orders) {
            let filtered = [...member.orders];

            if (dateRange.startDate && dateRange.endDate) {
                filtered = filtered.filter(order => {
                    const orderDate = dayjs(order.created_at);
                    return orderDate.isAfter(dateRange.startDate) && orderDate.isBefore(dateRange.endDate);
                });
            }

            setFilteredOrders(filtered);
        }
    }, [member?.orders, dateRange]);

    useEffect(() => {
        if (member?.point_usages) {
            let filtered = [...member.point_usages];
            
            if (pointDateRange.startDate && pointDateRange.endDate) {
                filtered = filtered.filter(usage => {
                    const usageDate = dayjs(usage.created_at);
                    return usageDate.isAfter(pointDateRange.startDate) && usageDate.isBefore(pointDateRange.endDate);
                });
            }
            
            setFilteredPointUsages(filtered);
        }
    }, [member?.point_usages, pointDateRange]);

    const handleDateChange = (type, date) => {
        setDateRange(prev => ({
            ...prev,
            [type]: date
        }));
    };

    const handlePointDateChange = (type, date) => {
        setPointDateRange(prev => ({
            ...prev,
            [type]: date
        }));
    };

    const clearDateFilter = () => {
        setDateRange({
            startDate: null,
            endDate: null
        });
    };

    const clearPointDateFilter = () => {
        setPointDateRange({
            startDate: null,
            endDate: null
        });
    };

    return (
        <main className="flex-1 relative py-8 px-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="space-y-8 max-w-screen-2xl mx-auto">
                {!member && (
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                        <div className="relative mb-6 search-container">
                            <Label htmlFor="search" className="mb-2 block text-lg font-medium">ค้นหาสมาชิก</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="h-4 w-4 text-gray-400" />
                                </div>
                                <TextInput
                                    id="search"
                                    type="text"
                                    name="search"
                                    placeholder="ค้นหาด้วยชื่อหรือเบอร์โทรศัพท์"
                                    value={formData.search}
                                    onChange={handleInputChange}
                                    className="w-full pl-10"
                                    autoComplete="off"
                                />
                            </div>
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1">
                                    {suggestions.map((suggestion) => (
                                        <div
                                            key={suggestion.id}
                                            className="p-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors duration-150"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <div className="font-medium flex items-center gap-2">
                                                <FaUser className="h-4 w-4 text-blue-500" />
                                                {suggestion.name}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                                <FaPhone className="h-3 w-3 text-gray-400" />
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* ข้อมูลสมาชิก */}
                            <Card className="col-span-2 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <FaUser className="h-5 w-5 text-blue-500" />
                                    <h2 className="text-2xl font-semibold">ข้อมูลสมาชิก</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                                            <FaUser className="h-4 w-4 text-gray-400" />
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
                                        <Label htmlFor="phone_number" className="flex items-center gap-2 mb-2">
                                            <FaPhone className="h-4 w-4 text-gray-400" />
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
                                        <Label htmlFor="birthdate" className="flex items-center gap-2 mb-2">
                                            <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                                            วันเกิด
                                        </Label>
                                        <TextInput
                                            id="birthdate"
                                            name="birthdate"
                                            value={dayjs(formData.birthdate).format('DD/MM/YYYY')}
                                            onChange={handleInputChange}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="created_at" className="flex items-center gap-2 mb-2">
                                            <FaClock className="h-4 w-4 text-gray-400" />
                                            วันที่สมัครสมาชิก
                                        </Label>
                                        <TextInput
                                            id="created_at"
                                            name="created_at"
                                            value={formatDate(formData.created_at)}
                                            onChange={handleInputChange}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* คะแนนสะสม */}
                            <Card className="shadow-lg border border-gray-100 bg-gradient-to-br from-blue-50 to-white">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaStar className="h-5 w-5 text-blue-500" />
                                        <h3 className="text-xl font-semibold text-gray-900">คะแนนสะสม</h3>
                                    </div>
                                    <div className="mt-6">
                                        <p className="text-5xl font-bold text-blue-600 tracking-tight">
                                            {formatPoints(member.loyalty_points)}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2 font-medium">คะแนน</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* ประวัติการใช้คะแนน */}
                        <Card className="shadow-lg border border-gray-100">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center gap-2">
                                    <FaCreditCard className="h-5 w-5 text-blue-500" />
                                    <h3 className="text-xl font-semibold">ประวัติการใช้คะแนน</h3>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-end">
                                    <div className="w-full md:w-auto">
                                        <Label htmlFor="pointStartDate" className="flex items-center gap-2 mb-2">
                                            <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                                            วันที่เริ่มต้น
                                        </Label>
                                        <Datepicker
                                            id="pointStartDate"
                                            language="th"
                                            value={pointDateRange.startDate}
                                            onChange={(date) => handlePointDateChange('startDate', date)}
                                            className="w-full md:w-48"
                                        />
                                    </div>
                                    <div className="w-full md:w-auto">
                                        <Label htmlFor="pointEndDate" className="flex items-center gap-2 mb-2">
                                            <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                                            วันที่สิ้นสุด
                                        </Label>
                                        <Datepicker
                                            id="pointEndDate"
                                            language="th"
                                            value={pointDateRange.endDate}
                                            onChange={(date) => handlePointDateChange('endDate', date)}
                                            className="w-full md:w-48"
                                        />
                                    </div>
                                    <Button
                                        color="light"
                                        size="sm"
                                        onClick={clearPointDateFilter}
                                        className="w-full md:w-auto"
                                    >
                                        <FaFilter className="h-3 w-3 mr-2" />
                                        ล้างตัวกรอง
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Table hoverable>
                                    <Table.Head className="bg-gray-50">
                                        <Table.HeadCell className="font-semibold">วันที่</Table.HeadCell>
                                        <Table.HeadCell className="font-semibold">รายการ</Table.HeadCell>
                                        <Table.HeadCell className="font-semibold">ประเภท</Table.HeadCell>
                                        <Table.HeadCell className="text-right font-semibold">คะแนน</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {filteredPointUsages.map((usage) => (
                                            <Table.Row key={usage.id} className="hover:bg-blue-50 transition-colors duration-150">
                                                <Table.Cell>{formatDate(usage.created_at)}</Table.Cell>
                                                <Table.Cell>{usage.description}</Table.Cell>
                                                <Table.Cell>
                                                    <Badge color={getPointTypeColor(usage.type)} className="font-medium">
                                                        {getPointTypeText(usage.type)}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell className={`text-right font-medium ${usage.type === 'plus' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {usage.type === 'plus' ? '+' : '-'}{formatPoints(usage.points)}
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                        {filteredPointUsages.length === 0 && (
                                            <Table.Row>
                                                <Table.Cell colSpan={4} className="text-center py-8 text-gray-500">
                                                    ไม่พบรายการในช่วงเวลาที่เลือก
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                            </div>
                        </Card>

                        {/* ประวัติการสั่งซื้อ */}
                        <Card className="shadow-lg border border-gray-100">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center gap-2">
                                    <FaShoppingBag className="h-5 w-5 text-blue-500" />
                                    <h3 className="text-xl font-semibold">ประวัติการสั่งซื้อ</h3>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-end">
                                    <div className="w-full md:w-auto">
                                        <Label htmlFor="startDate" className="flex items-center gap-2 mb-2">
                                            <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                                            วันที่เริ่มต้น
                                        </Label>
                                        <Datepicker
                                            id="startDate"
                                            language="th"
                                            value={dateRange.startDate}
                                            onChange={(date) => handleDateChange('startDate', date)}
                                            className="w-full md:w-48"
                                        />
                                    </div>
                                    <div className="w-full md:w-auto">
                                        <Label htmlFor="endDate" className="flex items-center gap-2 mb-2">
                                            <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                                            วันที่สิ้นสุด
                                        </Label>
                                        <Datepicker
                                            id="endDate"
                                            language="th"
                                            value={dateRange.endDate}
                                            onChange={(date) => handleDateChange('endDate', date)}
                                            className="w-full md:w-48"
                                        />
                                    </div>
                                    <Button
                                        color="light"
                                        size="sm"
                                        onClick={clearDateFilter}
                                        className="w-full md:w-auto"
                                    >
                                        <FaFilter className="h-3 w-3 mr-2" />
                                        ล้างตัวกรอง
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Table hoverable>
                                    <Table.Head className="bg-gray-50">
                                        <Table.HeadCell className="font-semibold">วันที่</Table.HeadCell>
                                        <Table.HeadCell className="font-semibold">รายการ</Table.HeadCell>
                                        <Table.HeadCell className="font-semibold">สถานะ</Table.HeadCell>
                                        <Table.HeadCell className="text-right font-semibold">ยอดรวม</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {filteredOrders.map((order) => (
                                            <Table.Row key={order.id} className="hover:bg-blue-50 transition-colors duration-150">
                                                <Table.Cell>{formatDate(order.created_at)}</Table.Cell>
                                                <Table.Cell>
                                                    <div className="space-y-1.5">
                                                        {order.items.map((item, index) => (
                                                            <div key={index} className="text-sm flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                                {item.product_name} x {item.quantity}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Badge color={getStatusColor(order.status)} className="font-medium">
                                                        {order.status}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell className="text-right font-medium">฿{formatNumber(order.total)}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                        {filteredOrders.length === 0 && (
                                            <Table.Row>
                                                <Table.Cell colSpan={4} className="text-center py-8 text-gray-500">
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
