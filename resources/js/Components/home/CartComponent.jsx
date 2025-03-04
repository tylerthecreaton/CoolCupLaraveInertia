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
import { isAbsoluteUrl } from "@/helpers";

const CartComponent = () => {
    const user = usePage().props.auth.user;
    const cartRef = useRef();
    const { state, dispatch } = useGlobalState();
    const { items } = state.cart;
    const [selectedPromotion, setSelectedPromotion] = useState("");
    const [discountInput, setDiscountInput] = useState("");
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [summary, setSummary] = useState({
        orderNumber: state.cart.orderNumber,
        key: 0,
        items: [],
        subtotal: 0,
        cartDiscount: 0,
        pointDiscount: 0,
        totalDiscount: 0,
        total: 0,
        discountType: "", // 'promotion' | 'manual' | 'point'
        totalItems: 0,
        appliedPromotion: null,
        manualDiscountAmount: 0,
        pointDiscountAmount: 0,
        userId: user?.id || null,
        userName: user?.name || "ผู้ใช้ทั่วไป",
        timestamp: new Date().toISOString(),
    });

    // Calculate total items (excluding discounts)
    const calculateTotalItems = () => {
        return items.reduce(
            (sum, item) => (!item.isDiscount ? sum + item.quantity : sum),
            0
        );
    };

    // Fetch promotions on component mount
    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axios.get("/api/promotions");
                const currentDate = new Date();
                // Filter only valid promotions
                const validPromotions = response.data.filter(promotion => {
                    const startDate = promotion.start_date ? new Date(promotion.start_date) : null;
                    const endDate = promotion.end_date ? new Date(promotion.end_date) : null;

                    // Check if promotion is valid for current date and is active
                    const isValidDate = (!startDate || currentDate >= startDate) &&
                           (!endDate || currentDate <= endDate) &&
                           promotion.is_active;

                    // For category promotions, check if we have relevant items in cart
                    if (promotion.type === "CATEGORY_DISCOUNT") {
                        const hasRelevantItems = items.some(item => 
                            item.categoryId === Number(promotion.category?.category_id)
                        );
                        return isValidDate && hasRelevantItems;
                    }

                    return isValidDate;
                });
                setPromotions(validPromotions);
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
    }, [items]); // Added items as dependency to re-fetch when cart changes

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
                const nextOrderNumber = response.data.nextOrderNumber;
                dispatch(cartActions.setOrderNumber(nextOrderNumber));
                setSummary((prev) => ({
                    ...prev,
                    orderNumber: nextOrderNumber,
                }));
            } catch (error) {
                console.error("Error fetching order number:", error);
                dispatch(cartActions.setOrderNumber(1));
                setSummary((prev) => ({ ...prev, orderNumber: 1 }));
            }
        };
        fetchOrderNumber();
    }, [dispatch]);

    // Update summary whenever relevant values change
    useEffect(() => {
        const {
            subtotal,
            cartDiscount,
            pointDiscount,
            totalDiscount,
            total,
            totalItems,
        } = calculateTotals();
        const regularItems = items.filter((item) => item.price > 0);

        setSummary((prev) => ({
            ...prev,
            orderNumber: state.cart.orderNumber,
            key: state.cart.key,
            items: regularItems,
            subtotal,
            cartDiscount,
            pointDiscount,
            totalDiscount,
            total,
            totalItems,
            discountType: state.cart.discountType,
            appliedPromotion: state.cart.appliedPromotion,
            manualDiscountAmount: state.cart.manualDiscountAmount,
            pointDiscountAmount: state.cart.pointDiscountAmount,
            userId: user?.id || null,
            userName: user?.name || "ผู้ใช้ทั่วไป",
            timestamp: new Date().toISOString(),
        }));
    }, [items, state.cart, user]);

    // Calculate cart totals
    const calculateTotals = () => {
        const regularItems = items.filter((item) => item.price > 0);
        const discountItems = items.filter((item) => item.price < 0);

        const subtotal = regularItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const cartDiscount = discountItems.reduce(
            (sum, item) => sum + Math.abs(item.price) * item.quantity,
            0
        );

        const pointDiscount = state.cart.pointDiscountAmount || 0;
        const totalDiscount = cartDiscount + pointDiscount;

        const totalItems = regularItems.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        return {
            subtotal,
            cartDiscount,
            pointDiscount,
            totalDiscount,
            total: Math.max(0, subtotal - totalDiscount),
            totalItems,
        };
    };

    // Handle promotion selection
    const handlePromotionSelect = async (promotionId) => {
        // Check if there's already a selected promotion
        const existingPromotionItems = items.filter(
            (item) => item.isDiscount && item.isPromotionDiscount
        );

        if (existingPromotionItems.length > 0 && promotionId) {
            await Swal.fire({
                title: "ไม่สามารถใช้โปรโมชั่นได้",
                text: "สามารถใช้โปรโมชั่นได้เพียง 1 รายการเท่านั้น กรุณายกเลิกโปรโมชั่นที่มีอยู่ก่อน",
                icon: "warning",
            });
            setSelectedPromotion("");
            return;
        }
        if (!promotionId) {
            setSelectedPromotion("");
            dispatch(cartActions.applyPromotion(null));
            // Remove any existing promotion discount items
            const discountItems = items.filter(
                (item) => item.isDiscount && item.isPromotionDiscount
            );
            discountItems.forEach((item) => {
                dispatch(cartActions.removeFromCart(item.id));
            });
            return;
        }

        const promotion = promotions.find(
            (p) => p.id === parseInt(promotionId)
        );

        console.log(`ton test`, promotion);

        if (!promotion) return;

        // Check for existing manual discount
        if (items.some((item) => item.isManualDiscount)) {
            await Swal.fire({
                title: "ไม่สามารถใช้โปรโมชั่นได้",
                text: "กรุณาลบส่วนลดที่มีอยู่ก่อนใช้โปรโมชั่น",
                icon: "warning",
            });
            setSelectedPromotion("");
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

        // Calculate promotion discount
        const discountAmount = calculateTotalDiscount(
            items.filter((item) => !item.isDiscount),
            [promotion],
            new Date()
        );

        if (discountAmount > 0) {
            // Remove any existing promotion discount items
            const discountItems = items.filter(
                (item) => item.isDiscount && item.isPromotionDiscount
            );
            discountItems.forEach((item) => {
                dispatch(cartActions.removeFromCart(item.id));
            });

            // Add promotion discount item
            const discountItem = {
                id: `promotion-${promotion.id}-${Date.now()}`,
                name: `ส่วนลด ${promotion.name}`,
                price: -discountAmount,
                quantity: 1,
                isDiscount: true,
                isPromotionDiscount: true,
            };
            console.log(promotion);
            dispatch(cartActions.addToCart(discountItem));
            dispatch(cartActions.applyPromotion(promotion));
            setSelectedPromotion(promotionId);
        }
    };

    // Handle manual discount
    const handleManualDiscount = async () => {
        const amount = Math.ceil(parseFloat(discountInput)); // Round up manual discount
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

        // Remove any existing discount items
        const discountItems = items.filter((item) => item.isDiscount);
        discountItems.forEach((item) => {
            dispatch(cartActions.removeFromCart(item.id));
        });

        const discountItem = {
            id: `manual-discount-${Date.now()}`,
            name: `ส่วนลด (${user ? `${user.name} #${user.id}` : "ผู้ใช้ทั่วไป"
                })`,
            price: -amount,
            quantity: 1,
            isDiscount: true,
            isManualDiscount: true,
        };

        dispatch(cartActions.addToCart(discountItem));
        dispatch(cartActions.applyManualDiscount(amount));
        setDiscountInput("");
    };

    // Handle quantity updates
    const handleUpdateQuantity = (item, delta) => {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) {
            handleRemoveItem(item);
        } else {
            dispatch(cartActions.updateQuantity(item, delta));
            const {
                subtotal,
                cartDiscount,
                pointDiscount,
                totalDiscount,
                total,
                totalItems,
            } = calculateTotals();
            setSummary((prev) => ({
                ...prev,
                subtotal,
                cartDiscount,
                pointDiscount,
                totalDiscount,
                total,
                totalItems,
                timestamp: new Date().toISOString(),
            }));
        }
    };

    // Handle item removal
    const handleRemoveItem = async (item) => {
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
            dispatch(cartActions.removeFromCart(item));

            // Reset promotion if removing a discount item
            if (item?.isManualDiscount) {
                setSummary((prev) => ({
                    ...prev,
                    discountType: "",
                    appliedPromotion: null,
                    manualDiscountAmount: 0,
                    pointDiscountAmount: 0,
                    timestamp: new Date().toISOString(),
                }));
            } else {
                const {
                    subtotal,
                    cartDiscount,
                    pointDiscount,
                    totalDiscount,
                    total,
                    totalItems,
                } = calculateTotals();
                setSummary((prev) => ({
                    ...prev,
                    subtotal,
                    cartDiscount,
                    pointDiscount,
                    totalDiscount,
                    total,
                    totalItems,
                    timestamp: new Date().toISOString(),
                }));
            }
        }
    };

    if (!state.app.isCartOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-[60]">
            <div
                ref={cartRef}
                id="shopping-cart"
                className="flex flex-col h-full"
            >
                {/* Cart Header */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-300 to-blue-300">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg">
                            <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex flex-col text-white">
                            <span className="text-2xl font-bold">
                                ออเดอร์ #{state.cart.orderNumber}
                            </span>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-blue-100">
                                    ตะกร้าสินค้า
                                </span>
                                {calculateTotalItems() > 0 && (
                                    <span className="bg-white text-blue-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                        {calculateTotalItems()} รายการ
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        color="white"
                        size="sm"
                        onClick={() => dispatch(appActions.setCartOpen(false))}
                        className="flex justify-center items-center w-8 h-8 hover:bg-blue-50 bg-white  hover:text-blue-600"
                    >
                        <X className="w-4 h-4 text-black-600" />
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
                                                    src={
                                                        isAbsoluteUrl(item.image)
                                                            ? item.image
                                                            : `/images/products/${item.image}`
                                                    }
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
                                                            <span className="font-medium">
                                                                ขนาด:
                                                            </span>{" "}
                                                            {item.size}
                                                        </p>
                                                    )}
                                                    {item.sweetness && (
                                                        <p className="text-sm text-gray-500">
                                                            <span className="font-medium">
                                                                ความหวาน:
                                                            </span>{" "}
                                                            {item.sweetness}
                                                        </p>
                                                    )}
                                                    {item.toppings &&
                                                        item.toppings.length >
                                                        0 && (
                                                            <p className="text-sm text-gray-500">
                                                                <span className="font-medium">
                                                                    ท็อปปิ้ง:
                                                                </span>{" "}
                                                                {item.toppings.map(topping => `${topping.name} (฿${topping.price})`).join(', ')}
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
                                                            item,
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
                                                            item,
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
                                                handleRemoveItem(item)
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
                                    color="success"
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
                                <span>{calculateTotalItems()} ชิ้น</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>ราคารวม:</span>
                                <span>฿{summary.subtotal.toFixed(2)}</span>
                            </div>
                            {summary.cartDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>ส่วนลดจากโปรโมชั่น/คูปอง:</span>
                                    <span>
                                        -฿{summary.cartDiscount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {summary.pointDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>ส่วนลดจากแต้ม:</span>
                                    <span>
                                        -฿{summary.pointDiscount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {summary.totalDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 font-medium">
                                    <span>ส่วนลดทั้งหมด:</span>
                                    <span>
                                        -฿{summary.totalDiscount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between font-medium text-lg pt-2 border-t">
                                <span>ยอดชำระ:</span>
                                <span>฿{summary.total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Confirm Order Button */}
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => {
                                setShowOrderModal(true);
                            }}
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
                totalItems={calculateTotalItems()}
            />
        </div>
    );
};

export default CartComponent;
