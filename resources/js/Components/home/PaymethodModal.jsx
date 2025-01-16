import { useForm } from "@inertiajs/react";
import {
    Button,
    FileInput,
    Label,
    Modal,
    Radio,
    Spinner,
    TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";

import {
    BadgeDollarSign,
    Banknote,
    CreditCard,
    QrCode,
    Receipt,
    SquarePercent,
} from "lucide-react";
import Swal from "sweetalert2";

import { useGlobalState } from "@/Store/state";
import { clientScreenActions } from "@/Store/state/clientScreenState";
import generatePayload from "promptpay-qr";
import ReactQrCode from "react-qr-code";
import LoadingIndicator from "../LoadingIndicator";
import ReceiptModal from "./ReceiptModal";

const PaymethodModal = ({ show, onClose, cartActions }) => {
    const { state, dispatch } = useGlobalState();
    const { data, post, setData, errors, processing } = useForm({
        selectedMethod: "cash",
        cashReceived: 0.0,
        showQR: false,
        paymentFile: null,
        paymentNote: "",
        cart: state.cart,
        memberPhone: "",
    });

    const settings = state.app.settings;
    const { total, subtotal, discount } = state.cart;

    const pointPerThb = settings.find(
        (setting) => setting.key === "point_per_thb"
    );

    const [showReceipt, setShowReceipt] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [member, setMember] = useState(null);
    const [isSummary, setIsSummary] = useState(false);
    const [isMemberLoading, setIsMemberLoading] = useState(false);
    const [usePoints, setUsePoints] = useState(false);
    const [isCashFocused, setIsCashFocused] = useState(false);

    const paymentMethods = [
        {
            id: "cash",
            name: "เงินสด",
            icon: "banknotes",
            description: "ชำระด้วยเงินสด",
        },
        {
            id: "qr",
            name: "QR Promptpay",
            icon: "qr-code",
            description: "สแกน QR Code เพื่อชำระเงิน",
        },
    ];

    useEffect(() => {
        if (data.memberPhone.length === 10) {
            setIsMemberLoading(true);
            handleMemberSearch();
        } else {
            setMember(null);
            setIsMemberLoading(false);
            // Clear discount when member is cleared
            dispatch(cartActions.applyPointDiscount({ amount: 0, point: 0 }));
        }
    }, [data.memberPhone]);

    // เมื่อเลือกวิธีชำระเงิน
    const handleMethodSelect = (method) => {
        setData("selectedMethod", method);
        setData("cashReceived", "");

        if (method === "qr") {
            const promptpayNumber =
                settings.find((s) => s.key === "promptpay_number")?.value || "";
            const qrCodeValue = generatePayload(promptpayNumber, {
                amount: total,
            });
            setData("showQR", true);
            // ส่งข้อมูล QR Code และข้อมูลการชำระเงินไปแสดงที่หน้า Client
            dispatch(
                clientScreenActions.showQRCode({
                    qrCode: qrCodeValue,
                    amount: total,
                    showAsModal: true,
                    paymentMethod: "qr",
                    subtotal: subtotal,
                    discount: discount,
                    pointDiscount: usePoints ? total : 0,
                    finalTotal: usePoints ? 0 : total,
                })
            );
        } else {
            setData("showQR", false);
            dispatch(clientScreenActions.showQRCode(null));
        }
    };

    // เมื่อค้นหาสมาชิก
    const handleMemberSearch = async () => {
        try {
            const response = await axios.get(
                route("api.admin.member.memberWherePhoneNumber", {
                    phoneNumber: data.memberPhone,
                })
            );
            if (response.data) {
                setMember(response.data);
                // ส่งข้อมูลลูกค้าไปแสดงที่หน้า Client
                dispatch(
                    clientScreenActions.showCustomerInfo({
                        name: response.data.name,
                        phone: response.data.phone,
                        points: response.data.loyalty_points,
                    })
                );
            } else {
                setMember(null);
                dispatch(clientScreenActions.showCustomerInfo(null));
            }
        } catch (error) {
            console.error("Error searching member:", error);
            setMember(null);
            dispatch(clientScreenActions.showCustomerInfo(null));
        } finally {
            setIsMemberLoading(false);
        }
    };

    // เมื่อใส่จำนวนเงินที่รับ
    const handleCashReceived = (value) => {
        const amount = parseFloat(value) || 0;
        setData("cashReceived", amount);

        // ถ้าเป็นการชำระด้วย QR และเงินที่รับมาน้อยกว่ายอดที่ต้องชำระ ให้ยังแสดง QR code
        if (data.selectedMethod === "qr" && amount < (usePoints ? 0 : total)) {
            const promptpayNumber =
                settings.find((s) => s.key === "promptpay_number")?.value || "";
            const qrCodeValue = generatePayload(promptpayNumber, {
                amount: total,
            });
            dispatch(
                clientScreenActions.showQRCode({
                    qrCode: qrCodeValue,
                    amount: total,
                    showAsModal: true,
                    paymentMethod: "qr",
                    subtotal: subtotal,
                    discount: discount,
                    pointDiscount: usePoints ? total : 0,
                    finalTotal: usePoints ? 0 : total,
                })
            );
        } else {
            dispatch(clientScreenActions.showQRCode(null));
        }

        // คำนวณข้อมูลการชำระเงิน
        const paymentInfo = {
            received: amount,
            change: amount - (usePoints ? 0 : total),
            total,
            subtotal,
            discount,
            pointsUsed: usePoints
                ? Math.ceil(
                      total * (pointPerThb ? parseFloat(pointPerThb.value) : 10)
                  )
                : 0,
            pointDiscount: usePoints ? total : 0,
            finalTotal: usePoints ? 0 : total,
            paymentMethod: data.selectedMethod,
            showAsModal: isCashFocused,
        };

        // ส่งข้อมูลการชำระเงินไปแสดงที่หน้า Client
        dispatch(clientScreenActions.showPaymentInfo(paymentInfo));
    };

    // เมื่อ focus ที่ช่องรับเงิน
    const handleCashFocus = () => {
        setIsCashFocused(!isCashFocused);

        // ถ้ามีการรับเงินแล้ว ให้ส่งข้อมูลไปแสดงที่หน้า Client
        if (data.cashReceived) {
            const amount = parseFloat(data.cashReceived) || 0;
            dispatch(
                clientScreenActions.showPaymentInfo({
                    showAsModal: true,
                    received: amount,
                    change: amount - (usePoints ? 0 : total),
                })
            );
        }
    };

    // เมื่อใช้คะแนนสะสม
    const handleUsePoints = (points = null) => {
        // ถ้าไม่ระบุ points มา จะใช้คะแนนทั้งหมดที่มี
        const pointsToUse =
            points ||
            Math.ceil(
                total * (pointPerThb ? parseFloat(pointPerThb.value) : 10)
            );

        if (!usePoints) {
            dispatch(
                cartActions.applyPointDiscount({
                    amount: pointsToUse,
                    point: points
                        ? points /
                          (pointPerThb ? parseFloat(pointPerThb.value) : 10)
                        : total,
                })
            );
            setUsePoints(true);
        } else {
            dispatch(
                cartActions.applyPointDiscount({
                    amount: 0,
                    point: 0,
                })
            );
            setUsePoints(false);
        }

        // อัพเดทข้อมูลการชำระเงินถ้ามีการใส่เงินสดไว้แล้ว
        if (data.cashReceived) {
            handleCashReceived(data.cashReceived);
        }
    };

    // Clear payment info when modal closes
    useEffect(() => {
        if (!show) {
            dispatch(clientScreenActions.showPaymentInfo(null));
        }
    }, [show]);

    const calculateChange = () => {
        const received = parseFloat(data.cashReceived);
        if (!received || received < total) return null;
        return (received - total).toFixed(2);
    };

    const confirmOrder = async () => {
        try {
            const response = await axios.post(route("order.store"), {
                selectedMethod:
                    data.selectedMethod === "qr"
                        ? "qr_code"
                        : data.selectedMethod,
                cart: state.cart,
                memberPhone: data.memberPhone,
                cashReceived:
                    data.selectedMethod === "cash"
                        ? data.cashReceived
                        : finalTotal,
                paymentNote: data.paymentNote || "",
            });

            if (response.status === 200) {
                // Show receipt modal with success message
                setReceipt(response.data);
                setShowReceipt(true);

                dispatch(
                    clientScreenActions.showPaymentInfo({
                        ...response.data,
                        showAsModal: true,
                        status: "confirmed",
                        received:
                            data.selectedMethod === "cash"
                                ? data.cashReceived
                                : finalTotal,
                        change:
                            data.selectedMethod === "cash"
                                ? calculateChange(data.cashReceived)
                                : 0,
                    })
                );
                // Show success message
                Swal.fire({
                    title: "สำเร็จ!",
                    text: "ขอบคุณที่ใช้บริการ",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });

                // Clear cart and close modal
                dispatch(cartActions.clearCart());
                onClose();
            }
        } catch (error) {
            console.error("Error confirming order:", error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "ไม่สามารถบันทึกคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง",
            });
        }
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        if (!data.selectedMethod) {
            Swal.fire({
                title: "กรุณาเลือกวิธีการชำระเงิน",
                icon: "warning",
            });
            return;
        }

        if (data.selectedMethod === "cash") {
            const received = parseFloat(data.cashReceived);
            if (!received && finalTotal > 0) {
                Swal.fire({
                    title: "กรุณากรอกจำนวนเงินที่รับมา",
                    icon: "warning",
                });
                return;
            }
            if (received < finalTotal) {
                Swal.fire({
                    title: "จำนวนเงินไม่เพียงพอ",
                    text: "กรุณาตรวจสอบจำนวนเงินอีกครั้ง",
                    icon: "error",
                });
                return;
            }
        }

        Swal.fire({
            title: "ยืนยันการชำระเงิน",
            text: `ยอดชำระ: ฿${total.toFixed(2)}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                confirmOrder();
            }
        });
    };

    const handleReceiptClose = () => {
        setShowReceipt(false);
        onClose();
    };

    useEffect(() => {
        if (!show) {
            setUsePoints(false);
            dispatch(cartActions.applyPointDiscount({ amount: 0, point: 0 }));
        }
    }, [show]);

    // Get cart discounts from state
    const cartDiscount = state.cart.cartDiscount || 0;
    const pointDiscount = state.cart.pointDiscount || 0;
    const totalDiscount = state.cart.totalDiscount || 0;

    // Calculate final total including all discounts
    const finalTotal = Math.max(0, total - totalDiscount);

    return (
        <>
            <Modal
                show={show}
                onClose={onClose}
                size="lg"
                className="dark:bg-gray-800"
            >
                <Modal.Header className="bg-gray-50 border-b">
                    <div className="flex items-center space-x-2">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <span className="text-xl font-semibold">
                            เลือกวิธีการชำระเงิน
                        </span>
                    </div>
                </Modal.Header>
                <Modal.Body className="p-6">
                    <LoadingIndicator loading={processing} />
                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Receipt className="w-5 h-5 text-blue-600" />
                                <span className="font-medium">ยอดชำระ</span>
                            </div>
                            <span className="text-xl font-bold text-blue-600">
                                ฿{subtotal}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <SquarePercent className="w-5 h-5 text-blue-600" />
                                <span className="font-medium">ส่วนลด</span>
                            </div>
                            <div className="text-right">
                                {cartDiscount > 0 && (
                                    <div className="text-sm text-blue-600">
                                        {state.cart.appliedPromotion
                                            ? `โปรโมชั่น (${
                                                  state.cart.appliedPromotion
                                                      .name
                                              }): ฿${cartDiscount.toFixed(2)}`
                                            : `ส่วนลดจากโปรโมชั่น/คูปอง: ฿${cartDiscount.toFixed(
                                                  2
                                              )}`}
                                    </div>
                                )}
                                {pointDiscount > 0 && (
                                    <div className="text-sm text-blue-600">
                                        แต้มสะสม: ฿{pointDiscount.toFixed(2)}
                                    </div>
                                )}
                                {totalDiscount > 0 && (
                                    <span className="text-xl font-bold text-blue-600">
                                        รวม: ฿{totalDiscount.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <BadgeDollarSign className="w-5 h-5 text-green-600" />
                                <span className="font-medium">
                                    ยอดชำระสุทธิ
                                </span>
                            </div>
                            <span className="text-xl font-bold text-green-600">
                                ฿{total}
                            </span>
                        </div>
                        {!isSummary && (
                            <>
                                <div className="grid grid-cols-1 gap-4">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                                data.selectedMethod ===
                                                method.id
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "hover:bg-gray-50"
                                            }`}
                                            onClick={() =>
                                                handleMethodSelect(method.id)
                                            }
                                        >
                                            <div className="flex flex-1 items-center space-x-4">
                                                {method.icon === "banknotes" ? (
                                                    <Banknote className="w-8 h-8 text-gray-600" />
                                                ) : (
                                                    <QrCode className="w-8 h-8 text-gray-600" />
                                                )}
                                                <div>
                                                    <h3 className="font-medium">
                                                        {method.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {method.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <Radio
                                                checked={
                                                    data.selectedMethod ===
                                                    method.id
                                                }
                                                onChange={() =>
                                                    handleMethodSelect(
                                                        method.id
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 space-y-4 rounded-lg border">
                                    <Label
                                        htmlFor="memberPhone"
                                        value="เบอร์สมาชิกเพื่อสะสมแต้ม"
                                    />
                                    <TextInput
                                        id="memberPhone"
                                        type="tel"
                                        value={data.memberPhone}
                                        onChange={(e) =>
                                            setData(
                                                "memberPhone",
                                                e.target.value
                                            )
                                        }
                                        placeholder="กรอกเบอร์โทรศัพท์สมาชิก"
                                        className="mt-1"
                                    />
                                    {isMemberLoading && (
                                        <div className="flex justify-center">
                                            <Spinner />
                                        </div>
                                    )}
                                    {member && (
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-gray-700">
                                                    ชื่อสมาชิก:
                                                </span>
                                                <span className="text-base font-normal">
                                                    {member?.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-gray-700">
                                                    เบอร์โทรศัพท์:
                                                </span>
                                                <span className="text-base font-normal">
                                                    {member?.phone_number}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-gray-700">
                                                    วันเกิด:
                                                </span>
                                                <span className="text-base font-normal">
                                                    {new Date(
                                                        member?.birthdate
                                                    ).toLocaleDateString(
                                                        "th-TH",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-gray-700">
                                                    แต้มสะสม:
                                                </span>
                                                <span className="text-base font-normal">
                                                    {member?.loyalty_points}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {member && (
                                    <>
                                        <div className="p-4 mb-4 space-y-2 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between">
                                                <span>ยอดรวม:</span>
                                                <span>
                                                    ฿{subtotal.toFixed(2)}
                                                </span>
                                            </div>
                                            {cartDiscount > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>
                                                        {state.cart
                                                            .appliedPromotion
                                                            ? `ส่วนลดโปรโมชั่น (${state.cart.appliedPromotion.name})`
                                                            : "ส่วนลดจากโปรโมชั่น/คูปอง"}
                                                        :
                                                    </span>
                                                    <span>
                                                        -฿
                                                        {cartDiscount.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {pointDiscount > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>ส่วนลดจากแต้ม:</span>
                                                    <span>
                                                        -฿
                                                        {pointDiscount.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {totalDiscount > 0 && (
                                                <div className="flex justify-between pt-2 font-medium text-green-600 border-t">
                                                    <span>ส่วนลดทั้งหมด:</span>
                                                    <span>
                                                        -฿
                                                        {totalDiscount.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between pt-2 font-semibold border-t">
                                                <span>ยอดสุทธิ:</span>
                                                <span>฿{total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        {member &&
                                            member.loyalty_points /
                                                (pointPerThb
                                                    ? parseFloat(
                                                          pointPerThb.value
                                                      )
                                                    : 10) >=
                                                total && (
                                                <Button
                                                    size="sm"
                                                    color={
                                                        usePoints
                                                            ? "success"
                                                            : "light"
                                                    }
                                                    onClick={() => {
                                                        if (!usePoints) {
                                                            dispatch(
                                                                cartActions.applyPointDiscount(
                                                                    {
                                                                        amount: Math.ceil(
                                                                            total *
                                                                                (pointPerThb
                                                                                    ? parseFloat(
                                                                                          pointPerThb.value
                                                                                      )
                                                                                    : 10)
                                                                        ),
                                                                        point: total,
                                                                    }
                                                                )
                                                            );
                                                        } else {
                                                            dispatch(
                                                                cartActions.applyPointDiscount(
                                                                    {
                                                                        amount: 0,
                                                                        point: 0,
                                                                    }
                                                                )
                                                            );
                                                        }
                                                        setUsePoints(
                                                            !usePoints
                                                        );
                                                    }}
                                                    className="mb-2 w-full"
                                                >
                                                    ใช้แต้มทั้งหมด{" "}
                                                    {Math.ceil(
                                                        total *
                                                            (pointPerThb
                                                                ? parseFloat(
                                                                      pointPerThb.value
                                                                  )
                                                                : 10)
                                                    )}{" "}
                                                    แต้ม = ฿{total.toFixed(2)}
                                                </Button>
                                            )}
                                        <div className="grid grid-cols-3 gap-2">
                                            <Button
                                                onClick={() =>
                                                    handleUsePoints(100)
                                                }
                                                className="col-span-1 bg-blue-600 hover:bg-blue-700"
                                                disabled={
                                                    !member ||
                                                    member.loyalty_points < 100
                                                }
                                            >
                                                100 P = ฿
                                                {(
                                                    100 /
                                                    (pointPerThb
                                                        ? parseFloat(
                                                              pointPerThb.value
                                                          )
                                                        : 10)
                                                ).toFixed(2)}
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleUsePoints(200)
                                                }
                                                className="col-span-1 bg-blue-600 hover:bg-blue-700"
                                                disabled={
                                                    !member ||
                                                    member.loyalty_points < 200
                                                }
                                            >
                                                200 P = ฿
                                                {(
                                                    200 /
                                                    (pointPerThb
                                                        ? parseFloat(
                                                              pointPerThb.value
                                                          )
                                                        : 10)
                                                ).toFixed(2)}
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleUsePoints(300)
                                                }
                                                className="col-span-1 bg-blue-600 hover:bg-blue-700"
                                                disabled={
                                                    !member ||
                                                    member.loyalty_points < 300
                                                }
                                            >
                                                300 P = ฿
                                                {(
                                                    300 /
                                                    (pointPerThb
                                                        ? parseFloat(
                                                              pointPerThb.value
                                                          )
                                                        : 10)
                                                ).toFixed(2)}
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleUsePoints(400)
                                                }
                                                className="col-span-1 bg-blue-600 hover:bg-blue-700"
                                                disabled={
                                                    !member ||
                                                    member.loyalty_points < 400
                                                }
                                            >
                                                400 P = ฿
                                                {(
                                                    400 /
                                                    (pointPerThb
                                                        ? parseFloat(
                                                              pointPerThb.value
                                                          )
                                                        : 10)
                                                ).toFixed(2)}
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleUsePoints(500)
                                                }
                                                className="col-span-1 bg-blue-600 hover:bg-blue-700"
                                                disabled={
                                                    !member ||
                                                    member.loyalty_points < 500
                                                }
                                            >
                                                500 P = ฿
                                                {(
                                                    500 /
                                                    (pointPerThb
                                                        ? parseFloat(
                                                              pointPerThb.value
                                                          )
                                                        : 10)
                                                ).toFixed(2)}
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleUsePoints(1000)
                                                }
                                                className="col-span-1 bg-blue-600 hover:bg-blue-700"
                                                disabled={
                                                    !member ||
                                                    member.loyalty_points < 1000
                                                }
                                            >
                                                1000 P = ฿
                                                {(
                                                    1000 /
                                                    (pointPerThb
                                                        ? parseFloat(
                                                              pointPerThb.value
                                                          )
                                                        : 10)
                                                ).toFixed(2)}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        <Button
                            onClick={() => setIsSummary(!isSummary)}
                            className="px-4 py-2 w-full font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                            {isSummary ? "ย้อนกลับ" : "ดูรายละเอียด"}
                        </Button>

                        {isSummary && data.selectedMethod === "cash" && (
                            <div className="p-4 space-y-4 bg-gray-50 rounded-lg">
                                <div>
                                    <Label
                                        htmlFor="cash-received"
                                        value="รับเงินจากลูกค้า"
                                        className="mb-2"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <TextInput
                                            id="cash-received"
                                            type="text"
                                            value={data.cashReceived}
                                            onChange={(e) =>
                                                handleCashReceived(
                                                    e.target.value.replace(
                                                        /[^0-9.]/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            onFocus={handleCashFocus}
                                            onBlur={handleCashFocus}
                                            placeholder="กรอกจำนวนเงินที่รับจากลูกค้า"
                                            className="flex-1"
                                        />
                                        <span className="text-gray-500">
                                            บาท
                                        </span>
                                    </div>
                                </div>
                                {data.cashReceived > 0 && (
                                    <div className="grid grid-cols-2 gap-y-2 p-4 bg-white rounded-lg">
                                        <div className="font-medium">
                                            ยอดที่ต้องชำระ:
                                        </div>
                                        <div className="font-medium text-right">
                                            ฿{total.toFixed(2)}
                                        </div>

                                        <div>รับเงิน:</div>
                                        <div className="text-right text-green-600">
                                            ฿
                                            {parseFloat(
                                                data.cashReceived
                                            ).toFixed(2)}
                                        </div>

                                        <div>เงินทอน:</div>
                                        <div className="text-right text-blue-600">
                                            ฿
                                            {Math.max(
                                                0,
                                                parseFloat(data.cashReceived) -
                                                    total
                                            ).toFixed(2)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {isSummary && data.selectedMethod === "qr" && (
                            <div className="mt-4 space-y-4">
                                <div className="flex flex-col items-center p-4 space-y-4 bg-blue-50 rounded-lg">
                                    <ReactQrCode
                                        value={generatePayload(
                                            settings.find(
                                                (s) =>
                                                    s.key === "promptpay_number"
                                            )?.value || "",
                                            {
                                                amount: parseFloat(total),
                                            }
                                        )}
                                        size={256}
                                    />
                                    <div className="space-y-2 text-center">
                                        <p className="text-sm text-gray-600">
                                            สแกน QR Code เพื่อชำระเงิน
                                        </p>
                                        <p className="font-medium text-gray-800">
                                            PromptPay:{" "}
                                            {settings.find(
                                                (s) =>
                                                    s.key === "promptpay_number"
                                            )?.value || ""}
                                        </p>
                                        <p className="text-lg font-bold text-blue-600">
                                            ยอดชำระ: ฿{total}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        จำนวนเงินที่ได้รับ
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <TextInput
                                            type="text"
                                            value={data.cashReceived}
                                            onChange={(e) =>
                                                handleCashReceived(
                                                    e.target.value.replace(
                                                        /[^0-9.]/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            placeholder="กรอกจำนวนเงิน"
                                            className="flex-1"
                                        />
                                        <span className="text-gray-500">
                                            บาท
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label
                                        htmlFor="payment-file"
                                        value="แนบหลักฐานการโอน"
                                    />
                                    <FileInput
                                        id="payment-file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData(
                                                "paymentFile",
                                                e.target.files[0]
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="payment-note"
                                        value="หมายเหตุ (ถ้ามี)"
                                    />
                                    <TextInput
                                        id="payment-note"
                                        type="text"
                                        placeholder="กรอกหมายเหตุเพิ่มเติม"
                                        value={data.paymentNote}
                                        onChange={(e) =>
                                            setData(
                                                "paymentNote",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-gray-50 border-t">
                    <div className="flex justify-center space-x-3 w-full">
                        {data.cashReceived > 0 && (
                            <>
                                <Button onClick={onClose} color="gray">
                                    ยกเลิก
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    ยืนยันการชำระเงิน
                                </Button>
                            </>
                        )}
                    </div>
                </Modal.Footer>
            </Modal>

            <ReceiptModal
                show={showReceipt}
                onClose={() => setShowReceipt(false)}
                orderData={receipt}
            />
        </>
    );
};

export default PaymethodModal;
