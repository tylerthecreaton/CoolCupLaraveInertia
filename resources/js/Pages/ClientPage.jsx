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
            selectedClient: null
        }
    });

    // Setup broadcast channel listeners
    useEffect(() => {
        const cartChannel = new BroadcastChannel('cart_state');
        const clientScreenChannel = new BroadcastChannel('client_screen_state');

        cartChannel.onmessage = (event) => {
            if (event.data.type === 'UPDATE_CART_STATE') {
                setLocalState(prev => ({
                    ...prev,
                    cart: event.data.payload
                }));
            }
        };

        clientScreenChannel.onmessage = (event) => {
            if (event.data.type === 'UPDATE_CLIENT_SCREEN_STATE') {
                setLocalState(prev => ({
                    ...prev,
                    clientScreen: event.data.payload
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
        setLocalState(prev => ({
            ...prev,
            cart: state.cart,
            clientScreen: state.clientScreen
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
                            <div className="debug-info">
                                <pre>
                                    {JSON.stringify(localState, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>
                <Modal
                    show={localState.clientScreen.isShowing}
                    size="md"
                    popup
                    onClose={() => {
                        console.log("close");
                    }}
                >
                    <Modal.Header />
                    <Modal.Body>{JSON.stringify(localState.cart, null, 2)}</Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            onClick={() => {
                                console.log("close");
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ปิด
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </StorefrontLayout>
    );
}
