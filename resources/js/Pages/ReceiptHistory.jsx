import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Link } from "@inertiajs/react";
import Swal from 'sweetalert2';
import { Receipt, Home, Search } from "lucide-react";
import ViewReceiptModal from "@/Components/home/ViewReceiptModal";
import { useState } from "react";
import { Breadcrumb, TextInput, Card, Table, Modal } from 'flowbite-react';

export default function ReceiptHistory({ orders }) {
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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
                            <div className="w-full md:w-1/2">
                                <form className="flex items-center">
                                    <TextInput
                                        type="text"
                                        placeholder="ค้นหาจากเลขที่ใบเสร็จ, ชื่อลูกค้า, วิธีการชำระเงิน"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        icon={Search}
                                        className="w-full"
                                    />
                                </form>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table hoverable className="w-full">
                                <Table.Head className="text-xs uppercase bg-gray-100">
                                    <Table.HeadCell className="px-6 py-4">เลขที่ใบเสร็จ</Table.HeadCell>
                                    <Table.HeadCell className="px-6 py-4">วันที่</Table.HeadCell>
                                    <Table.HeadCell className="px-6 py-4">ลูกค้า</Table.HeadCell>
                                    <Table.HeadCell className="px-6 py-4">รายการสินค้า</Table.HeadCell>
                                    <Table.HeadCell className="px-6 py-4">การชำระเงิน</Table.HeadCell>
                                    <Table.HeadCell className="px-6 py-4">ใบเสร็จ</Table.HeadCell>
                                    <Table.HeadCell className="px-6 py-4">ยอดรวม</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y divide-gray-200">
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <Table.Row key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                <Table.Cell className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    #{order.order_number}
                                                </Table.Cell>
                                                <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                                    {format(
                                                        new Date(order.created_at),
                                                        "dd MMMM yyyy HH:mm",
                                                        { locale: th }
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                                    {order.customer ? (
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8">
                                                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
                                                                    {order.customer.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {order.customer.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">ลูกค้าทั่วไป</span>
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleViewOrder(order)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        ดูรายการสินค้า ({order.order_details.length} รายการ)
                                                    </button>
                                                </Table.Cell>
                                                <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900 capitalize">
                                                            {order.payment_method}
                                                        </span>
                                                        {order.payment_slip && (
                                                            <span className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                                                                ดูสลิป
                                                            </span>
                                                        )}
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                                    {order.receipt_path ? (
                                                        <button
                                                            onClick={() => handleViewReceipt(order.receipt_path)}
                                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition-colors"
                                                        >
                                                            <Receipt className="w-4 h-4 mr-2" />
                                                            ดูใบเสร็จ
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg">
                                                            <Receipt className="w-4 h-4 mr-2" />
                                                            ไม่มีใบเสร็จ
                                                        </span>
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-lg font-semibold text-gray-900">
                                                            ฿{order.final_amount.toLocaleString()}
                                                        </span>
                                                        {order.discount > 0 && (
                                                            <div className="flex items-center space-x-1">
                                                                <span className="text-xs text-gray-500 line-through">
                                                                    ฿{order.total_amount.toLocaleString()}
                                                                </span>
                                                                <span className="text-xs font-medium text-green-600">
                                                                    (-{order.discount}%)
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))
                                    ) : (
                                        <Table.Row>
                                            <Table.Cell colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                ไม่พบข้อมูล
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 mt-4">
                            <div className="flex items-center gap-2">
                                {orders.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded-lg border ${
                                            link.active
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
            <Modal
                show={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                size="xl"
                className="dark:bg-gray-800"
            >
                <Modal.Header className="border-b border-gray-200 !p-6 bg-gray-50">
                    <div className="flex flex-col w-full">
                        <h3 className="text-xl font-semibold text-gray-900">รายละเอียดการสั่งซื้อ</h3>
                        {selectedOrder && (
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm font-medium text-gray-700">
                                    ออเดอร์ #{selectedOrder.order_number}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {format(new Date(selectedOrder.created_at), "dd MMMM yyyy HH:mm", { locale: th })}
                                </span>
                            </div>
                        )}
                    </div>
                </Modal.Header>
                <Modal.Body className="!p-6">
                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        {selectedOrder.customer ? (
                                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white text-xl font-semibold">
                                                {selectedOrder.customer.name.charAt(0)}
                                            </span>
                                        ) : (
                                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-xl">
                                                G
                                            </span>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium text-gray-900">
                                            {selectedOrder.customer ? selectedOrder.customer.name : "ลูกค้าทั่วไป"}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            ชำระเงินผ่าน: <span className="capitalize">{selectedOrder.payment_method}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    สินค้า
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ขนาด
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ความหวาน
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    จำนวน
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ราคา
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {selectedOrder.order_details.map((item, index) => (
                                                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={item.product_image}
                                                                alt={item.product_name}
                                                                className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                                                            />
                                                            <div className="ml-4 flex flex-col">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {item.product_name}
                                                                </span>
                                                                {/* {item.toppings && item.toppings.length > 0 && (
                                                                    <span className="text-xs text-gray-500 mt-1">
                                                                        เพิ่ม: {item.toppings.map(topping => topping.name).join(", ")}
                                                                    </span>
                                                                )} */}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {item.size}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {item.sweetness}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {item.quantity} แก้ว
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                        ฿{item.price.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700">ยอดรวม</span>
                                    <span className="font-medium text-gray-900">฿{selectedOrder.total_amount.toLocaleString()}</span>
                                </div>
                                {selectedOrder.discount > 0 && (
                                    <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                                        <span className="font-medium text-green-600">ส่วนลด {selectedOrder.discount}%</span>
                                        <span className="font-medium text-green-600">
                                            -฿{(selectedOrder.total_amount - selectedOrder.final_amount).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base border-t border-gray-200 pt-3">
                                    <span className="font-semibold text-gray-900">ยอดสุทธิ</span>
                                    <span className="font-semibold text-gray-900">฿{selectedOrder.final_amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </AuthenticatedLayout>
    );
}
