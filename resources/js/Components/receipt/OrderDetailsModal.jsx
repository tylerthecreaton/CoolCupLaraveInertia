import { Modal } from 'flowbite-react';
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function OrderDetailsModal({ show, onClose, order }) {
    if (!order) return null;

    return (
        <Modal
            show={show}
            onClose={onClose}
            size="xl"
            className="dark:bg-gray-800"
        >
            <Modal.Header className="border-b border-gray-200 !p-6 bg-gray-50">
                <div className="flex flex-col w-full">
                    <h3 className="text-xl font-semibold text-gray-900">รายละเอียดการสั่งซื้อ</h3>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium text-gray-700">
                            ออเดอร์ #{order.order_number}
                        </span>
                        <span className="text-sm text-gray-500">
                            {format(new Date(order.created_at), "dd MMMM yyyy HH:mm", { locale: th })}
                        </span>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body className="!p-6">
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {order.customer ? (
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white text-xl font-semibold">
                                        {order.customer.name.charAt(0)}
                                    </span>
                                ) : (
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-xl">
                                        G
                                    </span>
                                )}
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">
                                    {order.customer ? order.customer.name : "ลูกค้าทั่วไป"}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    ชำระเงินผ่าน: <span className="capitalize">{order.payment_method}</span>
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
                                    {order.order_details.map((item, index) => (
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
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.size}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.sweetness}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                ฿{item.price.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
