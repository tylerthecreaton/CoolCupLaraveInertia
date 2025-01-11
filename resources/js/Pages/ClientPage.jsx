import React, { useEffect, useState } from "react";
import MainContent from "@/Components/clientpage/MainContent";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head } from "@inertiajs/react";
import { Modal } from "flowbite-react";
import { useGlobalState } from "@/Store/state";

export default function ClientPage() {
    const { state, dispatch } = useGlobalState();
    const [localState, setLocalState] = useState({
        cart: {},
        clientScreen: {
            isShowing: false,
            selectedClient: null,
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

        // Cleanup on unmount
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
            <div className="client-page">
                <MainContent />
                <section className="featured-section">
                    <div className="container px-4 py-12 mx-auto">
                        <h2 className="mb-8 text-3xl font-semibold text-center">
                            ยินดีต้อนรับสู่ร้าน CoolCup
                        </h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="feature-card">
                                <h3 className="mb-2 text-xl font-semibold">
                                    ทุกแก้วคือความสดชื่น
                                </h3>
                                <p className="text-gray-600">
                                    เติมเต็มทุกช่วงเวลา ด้วยเครื่องดื่มคุณภาพ
                                </p>
                            </div>
                            <div className="feature-card">
                                <h3 className="mb-2 text-xl font-semibold">
                                    ดื่มด่ำทุกหยดแห่งความสุข
                                </h3>
                                <p className="text-gray-600">
                                    เพราะทุกแก้วคือความใส่ใจ ลองแล้วคุณจะหลงรัก
                                </p>
                            </div>
                            <div className="feature-card">
                                <h3 className="mb-2 text-xl font-semibold">
                                    เปิดประสบการณ์ชาในแบบคุณ
                                </h3>
                                <p className="text-gray-600">
                                    เพราะความสดชื่นไม่มีที่สิ้นสุด
                                    เมนูใหม่นี่แหละคือคำตอบ
                                </p>
                            </div>
                            {/* Debug info */}
                            {/* <div className="debug-info">
                                <pre>
                                    {JSON.stringify(localState, null, 2)}
                                </pre>
                            </div> */}
                            <Modal
                                show={localState.clientScreen.isShowing}
                                size="md"
                                popup
                                onClose={() => {
                                    dispatch(
                                        clientScreenActions.hideClientScreenModal()
                                    );
                                }}
                            >
                                <Modal.Header>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                        รายการสั่งซื้อ
                                    </h3>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="space-y-4">
                                        {/* Order Number */}
                                        <div className="text-sm text-gray-500">
                                            เลขที่คำสั่งซื้อ:{" "}
                                            {localState.cart.orderNumber}
                                        </div>

                                        {/* Items List */}
                                        <div className="space-y-3">
                                            {localState.cart.items?.map(
                                                (item, index) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium">
                                                                {item.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ขนาด:{" "}
                                                                {item.size} |
                                                                ความหวาน:{" "}
                                                                {item.sweetness}
                                                            </div>
                                                            {item.toppings
                                                                ?.length >
                                                                0 && (
                                                                <div className="text-sm text-gray-500">
                                                                    ท็อปปิ้ง:{" "}
                                                                    {item.toppings.join(
                                                                        ", "
                                                                    )}
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between mt-1">
                                                                <span>
                                                                    x
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                                <span className="font-medium">
                                                                    ฿
                                                                    {item.price *
                                                                        item.quantity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* Summary */}
                                        <div className="border-t pt-3 space-y-2">
                                            <div className="flex justify-between">
                                                <span>ยอดรวม</span>
                                                <span>
                                                    ฿{localState.cart.subtotal}
                                                </span>
                                            </div>
                                            {localState.cart.cartDiscount >
                                                0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>ส่วนลด</span>
                                                    <span>
                                                        -฿
                                                        {
                                                            localState.cart
                                                                .cartDiscount
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {localState.cart.pointDiscount >
                                                0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>ส่วนลดจากคะแนน</span>
                                                    <span>
                                                        -฿
                                                        {
                                                            localState.cart
                                                                .pointDiscount
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-medium text-lg pt-2 border-t">
                                                <span>ยอดสุทธิ</span>
                                                <span>
                                                    ฿{localState.cart.total}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => {
                                            dispatch(
                                                clientScreenActions.hideClientScreenModal()
                                            );
                                        }}
                                    >
                                        ปิด
                                    </button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </section>
            </div>
        </StorefrontLayout>
    );
}
