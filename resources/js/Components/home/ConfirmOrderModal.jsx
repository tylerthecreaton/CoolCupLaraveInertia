import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";
import { ShoppingBag, Receipt, Tag } from "lucide-react";
import PaymethodModal from "./PaymethodModal";
import { useGlobalState } from "@/Store/state";
import { cartActions } from "@/Store/state/cartState";
import { useForm } from "@inertiajs/react";
import { isAbsoluteUrl } from "@/helpers";

const ConfirmOrderModal = ({ show, onClose }) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const { state, dispatch } = useGlobalState();

    const summary = state.cart;

    // Format order number with leading zeros
    const formattedOrderNumber = String(summary.orderNumber).padStart(4, "0");

    return (
        <>
            <Modal
                show={show}
                onClose={onClose}
                size="xl"
                className="dark:bg-gray-800"
            >
                <Modal.Header className="bg-gray-50 border-b dark:bg-gray-700">
                    <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                        <div className="flex flex-col">
                            <span className="text-xl font-semibold">
                                ยืนยันการสั่งซื้อ
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                                ออเดอร์ #{formattedOrderNumber}
                            </span>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="p-6">
                    <div className="space-y-6">
                        <div className="flex items-center p-4 space-x-2 bg-blue-50 rounded-lg border border-blue-100">
                            <Receipt className="w-5 h-5 text-blue-600" />
                            <p className="text-base text-blue-700">
                                กรุณาตรวจสอบรายการสั่งซื้อของคุณให้ถูกต้อง
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="flex items-center space-x-2 text-lg font-semibold">
                                <span>รายการสินค้า</span>
                                <span className="text-sm text-gray-500">
                                    ({summary.totalItems} รายการ)
                                </span>
                            </h3>
                            <div className="bg-white rounded-lg border divide-y">
                                {summary.items
                                    .filter((i) => i.price > -1)
                                    .map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center p-4 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <img
                                                        src={
                                                            isAbsoluteUrl(item.image)
                                                                ? item.image
                                                                : `/images/products/${item.image}`
                                                        }
                                                        alt={item.name}
                                                        className="object-cover w-16 h-16 rounded-lg shadow-sm"
                                                    />
                                                    <span className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded-full">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ฿{item.price} ต่อแก้ว
                                                    </p>
                                                    {item.size && (
                                                        <p className="text-sm text-gray-500">
                                                            ขนาด: {item.size}
                                                        </p>
                                                    )}
                                                    {item.toppings?.length >
                                                        0 && (
                                                            <p className="text-sm text-gray-500">
                                                                ท็อปปิ้ง:{" "}
                                                                {item.toppings.map(topping => `${topping.name} (฿${topping.price})`).join(', ')}
                                                            </p>
                                                        )}
                                                    {item.sweetness && (
                                                        <p className="text-sm text-gray-500">
                                                            ความหวาน:{" "}
                                                            {item.sweetness}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-lg font-semibold">
                                                ฿
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="p-4 space-y-3 bg-gray-50 rounded-lg">
                            <h3 className="mb-3 text-lg font-semibold">
                                สรุปคำสั่งซื้อ
                            </h3>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    จำนวนสินค้า:
                                </span>
                                <span className="font-medium">
                                    {summary.totalItems} แก้ว
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">ราคารวม:</span>
                                <span className="font-medium">
                                    ฿{summary.subtotal.toFixed(2)}
                                </span>
                            </div>
                            {summary.cartDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span className="flex gap-1 items-center">
                                        <Tag className="w-4 h-4" />
                                        <span>
                                            {summary.appliedPromotion
                                                ? `โปรโมชั่น: ${summary.appliedPromotion.name}`
                                                : "ส่วนลดจากโปรโมชั่น/คูปอง"}
                                        </span>
                                    </span>
                                    <span className="font-medium">
                                        -฿{summary.cartDiscount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {summary.pointDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span className="flex gap-1 items-center">
                                        <Tag className="w-4 h-4" />
                                        <span>ส่วนลดจากแต้ม</span>
                                    </span>
                                    <span className="font-medium">
                                        -฿{summary.pointDiscount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {summary.totalDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 font-medium border-t pt-2">
                                    <span>ส่วนลดทั้งหมด:</span>
                                    <span>
                                        -฿{summary.totalDiscount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between pt-3 text-lg border-t">
                                <span className="font-bold">ราคาสุทธิ:</span>
                                <span className="font-bold text-blue-600">
                                    ฿{summary.total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="bg-gray-50 border-t dark:bg-gray-700">
                    <div className="flex justify-center space-x-3 w-full">
                        <Button onClick={onClose} color="gray" className="px-6">
                            ยกเลิก
                        </Button>
                        <Button
                            onClick={() => setShowPaymentModal(true)}
                            className="px-6 bg-blue-600 hover:bg-blue-700"
                        >
                            ชำระเงิน
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            <PaymethodModal
                show={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                total={summary.total}
                cartActions={cartActions}
            />
        </>
    );
};

export default ConfirmOrderModal;
