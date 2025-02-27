import React from 'react';
import { Bar } from 'react-chartjs-2';
import { BeakerIcon } from '@heroicons/react/24/outline';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const IngredientUsage = ({ ingredientUsage = [] }) => {
    if (!Array.isArray(ingredientUsage)) {
        return null;
    }

    // Define a color palette for the bars
    const colorPalette = [
        { start: 'rgb(54, 162, 235)', end: 'rgba(54, 162, 235, 0.5)' },   // Blue
        { start: 'rgb(255, 99, 132)', end: 'rgba(255, 99, 132, 0.5)' },   // Pink
        { start: 'rgb(75, 192, 192)', end: 'rgba(75, 192, 192, 0.5)' },   // Teal
        { start: 'rgb(255, 159, 64)', end: 'rgba(255, 159, 64, 0.5)' },   // Orange
        { start: 'rgb(153, 102, 255)', end: 'rgba(153, 102, 255, 0.5)' }, // Purple
        { start: 'rgb(255, 205, 86)', end: 'rgba(255, 205, 86, 0.5)' },   // Yellow
        { start: 'rgb(201, 203, 207)', end: 'rgba(201, 203, 207, 0.5)' }, // Gray
        { start: 'rgb(255, 99, 71)', end: 'rgba(255, 99, 71, 0.5)' },     // Tomato
        { start: 'rgb(46, 204, 113)', end: 'rgba(46, 204, 113, 0.5)' },   // Emerald
        { start: 'rgb(142, 68, 173)', end: 'rgba(142, 68, 173, 0.5)' },   // Wisteria
    ];

    const chartData = {
        labels: ingredientUsage.map(item => item.name),
        datasets: [
            {
                label: 'ปริมาณการใช้',
                data: ingredientUsage.map(item => Math.abs(item.total_amount)),
                backgroundColor: ingredientUsage.map((_, index) => colorPalette[index % colorPalette.length].end),
                borderColor: ingredientUsage.map((_, index) => colorPalette[index % colorPalette.length].start),
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 32,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#2563eb',
                bodyColor: '#1f2937',
                titleFont: {
                    family: 'IBM Plex Sans Thai',
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    family: 'IBM Plex Sans Thai',
                    size: 13
                },
                padding: 12,
                borderWidth: 1,
                callbacks: {
                    label: (context) => {
                        const dataIndex = context.dataIndex;
                        const amount = context.raw;
                        const unit = ingredientUsage[dataIndex].unit;
                        return `ปริมาณ: ${amount.toLocaleString()} ${unit}`;
                    }
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    font: {
                        family: 'IBM Plex Sans Thai',
                        size: 12
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    font: {
                        family: 'IBM Plex Sans Thai',
                        size: 12
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <BeakerIcon className="w-6 h-6 text-indigo-600" />
                        <h3 className="ml-2 text-lg font-semibold text-gray-900">การใช้วัตถุดิบ</h3>
                    </div>
                </div>
                {ingredientUsage.length > 0 ? (
                    <div className="h-[400px] relative">
                        <Bar data={chartData} options={options} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[400px] text-gray-500">
                        <div className="text-center">
                            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูลการใช้วัตถุดิบ</h3>
                            <p className="mt-1 text-sm text-gray-500">ไม่พบข้อมูลการใช้วัตถุดิบในช่วงเวลาที่เลือก</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IngredientUsage;
