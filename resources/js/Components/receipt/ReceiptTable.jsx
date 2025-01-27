import React from "react";
import { Table } from "flowbite-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
        completed: {
            color: 'bg-green-100 text-green-800',
            text: 'เสร็จสมบูรณ์'
        },
        cancelled: {
            color: 'bg-red-100 text-red-800',
            text: 'ยกเลิกแล้ว'
        },
        // เพิ่มสถานะอื่นๆ ตามต้องการ
    };

    const config = statusConfig[status] || statusConfig.completed;

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
            {config.text}
        </span>
    );
};

export default function ReceiptTable({ orders, onViewReceipt, onViewOrder, onCancelOrder }) {
    return (
        <div className="overflow-x-auto">
            <Table hoverable className="w-full">
                <Table.Head>
                    <Table.HeadCell>เลขที่</Table.HeadCell>
                    <Table.HeadCell>วันที่</Table.HeadCell>
                    <Table.HeadCell>ลูกค้า</Table.HeadCell>
                    <Table.HeadCell>ยอดรวม</Table.HeadCell>
                    <Table.HeadCell>ส่วนลด</Table.HeadCell>
                    <Table.HeadCell>ยอดสุทธิ</Table.HeadCell>
                    <Table.HeadCell>สถานะ</Table.HeadCell>
                    <Table.HeadCell>การชำระเงิน</Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">Actions</span>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {orders.map((order) => (
                        <Table.Row key={order.id} className="bg-white">
                            <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                #{order.order_number}
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                {format(new Date(order.created_at), "d MMM yyyy HH:mm", {
                                    locale: th,
                                })}
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                {order.customer ? (
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {order.customer.name}
                                        </div>
                                        <div className="text-gray-500">
                                            {order.customer.phone_number}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-gray-500">ลูกค้าทั่วไป</span>
                                )}
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                ฿{Number(order.total_amount).toLocaleString()}
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                {order.discount_amount > 0 ? (
                                    <span className="text-red-600">
                                        -฿{Number(order.discount_amount).toLocaleString()}
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4 whitespace-nowrap font-medium">
                                ฿{Number(order.final_amount).toLocaleString()}
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                <OrderStatusBadge status={order.status} />
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {order.payment_method === "cash"
                                            ? "เงินสด"
                                            : order.payment_method === "qr_code"
                                                ? "QR Code"
                                                : order.payment_method}
                                    </span>
                                    {order.cash && (
                                        <span className="text-sm text-gray-500">
                                            รับเงิน: ฿{Number(order.cash).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </Table.Cell>
                            <Table.Cell className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col space-y-1">
                                    <button
                                        onClick={() => onViewOrder(order)}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        ดูรายละเอียด
                                    </button>
                                    {order.receipt_path && (
                                        <button
                                            onClick={() => onViewReceipt(order.receipt_path)}
                                            className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                                        >
                                            ดูใบเสร็จ
                                        </button>
                                    )}
                                    {order.status === 'completed' && (
                                        <button
                                            onClick={() => onCancelOrder(order)}
                                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                                        >
                                            ยกเลิก Order
                                        </button>
                                    )}
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}
