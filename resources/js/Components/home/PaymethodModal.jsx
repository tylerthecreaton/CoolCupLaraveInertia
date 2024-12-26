import React, { useState } from "react";
import {
    Modal,
    Button,
    Radio,
    TextInput,
    Label,
    FileInput,
} from "flowbite-react";
import { useForm } from "@inertiajs/react";

import { Banknote, QrCode, Receipt, CreditCard } from "lucide-react";
import Swal from "sweetalert2";

import generatePayload from "promptpay-qr";
import ReactQrCode from "react-qr-code";
import { useGlobalState } from "@/Store/state";
import { appActions } from "@/Store/state/appState";
import ReceiptModal from "./ReceiptModal";
import LoadingIndicator from "../LoadingIndicator";
import { MdOutlineSystemSecurityUpdateWarning } from "react-icons/md";
import UsePointModal from "./UsePointModal";

const PaymethodModal = ({ show, onClose, total, dispatch, cartActions }) => {
    const { state } = useGlobalState();
    const { data, post, setData, errors, processing } = useForm({
        selectedMethod: "cash",
        cashReceived: 0.0,
        showQR: false,
        paymentFile: null,
        paymentNote: "",
        cart: state.cart,
        memberPhone: "",
    });

    const [showReceipt, setShowReceipt] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [member, setMember] = useState(null);

    const paymentMethods = [
        {
            id: "cash",
            name: "เงินสด",
            icon: "banknotes",
            description: "ชำระด้วยเงินสด",
        },
        {
            id: "promptpay",
            name: "QR Promptpay",
            icon: "qr-code",
            description: "สแกน QR Code เพื่อชำระเงิน",
        },
    ];

    const handleSearchMember = async () => {
        const response = await axios.get(
            route("api.admin.member.memberWherePhoneNumber", {
                phoneNumber: data.memberPhone,
            })
        );
        setMember(response.data);
    };

    const handleMethodSelect = (methodId) => {
        setData("selectedMethod", methodId);
        if (methodId === "promptpay") {
            setData("showQR", true);
        } else {
            setData("showQR", false);
        }
        setData("cashReceived", "");
        setData("paymentFile", null);
        setData("paymentNote", "");
    };

    const calculateChange = () => {
        const received = parseFloat(data.cashReceived);
        if (!received || received < total) return null;
        return (received - total).toFixed(2);
    };

    const confirmOrder = async () => {
        const response = await axios.post(route("order.store"), {
            ...data,
            cart: state.cart,
        });
        if (response.status === 200) {
            Swal.fire({
                title: "สำเร็จ!",
                text: "ชำระเงินเรียบร้อยแล้ว",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
            dispatch(cartActions.clearCart());
            onClose();
            setReceipt(response.data);
            setShowReceipt(true);
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
            if (!received) {
                Swal.fire({
                    title: "กรุณากรอกจำนวนเงินที่รับมา",
                    icon: "warning",
                });
                return;
            }
            if (received < total) {
                Swal.fire({
                    title: "จำนวนเงินไม่เพียงพอ",
                    text: "กรุณาตรวจสอบจำนวนเงินอีกครั้ง",
                    icon: "error",
                });
                return;
            }
        }

        const newOrderData = {
            orderNumber: `ORD${new Date().getTime()}`,
            items: state.cart,
            total: total,
            paymentMethod: data.selectedMethod,
            cashReceived: data.cashReceived,
            memberPhone: data.memberPhone,
        };

        Swal.fire({
            title: "ยืนยันการชำระเงิน",
            text: `ยอดชำระ: ฿${total}`,
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
                                ฿{total}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                        data.selectedMethod === method.id
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
                                            data.selectedMethod === method.id
                                        }
                                        onChange={() =>
                                            handleMethodSelect(method.id)
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        {data.selectedMethod === "cash" && (
                            <div className="p-4 space-y-4 rounded-lg border">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        จำนวนเงินที่รับมา
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <TextInput
                                            type="number"
                                            value={data.cashReceived}
                                            onChange={(e) =>
                                                setData(
                                                    "cashReceived",
                                                    e.target.value
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
                                {calculateChange() !== null && (
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="font-medium text-green-700">
                                            เงินทอน:
                                        </span>
                                        <span className="text-lg font-bold text-green-700">
                                            ฿{calculateChange()}
                                        </span>
                                    </div>
                                )}
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
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (!data.memberPhone) {
                                                return Swal.fire({
                                                    title: "ไม่สำเร็จ",
                                                    text: "กรุณากรอกเบอร์โทรศัพท์สมาชิก",
                                                    icon: "error",
                                                });
                                            }

                                            handleSearchMember();
                                        }}
                                    >
                                        ค้นหา
                                    </Button>
                                </div>
                            </div>
                        )}

                        {data.selectedMethod === "promptpay" && (
                            <div className="mt-4 space-y-4">
                                <div className="flex flex-col items-center p-4 space-y-4 bg-blue-50 rounded-lg">
                                    {/* <img
                                        src="https://promptpay.io/0899999999.png"
                                        alt="QR Code"
                                        className="w-64 h-64"
                                    /> */}
                                    <ReactQrCode
                                        value={generatePayload("0942017100", {
                                            amount: total,
                                        })}
                                        size={256}
                                    />
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            สแกน QR Code เพื่อชำระเงิน
                                        </p>
                                        <p className="text-lg font-semibold text-blue-600">
                                            ยอดชำระ ฿{total}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        จำนวนเงินที่ได้รับ
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <TextInput
                                            type="number"
                                            value={data.cashReceived}
                                            onChange={(e) =>
                                                setData(
                                                    "cashReceived",
                                                    e.target.value
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
                                <div className="flex gap-2 justify-between">
                                    <Button type="button" onClick={() => {}}>
                                        ใช้แต้ม
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (!data.memberPhone) {
                                                return Swal.fire({
                                                    title: "ไม่สำเร็จ",
                                                    text: "กรุณากรอกเบอร์โทรศัพท์สมาชิก",
                                                    icon: "error",
                                                });
                                            }

                                            handleSearchMember();
                                        }}
                                    >
                                        ค้นหา
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-gray-50 border-t">
                    <div className="flex justify-center space-x-3 w-full">
                        <Button onClick={onClose} color="gray">
                            ยกเลิก
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            ยืนยันการชำระเงิน
                        </Button>
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
