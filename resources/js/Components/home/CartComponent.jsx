import React, { useState, useEffect, useRef } from "react";
import { useGlobalState } from "@/Store/state";
import { appActions } from "@/Store/state/appState";
import { cartActions } from "@/Store/state/cartState";
import { Button, TextInput, Select } from "flowbite-react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import axios from "axios";
import ConfirmOrderModal from "./ConfirmOrderModal";
import { calculateTotalDiscount } from "@/helpers/promotion-calculator";

const CartComponent = () => {
    const user = usePage().props.auth.user;
    const cartRef = useRef();
    const { state, dispatch } = useGlobalState();
    const { items } = state.cart;
    const [selectedPromotion, setSelectedPromotion] = useState("");
    const [discountInput, setDiscountInput] = useState("");
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [appliedDiscount, setAppliedDiscount] = useState({
        type: null, // 'promotion' or 'manual'
        amount: 0,
        promotion: null,
    });

    // Fetch promotions on component mount
    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axios.get("/api/promotions");
                setPromotions(response.data);
            } catch (error) {
                console.error("Error fetching promotions:", error);
                Swal.fire({
                    title: "ข้อผิดพลาด",
                    text: "ไม่สามารถดึงข้อมูลโปรโมชั่นได้",
                    icon: "error",
                });
            }
        };
        fetchPromotions();
    }, []);

    // Handle click outside cart
    useEffect(() => {
        const handleClickOutside = (event) => {
            const cart = document.getElementById("shopping-cart");
            const modals = document.querySelectorAll('[role="dialog"]');

            const isInsideModal = Array.from(modals).some((modal) =>
                modal.contains(event.target)
            );

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
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [state.app.isCartOpen, dispatch]);

    // Fetch initial order number
    useEffect(() => {
        const fetchOrderNumber = async () => {
            try {
                const response = await axios.get("/api/get-last-order-number");
                dispatch(
                    cartActions.setOrderNumber(response.data.nextOrderNumber)
                );
            } catch (error) {
                console.error("Error fetching order number:", error);
                dispatch(cartActions.setOrderNumber(1));
            }
        };
        fetchOrderNumber();
    }, [dispatch]);

    // Calculate cart totals
    const calculateTotals = () => {
        const regularItems = items.filter((item) => !item.isDiscount);
        const subtotal = regularItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        let discount = 0;
        if (appliedDiscount.type === "promotion" && appliedDiscount.promotion) {
            discount = calculateTotalDiscount(
                regularItems,
                [appliedDiscount.promotion],
                new Date()
            );

            console.log(`Discount applied: ${discount}`);
        } else if (appliedDiscount.type === "manual") {
            discount = appliedDiscount.amount;
        }

        const total = Math.max(0, subtotal - discount);

        return { subtotal, discount, total };
    };

    // Handle promotion selection
    const handlePromotionSelect = async (promotionId) => {
        if (!promotionId) {
            setSelectedPromotion("");
            setAppliedDiscount({ type: null, amount: 0, promotion: null });
            return;
        }

        const promotion = promotions.find(
            (p) => p.id === parseInt(promotionId)
        );
        if (!promotion) return;

        // Check for existing manual discount
        if (items.some((item) => item.isManualDiscount)) {
            await Swal.fire({
                title: "ไม่สามารถใช้โปรโมชั่นได้",
                text: "กรุณาลบส่วนลดที่มีอยู่ก่อนใช้โปรโมชั่น",
                icon: "warning",
            });
            return;
        }

        // Validate minimum purchase if required
        const { subtotal } = calculateTotals();
        if (promotion.min_purchase && subtotal < promotion.min_purchase) {
            await Swal.fire({
                title: "ไม่สามารถใช้โปรโมชั่นได้",
                text: `ยอดสั่งซื้อขั้นต่ำต้องมากกว่า ${promotion.min_purchase} บาท`,
                icon: "warning",
            });
            setSelectedPromotion("");
            return;
        }

        setSelectedPromotion(promotionId);
        setAppliedDiscount({
            type: "promotion",
            amount: 0, // Will be calculated in calculateTotals
            promotion,
        });
    };

    // Handle manual discount
    const handleManualDiscount = async () => {
        const amount = parseFloat(discountInput);
        if (!amount || amount <= 0) {
            await Swal.fire({
                title: "ไม่สามารถใช้ส่วนลดได้",
                text: "กรุณากรอกส่วนลดให้ถูกต้อง",
                icon: "error",
            });
            return;
        }

        if (selectedPromotion) {
            await Swal.fire({
                title: "ไม่สามารถใช้ส่วนลดได้",
                text: "กรุณายกเลิกโปรโมชั่นก่อนใช้ส่วนลด",
                icon: "warning",
            });
            return;
        }

        const { subtotal } = calculateTotals();
        if (amount > subtotal) {
            await Swal.fire({
                title: "ไม่สามารถใช้ส่วนลดได้",
                text: "ส่วนลดมากกว่าราคารวม",
                icon: "error",
            });
            return;
        }

        const discountItem = {
            id: `discount-${Date.now()}`,
            name: `ส่วนลด (${
                user ? `${user.name} #${user.id}` : "ผู้ใช้ทั่วไป"
            })`,
            price: -amount,
            quantity: 1,
            isDiscount: true,
            isManualDiscount: true,
        };

        dispatch(cartActions.addToCart(discountItem));
        setDiscountInput("");
        setAppliedDiscount({
            type: "manual",
            amount,
            promotion: null,
        });
    };

    // Handle quantity updates
    const handleUpdateQuantity = (itemId, delta) => {
        const item = items.find((item) => item.id === itemId);
        if (!item) return;

        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) {
            handleRemoveItem(itemId);
        } else {
            dispatch(cartActions.updateQuantity({ itemId, delta }));
        }
    };

    // Handle item removal
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

            // Reset promotion if removing a discount item
            const item = items.find((item) => item.id === itemId);
            if (item?.isManualDiscount) {
                setAppliedDiscount({ type: null, amount: 0, promotion: null });
            }
        }
    };

    // Calculate total items (excluding discounts)
    const totalItems = items.reduce(
        (sum, item) => (!item.isDiscount ? sum + item.quantity : sum),
        0
    );

    if (!state.app.isCartOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-[60]">
            <div
                ref={cartRef}
                id="shopping-cart"
                className="flex flex-col h-full"
            >
                {/* Cart Header */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600">
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
                        className="flex justify-center items-center w-8 h-8 hover:bg-blue-50"
                    >
                        <X className="w-4 h-4 text-blue-600" />
                    </Button>
                </div>

                {/* Cart Items */}
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
                                                        ฿{item.price} ต่อชิ้น
                                                    </p>
                                                    {item.size && (
                                                        <p className="text-sm text-gray-500">
                                                            ขนาด: {item.size}
                                                        </p>
                                                    )}
                                                    {item.options && (
                                                        <p className="text-sm text-gray-500">
                                                            ตัวเลือก:{" "}
                                                            {item.options}
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-green-600">
                                                <h3 className="font-medium">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm">
                                                    -฿{Math.abs(item.price)}
                                                </p>
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
                                                    className="p-1"
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
                                                    className="p-1"
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
                                            className="p-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Footer with Totals and Actions */}
                {items.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t">
                        {/* Promotions and Discounts Section */}
                        <div className="mb-4 space-y-4">
                            <Select
                                value={selectedPromotion}
                                onChange={(e) =>
                                    handlePromotionSelect(e.target.value)
                                }
                                className="w-full"
                                disabled={items.some(
                                    (item) => item.isManualDiscount
                                )}
                            >
                                <option value="">เลือกโปรโมชั่น</option>
                                {promotions.map((promo) => (
                                    <option key={promo.id} value={promo.id}>
                                        [{promo.type}] {promo.name}
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
                                    onClick={handleManualDiscount}
                                    disabled={selectedPromotion !== ""}
                                >
                                    ใช้ส่วนลด
                                </Button>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="mb-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>จำนวนสินค้า:</span>
                                <span>{totalItems} ชิ้น</span>
                            </div>

                            {/* Calculate and display totals */}
                            {(() => {
                                const { subtotal, discount, total } =
                                    calculateTotals();
                                return (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span>ราคารวม:</span>
                                            <span>฿{subtotal.toFixed(2)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>ส่วนลด:</span>
                                                <span>
                                                    -฿{discount.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 text-lg font-semibold border-t">
                                            <span>ราคาสุทธิ:</span>
                                            <span>฿{total.toFixed(2)}</span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Confirm Order Button */}
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

            {/* Confirm Order Modal */}
            <ConfirmOrderModal
                show={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                items={items}
                totalItems={totalItems}
                orderSummary={calculateTotals()}
                selectedPromotion={selectedPromotion}
                promotions={promotions}
            />
        </div>
    );
};

export default CartComponent;
