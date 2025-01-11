import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from 'flowbite-react';
import {
    HiCurrencyDollar,
    HiShoppingBag,
    HiChartBar,
    HiUsers,
    HiCreditCard,
    HiClock,
    HiScale,
    HiBeaker
} from 'react-icons/hi';
import { BarChart, DonutChart, Title, Text, Flex, Legend, BadgeDelta } from '@tremor/react';

export default function DailyReport({ stats }) {
    const sections = [
        {
            title: 'ข้อมูลการขาย',
            description: 'สรุปยอดขายและจำนวนออเดอร์ประจำวัน',
            items: [
                {
                    label: 'ยอดขายรวม',
                    value: stats?.totalSales || '0',
                    icon: HiCurrencyDollar,
                    format: 'currency',
                    color: 'blue'
                },
                {
                    label: 'กำไรรวม',
                    value: stats?.totalProfit || '0',
                    icon: HiCurrencyDollar,
                    format: 'currency',
                    color: 'green'
                },
                {
                    label: 'จำนวนออเดอร์',
                    value: stats?.totalOrders || '0',
                    icon: HiShoppingBag,
                    color: 'purple'
                }
            ]
        }
    ];

    const formatValue = (value, format) => {
        if (format === 'currency') {
            return new Intl.NumberFormat('th-TH', {
                style: 'currency',
                currency: 'THB',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        }
        return value;
    };

    const getBackgroundColor = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            cyan: 'bg-cyan-100 text-cyan-600',
            pink: 'bg-pink-100 text-pink-600',
            indigo: 'bg-indigo-100 text-indigo-600',
            red: 'bg-red-100 text-red-600'
        };
        return colors[color] || colors.blue;
    };

    // Format data for Tremor charts
    const salesByTimeData = stats?.salesByTimeChart?.labels?.map((label, index) => ({
        name: label,
        'ยอดขาย': stats.salesByTimeChart.data[index],
        'เป้าหมาย': stats.salesByTimeChart.data[index] * 1.2
    })) || [];

    const topDrinksData = stats?.topDrinksChart?.labels?.map((label, index) => ({
        name: label,
        value: stats.topDrinksChart.data[index]
    })) || [];

    const paymentMethodsData = stats?.paymentMethodsChart?.labels?.map((label, index) => ({
        name: label,
        value: stats.paymentMethodsChart.data[index]
    })) || [];

    const memberData = [
        { name: 'สมาชิก', value: stats?.memberPercentage || 0 },
        { name: 'ไม่เป็นสมาชิก', value: 100 - (stats?.memberPercentage || 0) }
    ];

    const chartColors = {
        salesByTime: ['#000000', '#666666'],  // ดำและเทา
        topDrinks: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'],  // โทนสีเทา-ดำ
        paymentMethods: ['#000000', '#333333', '#666666'],  // โทนสีเทา-ดำ
        memberStats: ['#000000', '#666666']  // ดำและเทา
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                        รายงานประจำวัน
                    </h2>
                    <p className="text-sm text-gray-600">
                        ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            }
        >
            <Head title="รายงานประจำวัน" />

            <div className="py-6">
                <div className="px-4 mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    {sections.map((section, index) => (
                        <div key={index} className="overflow-hidden bg-white rounded-lg shadow">
                            <div className="px-4 py-5 bg-white border-b border-gray-200 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    {section.title}
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    {section.description}
                                </p>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {section.items.map((item, itemIndex) => (
                                        <Card key={itemIndex}>
                                            <div className="flex items-center space-x-4">
                                                <div className={`rounded-lg p-3 ${getBackgroundColor(item.color)}`}>
                                                    <item.icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        {item.label}
                                                    </p>
                                                    <p className="mt-1 text-xl font-semibold text-gray-900">
                                                        {formatValue(item.value, item.format)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Sales by Time Chart */}
                        <div className="overflow-hidden bg-white rounded-lg shadow">
                            <div className="px-4 py-5 bg-white border-b border-gray-200 sm:px-6">
                                <div>
                                    <Title>ยอดขายตามช่วงเวลา</Title>
                                    <Text>เปรียบเทียบยอดขายกับเป้าหมาย</Text>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <BarChart
                                    data={salesByTimeData}
                                    index="name"
                                    categories={['ยอดขาย', 'เป้าหมาย']}
                                    colors={chartColors.salesByTime}
                                    valueFormatter={(value) => 
                                        new Intl.NumberFormat('th-TH', {
                                            style: 'currency',
                                            currency: 'THB',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(value)
                                    }
                                    yAxisWidth={100}
                                    showAnimation={true}
                                    className="h-72"
                                />
                            </div>
                        </div>

                        {/* Top Drinks Chart */}
                        <div className="overflow-hidden bg-white rounded-lg shadow">
                            <div className="px-4 py-5 bg-white border-b border-gray-200 sm:px-6">
                                <Flex>
                                    <div>
                                        <Title>เครื่องดื่มยอดนิยม</Title>
                                        <Text>5 อันดับเครื่องดื่มที่ขายดีที่สุด</Text>
                                    </div>
                                    <BadgeDelta deltaType="increase" size="xs">
                                        +10.3%
                                    </BadgeDelta>
                                </Flex>
                            </div>
                            <div className="p-4 sm:p-6">
                                <DonutChart
                                    data={topDrinksData}
                                    category="value"
                                    index="name"
                                    colors={chartColors.topDrinks}
                                    valueFormatter={(value) => `${value} แก้ว`}
                                    showAnimation={true}
                                    className="h-72"
                                />
                            </div>
                        </div>

                        {/* Payment Methods Chart */}
                        <div className="overflow-hidden bg-white rounded-lg shadow">
                            <div className="px-4 py-5 bg-white border-b border-gray-200 sm:px-6">
                                <div>
                                    <Title>วิธีการชำระเงิน</Title>
                                    <Text>สัดส่วนการชำระเงินแต่ละประเภท</Text>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <DonutChart
                                    data={paymentMethodsData}
                                    category="value"
                                    index="name"
                                    colors={chartColors.paymentMethods}
                                    valueFormatter={(value) => `${value} ครั้ง`}
                                    showAnimation={true}
                                    className="h-72"
                                />
                                <div className="mt-2 text-center">
                                    <Text>{paymentMethodsData[0]?.value || 0} ครั้ง</Text>
                                </div>
                            </div>
                        </div>

                        {/* Member Stats */}
                        <div className="overflow-hidden bg-white rounded-lg shadow">
                            <div className="px-4 py-5 bg-white border-b border-gray-200 sm:px-6">
                                <Flex>
                                    <div>
                                        <Title>สัดส่วนลูกค้า</Title>
                                        <Text>เปรียบเทียบสัดส่วนลูกค้าสมาชิกและไม่เป็นสมาชิก</Text>
                                    </div>
                                    <BadgeDelta deltaType="increase" size="xs">
                                        +5.2%
                                    </BadgeDelta>
                                </Flex>
                            </div>
                            <div className="p-4 sm:p-6">
                                <DonutChart
                                    data={memberData}
                                    category="value"
                                    index="name"
                                    colors={chartColors.memberStats}
                                    valueFormatter={(value) => `${value}%`}
                                    showAnimation={true}
                                    className="h-72"
                                />
                                <div className="mt-2 text-center">
                                    <Text>100%</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
