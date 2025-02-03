import React, { useState, useCallback, useEffect } from "react";
import { Button, Datepicker, Label, TextInput, Card, Badge, Table } from "flowbite-react";
import { router } from '@inertiajs/react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

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

    return (
        <main className="flex-1 relative py-6 px-4 bg-gray-50">
            <div className="space-y-6 max-w-screen-2xl mx-auto">
                {!member && (
                    <div className="p-4 bg-white rounded-lg shadow">
                        <div className="relative mb-6 search-container">
                            <Label htmlFor="search" className="mb-2 block">ค้นหาสมาชิก</Label>
                            <TextInput
                                id="search"
                                type="text"
                                name="search"
                                placeholder="ค้นหาด้วยชื่อหรือเบอร์โทรศัพท์"
                                value={formData.search}
                                onChange={handleInputChange}
                                className="w-full"
                                autoComplete="off"
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                                    {suggestions.map((suggestion) => (
                                        <div
                                            key={suggestion.id}
                                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <div className="font-medium">{suggestion.name}</div>
                                            <div className="text-sm text-gray-600">{suggestion.phone_number}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {member && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* ข้อมูลสมาชิก */}
                            <Card className="col-span-2">
                                <h2 className="text-xl font-semibold mb-4">ข้อมูลสมาชิก</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">ชื่อ</Label>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone_number">เบอร์โทรศัพท์</Label>
                                        <TextInput
                                            id="phone_number"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="birthdate">วันเกิด</Label>
                                        <TextInput
                                            id="birthdate"
                                            name="birthdate"
                                            value={dayjs(formData.birthdate).format('DD/MM/YYYY')}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="created_at">วันที่สมัครสมาชิก</Label>
                                        <TextInput
                                            id="created_at"
                                            name="created_at"
                                            value={formatDate(formData.created_at)}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* คะแนนสะสม */}
                            <Card>
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-gray-900">คะแนนสะสม</h3>
                                    <div className="mt-4">
                                        <p className="text-4xl font-bold text-blue-600">
                                            {formatPoints(member.loyalty_points)}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">คะแนน</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* ประวัติการใช้คะแนน */}
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">ประวัติการใช้คะแนน</h3>
                            </div>
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell>วันที่</Table.HeadCell>
                                    <Table.HeadCell>รายการ</Table.HeadCell>
                                    <Table.HeadCell>ประเภท</Table.HeadCell>
                                    <Table.HeadCell className="text-right">คะแนน</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {member.point_usages?.map((usage) => (
                                        <Table.Row key={usage.id} className="hover:bg-gray-50">
                                            <Table.Cell>{formatDate(usage.created_at)}</Table.Cell>
                                            <Table.Cell>{usage.description}</Table.Cell>
                                            <Table.Cell>
                                                <Badge color={getPointTypeColor(usage.type)}>
                                                    {getPointTypeText(usage.type)}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell className={`text-right ${usage.type === 'plus' ? 'text-green-600' : 'text-red-600'}`}>
                                                {usage.type === 'plus' ? '+' : '-'}{formatPoints(usage.points)}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Card>

                        {/* ประวัติการสั่งซื้อ */}
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">ประวัติการสั่งซื้อ</h3>
                            </div>
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell>วันที่</Table.HeadCell>
                                    <Table.HeadCell>รายการ</Table.HeadCell>
                                    <Table.HeadCell>สถานะ</Table.HeadCell>
                                    <Table.HeadCell className="text-right">ยอดรวม</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {member.orders?.map((order) => (
                                        <Table.Row key={order.id} className="hover:bg-gray-50">
                                            <Table.Cell>{formatDate(order.created_at)}</Table.Cell>
                                            <Table.Cell>
                                                <div className="space-y-1">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="text-sm">
                                                            {item.product_name} x {item.quantity}
                                                        </div>
                                                    ))}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge color={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell className="text-right">฿{formatNumber(order.total)}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Card>
                    </>
                )}
            </div>
        </main>
    );
}
