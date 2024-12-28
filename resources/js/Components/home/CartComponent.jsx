import React, { useState, useEffect, useRef } from "react";
import { useGlobalState } from "@/Store/state";
import { appActions } from "@/Store/state/appState";
import { cartActions } from "@/Store/state/cartState";
import { Button, TextInput, Select } from "flowbite-react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import axios from 'axios';
import ConfirmOrderModal from "./ConfirmOrderModal";

const CartComponent = () => {
    const user = usePage().props.auth.user;
    const cartRef = useRef();
    const { state, dispatch } = useGlobalState();
    const { items } = state.cart;
    const [selectedPromotion, setSelectedPromotion] = useState("");
    const [discountInput, setDiscountInput] = useState("");
    const [showOrderModal, setShowOrderModal] = useState(false);
    
    const promotions = [
        { code: "NEWUSER", discount: 10, description: "ส่วนลดลูกค้าใหม่ 10%" },
        { code: "HOLIDAY", discount: 15, description: "ส่วนลดเทศกาล 15%" },
        { code: "MEMBER", discount: 20, description: "ส่วนลดสมาชิก 20%" },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            const cart = document.getElementById("shopping-cart");
            const modals = document.querySelectorAll('[role="dialog"]');

            let isInsideModal = false;
            modals.forEach((modal) => {
                if (modal.contains(event.target)) {
                    isInsideModal = true;
                }
            });

            if (
                cart &&
                !cart.contains(event.target) &&
                !isInsideModal &&
                state.app.isCartOpen
            ) {
                dispatch(appActions.setCartOpen(false));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [state.app.isCartOpen]);

    useEffect(() => {
        // Fetch the last order number from backend
        axios.get('/get-last-order-number')
            .then(response => {
                dispatch(cartActions.setOrderNumber(response.data.nextOrderNumber));
            })
            .catch(error => {
                console.error('Error fetching order number:', error);
                dispatch(cartActions.setOrderNumber(1));
            });
    }, []);

    const handleAddToCart = (product, toppings, sweetness, size) => {
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.sale_price,
            toppings: toppings,
            sweetness: sweetness,
            size: size,
            quantity: 1,
        };

        dispatch(cartActions.addToCart(cartItem));
    };

    const handleRemoveItem = async (itemId) => {
        const result = await Swal.fire({
            title: "ยืนยันการลบ",
            text: "คุณต้องการลบรายการนี้ใช่หรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ใช่, ลบเลย",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (result.isConfirmed) {
            dispatch(cartActions.removeFromCart(itemId));
        }
    };

    const handleUpdateQuantity = (itemId, delta) => {
        const item = items.find((item) => item.id === itemId);
        if (!item) return;

        const newQuantity = item.quantity + delta;

        if (newQuantity <= 0) {
            dispatch(cartActions.removeFromCart(itemId));
        } else {
            dispatch(cartActions.updateQuantity({ itemId, delta }));
        }
    };

    const calculateTotal = () => {
        const subtotal = items.reduce((total, item) => {
            if (!item.isDiscount) {
                return total + item.price * item.quantity;
            }
            return total;
        }, 0);

        let discount = 0;

        items.forEach((item) => {
            if (item.isDiscount) {
                discount += Math.abs(item.price * item.quantity);
            }
        });

        if (selectedPromotion) {
            const promotion = promotions.find(
                (p) => p.code === selectedPromotion
            );
            if (promotion) {
                discount += (subtotal * promotion.discount) / 100;
            }
        }

        const total = Math.max(0, subtotal - discount);

        return {
            subtotal,
            discount,
            total,
        };
    };

    const handlePromotionChange = (value) => {
        const hasManualDiscount = items.some((item) => item.isDiscount);
        if (value && hasManualDiscount) {
            Swal.fire({
                title: "ไม่สามารถใช้โปรโมชั่นได้",
                text: "กรุณาลบส่วนลดที่มีอยู่ก่อนใช้โปรโมชั่น",
                icon: "warning",
            });
            return;
        }
        setSelectedPromotion(value);
    };

    const handleApplyDiscount = () => {
        const discountAmount = parseFloat(discountInput);
        if (!discountAmount || discountAmount <= 0) {
            Swal.fire({
                title: "ไม่สามารถใช้ส่วนลดได้",
                text: "กรุณากรอกส่วนลดให้ถูกต้อง",
                icon: "error",
            });
            return;
        }

        if (selectedPromotion) {
            Swal.fire({
                title: "ไม่สามารถใช้ส่วนลดได้",
                text: "กรุณายกเลิกโปรโมชั่นก่อนใช้ส่วนลด",
                icon: "warning",
            });
            return;
        }

        if (calculateTotal().subtotal - discountAmount < 0) {
            Swal.fire({
                title: "ไม่สามารถใช้ส่วนลดได้",
                text: "ส่วนลดมากกว่าราคารวม",
                icon: "error",
            });
            return;
        }

        const discountItem = {
            id: `discount-${new Date().getTime()}`,
            image: "https://via.placeholder.com/150",
            name: `Discount (${
                user ? `${user.name} # ID: ${user.id}` : "Guest"
            })`,
            price: -discountAmount,
            quantity: 1,
            isDiscount: true,
            isManualDiscount: true,
        };

        dispatch(cartActions.addToCart(discountItem));
        setDiscountInput("");
    };

    const totalItems = items.reduce(
        (sum, item) => (!item.isDiscount ? sum + item.quantity : sum),
        0
    );

    if (!state.app.isCartOpen) {
        return null;
    }

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-[60] transition-transform duration-300 ease-in-out transform">
            <div
                ref={cartRef}
                id="shopping-cart"
                className="flex flex-col h-full"
            >
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg">
                            <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex flex-col text-white">
                            <span className="text-2xl font-bold">
                                ออเดอร์ #{state.cart.currentOrderNumber}
                            </span>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-blue-100">
                                    ตะกร้าสินค้า
                                </span>
                                {totalItems > 0 && (
                                    <span className="bg-white text-blue-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                        {totalItems} รายการ
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        color="white"
                        size="sm"
                        onClick={() => dispatch(appActions.setCartOpen(false))}
                        className="flex justify-center items-center w-8 h-8 bg-white transition duration-150 hover:bg-blue-50"
                    >
                        <X className="w-4 h-4 text-blue-600" />
                    </Button>
                </div>

                <div className="overflow-y-auto flex-1 p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-full text-gray-500">
                            <ShoppingCart className="mb-4 w-16 h-16" />
                            <p className="text-lg">ตะกร้าว่างเปล่า</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center p-4 bg-white rounded-lg border"
                                >
                                    <div className="flex items-center space-x-4">
                                        {!item.isDiscount ? (
                                            <>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="object-cover w-16 h-16 rounded-lg"
                                                />
                                                <div>
                                                    <h3 className="font-medium">
                                                        {item.name}
                                                    </h3>
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
                                            </>
                                        ) : (
                                            <div className="flex items-center text-green-600">
                                                <div>
                                                    <h3 className="font-medium">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm">
                                                        -฿{Math.abs(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        {!item.isDiscount && (
                                            <div className="flex items-center space-x-1">
                                                <Button
                                                    size="xs"
                                                    color="light"
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.id,
                                                            -1
                                                        )
                                                    }
                                                    className="!p-1"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-6 text-sm text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    size="xs"
                                                    color="light"
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.id,
                                                            1
                                                        )
                                                    }
                                                    className="!p-1"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        )}
                                        <Button
                                            size="xs"
                                            color="failure"
                                            onClick={() =>
                                                handleRemoveItem(item.id)
                                            }
                                            className="!p-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t">
                        <div className="mb-4 space-y-4">
                            <Select
                                value={selectedPromotion}
                                onChange={(e) =>
                                    handlePromotionChange(e.target.value)
                                }
                                className="w-full"
                                disabled={items.some((item) => item.isDiscount)}
                            >
                                <option value="">เลือกโปรโมชั่น</option>
                                {promotions.map((promo) => (
                                    <option key={promo.code} value={promo.code}>
                                        {promo.description}
                                    </option>
                                ))}
                            </Select>

                            <div className="flex space-x-2">
                                <TextInput
                                    type="number"
                                    placeholder="ใส่ส่วนลด"
                                    value={discountInput}
                                    onChange={(e) =>
                                        setDiscountInput(e.target.value)
                                    }
                                    className="flex-1"
                                    disabled={selectedPromotion !== ""}
                                />
                                <Button
                                    size="sm"
                                    color="light"
                                    onClick={handleApplyDiscount}
                                    disabled={selectedPromotion !== ""}
                                >
                                    ใช้ส่วนลด
                                </Button>
                            </div>
                        </div>

                        <div className="mb-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>จำนวนสินค้า:</span>
                                <span>{totalItems} แก้ว</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>ราคารวม:</span>
                                <span>฿{calculateTotal().subtotal}</span>
                            </div>
                            {calculateTotal().discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>ส่วนลด:</span>
                                    <span>-฿{calculateTotal().discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2 text-lg font-semibold border-t">
                                <span>ราคาสุทธิ:</span>
                                <span>฿{calculateTotal().total}</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => setShowOrderModal(true)}
                        >
                            ยืนยันคำสั่งซื้อ
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmOrderModal
                show={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                items={items}
                totalItems={totalItems}
                total={calculateTotal().subtotal}
                discount={calculateTotal().discount}
                finalTotal={calculateTotal().total}
                selectedPromotion={selectedPromotion}
                promotions={promotions}
            />
        </div>
    );
};

export default CartComponent;
