import React from "react";
import { usePage } from '@inertiajs/react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { isAbsoluteUrl } from "@/helpers";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const gradientColors = {
    start: 'rgba(59, 130, 246, 0.8)', // Bright blue
    middle: 'rgba(147, 51, 234, 0.7)', // Purple
    end: 'rgba(236, 72, 153, 0.6)', // Pink
    background: 'rgba(59, 130, 246, 0.05)'
};

export default function MainContent({ topProducts = [], statistics = {} }) {
    const { dailySales = [] } = usePage().props;

    const formatCurrency = (amount) => {
        return parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const createGradient = (ctx) => {
        if (!ctx) return gradientColors.start;

        const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
        gradient.addColorStop(0, gradientColors.start);
        gradient.addColorStop(0.5, gradientColors.middle);
        gradient.addColorStop(1, gradientColors.end);
        return gradient;
    };

    const createBackgroundGradient = (ctx) => {
        if (!ctx) return gradientColors.background;

        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
        return gradient;
    };

    const chartData = {
        labels: dailySales.map(item => item.date),
        datasets: [
            {
                label: 'Daily Sales',
                data: dailySales.map(item => item.total),
                fill: true,
                borderWidth: 3,
                borderColor: function(context) {
                    const chart = context.chart;
                    const {ctx} = chart;
                    return createGradient(ctx);
                },
                backgroundColor: function(context) {
                    const chart = context.chart;
                    const {ctx} = chart;
                    return createBackgroundGradient(ctx);
                },
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: 'white',
                pointBorderColor: gradientColors.middle,
                pointBorderWidth: 3,
                pointHoverBorderWidth: 4,
                pointHoverBackgroundColor: 'white',
                pointHoverBorderColor: gradientColors.end,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                bodyFont: {
                    size: 14,
                    weight: '600'
                },
                padding: 12,
                borderColor: 'rgba(209, 213, 219, 0.5)',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return '฿' + formatCurrency(context.raw);
                    }
                }
            }
        },
        interaction: {
            mode: 'nearest',
            intersect: false,
            axis: 'x'
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: '500'
                    },
                    color: '#6b7280'
                }
            },
            y: {
                beginAtZero: true,
                border: {
                    display: false
                },
                grid: {
                    color: 'rgba(209, 213, 219, 0.25)'
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: '500'
                    },
                    color: '#6b7280',
                    padding: 8,
                    callback: function(value) {
                        return '฿' + formatCurrency(value);
                    }
                }
            }
        },
        elements: {
            line: {
                borderJoinStyle: 'round'
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Sales Card */}
                <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg transition-all transform hover:scale-105">
                    <h3 className="text-sm font-medium text-blue-100">ยอดขายรายเดือน</h3>
                    <p className="text-3xl font-bold text-white">฿{formatCurrency(statistics.totalSales || 0)}</p>
                    <p className="flex items-center text-sm text-blue-100">
                        <span className="mr-1">{statistics.salesChange >= 0 ? '↑' : '↓'}</span>
                        {statistics.salesChange >= 0 ? '+' : ''}{statistics.salesChange || 0}% จากเดือนที่แล้ว
                    </p>
                </div>

                {/* Orders Card */}
                <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg transition-all transform hover:scale-105">
                    <h3 className="text-sm font-medium text-purple-100">รายการสั่งซื้อรายเดือน</h3>
                    <p className="text-3xl font-bold text-white">{statistics.totalOrders || 0}</p>
                    <p className="flex items-center text-sm text-purple-100">
                        <span className="mr-1">{statistics.ordersChange >= 0 ? '↑' : '↓'}</span>
                        {statistics.ordersChange >= 0 ? '+' : ''}{statistics.ordersChange || 0}% จากเดือนที่แล้ว
                    </p>
                </div>

                {/* Average Order Value */}
                <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg transition-all transform hover:scale-105">
                    <h3 className="text-sm font-medium text-green-100">ยอดเฉลี่ยต่อออเดอร์</h3>
                    <p className="text-3xl font-bold text-white">฿{formatCurrency(statistics.averageOrderValue || 0)}</p>
                    <p className="flex items-center text-sm text-green-100">
                        <span className="mr-1">{statistics.averageOrderChange >= 0 ? '↑' : '↓'}</span>
                        {statistics.averageOrderChange >= 0 ? '+' : ''}{statistics.averageOrderChange || 0}% จากเดือนที่แล้ว
                    </p>
                </div>

                {/* Customers */}
                <div className="p-6 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg transition-all transform hover:scale-105">
                    <h3 className="text-sm font-medium text-red-100">จำนวนลูกค้ารายเดือน</h3>
                    <p className="text-3xl font-bold text-white">{statistics.totalCustomers || 0}</p>
                    <p className="flex items-center text-sm text-red-100">
                        <span className="mr-1">{statistics.customersChange >= 0 ? '↑' : '↓'}</span>
                        {statistics.customersChange >= 0 ? '+' : ''}{statistics.customersChange || 0}% จากเดือนที่แล้ว
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Sales Chart */}
                <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-lg">
                    <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900">
                        <span className="mr-2 w-2 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></span>
                        กราฟข้อมูลการขาย
                    </h3>
                    <div className="h-80">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Top Products */}
                <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-lg">
                    <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900">
                        <span className="mr-2 w-2 h-2 bg-purple-500 rounded-full"></span>
                        สินค้ายอดนิยม
                    </h3>
                    <div className="space-y-4">
                        {Array.isArray(topProducts) && topProducts.map((product) => (
                            <div key={product.id} className="flex justify-between items-center p-4 rounded-lg transition-colors hover:bg-gray-50">
                                <div className="flex items-center">
                                    <div className="flex overflow-hidden justify-center items-center w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                                        {product.image ? (
                                            <img
                                                src={isAbsoluteUrl(product.image)
                                                    ? product.image
                                                    : `/images/products/${product.image}`
                                            }
                                                alt={product.name}
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItaW1hZ2UiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiPjwvcG9seWxpbmU+PC9zdmc+';
                                                }}
                                            />
                                        ) : (
                                            <div className="flex justify-center items-center w-full h-full bg-gray-100">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {product.category?.name || 'Uncategorized'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                    ฿{formatCurrency(product.price)}
                                </p>
                            </div>
                        ))}

                        {(!Array.isArray(topProducts) || topProducts.length === 0) && (
                            <div className="py-8 text-center text-gray-500">
                                No products found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
