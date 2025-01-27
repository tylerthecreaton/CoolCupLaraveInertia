import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import Swal from 'sweetalert2';
import { Receipt, Home } from "lucide-react";
import ViewReceiptModal from "@/Components/home/ViewReceiptModal";
import { useState } from "react";
import { Breadcrumb, Card } from 'flowbite-react';
import SearchBar from "@/Components/receipt/SearchBar";
import ReceiptTable from "@/Components/receipt/ReceiptTable";
import OrderDetailsModal from "@/Components/receipt/OrderDetailsModal";
import CancelOrderModal from "@/Components/receipt/CancelOrderModal";

export default function ReceiptHistory({ orders }) {
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);

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

    // กรองรายการตามคำค้นหา
    const filteredOrders = orders.data.filter(order => {
        const searchString = searchTerm.toLowerCase();
        return (
            (order.order_number?.toString() || '').toLowerCase().includes(searchString) ||
            (order.customer?.name || "ลูกค้าทั่วไป").toLowerCase().includes(searchString) ||
            (order.payment_method || '').toLowerCase().includes(searchString)
        );
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
                            <SearchBar
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                            />
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
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded-lg border ${link.active
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : link.url
                                                ? 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                            }`}
                                        preserveScroll
                                    >
                                        {link.label === 'pagination.previous'
                                            ? 'ย้อนกลับ'
                                            : link.label === 'pagination.next'
                                                ? 'ถัดไป'
                                                : link.label}
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
