import MainContent from "@/Components/clientpage/MainContent";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { useGlobalState } from "@/Store/state";
import { Head } from "@inertiajs/react";
import { useEffect, useState, useRef } from "react";
import ReactQrCode from "react-qr-code";
import "@/../../resources/css/client-page.css";
import { isAbsoluteUrl } from "@/helpers";
import { ChevronUp, ChevronDown, ShoppingBag } from "lucide-react";

const ShowThankYouModal = ({ localState, isShowing = false }) => {
    return (
        isShowing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="p-8 mx-4 w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-500 animate-scale-up">
                    <div className="relative">
                        {/* Decorative Elements */}
                        <div className="absolute -top-12 -left-12 w-24 h-24 bg-green-100 rounded-full opacity-20"></div>
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>

                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 animate-ping">
                                        <div className="w-20 h-20 bg-green-100 rounded-full opacity-75"></div>
                                    </div>
                                    <div className="relative flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                                        <svg
                                            className="w-12 h-12 text-green-500 transform transition-transform duration-500 hover:scale-110"
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
                                </div>
                            </div>

                            <h2 className="mb-3 text-3xl font-bold text-gray-800 transition-all duration-300 hover:text-gray-900">
                                ขอบคุณที่ใช้บริการ
                            </h2>
                            <p className="mb-6 text-lg text-gray-600">
                                เราหวังว่าคุณจะได้รับความประทับใจกับเครื่องดื่มของเรา
                            </p>

                            {localState.clientScreen?.customerInfo?.points && (
                                <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl transform transition-all duration-300 hover:scale-105">
                                    <div className="relative">
                                        <svg
                                            className="absolute top-0 right-0 w-12 h-12 text-blue-200 transform rotate-15"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        <p className="mb-2 text-lg font-medium text-blue-800">
                                            คะแนนสะสมของคุณ
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600 animate-bounce">
                                            {localState.clientScreen.customerInfo.points}
                                            <span className="ml-2 text-xl">คะแนน</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

const CashPaymentModal = ({ paymentInfo, onClose, localState }) => {
    if (!paymentInfo?.showAsModal) return null;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 5000); // Auto close after 5 seconds

        return () => clearTimeout(timer);
    }, [paymentInfo]);

    // Ensure we have valid numbers with default values
    const total = localState?.cart?.total || 0;
    const received = paymentInfo?.received || 0;
    const change = received - total;

    // Get VAT information
    const vatRate = localState?.cart?.vatRate || 7;
    const vatAmount = localState?.cart?.vatAmount || (total - (total / (1 + (vatRate / 100))));
    const subtotalBeforeVat = localState?.cart?.subtotalBeforeVat || (total / (1 + (vatRate / 100)));

    const formatPrice = (amount) => {
        return amount.toLocaleString();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="p-8 mx-4 w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-500 animate-scale-up">
                <div className="relative">
                    {/* Decorative Elements */}
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-100 rounded-full opacity-20"></div>
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center space-y-6">
                        <div className="p-6 bg-blue-50 rounded-xl">
                            <h3 className="text-2xl font-semibold text-blue-800 mb-4">รายละเอียดการชำระเงิน</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-lg text-blue-600 mb-1">ราคารวม</p>
                                    <p className="text-3xl font-bold text-blue-700">
                                        ฿{(localState?.cart?.total || 0).toFixed(2)}
                                    </p>
                                </div>

                                {/* VAT Information */}
                                <div className="flex justify-between text-sm text-blue-600 border-t border-blue-200 pt-2 mt-2">
                                    <span>ราคาก่อนภาษี:</span>
                                    <span>฿{(localState?.cart?.subtotalBeforeVat || (localState?.cart?.total / 1.07)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-blue-600">
                                    <span>ภาษีมูลค่าเพิ่ม ({vatRate}%):</span>
                                    <span>฿{(localState?.cart?.vatAmount || (localState?.cart?.total - (localState?.cart?.total / 1.07))).toFixed(2)}</span>
                                </div>

                                <div>
                                    <p className="text-lg text-blue-600 mb-1">รับเงิน</p>
                                    <p className="text-4xl font-bold text-blue-700">
                                        ฿{formatPrice(received)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg text-blue-600 mb-1">เงินทอน</p>
                                    <p className="text-4xl font-bold text-green-600">
                                        ฿{formatPrice(change)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
    const [isCartExpanded, setIsCartExpanded] = useState(false);
    const cartDrawerRef = useRef(null);
    const prevCartItemsLength = useRef(0);

    // Auto-open drawer when items are added to cart
    useEffect(() => {
        if (localState.cart.items?.length > 0 && localState.cart.items?.length > prevCartItemsLength.current) {
            setIsCartExpanded(true);
        }
        
        prevCartItemsLength.current = localState.cart.items?.length || 0;
    }, [localState.cart.items?.length]);

    // Handle clicks outside the cart drawer to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (cartDrawerRef.current && !cartDrawerRef.current.contains(event.target) && isCartExpanded) {
                setIsCartExpanded(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCartExpanded]);

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

    const handlePaymentComplete = () => {
        setLocalState((prev) => ({
            ...prev,
            clientScreen: {
                ...prev.clientScreen,
                customerInfo: null,
                paymentInfo: {
                    ...prev.clientScreen?.paymentInfo,
                    showAsModal: false,
                },
            },
        }));
    };

    return (
        <StorefrontLayout>
            <Head title="ClientPage" />
            <MainContent />
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white client-page">
                {/* Hero Section */}
                <section className="relative py-16 overflow-hidden featured-section">
                    <div className="container relative px-4 mx-auto">
                        <div className="relative z-10 mb-12 text-center animate-fade-in">
                            <h1 className="mb-6 text-5xl font-bold text-blue-600 transition-all duration-300 hover:text-blue-700">
                                ยินดีต้อนรับสู่ร้าน CoolCup
                            </h1>
                            <p className="text-xl text-gray-600 transition-all duration-300 hover:text-gray-800">
                                เครื่องดื่มสดใหม่ รสชาติเยี่ยม พร้อมเสิร์ฟคุณ
                            </p>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-10"></div>
                    </div>
                </section>

                {/* Member Information */}
                {localState.clientScreen.customerInfo && (
                    <div className="p-6 mb-8 bg-white rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl">
                        <div className="flex flex-col justify-between items-start space-y-4 md:flex-row md:items-center md:space-y-0">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-8 h-8 text-blue-600"
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
                                    <p className="mb-1 text-sm text-gray-600">
                                        คะแนนสะสม
                                    </p>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 w-5 h-5 text-yellow-500"
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

                {/* Cart Items - Flutter-style Drawer */}
                {localState.cart.items?.length > 0 && (
                    <>
                        {/* Cart Drawer Content - Right Side */}
                        <div 
                            ref={cartDrawerRef}
                            className={`fixed top-0 right-0 bottom-0 z-30 bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 ease-in-out transform right-drawer ${
                                isCartExpanded ? 'translate-x-0 drawer-enter' : 'translate-x-full drawer-exit'
                            }`}
                            style={{ 
                                width: '350px',
                                maxWidth: '90vw'
                            }}
                        >
                            <div className="relative h-full overflow-hidden right-drawer-content">
                                {/* Drawer Handle */}
                                <div className="absolute top-0 left-0 right-0 flex justify-center pt-2 pb-4">
                                    <div className="drawer-handle-indicator"></div>
                                </div>
                                
                                {/* Close Button */}
                                <button 
                                    className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                                    onClick={() => setIsCartExpanded(false)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                
                                {/* Drawer Content */}
                                <div className="h-full overflow-y-auto pt-14 pb-24 right-drawer-body">
                                    <div className="px-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-2xl font-semibold text-gray-800">
                                                รายการสินค้า
                                            </h3>
                                            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                {localState.cart.items.length} รายการ
                                            </div>
                                        </div>
                                        
                                        {/* Cart Items */}
                                        <div className="space-y-4 mb-6">
                                            {localState.cart.items.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-start p-4 space-x-4 bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100 hover:shadow-md cart-item"
                                                    style={{
                                                        animationDelay: `${index * 100}ms`,
                                                    }}
                                                >
                                                    <div className="relative flex-shrink-0">
                                                        <img
                                                            src={
                                                                isAbsoluteUrl(item.image)
                                                                    ? item.image
                                                                    : `/images/products/${item.image}`
                                                            }
                                                            alt={item.name}
                                                            className="object-cover w-20 h-20 rounded-lg shadow-sm"
                                                        />
                                                        <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">
                                                            {item.quantity}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <div className="text-lg font-semibold text-gray-800">
                                                                {item.name}
                                                            </div>
                                                            <div className="text-lg font-bold text-blue-600">
                                                                ฿{(item.subtotal || (item.price * item.quantity) || 0).toFixed(2)}
                                                            </div>
                                                        </div>
                                                        <div className="mt-1 space-x-2">
                                                            <span className="inline-block px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                                                                {item.size}
                                                            </span>
                                                            <span className="inline-block px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                                                                ความหวาน: {item.sweetness}
                                                            </span>
                                                        </div>
                                                        {item.toppings && item.toppings.length > 0 && (
                                                            <div className="mt-2 text-sm text-gray-600">
                                                                <span className="font-medium">ท็อปปิ้ง: </span>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {item.toppings.map((topping, idx) => (
                                                                        <span 
                                                                            key={idx} 
                                                                            className="inline-block px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full"
                                                                        >
                                                                            {topping.name} (฿{topping.price})
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Cart Summary */}
                                        <div className="p-4 bg-white rounded-xl shadow-md sticky bottom-0 right-drawer-footer">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-gray-600">
                                                    <span>ราคารวม</span>
                                                    <span className="font-medium">
                                                        ฿{(localState.cart.subtotal || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                                {localState.cart.cartDiscount >
                                                    0 && (
                                                        <div className="flex justify-between items-center text-green-600">
                                                            <span>ส่วนลด</span>
                                                            <span className="font-medium">
                                                                -฿{(localState.cart.cartDiscount || 0).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                {localState.cart
                                                    .pointDiscountAmount > 0 && (
                                                        <div className="flex justify-between items-center text-blue-600">
                                                            <span>ส่วนลดจากคะแนน</span>
                                                            <span className="font-medium">
                                                                -฿{(localState.cart.pointDiscountAmount || 0).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                
                                                {/* VAT Information */}
                                                <div className="flex justify-between text-gray-600">
                                                    <span>ราคาก่อนภาษี:</span>
                                                    <span>
                                                        ฿{(localState.cart.subtotalBeforeVat || (localState.cart.total / 1.07) || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-gray-600">
                                                    <span>ภาษีมูลค่าเพิ่ม ({localState.cart.vatRate || 7}%):</span>
                                                    <span>
                                                        ฿{(localState.cart.vatAmount || (localState.cart.total - (localState.cart.total / 1.07)) || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex justify-between pt-4 text-xl font-semibold text-blue-600 border-t">
                                                    <span>ยอดสุทธิ</span>
                                                    <span>
                                                        ฿{(localState.cart.total || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* QR Code Display */}
                {localState.clientScreen.qrCode && (
                    <div
                        className={`transition-all duration-300 ${localState.clientScreen.qrCode.showAsModal
                            ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                            : ""
                            }`}
                    >
                        <div
                            className={`bg-white rounded-xl shadow-2xl p-8 ${localState.clientScreen.qrCode
                                .showAsModal
                                ? "max-w-md w-full mx-4 transform transition-all duration-300 scale-100"
                                : ""
                                }`}
                        >
                            <div className="text-center">
                                <h3 className="mb-6 text-2xl font-semibold text-gray-800">
                                    สแกนเพื่อชำระเงิน
                                </h3>
                                <div className="inline-block p-4 mb-6 bg-white rounded-lg shadow-inner">
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
                                        <span className="text-lg font-semibold">
                                            ฿{(localState.clientScreen.qrCode.subtotal || 0).toFixed(2)}
                                        </span>
                                    </div>
                                    {localState.cart.totalDiscount >
                                        0 && (
                                            <div className="flex justify-between items-center px-4">
                                                <span className="text-green-600">
                                                    ส่วนลด:
                                                </span>
                                                <span className="text-lg font-semibold text-green-600">
                                                    -฿{(localState.cart.totalDiscount || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    {localState.cart
                                        .pointDiscountAmount > 0 && (
                                            <div className="flex justify-between items-center px-4">
                                                <span className="text-blue-600">
                                                    ส่วนลดจากคะแนน:
                                                </span>
                                                <span className="text-lg font-semibold text-blue-600">
                                                    -฿{(localState.cart.pointDiscountAmount || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    {/* VAT Information in QR Code Display */}
                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                        <div className="flex justify-between items-center px-4 text-sm text-gray-600">
                                            <span>ราคาก่อนภาษี:</span>
                                            <span>
                                                ฿{(localState.cart.subtotalBeforeVat || (localState.cart.total / 1.07) || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center px-4 text-sm text-gray-600">
                                            <span>ภาษีมูลค่าเพิ่ม ({localState.cart.vatRate || 7}%):</span>
                                            <span>
                                                ฿{(localState.cart.vatAmount || (localState.cart.total - (localState.cart.total / 1.07)) || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center px-4 pt-3 border-t">
                                        <span className="font-medium text-gray-800">
                                            ยอดชำระ:
                                        </span>
                                        <span className="text-xl font-bold text-blue-600">
                                            ฿{(localState.cart.total || 0).toFixed(2)}
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
                        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
                            <div className="p-8 mx-4 w-full max-w-3xl text-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-2xl transition-all duration-300 transform">
                                <div className="space-y-8">
                                    <div className="text-white">
                                        <p className="mb-2 text-2xl">
                                            รับเงิน
                                        </p>
                                        <p className="py-4 text-6xl font-bold bg-white bg-opacity-10 rounded-lg">
                                            ฿{(localState.clientScreen.paymentInfo.received || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-white">
                                        <p className="mb-2 text-2xl">
                                            เงินทอน
                                        </p>
                                        <p className="py-4 text-6xl font-bold bg-white bg-opacity-10 rounded-lg">
                                            ฿{Math.max(
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
            <ShowThankYouModal localState={localState} isShowing={localState.isShowingThankYouModal} />
            <CashPaymentModal
                paymentInfo={localState.clientScreen?.paymentInfo}
                onClose={handlePaymentComplete}
                localState={localState}
            />
        </StorefrontLayout>
    );
}
