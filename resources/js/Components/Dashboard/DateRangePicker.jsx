import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function DateRangePicker({ dateRange, startDate, endDate, onDateRangeChange, onDateChange }) {
    const handleQuickSelect = (range) => {
        onDateRangeChange(range);
    };

    return (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex space-x-2">
                <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                        dateRange === 'today'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleQuickSelect('today')}
                >
                    วันนี้
                </button>
                <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                        dateRange === 'yesterday'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleQuickSelect('yesterday')}
                >
                    เมื่อวาน
                </button>
                <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                        dateRange === 'thisWeek'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleQuickSelect('thisWeek')}
                >
                    สัปดาห์นี้
                </button>
                <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                        dateRange === 'thisMonth'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleQuickSelect('thisMonth')}
                >
                    เดือนนี้
                </button>
            </div>

            <div className="flex-1 sm:text-right">
                <div className="inline-flex items-center">
                    <DatePicker
                        selectsRange={true}
                        startDate={startDate ? new Date(startDate) : null}
                        endDate={endDate ? new Date(endDate) : null}
                        onChange={(update) => {
                            const [start, end] = update;
                            onDateChange(
                                start ? start.toISOString() : null,
                                end ? end.toISOString() : null
                            );
                        }}
                        locale={th}
                        dateFormat="dd/MM/yyyy"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        customInput={
                            <button className="inline-flex items-center">
                                <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                                {startDate && endDate ? (
                                    <>
                                        {format(new Date(startDate), 'dd/MM/yyyy')} -{' '}
                                        {format(new Date(endDate), 'dd/MM/yyyy')}
                                    </>
                                ) : (
                                    'เลือกช่วงเวลา'
                                )}
                            </button>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
