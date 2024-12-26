import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Link } from "@inertiajs/react";
import Swal from 'sweetalert2';
import { Receipt, Home, Search } from "lucide-react";
import ViewReceiptModal from "@/Components/home/ViewReceiptModal";
import { useState } from "react";
import { Breadcrumb, TextInput, Card, Table } from 'flowbite-react';

export default function ReceiptHistory({ orders }) {
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleViewReceipt = (receiptPath) => {
        fetch(`/images/receipt/${receiptPath}`)
            .then(response => {
                if (!response.ok) {
                    Swal.fire({
                        title: 'ไม่พบใบเสร็จ',
                        text: 'ไม่พบไฟล์ใบเสร็จในระบบ',
                        icon: 'error',
                        confirmButtonText: 'ตกลง'
                    });
                    return;
                }
                setSelectedReceipt(receiptPath);
                setShowModal(true);
            })
            .catch(() => {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถเปิดใบเสร็จได้',
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                });
            });
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
            <Head title="ประวัติใบเสร็จ" />

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
                                                    <ul className="space-y-3">
                                                        {order.order_details.map((item) => (
                                                            <li key={item.id} className="flex items-center space-x-3">
                                                                <img
                                                                    src={item.product_image}
                                                                    alt={item.product_name}
                                                                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium text-gray-900">
                                                                        {item.product_name}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {item.size}
                                                                        {item.sweetness !== "100%" && ` • ${item.sweetness}`}
                                                                        {` • ${item.quantity} แก้ว`}
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
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

            <ViewReceiptModal
                show={showModal}
                onClose={() => setShowModal(false)}
                receiptPath={selectedReceipt}
            />
        </AuthenticatedLayout>
    );
}
