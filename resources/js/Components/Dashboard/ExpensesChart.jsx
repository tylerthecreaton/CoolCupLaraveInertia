import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { BanknotesIcon } from '@heroicons/react/24/outline';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensesChart({ data }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const colors = [
        'rgb(99, 102, 241)', // Indigo
        'rgb(34, 197, 94)',  // Green
        'rgb(249, 115, 22)', // Orange
        'rgb(236, 72, 153)', // Pink
        'rgb(234, 179, 8)',  // Yellow
        'rgb(168, 85, 247)', // Purple
        'rgb(14, 165, 233)', // Sky
        'rgb(239, 68, 68)',  // Red
    ];

    const chartData = {
        labels: data.map(item => item.category),
        datasets: [
            {
                data: data.map(item => item.total_amount),
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.2)')),
                borderWidth: 2,
                hoverOffset: 4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        family: "'Prompt', sans-serif"
                    },
                    generateLabels: function(chart) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                const backgroundColor = data.datasets[0].backgroundColor[i];
                                return {
                                    text: `${label} (${formatCurrency(value)})`,
                                    fillStyle: backgroundColor,
                                    strokeStyle: backgroundColor,
                                    lineWidth: 2,
                                    hidden: false,
                                    index: i
                                };
                            });
                        }
                        return [];
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
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                    }
                }
            }
        }
    };

    const totalExpenses = data.reduce((acc, curr) => acc + curr.total_amount, 0);

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <BanknotesIcon className="w-6 h-6 text-indigo-600" />
                        <h3 className="ml-2 text-lg font-semibold text-gray-900">รายจ่ายตามหมวดหมู่</h3>
                    </div>
                    <div className="text-sm text-gray-500">
                        รวม: <span className="font-semibold text-gray-900">{formatCurrency(totalExpenses)}</span>
                    </div>
                </div>
                <div className="h-80">
                    <Doughnut data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
}
