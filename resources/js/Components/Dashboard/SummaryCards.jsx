import React from 'react';
import { CurrencyDollarIcon, ShoppingCartIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

export default function SummaryCards({ data }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const cards = [
        {
            title: 'ยอดขายทั้งหมด',
            value: formatCurrency(data?.total_sales || 0),
            icon: CurrencyDollarIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            trend: '+12.5%',
            trendColor: 'text-green-600'
        },
        {
            title: 'จำนวนออเดอร์',
            value: data?.total_orders || 0,
            icon: ShoppingCartIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            trend: '+8.2%',
            trendColor: 'text-blue-600'
        },
        {
            title: 'ยอดเฉลี่ยต่อออเดอร์',
            value: formatCurrency(data?.average_order_value || 0),
            icon: ArrowTrendingUpIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            trend: '+4.1%',
            trendColor: 'text-purple-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {cards.map((card, index) => (
                <div key={index} className="relative overflow-hidden bg-white rounded-lg shadow transition-all duration-300 hover:shadow-lg">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 p-3 rounded-lg ${card.bgColor}`}>
                                        <card.icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                                        <div className="mt-1">
                                            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className={`inline-flex items-center text-sm ${card.trendColor}`}>
                                        <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                                        <span>{card.trend} จากเดือนที่แล้ว</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${card.bgColor}`}></div>
                </div>
            ))}
        </div>
    );
}
