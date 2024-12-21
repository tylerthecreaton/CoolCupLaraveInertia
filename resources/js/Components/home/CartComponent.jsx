import React, { useState, useEffect, useRef } from "react";
import { useGlobalState } from "@/Store/state";
import { appActions } from "@/Store/state/appState";
import { cartActions } from "@/Store/state/cartState";
import { Button, TextInput, Select } from "flowbite-react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import ConfirmOrderModal from "./ConfirmOrderModal";

const CartComponent = () => {
    const user = usePage().props.auth.user;
    const { state, dispatch } = useGlobalState();
    const cartRef = useRef(null);
    const { items, totalItems, total, discount, finalTotal } = state.cart;
    const [discountInput, setDiscountInput] = useState("");
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState("");
    const [customDiscount, setCustomDiscount] = useState("");

    const promotions = [
        { code: "NEWUSER", discount: 10, description: "ส่วนลดลูกค้าใหม่ 10%" },
        { code: "HOLIDAY", discount: 15, description: "ส่วนลดเทศกาล 15%" },
        { code: "MEMBER", discount: 20, description: "ส่วนลดสมาชิก 20%" },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            const cart = document.getElementById("shopping-cart");
            const modals = document.querySelectorAll('[role="dialog"]');
            
            // Check if click is inside any modal
            const isModalClick = Array.from(modals).some(modal => 
                modal.contains(event.target)
            );

            // If click is outside cart and not in any modal, close cart
            if (cart && 
                !cart.contains(event.target) && 
                !isModalClick && 
                !event.target.closest('.modal')) {
                dispatch(appActions.setCartOpen(false));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dispatch]);

    const handleAddToCart = (drink, toppings, sweetness) => {
        const cartItem = {
            id: new Date().getTime(),
            drinkId: drink.id,
            name: drink.name,
            price: drink.price,
            image: drink.image,
            toppings: toppings,
            sweetness: sweetness,
            quantity: 1
        };

        dispatch(cartActions.addToCart(cartItem));
    };

    const handleUpdateQuantity = (id, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity > 0) {
            dispatch(cartActions.updateQuantity(id, newQuantity));
        } else {
            handleRemoveItem(id);
        }
    };

    const handleRemoveItem = (id) => {
        Swal.fire({
            title: 'ยืนยันการลบ',
            text: 'คุณต้องการลบรายการนี้ใช่หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#ef4444',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(cartActions.removeFromCart(id));
            }
        });
    };

    const calculateTotal = () => {
        const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
        let discount = 0;

        if (selectedPromotion) {
            const promotion = promotions.find(p => p.code === selectedPromotion);
            if (promotion) {
                discount = (subtotal * promotion.discount) / 100;
            }
        } else if (customDiscount) {
            discount = parseFloat(customDiscount) || 0;
        }

        return {
            subtotal,
            discount,
            total: Math.max(0, subtotal - discount)
        };
    };

    const handlePromotionChange = (value) => {
        setSelectedPromotion(value);
        setCustomDiscount("");  // ปิดช่องส่วนลดเมือเลือกโปรโมชั่น
    };

    const handleCustomDiscountChange = (value) => {
        setCustomDiscount(value);
        setSelectedPromotion("");  // ปิดการเลือกใช้โปรโมชั่นถ้าหากเลือกใช้ช่องส่วนลด
    };

    const handleApplyDiscount = () => {
        const discountAmount = parseFloat(discountInput);
        if (total - discountAmount < 0) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถใช้ส่วนลดเพิ่มได้",
            });
            return;
        }
        setDiscountInput("");
        dispatch(
            cartActions.addToCart({
                id: new Date().getTime(),
                name: `Discount / ${user.id} : ${user.name}`,
                price: -discountAmount,
                quantity: 1,
            })
        );
    };

    if (!state.app.isCartOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-[60] transition-transform duration-300 ease-in-out transform">
            <div ref={cartRef} id="shopping-cart" className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-blue-50">
                    <div className="flex items-center space-x-2">
                        <ShoppingCart className="w-6 h-6" />
                        <h2 className="text-lg font-semibold">ตะกร้าสินค้า</h2>
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                            {totalItems}
                        </span>
                    </div>
                    <Button
                        size="sm"
                        color="gray"
                        onClick={() => dispatch(appActions.setCartOpen(false))}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            ไม่มีสินค้าในตะกร้า
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start space-x-4 bg-gray-50 p-3 rounded-lg"
                                >
                                    <img
                                        src={
                                            item.image ??
                                            "https://via.placeholder.com/150"
                                        }
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="font-medium">
                                                ฿{item.price * item.quantity}
                                            </p>
                                        </div>
                                        {(item.toppings || item.sweetness) && (
                                            <div className="text-sm text-gray-500 mt-1">
                                                {item.toppings?.length > 0 && (
                                                    <p>เพิ่มเติม: {item.toppings.join(", ")}</p>
                                                )}
                                                {item.sweetness && (
                                                    <p>ความหวาน: {item.sweetness}</p>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Button
                                                size="xs"
                                                color="light"
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item.id,
                                                        item.quantity,
                                                        -1
                                                    )
                                                }
                                            >
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                            <span className="w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                size="xs"
                                                color="light"
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item.id,
                                                        item.quantity,
                                                        1
                                                    )
                                                }
                                            >
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="xs"
                                                color="failure"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t p-4 bg-gray-50">
                        <div className="flex flex-col space-y-4 mb-4">
                            <Select
                                value={selectedPromotion}
                                onChange={(e) => handlePromotionChange(e.target.value)}
                                className="w-full"
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
                                    placeholder="ส่วนลดอื่นๆ"
                                    value={customDiscount}
                                    onChange={(e) => handleCustomDiscountChange(e.target.value)}
                                    disabled={!!selectedPromotion}
                                    className="flex-1"
                                />
                                <Button
                                    color="light"
                                    onClick={() => {
                                        setCustomDiscount("");
                                        setSelectedPromotion("");
                                    }}
                                >
                                    ล้าง
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span>จำนวนสินค้า:</span>
                                <span>{totalItems} ชิ้น</span>
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
                            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                <span>ราคาสุทธิ:</span>
                                <span>฿{calculateTotal().total}</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => setShowOrderModal(true)}
                        >
                            สั่งออเดอร์
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
            />
        </div>
    );
};

export default CartComponent;
