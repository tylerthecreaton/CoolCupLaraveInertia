import React from 'react';
import { CircleStackIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function InventoryStatus({ ingredients }) {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <CircleStackIcon className="w-6 h-6 text-indigo-600" />
                        <h3 className="ml-2 text-lg font-semibold text-gray-900">สถานะวัตถุดิบ</h3>
                    </div>
                </div>
                <div className="overflow-hidden">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {ingredients.map((ingredient, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border ${
                                    ingredient.status === 'low'
                                        ? 'border-red-200 bg-red-50'
                                        : 'border-gray-200 bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                            {ingredient.name}
                                        </h4>
                                        <div className="mt-1 flex items-center">
                                            <p className={`text-sm ${
                                                ingredient.status === 'low' ? 'text-red-600' : 'text-gray-500'
                                            }`}>
                                                {ingredient.total_quantity.toLocaleString()} {ingredient.unit}
                                            </p>
                                        </div>
                                    </div>
                                    {ingredient.status === 'low' && (
                                        <div className="ml-4">
                                            <span className="inline-flex items-center p-1.5 rounded-full bg-red-100">
                                                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {ingredient.status === 'low' && (
                                    <div className="mt-2">
                                        <p className="text-sm text-red-600">
                                            วัตถุดิบใกล้หมด กรุณาเติมสต็อก
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
