import { Table } from 'flowbite-react';
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function ReceiptTable({ orders, onViewReceipt, onViewOrder, handleCancelOrder }) {
    return (
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
                    <Table.HeadCell className="px-6 py-4">จัดการ</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200">
                    {orders.length > 0 ? (
                        orders.map((order) => (
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
                                        onClick={() => onViewOrder(order)}
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
                                            onClick={() => onViewReceipt(order.receipt_path)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            ดูใบเสร็จ
                                        </button>
                                    ) : (
                                        <span className="text-gray-500">ไม่มีใบเสร็จ</span>
                                    )}
                                </Table.Cell>
                                <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">
                                            ฿{order.total_amount.toLocaleString()}
                                        </span>
                                        {order.discount > 0 && (
                                            <span className="text-xs font-medium text-green-600">
                                                (-{order.discount}%)
                                            </span>
                                        )}
                                    </div>
                                </Table.Cell>
                                <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                                        >
                                            ยกเลิก Order
                                        </button>
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
    );
}
