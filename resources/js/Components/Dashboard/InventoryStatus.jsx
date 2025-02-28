import React, { useState } from 'react';
import { CircleStackIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Tooltip = ({ children, content, show }) => {
    if (!show) return null;
    
    return (
        <div style={{ zIndex: 9999 }} className="fixed w-64 p-4 text-sm transform -translate-x-1/2 -translate-y-full bg-gray-900 rounded-xl shadow-xl pointer-events-none">
            {content}
            <div className="absolute w-3 h-3 bg-gray-900 rotate-45 -translate-x-1/2 left-1/2 -bottom-1.5"></div>
        </div>
    );
};

export default function InventoryStatus({ ingredients }) {
    const [tooltipIndex, setTooltipIndex] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (index, event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
        setTooltipIndex(index);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg relative">
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <CircleStackIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">สถานะวัตถุดิบ</h3>
                    </div>
                </div>
                <div className="overflow-visible">
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {ingredients.map((ingredient, index) => {
                            const isLow = ingredient.status === 'low';
                            return (
                                <div
                                    key={index}
                                    className={`relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                                        isLow
                                            ? 'border-red-200 bg-red-50 hover:border-red-300'
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                    }`}
                                    onMouseEnter={(e) => handleMouseEnter(index, e)}
                                    onMouseLeave={() => setTooltipIndex(null)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-medium text-gray-900 truncate">
                                                {ingredient.name}
                                            </h4>
                                            <div className="mt-2 flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`} />
                                                <p className={`text-sm font-medium ${
                                                    isLow ? 'text-red-600' : 'text-gray-600'
                                                }`}>
                                                    {(ingredient.total_quantity || 0).toLocaleString()} {ingredient.unit}
                                                </p>
                                            </div>
                                        </div>
                                        {isLow && (
                                            <div className="ml-4">
                                                <span className="inline-flex items-center p-2 rounded-lg bg-red-100 transition-transform duration-200 hover:scale-110">
                                                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {isLow && (
                                        <div className="mt-3 px-3 py-2 bg-red-100 rounded-lg">
                                            <p className="text-sm font-medium text-red-600">
                                                ⚠️ วัตถุดิบใกล้หมด กรุณาเติมสต็อก
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {tooltipIndex !== null && (
                <div style={{ 
                    position: 'fixed',
                    left: tooltipPosition.x,
                    top: tooltipPosition.y,
                }}>
                    <Tooltip 
                        show={true}
                        content={
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-white">{ingredients[tooltipIndex].name}</p>
                                    {ingredients[tooltipIndex].status === 'low' && (
                                        <span className="px-2 py-1 text-xs font-medium text-red-900 bg-red-200 rounded-full">
                                            สต็อกต่ำ
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2 text-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span>จำนวนคงเหลือ:</span>
                                        <span className="font-medium text-white">
                                            {(ingredients[tooltipIndex].total_quantity || 0).toLocaleString()} {ingredients[tooltipIndex].unit}
                                        </span>
                                    </div>
                                    {ingredients[tooltipIndex].status === 'low' && (
                                        <div className="px-3 py-2 bg-red-900 bg-opacity-50 rounded-lg">
                                            <p className="text-red-200">
                                                ⚠️ ควรเติมสต็อกเพื่อป้องกันการขาดแคลน
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                    />
                </div>
            )}
        </div>
    );
}
