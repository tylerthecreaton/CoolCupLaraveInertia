import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    CurrencyDollarIcon,
    ShoppingBagIcon,
    ChartBarIcon,
    UsersIcon,
    CreditCardIcon,
    ClockIcon,
    ScaleIcon,
    BeakerIcon,
    ArrowTrendingUpIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function DailyReport({ stats }) {
    // กำหนดชุดสีสำหรับ charts
    const chartColors = {
        sales: ['rgba(63, 81, 181, 0.8)', 'rgba(92, 107, 192, 0.6)'],
        salesBg: ['rgba(63, 81, 181, 0.1)', 'rgba(92, 107, 192, 0.1)'],
        drinks: ['#FF5722', '#FFA000', '#4CAF50', '#00BCD4', '#3F51B5'],
        payment: ['#4caf50', '#067bc2', '#81c784'],
        member: ['#ff9800', '#ffa726']
    };

    const sections = [
        {
            title: 'ข้อมูลการขาย',
            description: 'สรุปยอดขายและจำนวนออเดอร์ประจำวัน',
            backgroundColor: 'bg-gradient-to-br from-blue-300 to-indigo-100',
            items: [
                {
                    label: 'ยอดขายรวม',
                    value: stats?.totalSales || '0',
                    icon: CurrencyDollarIcon,
                    format: 'currency',
                    color: 'text-blue-600',
                    bgColor: 'bg-gradient-to-br from-blue-100 to-blue-50'
                },
                {
                    label: 'กำไรรวม',
                    value: stats?.totalProfit || '0',
                    icon: CurrencyDollarIcon,
                    format: 'currency',
                    color: 'text-green-600',
                    bgColor: 'bg-gradient-to-br from-green-100 to-green-50'
                },
                {
                    label: 'จำนวนออเดอร์',
                    value: stats?.totalOrders || '0',
                    icon: ShoppingBagIcon,
                    color: 'text-purple-600',
                    bgColor: 'bg-gradient-to-br from-purple-100 to-purple-50'
                }
            ]
        },
        {
            title: 'ข้อมูลรายจ่าย',
            description: 'สรุปรายจ่ายจากการซื้อวัตถุดิบประจำวัน',
            backgroundColor: 'bg-gradient-to-br from-red-300 to-orange-100',
            items: [
                {
                    label: 'รายจ่ายรวม',
                    value: stats?.totalExpenses || '0',
                    icon: CurrencyDollarIcon,
                    format: 'currency',
                    color: 'text-red-600',
                    bgColor: 'bg-gradient-to-br from-red-100 to-red-50'
                },
                {
                    label: 'จำนวนรายการ',
                    value: stats?.totalExpenseItems || '0',
                    icon: ShoppingBagIcon,
                    color: 'text-orange-600',
                    bgColor: 'bg-gradient-to-br from-orange-100 to-orange-50'
                }
            ]
        }
    ];

    // Chart options and configs
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: '"IBM Plex Sans Thai", sans-serif',
                        size: 13
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#000',
                bodyColor: '#666',
                bodyFont: {
                    family: '"IBM Plex Sans Thai", sans-serif',
                    size: 13
                },
                titleFont: {
                    family: '"IBM Plex Sans Thai", sans-serif',
                    size: 14,
                    weight: '600'
                },
                padding: 12,
                boxPadding: 8,
                usePointStyle: true,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        family: '"IBM Plex Sans Thai", sans-serif',
                        size: 12
                    }
                }
            },
            y: {
                grid: {
                    borderDash: [5, 5],
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    font: {
                        family: '"IBM Plex Sans Thai", sans-serif',
                        size: 12
                    }
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        family: '"IBM Plex Sans Thai", sans-serif',
                        size: 12
                    },
                    boxWidth: 8
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#000',
                bodyColor: '#666',
                bodyFont: {
                    family: '"IBM Plex Sans Thai", sans-serif',
                    size: 13
                },
                titleFont: {
                    family: '"IBM Plex Sans Thai", sans-serif',
                    size: 14,
                    weight: '600'
                },
                padding: 12,
                boxPadding: 8,
                usePointStyle: true,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1
            }
        }
    };

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

    // Format data for Chart.js
    const salesByTimeData = {
        labels: stats?.salesByTimeChart?.labels || [],
        datasets: [
            {
                label: 'ยอดขาย',
                data: stats?.salesByTimeChart?.data || [],
                backgroundColor: chartColors.sales[0],
                borderColor: chartColors.sales[0],
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 20,
            },
            {
                label: 'เป้าหมาย',
                data: stats?.salesByTimeChart?.data?.map(value => value * 1.2) || [],
                backgroundColor: chartColors.sales[1],
                borderColor: chartColors.sales[1],
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 20,
            }
        ]
    };

    const topDrinksData = {
        labels: stats?.topDrinksChart?.labels || [],
        datasets: [{
            data: stats?.topDrinksChart?.data || [],
            backgroundColor: chartColors.drinks,
            borderColor: 'white',
            borderWidth: 2,
            hoverOffset: 4
        }]
    };

    const paymentMethodsData = {
        labels: stats?.paymentMethodsChart?.labels || [],
        datasets: [{
            data: stats?.paymentMethodsChart?.data || [],
            backgroundColor: chartColors.payment,
            borderColor: 'white',
            borderWidth: 2,
            hoverOffset: 4
        }]
    };

    const memberData = {
        labels: ['สมาชิก', 'ไม่เป็นสมาชิก'],
        datasets: [{
            data: [stats?.memberPercentage || 0, 100 - (stats?.memberPercentage || 0)],
            backgroundColor: chartColors.member,
            borderColor: 'white',
            borderWidth: 2,
            hoverOffset: 4
        }]
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-blue-600">
                            รายงานประจำวัน
                        </h2>
                        <div className="flex items-center space-x-1 text-gray-500">
                            <CalendarDaysIcon className="w-4 h-4" />
                            <span className="text-sm">
                                ข้อมูลสรุปผลการดำเนินงานและยอดขายประจำวัน ณ วันที่ {new Date().toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center px-3 py-1 space-x-1 text-green-700 bg-green-50 rounded-full">
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">+15.3% จากเมื่อวาน</span>
                    </div>
                </div>
            }
        >
            <Head title="รายงานประจำวัน" />
            <div className="py-6 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="px-2 sm:px-4 lg:px-6 max-w-[1600px] mx-auto">
                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <div key={index} className={`${section.backgroundColor} rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                                <div className="p-6 border-b backdrop-blur-sm border-white/20">
                                    <h3 className="mb-2 text-2xl font-bold text-white">
                                        {section.title}
                                    </h3>
                                    <p className="text-white/80">
                                        {section.description}
                                    </p>
                                </div>
                                <div className="p-6 backdrop-blur-sm">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        {section.items.map((item, itemIndex) => (
                                            <div
                                                key={itemIndex}
                                                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`p-3 rounded-xl ${item.bgColor} ${item.color} transform transition-all duration-300 hover:scale-110 hover:rotate-6`}>
                                                            <item.icon className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <p className="mb-1 text-sm font-medium tracking-wide text-gray-600">
                                                                {item.label}
                                                            </p>
                                                            <p className={`text-2xl font-bold ${item.color}`}>
                                                                {formatValue(item.value, item.format)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Sales by Time Chart */}
                            <div className="overflow-hidden bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-gray-100">
                                    <h3 className="mb-2 text-xl font-bold text-white">
                                        ยอดขายตามช่วงเวลา
                                    </h3>
                                    <p className="text-white/80">
                                        เปรียบเทียบยอดขายกับเป้าหมาย
                                    </p>
                                </div>
                                <div className="p-6">
                                    <Bar
                                        data={salesByTimeData}
                                        options={barOptions}
                                        height={270}
                                    />
                                </div>
                            </div>

                            {/* Top Drinks Chart */}
                            <div className="overflow-hidden bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="p-6 bg-gradient-to-r from-orange-500 to-amber-500 border-b border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="mb-2 text-xl font-bold text-white">
                                                เครื่องดื่มยอดนิยม
                                            </h3>
                                            <p className="text-white/80">
                                                5 อันดับเครื่องดื่มขายดีประจำวัน
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <Doughnut
                                        data={topDrinksData}
                                        options={pieOptions}
                                        height={270}
                                    />
                                </div>
                            </div>

                            {/* Payment Methods Chart */}
                            <div className="overflow-hidden bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 border-b border-gray-100">
                                    <h3 className="mb-2 text-xl font-bold text-white">
                                        วิธีการชำระเงิน
                                    </h3>
                                    <p className="text-white/80">
                                        สัดส่วนการชำระเงินแต่ละประเภท
                                    </p>
                                </div>
                                <div className="p-6">
                                    <Doughnut
                                        data={paymentMethodsData}
                                        options={pieOptions}
                                        height={270}
                                    />
                                </div>
                            </div>

                            {/* Member Stats */}
                            <div className="overflow-hidden bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 border-b border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="mb-2 text-xl font-bold text-white">
                                                สัดส่วนสมาชิก
                                            </h3>
                                            <p className="text-white/80">
                                                เปอร์เซ็นต์การใช้งานของสมาชิก
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <Doughnut
                                        data={memberData}
                                        options={pieOptions}
                                        height={270}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
