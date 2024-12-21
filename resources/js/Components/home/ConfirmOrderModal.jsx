import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";
import { ShoppingBag, Receipt, Tag } from "lucide-react";
import PaymethodModal from "./PaymethodModal";
import { useGlobalState } from "@/Store/state";
import { cartActions } from "@/Store/state/cartState";
import { useForm } from "@inertiajs/react";

const ConfirmOrderModal = ({
    show,
    onClose,
    items,
    totalItems,
    total,
    discount,
    finalTotal,
    selectedPromotion,
    promotions,
}) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const { state, dispatch } = useGlobalState();

    const selectedPromotionDetails = selectedPromotion
        ? promotions.find((p) => p.code === selectedPromotion)
        : null;

    return (
        <>
            <Modal
                show={show}
                onClose={onClose}
                size="xl"
                className="dark:bg-gray-800"
            >
                <Modal.Header className="border-b bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                        <div className="flex flex-col">
                            <span className="text-xl font-semibold">
                                ยืนยันการสั่งซื้อ
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                                ออเดอร์ # {state.cart.currentOrderNumber}
                            </span>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="p-6">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <Receipt className="w-5 h-5 text-blue-600" />
                            <p className="text-base text-blue-700">
                                กรุณาตรวจสอบรายการสั่งซื้อของคุณให้ถูกต้อง
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center space-x-2">
                                <span>รายการสินค้า</span>
                                <span className="text-sm text-gray-500">
                                    ({totalItems} รายการ)
                                </span>
                            </h3>
                            <div className="bg-white rounded-lg border divide-y">
                                {items.map(
                                    (item) =>
                                        !item.isDiscount && (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-center p-4 hover:bg-gray-50"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                        />
                                                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                            {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            ฿{item.price}{" "}
                                                            ต่อแก้ว
                                                        </p>
                                                        {item.size && (
                                                            <p className="text-sm text-gray-500">
                                                                ขนาด:{" "}
                                                                {item.size}
                                                            </p>
                                                        )}
                                                        {item.toppings?.length >
                                                            0 && (
                                                            <p className="text-sm text-gray-500">
                                                                ท็อปปิ้ง:{" "}
                                                                {item.toppings.join(
                                                                    ", "
                                                                )}
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
                                                <p className="font-semibold text-lg">
                                                    ฿
                                                    {item.price * item.quantity}
                                                </p>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-lg mb-3">
                                สรุปคำสั่งซื้อ
                            </h3>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    จำนวนสินค้า:
                                </span>
                                <span className="font-medium">
                                    {totalItems} แก้ว
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">ราคารวม:</span>
                                <span className="font-medium">฿{total}</span>
                            </div>
                            {selectedPromotionDetails && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span className="flex items-center gap-1">
                                        <Tag className="w-4 h-4" />
                                        <span>
                                            โปรโมชั่น:{" "}
                                            {
                                                selectedPromotionDetails.description
                                            }
                                        </span>
                                    </span>
                                    <span className="font-medium">
                                        -฿
                                        {(
                                            (total *
                                                selectedPromotionDetails.discount) /
                                            100
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {items.map(
                                (item) =>
                                    item.isDiscount && (
                                        <div
                                            key={item.id}
                                            className="flex justify-between text-sm text-green-600"
                                        >
                                            <span>{item.name}</span>
                                            <span className="font-medium">
                                                -฿{Math.abs(item.price)}
                                            </span>
                                        </div>
                                    )
                            )}
                            <div className="flex justify-between text-lg pt-3 border-t">
                                <span className="font-bold">ราคาสุทธิ:</span>
                                <span className="font-bold text-blue-600">
                                    ฿{finalTotal}
                                </span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-t bg-gray-50 dark:bg-gray-700">
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
                total={finalTotal}
                dispatch={dispatch}
                cartActions={cartActions}
            />
        </>
    );
};

export default ConfirmOrderModal;
