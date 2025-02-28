import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'กราฟแสดงจำนวนการขายสินค้า',
            font: {
                family: 'IBM Plex Sans Thai, sans-serif',
                size: 24,
                weight: 'bold'
            },
            padding: {
                top: 20,
                bottom: 30
            },
            color: '#1a365d'
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    return `จำนวนขาย: ${context.raw.toLocaleString('th-TH')} ชิ้น`;
                }
            },
            padding: 12,
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleFont: {
                family: 'IBM Plex Sans Thai, sans-serif',
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                family: 'IBM Plex Sans Thai, sans-serif',
                size: 13
            },
            bodySpacing: 8,
            usePointStyle: true,
            boxPadding: 6
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(226, 232, 240, 0.6)',
                drawBorder: false
            },
            ticks: {
                font: {
                    family: 'IBM Plex Sans Thai, sans-serif',
                    size: 12
                },
                padding: 10,
                color: '#4a5568'
            },
            title: {
                display: true,
                text: 'จำนวนขาย (ชิ้น)',
                font: {
                    family: 'IBM Plex Sans Thai, sans-serif',
                    size: 14,
                    weight: 'bold'
                },
                padding: { top: 20, bottom: 20 },
                color: '#2d3748'
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                font: {
                    family: 'IBM Plex Sans Thai, sans-serif',
                    size: 12
                },
                maxRotation: 45,
                minRotation: 45,
                color: '#4a5568'
            },
            title: {
                display: true,
                text: 'สินค้า',
                font: {
                    family: 'IBM Plex Sans Thai, sans-serif',
                    size: 14,
                    weight: 'bold'
                },
                padding: { top: 20 },
                color: '#2d3748'
            }
        }
    },
    animation: {
        onComplete: function(animation) {
            const ctx = animation.chart.ctx;
            ctx.font = '12px IBM Plex Sans Thai';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = '#2d3748';

            animation.chart.data.datasets[0].data.forEach((value, index) => {
                const bar = animation.chart.getDatasetMeta(0).data[index];
                const x = bar.x;
                const y = bar.y - 5;
                ctx.fillText(value.toLocaleString('th-TH'), x, y);
            });
        }
    }
};

// สร้างชุดสีแบบไล่ระดับตามจำนวนการขาย
const generateGradientColors = (value, maxValue) => {
    const hue = (value / maxValue) * 120;
    return `hsla(${hue}, 85%, 65%, 0.85)`;
};

export default function ProductSalesBarChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูลการขาย</h3>
                    <p className="mt-1 text-sm text-gray-500">ไม่พบข้อมูลการขายในช่วงเวลาที่เลือก</p>
                </div>
            </div>
        );
    }

    const maxSales = Math.max(...data.map(item => item.quantity_sold));

    const chartData = {
        labels: data.map(item => item.product_name),
        datasets: [
            {
                data: data.map(item => item.quantity_sold),
                backgroundColor: data.map(item => 
                    generateGradientColors(item.quantity_sold, maxSales)
                ),
                borderWidth: 1,
                borderRadius: 8,
                barPercentage: 0.75,
            }
        ]
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-lg p-6">
            <div className="h-[400px] mb-8">
                <Bar options={options} data={chartData} />
            </div>
            
            <div className="border-t pt-6 space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                    <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                        <div className="w-4 h-4 rounded-full bg-red-500 mr-3 opacity-85"></div>
                        <span className="text-gray-700 font-medium">ยอดขายต่ำ</span>
                        <span className="text-red-600 text-xs ml-2">(ควรทำโปรโมชั่น)</span>
                    </div>
                    <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-3 opacity-85"></div>
                        <span className="text-gray-700 font-medium">ยอดขายปานกลาง</span>
                    </div>
                    <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                        <div className="w-4 h-4 rounded-full bg-green-500 mr-3 opacity-85"></div>
                        <span className="text-gray-700 font-medium">ยอดขายดี</span>
                    </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg mt-4">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-blue-800 font-medium">
                        คำแนะนำ: พิจารณาทำโปรโมชั่นสำหรับสินค้าที่มีแถบสีแดงเพื่อกระตุ้นยอดขาย
                    </span>
                </div>
            </div>
        </div>
    );
}
