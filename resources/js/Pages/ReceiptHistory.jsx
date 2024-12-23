import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Link } from "@inertiajs/react";

export default function ReceiptHistory({ orders }) {
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
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                เลขที่ใบเสร็จ
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                วันที่
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ลูกค้า
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                รายการสินค้า
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                การชำระเงิน
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ยอดรวม
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.data.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {format(
                                                        new Date(
                                                            order.created_at
                                                        ),
                                                        "dd MMMM yyyy HH:mm",
                                                        { locale: th }
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.customer
                                                        ? order.customer.name
                                                        : "ลูกค้าทั่วไป"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <ul className="space-y-1">
                                                        {order.order_details.map(
                                                            (item) => (
                                                                <li
                                                                    key={item.id}
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <img 
                                                                        src={item.product_image} 
                                                                        alt={item.product_name}
                                                                        className="w-8 h-8 rounded-full object-cover"
                                                                    />
                                                                    <span>
                                                                        {item.product_name} ({item.size})
                                                                        {item.sweetness !== "100%" && ` - หวาน ${item.sweetness}`}
                                                                        {" x "}{item.quantity}
                                                                    </span>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex flex-col">
                                                        <span className="capitalize">{order.payment_method}</span>
                                                        <span className="text-xs text-gray-500">
                                                            จ่าย: ฿{parseFloat(order.cash).toLocaleString()}
                                                        </span>
                                                        {order.payment_note && (
                                                            <span className="text-xs text-gray-500">
                                                                หมายเหตุ: {order.payment_note}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-900">
                                                            ฿{order.final_amount.toLocaleString()}
                                                        </span>
                                                        {order.discount_amount > 0 && (
                                                            <span className="text-xs text-green-600">
                                                                ส่วนลด: ฿{order.discount_amount.toLocaleString()}
                                                            </span>
                                                        )}
                                                        {order.received_points > 0 && (
                                                            <span className="text-xs text-blue-600">
                                                                + {order.received_points} แต้ม
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    {orders.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 border rounded ${
                                                link.active
                                                    ? 'bg-blue-500 text-white'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 hover:bg-gray-50'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                            preserveScroll
                                        >
                                            {link.label === 'pagination.previous'
                                                ? 'ก่อนหน้า'
                                                : link.label === 'pagination.next'
                                                ? 'ถัดไป'
                                                : link.label}
                                        </Link>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-500">
                                    แสดง {orders.from} ถึง {orders.to} จากทั้งหมด {orders.total} รายการ
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
