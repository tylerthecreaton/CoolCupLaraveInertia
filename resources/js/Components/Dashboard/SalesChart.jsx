import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { ChartBarSquareIcon } from '@heroicons/react/24/outline';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function SalesChart({ data }) {
    const chartData = {
        labels: data.map(item => `${item.hour}:00`),
        datasets: [
            {
                label: 'ยอดขาย',
                data: data.map(item => item.total_sales),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: 'rgb(99, 102, 241)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
            },
            {
                label: 'จำนวนออเดอร์',
                data: data.map(item => item.order_count * 100), // Scale up for better visualization
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: 'rgb(34, 197, 94)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        family: "'Prompt', sans-serif"
                    }
                }
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: 'black',
                titleFont: {
                    size: 13,
                    family: "'Prompt', sans-serif",
                    weight: 'normal'
                },
                bodyColor: 'black',
                bodyFont: {
                    size: 12,
                    family: "'Prompt', sans-serif"
                },
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
                usePointStyle: true,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.dataset.label === 'ยอดขาย') {
                            label += new Intl.NumberFormat('th-TH', {
                                style: 'currency',
                                currency: 'THB',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(context.raw);
                        } else {
                            label += Math.round(context.raw / 100); // Scale down for actual value
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        family: "'Prompt', sans-serif"
                    }
                }
            },
            y: {
                position: 'left',
                grid: {
                    color: '#f3f4f6'
                },
                ticks: {
                    font: {
                        size: 12,
                        family: "'Prompt', sans-serif"
                    },
                    callback: function(value) {
                        return new Intl.NumberFormat('th-TH', {
                            style: 'currency',
                            currency: 'THB',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(value);
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
                        <ChartBarSquareIcon className="w-6 h-6 text-indigo-600" />
                        <h3 className="ml-2 text-lg font-semibold text-gray-900">ยอดขายตามช่วงเวลา</h3>
                    </div>
                </div>
                <div className="h-80">
                    <Line data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
}
