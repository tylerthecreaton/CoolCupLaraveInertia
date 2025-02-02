import React from 'react';
import { ArrowTrendingUpIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function TopProducts({ products }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <ChartBarIcon className="w-6 h-6 text-indigo-600" />
                        <h3 className="ml-2 text-lg font-semibold text-gray-900">สินค้าขายดี</h3>
                    </div>
                </div>
                <div className="overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">สินค้า</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">จำนวน</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">รายได้</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">สัดส่วน</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product, index) => {
                                const percentage = ((product.total_quantity / products[0].total_quantity) * 100).toFixed(1);
                                return (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                                            {product.name}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-right text-gray-900">
                                            {product.total_quantity.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                                            {formatCurrency(product.total_revenue)}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                                                {percentage}%
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
