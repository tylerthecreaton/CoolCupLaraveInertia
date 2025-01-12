import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { useGlobalState } from "@/Store/state";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ReactQrCode from "react-qr-code";

export default function ClientPage() {
    const { dispatch } = useGlobalState();
    const [localState, setLocalState] = useState({
        cart: {},
        clientScreen: {
            isShowing: false,
            selectedClient: null,
            qrCode: null,
            customerInfo: null,
            paymentInfo: null,
        },
        isShowingThankYouModal: false,
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
                console.log(
                    "Received client screen update:",
                    event.data.payload
                );
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

    // Watch for payment confirmation
    useEffect(() => {
        console.log(
            "Payment status changed:",
            localState.clientScreen?.paymentInfo
        );
        if (localState.clientScreen?.paymentInfo?.status === "confirmed") {
            console.log("Showing thank you modal");
            setLocalState((prev) => ({
                ...prev,
                isShowingThankYouModal: true,
            }));

            // Auto hide after 5 seconds
            setTimeout(() => {
                setLocalState((prev) => ({
                    ...prev,
                    isShowingThankYouModal: false,
                }));
                // Also clear the payment info
                dispatch({
                    type: "SHOW_PAYMENT_INFO",
                    payload: null,
                });
            }, 5000);
        }
    }, [localState.clientScreen?.paymentInfo?.status]);

    return (
        <StorefrontLayout>
            <Head title="ClientPage" />
            <div className="client-page min-h-screen bg-gradient-to-b from-blue-50 to-white">
                <section className="featured-section">
                    <div className="container px-4 py-8 mx-auto">
                        {/* Hero Section */}
                        <div className="text-center mb-12 animate-fade-in">
                            <h1 className="text-4xl font-bold text-blue-600 mb-4">
                                ยินดีต้อนรับสู่ร้าน CoolCup
                            </h1>
                            <p className="text-gray-600 text-lg">
                                เครื่องดื่มสดใหม่ รสชาติเยี่ยม พร้อมเสิร์ฟคุณ
                            </p>
                        </div>

                        {/* Member Information */}
                        {localState.clientScreen.customerInfo && (
                            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {
                                                    localState.clientScreen
                                                        .customerInfo.name
                                                }
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-1">
                                                คะแนนสะสม
                                            </p>
                                            <div className="flex items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-yellow-500 mr-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                                    />
                                                </svg>
                                                <span className="text-2xl font-bold text-blue-600">
                                                    {
                                                        localState.clientScreen
                                                            .customerInfo.points
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cart Items */}
                        {localState.cart.items?.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
                                <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">
                                    รายการสินค้า
                                </h3>
                                <div className="space-y-4">
                                    {localState.cart.items.map(
                                        (item, index) => (
                                            <div
                                                key={item.id}
                                                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                                style={{
                                                    animationDelay: `${
                                                        index * 100
                                                    }ms`,
                                                }}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-lg text-gray-800">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-gray-600 mt-1">
                                                        <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-2">
                                                            {item.size}
                                                        </span>
                                                        <span className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm">
                                                            ความหวาน:{" "}
                                                            {item.sweetness}
                                                        </span>
                                                    </div>
                                                    {item.toppings?.length >
                                                        0 && (
                                                        <div className="text-sm text-gray-600 mt-2">
                                                            <span className="font-medium">
                                                                ท็อปปิ้ง:{" "}
                                                            </span>
                                                            {item.toppings.map(
                                                                (
                                                                    topping,
                                                                    idx
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="inline-block bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs mr-1 mb-1"
                                                                    >
                                                                        {
                                                                            topping
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between mt-3">
                                                        <span className="text-gray-600">
                                                            จำนวน:{" "}
                                                            {item.quantity}
                                                        </span>
                                                        <span className="font-semibold text-blue-600">
                                                            ฿
                                                            {(
                                                                item.price *
                                                                item.quantity
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}

                                    {/* Summary Section */}
                                    <div className="border-t pt-6 space-y-3 mt-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>ยอดรวม</span>
                                            <span className="font-medium">
                                                ฿
                                                {localState.cart.subtotal?.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>
                                        {localState.cart.cartDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>ส่วนลด</span>
                                                <span className="font-medium">
                                                    -฿
                                                    {localState.cart.cartDiscount?.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {localState.cart.pointDiscountAmount >
                                            0 && (
                                            <div className="flex justify-between text-blue-600">
                                                <span>ส่วนลดจากคะแนน</span>
                                                <span className="font-medium">
                                                    -฿
                                                    {localState.cart.pointDiscountAmount?.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-semibold text-xl pt-4 border-t text-blue-600">
                                            <span>ยอดสุทธิ</span>
                                            <span>
                                                ฿
                                                {localState.cart.total?.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* QR Code Display */}
                        {localState.clientScreen.qrCode && (
                            <div
                                className={`transition-all duration-300 ${
                                    localState.clientScreen.qrCode.showAsModal
                                        ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                                        : ""
                                }`}
                            >
                                <div
                                    className={`bg-white rounded-xl shadow-2xl p-8 ${
                                        localState.clientScreen.qrCode
                                            .showAsModal
                                            ? "max-w-md w-full mx-4 transform transition-all duration-300 scale-100"
                                            : ""
                                    }`}
                                >
                                    <div className="text-center">
                                        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                                            สแกนเพื่อชำระเงิน
                                        </h3>
                                        <div className="bg-white p-4 rounded-lg shadow-inner mb-6 inline-block">
                                            <ReactQrCode
                                                value={
                                                    localState.clientScreen
                                                        .qrCode.qrCode
                                                }
                                                size={256}
                                                className="mx-auto"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center px-4">
                                                <span className="text-gray-600">
                                                    ยอดรวม:
                                                </span>
                                                <span className="font-semibold text-lg">
                                                    ฿
                                                    {localState.clientScreen.qrCode.subtotal.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                            {localState.cart.totalDiscount >
                                                0 && (
                                                <div className="flex justify-between items-center px-4">
                                                    <span className="text-green-600">
                                                        ส่วนลด:
                                                    </span>
                                                    <span className="font-semibold text-lg text-green-600">
                                                        ฿
                                                        {localState.cart.totalDiscount.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {localState.cart
                                                .pointDiscountAmount > 0 && (
                                                <div className="flex justify-between items-center px-4">
                                                    <span className="text-blue-600">
                                                        ส่วนลดจากคะแนน:
                                                    </span>
                                                    <span className="font-semibold text-lg text-blue-600">
                                                        ฿
                                                        {localState.cart.pointDiscountAmount.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center px-4 pt-3 border-t">
                                                <span className="text-gray-800 font-medium">
                                                    ยอดชำระ:
                                                </span>
                                                <span className="font-bold text-xl text-blue-600">
                                                    ฿
                                                    {localState.cart.total.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Info Modal */}
                        {localState.clientScreen.paymentInfo?.showAsModal &&
                            !localState.clientScreen.paymentInfo?.status ==
                                "confirmed" && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-xl shadow-2xl text-center max-w-3xl w-full mx-4 transform transition-all duration-300">
                                        <div className="space-y-8">
                                            <div className="text-white">
                                                <p className="text-2xl mb-2">
                                                    รับเงิน
                                                </p>
                                                <p className="text-6xl font-bold bg-white bg-opacity-10 rounded-lg py-4">
                                                    ฿
                                                    {localState.clientScreen.paymentInfo.received.toFixed(
                                                        2
                                                    )}
                                                </p>
                                            </div>
                                            <div className="text-white">
                                                <p className="text-2xl mb-2">
                                                    เงินทอน
                                                </p>
                                                <p className="text-6xl font-bold bg-white bg-opacity-10 rounded-lg py-4">
                                                    ฿
                                                    {Math.max(
                                                        0,
                                                        localState.clientScreen
                                                            .paymentInfo.change
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </section>
            </div>
            <ShowThankYouModal
                localState={localState}
                isShowing={localState.isShowingThankYouModal}
            />
        </StorefrontLayout>
    );
}

const ShowThankYouModal = ({ localState, isShowing = false }) => {
    return (
        isShowing && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full mx-4 transform transition-all duration-500 animate-scale-in">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                            <svg
                                className="w-12 h-12 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            ขอบคุณที่ใช้บริการ
                        </h2>
                        <p className="text-gray-600 text-lg mb-4">
                            เราหวังว่าคุณจะได้รับความประทับใจกับเครื่องดื่มของเรา
                        </p>
                        {localState.clientScreen?.customerInfo?.points && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-blue-800 font-medium">
                                    คะแนนสะสมของคุณ
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {
                                        localState.clientScreen.customerInfo
                                            .points
                                    }{" "}
                                    คะแนน
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};
