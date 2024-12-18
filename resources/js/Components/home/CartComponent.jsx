import React, { useState } from "react";
import { useGlobalState } from "@/Store/state";
import { appActions } from "@/Store/state/appState";
import { cartActions } from "@/Store/state/cartState";
import { Button, TextInput } from "flowbite-react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";

const CartComponent = () => {
    const { state, dispatch } = useGlobalState();
    const { items, totalItems, total, discount, finalTotal } = state.cart;
    const [discountInput, setDiscountInput] = useState("");

    const handleUpdateQuantity = (id, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity > 0) {
            dispatch(cartActions.updateQuantity(id, newQuantity));
        } else {
            dispatch(cartActions.removeFromCart(id));
        }
    };

    const handleApplyDiscount = () => {
        const discountAmount = parseFloat(discountInput);
        if (!isNaN(discountAmount) && discountAmount >= 0) {
            dispatch(cartActions.applyDiscount(discountAmount));
            setDiscountInput("");
        }
    };

    return (
        <div className="fixed top-0 right-0 h-screen w-80 bg-white shadow-xl flex flex-col">
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
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium">
                                            {item.name}
                                        </h3>
                                        <Button
                                            size="xs"
                                            color="failure"
                                            onClick={() =>
                                                dispatch(
                                                    cartActions.removeFromCart(
                                                        item.id
                                                    )
                                                )
                                            }
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        <p>ขนาด: {item.size}</p>
                                        <p>ความหวาน: {item.sweetness}</p>
                                        {item.topping && (
                                            <p>ท็อปปิ้ง: {item.topping}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-blue-600 font-medium">
                                            ฿{item.price}
                                        </span>
                                        <div className="flex items-center space-x-2">
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
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-600 mt-1">
                                        รวม: ฿{item.price * item.quantity}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <div className="border-t p-4 bg-gray-50">
                    {/* Discount Input */}
                    <div className="flex space-x-2 mb-4">
                        <TextInput
                            type="number"
                            placeholder="ใส่ส่วนลด"
                            value={discountInput}
                            onChange={(e) => setDiscountInput(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            size="sm"
                            color="light"
                            onClick={handleApplyDiscount}
                        >
                            ใช้ส่วนลด
                        </Button>
                    </div>

                    {/* Summary */}
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span>จำนวนสินค้า:</span>
                            <span>{totalItems} ชิ้น</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>ราคารวม:</span>
                            <span>฿{total}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>ส่วนลด:</span>
                                <span>-฿{discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                            <span>ราคาสุทธิ:</span>
                            <span>฿{finalTotal}</span>
                        </div>
                    </div>

                    <Button className="w-full">ชำระเงิน</Button>
                </div>
            )}
        </div>
    );
};

export default CartComponent;
