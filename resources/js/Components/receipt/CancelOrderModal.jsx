import React, { useState } from 'react';
import { Modal, Button, TextInput, Checkbox, Textarea } from 'flowbite-react';
import { useForm } from '@inertiajs/react';
import { HiOutlineExclamationCircle, HiOutlineRefresh, HiOutlineCash, HiOutlineTag, HiOutlineStar } from 'react-icons/hi';

const CancelOrderModal = ({ isOpen, onClose, orderId }) => {
    const { data, setData, post, processing, errors } = useForm({
        order_id: orderId,
        cancellation_reason: '',
        is_restock_possible: false,
        restocked_items: '',
        refunded_amount: 0,
        refunded_discount: false,
        refunded_points: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('order.cancel'), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="xl">
            <Modal.Header className="bg-red-50 text-red-900">
                <div className="flex items-center">
                    <HiOutlineExclamationCircle className="w-6 h-6 mr-2 text-red-600" />
                    <span className="text-xl font-semibold">ยกเลิกคำสั่งซื้อ</span>
                </div>
            </Modal.Header>
            <Modal.Body className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_restock_possible"
                                checked={data.is_restock_possible}
                                onChange={(e) => setData('is_restock_possible', e.target.checked)}
                            />
                            <label htmlFor="is_restock_possible" className="text-sm font-medium text-gray-700">สามารถนำสินค้ากลับคืนคลังได้หรือไม่?</label>
                        </div>
                        {data.is_restock_possible && (
                            <div>
                                <label htmlFor="restocked_items" className="block mb-2 text-sm font-medium text-gray-700">รายการสินค้าที่นำกลับคืนคลัง</label>
                                <Textarea
                                    id="restocked_items"
                                    value={data.restocked_items}
                                    onChange={(e) => setData('restocked_items', e.target.value)}
                                    className="w-full"
                                    rows={3}
                                    placeholder="ระบุรายการสินค้าที่สามารถนำกลับคืนคลังได้"
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="refunded_amount" className="block mb-2 text-sm font-medium text-gray-700">จำนวนเงินที่คืน</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <HiOutlineCash className="w-5 h-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="refunded_amount"
                                    type="number"
                                    step="0.01"
                                    value={data.refunded_amount}
                                    onChange={(e) => setData('refunded_amount', parseFloat(e.target.value))}
                                    className="pl-10"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="refunded_discount"
                                checked={data.refunded_discount}
                                onChange={(e) => setData('refunded_discount', e.target.checked)}
                            />
                            <label htmlFor="refunded_discount" className="text-sm font-medium text-gray-700">คืนส่วนลดด้วยหรือไม่?</label>
                        </div>
                        <div>
                            <label htmlFor="refunded_points" className="block mb-2 text-sm font-medium text-gray-700">คะแนนที่คืน</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <HiOutlineStar className="w-5 h-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="refunded_points"
                                    type="number"
                                    value={data.refunded_points}
                                    onChange={(e) => setData('refunded_points', parseInt(e.target.value))}
                                    className="pl-10"
                                    placeholder="0"
                                />
                            </div>
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
