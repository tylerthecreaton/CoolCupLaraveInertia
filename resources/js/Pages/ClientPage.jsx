import React, { useEffect, useState } from "react";
import MainContent from "@/Components/clientpage/MainContent";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head } from "@inertiajs/react";
import { Modal } from "flowbite-react";
import { useGlobalState } from "@/Store/state";
import ReactQrCode from "react-qr-code";

export default function ClientPage() {
    const { state, dispatch } = useGlobalState();
    const [localState, setLocalState] = useState({
        cart: {},
        clientScreen: {
            isShowing: false,
            selectedClient: null,
            qrCode: null,
            customerInfo: null,
            paymentInfo: null,
        },
    });

    // Setup broadcast channel listeners
    useEffect(() => {
        const cartChannel = new BroadcastChannel("cart_state");
        const clientScreenChannel = new BroadcastChannel("client_screen_state");

        cartChannel.onmessage = (event) => {
            if (event.data.type === "UPDATE_CART_STATE") {
                setLocalState((prev) => ({
                    ...prev,
                    cart: event.data.payload,
                }));
            }
        };

        clientScreenChannel.onmessage = (event) => {
            if (event.data.type === "UPDATE_CLIENT_SCREEN_STATE") {
                setLocalState((prev) => ({
                    ...prev,
                    clientScreen: event.data.payload,
                }));
            }
        };

        return () => {
            cartChannel.close();
            clientScreenChannel.close();
        };
    }, []);

    // Initial state sync
    useEffect(() => {
        setLocalState((prev) => ({
            ...prev,
            cart: state.cart,
            clientScreen: state.clientScreen,
        }));
    }, [state.cart, state.clientScreen]);

    return (
        <StorefrontLayout>
            <Head title="ClientPage" />
            <div className="client-page min-h-screen bg-gray-100">
                <section className="featured-section">
                    <div className="container px-4 py-12 mx-auto">
                        <h2 className="mb-8 text-3xl font-semibold text-center">
                            ยินดีต้อนรับสู่ร้าน CoolCup
                        </h2>
                        
                        {/* รายการสินค้า */}
                        {localState.cart.items?.length > 0 && (
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                                <h3 className="text-xl font-semibold mb-4">รายการสินค้า</h3>
                                <div className="space-y-4">
                                    {localState.cart.items.map((item) => (
                                        <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    ขนาด: {item.size} | ความหวาน: {item.sweetness}
                                                </div>
                                                {item.toppings?.length > 0 && (
                                                    <div className="text-sm text-gray-500">
                                                        ท็อปปิ้ง: {item.toppings.join(", ")}
                                                    </div>
                                                )}
                                                <div className="flex justify-between mt-1">
                                                    <span>x{item.quantity}</span>
                                                    <span className="font-medium">
                                                        ฿{(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* สรุปยอด */}
                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span>ยอดรวม</span>
                                            <span>฿{localState.cart.subtotal?.toFixed(2)}</span>
                                        </div>
                                        {localState.cart.cartDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>ส่วนลด</span>
                                                <span>-฿{localState.cart.cartDiscount?.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {localState.cart.pointDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>ส่วนลดจากคะแนน</span>
                                                <span>-฿{localState.cart.pointDiscount?.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-medium text-lg pt-2 border-t">
                                            <span>ยอดสุทธิ</span>
                                            <span>฿{localState.cart.total?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* QR Code Display */}
                        {localState.clientScreen.qrCode && (
                            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                                <h3 className="text-xl font-semibold mb-4">สแกนเพื่อชำระเงิน</h3>
                                <div className="flex justify-center mb-4">
                                    <ReactQrCode 
                                        value={localState.clientScreen.qrCode.qrCode} 
                                        size={256}
                                        className="mx-auto"
                                    />
                                </div>
                                <p className="text-xl font-semibold text-blue-600">
                                    จำนวนเงิน: ฿{localState.clientScreen.qrCode.amount.toFixed(2)}
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Customer Info Display */}
                {localState.clientScreen.customerInfo && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-40">
                        <div className="container mx-auto max-w-4xl">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {localState.clientScreen.customerInfo.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        เบอร์โทร: {localState.clientScreen.customerInfo.phone}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-medium text-blue-600">
                                        คะแนนสะสม: {localState.clientScreen.customerInfo.points} คะแนน
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Info Display */}
                {localState.clientScreen.paymentInfo && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-30">
                        <div className="container mx-auto max-w-4xl">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-gray-600">ยอดรวม</p>
                                    <p className="text-2xl font-bold">
                                        ฿{localState.clientScreen.paymentInfo.total.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">รับเงิน</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ฿{localState.clientScreen.paymentInfo.received.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">เงินทอน</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ฿{Math.max(0, localState.clientScreen.paymentInfo.change).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
