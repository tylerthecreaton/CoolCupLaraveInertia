import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DateRangePicker from '../Components/Dashboard/DateRangePicker';
import SummaryCards from '../Components/Dashboard/SummaryCards';
import SalesChart from '../Components/Dashboard/SalesChart';
import InventoryStatus from '../Components/Dashboard/InventoryStatus';
import TopProducts from '../Components/Dashboard/TopProducts';
import ExpensesChart from '../Components/Dashboard/ExpensesChart';

export default function Dashboard({ auth, salesData, topProducts, ingredients, expenses, hourlySales, filters }) {
    const [dateRange, setDateRange] = useState(filters.dateRange);
    const [startDate, setStartDate] = useState(filters.startDate);
    const [endDate, setEndDate] = useState(filters.endDate);

    const handleDateRangeChange = (newRange) => {
        setDateRange(newRange);
        // Refresh data via Inertia
        router.get(
            route('dashboard'),
            { dateRange: newRange },
            { preserveState: true }
        );
    };

    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        // Refresh data via Inertia
        router.get(
            route('dashboard'),
            { 
                dateRange: 'custom', 
                startDate: start,
                endDate: end
            },
            { preserveState: true }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        สวัสดี, {auth.user.name}! 👋
                    </h2>
                    <p className="mt-1 text-gray-600">
                        ยินดีต้อนรับสู่ระบบจัดการร้าน CoolCupPOS
                    </p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Date Range Filters */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <DateRangePicker
                                dateRange={dateRange}
                                startDate={startDate}
                                endDate={endDate}
                                onDateRangeChange={handleDateRangeChange}
                                onDateChange={handleDateChange}
                            />
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="mb-6">
                        <SummaryCards data={salesData} />
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Sales Chart */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <SalesChart data={hourlySales} />
                            </div>
                        </div>

                        {/* Expenses Chart */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <ExpensesChart data={expenses} />
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Products */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <TopProducts products={topProducts} />
                            </div>
                        </div>

                        {/* Inventory Status */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <InventoryStatus ingredients={ingredients} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
