import ViewReceiptModal from "@/Components/home/ViewReceiptModal";
import CancelOrderModal from "@/Components/receipt/CancelOrderModal";
import ReceiptTable from "@/Components/receipt/ReceiptTable";
import SearchBar from "@/Components/receipt/SearchBar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Breadcrumb, Card, Select } from 'flowbite-react';
import { Home, Receipt } from "lucide-react";
import { useState } from "react";
import Swal from 'sweetalert2';
import OrderDetailsModal from "../Components/receipt/OrderDetailsModal";

export default function ReceiptHistory({ orders, filters }) {
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [filterType, setFilterType] = useState(filters?.type || "today");
    const [customStartDate, setCustomStartDate] = useState(filters?.startDate || "");
    const [customEndDate, setCustomEndDate] = useState(filters?.endDate || "");

    const handleViewReceipt = (receiptPath) => {
        fetch(`/images/receipt/${receiptPath}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('ไม่พบไฟล์ใบเสร็จ');
                }
                setSelectedReceipt(`/images/receipt/${receiptPath}`);
                setShowReceiptModal(true);
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "ไม่สามารถแสดงใบเสร็จได้",
                    text: "ไม่พบไฟล์ใบเสร็จในระบบ",
                });
            });
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handleCancelOrder = (order) => {
        setSelectedOrder(order);
        setShowCancelModal(true);
    };

    // ฟังก์ชันสำหรับ submit ตัวกรอง
    const handleFilterSubmit = () => {
        router.get(
            route('receipt.history'),
            {
                filterType: filterType,
                startDate: filterType === 'custom' ? customStartDate : null,
                endDate: filterType === 'custom' ? customEndDate : null,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // กรองรายการตามคำค้นหา
    const filteredOrders = orders.data.filter(order => {
        const searchString = searchTerm.toLowerCase();
        const matchesSearch = (
            (order.order_number?.toString() || '').toLowerCase().includes(searchString) ||
            (order.customer?.name || "ลูกค้าทั่วไป").toLowerCase().includes(searchString) ||
            (order.payment_method || '').toLowerCase().includes(searchString)
        );
        return matchesSearch;
    });

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    ประวัติใบเสร็จ
                </h2>
            }
        >
            <Head title="ประวัติการสั่งซื้อ" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Breadcrumb>
                            <Breadcrumb.Item href={route('dashboard')} icon={Home}>
                                หน้าหลัก
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <div className="flex items-center">
                                    <Receipt className="w-4 h-4 mr-2" />
                                    ประวัติใบเสร็จ
                                </div>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <Card>
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 mb-4">
                            <div className="w-full md:w-1/2">
                                <SearchBar
                                    searchTerm={searchTerm}
                                    onSearchChange={setSearchTerm}
                                />
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-2">
                                <Select
                                    className="w-full md:w-1/3"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="today">วันนี้</option>
                                    <option value="week">สัปดาห์นี้</option>
                                    <option value="custom">กำหนดเอง</option>
                                    <option value="all">ทั้งหมด</option>
                                </Select>
                                {filterType === "custom" && (
                                    <>
                                        <input
                                            type="date"
                                            className="w-full md:w-1/3 rounded-lg border-gray-300"
                                            value={customStartDate}
                                            onChange={(e) => setCustomStartDate(e.target.value)}
                                        />
                                        <input
                                            type="date"
                                            className="w-full md:w-1/3 rounded-lg border-gray-300"
                                            value={customEndDate}
                                            onChange={(e) => setCustomEndDate(e.target.value)}
                                        />
                                    </>
                                )}
                                <button
                                    onClick={handleFilterSubmit}
                                    className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    ค้นหา
                                </button>
                            </div>
                        </div>

                        <ReceiptTable
                            orders={filteredOrders}
                            onViewReceipt={handleViewReceipt}
                            onViewOrder={handleViewOrder}
                            onCancelOrder={handleCancelOrder}
                        />

                        {/* Pagination */}
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 mt-4">
                            <div className="flex items-center gap-2">
                                {orders.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url ? `${link.url}&filterType=${filterType}${filterType === 'custom' ? `&startDate=${customStartDate}&endDate=${customEndDate}` : ''}` : '#'}
                                        className={`px-3 py-1 rounded-lg border ${link.active
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : link.url
                                                ? 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                            }`}
                                        preserveScroll
                                        preserveState
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    >
                                    </Link>
                                ))}
                            </div>
                            <div className="text-sm text-gray-700">
                                แสดง {orders.from} ถึง {orders.to} จากทั้งหมด {orders.total} รายการ
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Receipt Modal */}
            <ViewReceiptModal
                show={showReceiptModal}
                onClose={() => setShowReceiptModal(false)}
                receiptUrl={selectedReceipt}
            />

            {/* Order Details Modal */}
            <OrderDetailsModal
                show={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                order={selectedOrder}
            />
            {showCancelModal && (
                <CancelOrderModal
                    isOpen={showCancelModal}
                    onClose={() => {
                        setShowCancelModal(false);
                        setSelectedOrder(null);
                    }}
                    order={selectedOrder}
                />
            )}
        </AuthenticatedLayout>
    );
}
