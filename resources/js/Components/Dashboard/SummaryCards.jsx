import React from 'react';
import { CurrencyDollarIcon, ShoppingCartIcon, ArrowTrendingUpIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import { Tooltip } from 'flowbite-react';
import clsx from 'clsx';

export default function SummaryCards({ data }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatTrend = (trend) => {
        if (!trend && trend !== 0) return '0%';
        return `${trend > 0 ? '+' : ''}${Math.abs(trend).toLocaleString()}%`;
    };

    const getTrendIcon = (trend) => {
        if (trend > 0) return ArrowUpIcon;
        if (trend < 0) return ArrowDownIcon;
        return ArrowTrendingUpIcon;
    };

    const getTrendColor = (trend) => {
        if (trend > 0) return 'text-emerald-600';
        if (trend < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    // Calculate after VAT amount
    const vatRate = data?.settings?.vat_rate || 7;
    const totalSales = data?.total_sales || 0;
    const afterVatAmount = totalSales - (totalSales * (vatRate / 100));

    const cards = [
        {
            title: 'ยอดขายทั้งหมด',
            value: formatCurrency(totalSales),
            icon: CurrencyDollarIcon,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100',
            trend: data?.sales_trend,
            tooltip: 'แสดง % ความแตกต่างเทียบกับช่วงก่อนหน้า โดยใช้ค่าที่มากกว่าเป็นฐานในการคำนวณ'
        },
        {
            title: 'ยอดขายหลังหักภาษี',
            value: formatCurrency(afterVatAmount),
            subText: `(VAT ${vatRate}%)`,
            icon: CurrencyDollarIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            trend: data?.sales_trend,
            tooltip: 'แสดง % ความแตกต่างเทียบกับช่วงก่อนหน้า โดยใช้ค่าที่มากกว่าเป็นฐานในการคำนวณ'
        },
        {
            title: 'จำนวนออเดอร์',
            value: data?.total_orders || 0,
            icon: ShoppingCartIcon,
            color: 'text-violet-600',
            bgColor: 'bg-violet-100',
            trend: data?.orders_trend,
            tooltip: 'แสดง % ความแตกต่างเทียบกับช่วงก่อนหน้า โดยใช้ค่าที่มากกว่าเป็นฐานในการคำนวณ'
        },
        {
            title: 'ยอดเฉลี่ยต่อออเดอร์',
            value: formatCurrency(data?.average_order_value || 0),
            icon: ArrowTrendingUpIcon,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100',
            trend: data?.avg_order_trend,
            tooltip: 'แสดง % ความแตกต่างเทียบกับช่วงก่อนหน้า โดยใช้ค่าที่มากกว่าเป็นฐานในการคำนวณ'
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => {
                const TrendIcon = getTrendIcon(card.trend);
                const trendColor = getTrendColor(card.trend);
                
                return (
                    <div 
                        key={index} 
                        className="overflow-hidden relative bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className={`flex-shrink-0 p-3 rounded-lg ${card.bgColor}`}>
                                    <card.icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                                <Tooltip content={card.tooltip}>
                                    <InformationCircleIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                </Tooltip>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                                <div className="mt-2">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {card.value}
                                        {card.subText && (
                                            <span className="ml-1 text-sm font-normal text-gray-500">
                                                {card.subText}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <span className={clsx(
                                        "text-xs font-medium mr-2 px-2.5 py-0.5 rounded",
                                        card.trend > 0 ? "bg-green-100 text-green-800" : 
                                        card.trend < 0 ? "bg-red-100 text-red-800" : 
                                        "bg-gray-100 text-gray-800"
                                    )}>
                                        {card.trend !== 0 && (card.trend > 0 ? "+" : "-")}
                                        {Math.abs(card.trend)}%
                                    </span>
                                    <span className="text-sm text-gray-500">เทียบกับเมื่อวาน</span>
                                </div>
                            </div>
                        </div>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 ${card.bgColor}`}></div>
                    </div>
                );
            })}
        </div>
    );
}
