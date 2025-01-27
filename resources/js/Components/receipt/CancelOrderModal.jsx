import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput, Checkbox, Textarea, Table } from 'flowbite-react';
import { useForm } from '@inertiajs/react';
import { HiOutlineExclamationCircle, HiOutlineRefresh, HiOutlineCash, HiOutlineTag, HiOutlineStar } from 'react-icons/hi';

const CancelOrderModal = ({ isOpen, onClose, order }) => {
    const { data, setData, post, processing, errors } = useForm({
        order_id: order?.id,
        cancellation_reason: '',
        is_restock_possible: false,
        // restocked_items: '',
        refunded_amount: order?.final_amount || 0,
        refunded_discount: order?.discount_amount > 0,
        refunded_points: order?.received_points || 0,
    });

    useEffect(() => {
        if (order) {
            setData(prevData => ({
                ...prevData,
                order_id: order.id,
                refunded_amount: order.final_amount,
                refunded_discount: order.discount_amount > 0,
                refunded_points: order.received_points,
            }));
        }
    }, [order]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('order.cancel'), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    if (!order) return null;

    return (
        <Modal show={isOpen} onClose={onClose} size="xl">
            <Modal.Header className="bg-red-50 text-red-900">
                <div className="flex items-center">
                    <HiOutlineExclamationCircle className="w-6 h-6 mr-2 text-red-600" />
                    <span className="text-xl font-semibold">ยกเลิกคำสั่งซื้อ #{order.order_number}</span>
                </div>
            </Modal.Header>
            <Modal.Body className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Details */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">รายการสินค้า</h3>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>สินค้า</Table.HeadCell>
                                <Table.HeadCell>ขนาด</Table.HeadCell>
                                <Table.HeadCell>จำนวน</Table.HeadCell>
                                <Table.HeadCell>ราคา</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {order.order_details.map((item) => (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.product_name}</Table.Cell>
                                        <Table.Cell>{item.size}</Table.Cell>
                                        <Table.Cell>{item.quantity}</Table.Cell>
                                        <Table.Cell>{item.subtotal}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                            <span>ยอดรวม:</span>
                            <span>฿{order.total_amount}</span>
                        </div>
                        {order.discount_amount > 0 && (
                            <div className="flex justify-between text-red-600">
                                <span>ส่วนลด:</span>
                                <span>-฿{order.discount_amount}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold">
                            <span>ยอดสุทธิ:</span>
                            <span>฿{order.final_amount}</span>
                        </div>
                        {order.received_points > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>คะแนนที่ได้รับ:</span>
                                <span>{order.received_points} คะแนน</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="cancellation_reason" className="block mb-2 text-sm font-medium text-gray-700">เหตุผลในการยกเลิก</label>
                            <Textarea
                                id="cancellation_reason"
                                value={data.cancellation_reason}
                                onChange={(e) => setData('cancellation_reason', e.target.value)}
                                className="w-full"
                                rows={3}
                                placeholder="กรุณาระบุเหตุผลในการยกเลิกคำสั่งซื้อ"
                            />
                            {errors.cancellation_reason && (
                                <p className="text-red-500 text-sm mt-1">{errors.cancellation_reason}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_restock_possible"
                                checked={data.is_restock_possible}
                                onChange={(e) => setData('is_restock_possible', e.target.checked)}
                            />
                            <label htmlFor="is_restock_possible" className="text-sm text-gray-700">
                                สามารถนำสินค้ากลับเข้าสต็อกได้
                            </label>
                        </div>

                        {/* {data.is_restock_possible && (
                            <div>
                                <label htmlFor="restocked_items" className="block mb-2 text-sm font-medium text-gray-700">
                                    รายการสินค้าที่นำกลับเข้าสต็อก
                                </label>
                                <Textarea
                                    id="restocked_items"
                                    value={data.restocked_items}
                                    onChange={(e) => setData('restocked_items', e.target.value)}
                                    className="w-full"
                                    rows={2}
                                    placeholder="ระบุรายการสินค้าที่สามารถนำกลับเข้าสต็อกได้"
                                />
                            </div>
                        )} */}

                        <div className="space-y-4 pt-4 border-t">
                            <div>
                                <label htmlFor="refunded_amount" className="block mb-2 text-sm font-medium text-gray-700">
                                    จำนวนเงินที่คืน
                                </label>
                                <TextInput
                                    id="refunded_amount"
                                    type="number"
                                    value={data.refunded_amount}
                                    onChange={(e) => setData('refunded_amount', e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {order.discount_amount > 0 && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="refunded_discount"
                                        checked={data.refunded_discount}
                                        onChange={(e) => setData('refunded_discount', e.target.checked)}
                                    />
                                    <label htmlFor="refunded_discount" className="text-sm text-gray-700">
                                        คืนส่วนลด ฿{order.discount_amount}
                                    </label>
                                </div>
                            )}

                            {order.received_points > 0 && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="refunded_points"
                                        checked={data.refunded_points > 0}
                                        onChange={(e) => setData('refunded_points', e.target.checked ? order.received_points : 0)}
                                    />
                                    <label htmlFor="refunded_points" className="text-sm text-gray-700">
                                        คืนคะแนนสะสม {order.received_points} คะแนน
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button color="gray" onClick={onClose}>
                            ยกเลิก
                        </Button>
                        <Button type="submit" color="red" disabled={processing}>
                            {processing ? 'กำลังดำเนินการ...' : 'ยืนยันการยกเลิกคำสั่งซื้อ'}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default CancelOrderModal;
