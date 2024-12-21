import React, { useState } from "react";
import {
    Modal,
    Button,
    Radio,
    TextInput,
    Label,
    FileInput,
} from "flowbite-react";
import { Banknote, QrCode, Receipt, CreditCard } from "lucide-react";
import Swal from "sweetalert2";

const PaymethodModal = ({
    show,
    onClose,
    onConfirm,
    total,
    dispatch,
    cartActions,
}) => {
    const [selectedMethod, setSelectedMethod] = useState("");
    const [cashReceived, setCashReceived] = useState("");
    const [showQR, setShowQR] = useState(false);
    const [paymentFile, setPaymentFile] = useState(null);
    const [paymentNote, setPaymentNote] = useState("");

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

    const handleMethodSelect = (methodId) => {
        setSelectedMethod(methodId);
        if (methodId === "promptpay") {
            setShowQR(true);
        } else {
            setShowQR(false);
        }
        setCashReceived("");
        setPaymentFile(null);
        setPaymentNote("");
    };

    const calculateChange = () => {
        const received = parseFloat(cashReceived);
        if (!received || received < total) return null;
        return (received - total).toFixed(2);
    };

    const handleConfirm = () => {
        if (!selectedMethod) {
            Swal.fire({
                title: "กรุณาเลือกวิธีการชำระเงิน",
                icon: "warning",
            });
            return;
        }

        if (selectedMethod === "cash") {
            const received = parseFloat(cashReceived);
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

        if (selectedMethod === "promptpay" && !paymentFile) {
            Swal.fire({
                title: "กรุณาแนบหลักฐานการโอนเงิน",
                icon: "warning",
            });
            return;
        }

        onConfirm({
            method: selectedMethod,
            cashReceived:
                selectedMethod === "cash" ? parseFloat(cashReceived) : null,
            change: selectedMethod === "cash" ? calculateChange() : null,
            paymentFile: selectedMethod === "promptpay" ? paymentFile : null,
            paymentNote: selectedMethod === "promptpay" ? paymentNote : null,
        });

        dispatch(cartActions.incrementOrderNumber());
    };

    return (
        <Modal show={show} onClose={onClose} size="lg">
            <Modal.Header className="border-b bg-gray-50">
                <div className="flex items-center space-x-2">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <span className="text-xl font-semibold">
                        เลือกวิธีการชำระเงิน
                    </span>
                </div>
            </Modal.Header>
            <Modal.Body className="p-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
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
                                    selectedMethod === method.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "hover:bg-gray-50"
                                }`}
                                onClick={() => handleMethodSelect(method.id)}
                            >
                                <div className="flex-1 flex items-center space-x-4">
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
                                    checked={selectedMethod === method.id}
                                    onChange={() =>
                                        handleMethodSelect(method.id)
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    {selectedMethod === "cash" && (
                        <div className="space-y-4 p-4 border rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    จำนวนเงินที่รับมา
                                </label>
                                <div className="flex items-center space-x-2">
                                    <TextInput
                                        type="number"
                                        value={cashReceived}
                                        onChange={(e) =>
                                            setCashReceived(e.target.value)
                                        }
                                        placeholder="กรอกจำนวนเงิน"
                                        className="flex-1"
                                    />
                                    <span className="text-gray-500">บาท</span>
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
                        </div>
                    )}

                    {selectedMethod === "promptpay" && (
                        <div className="space-y-4 mt-4">
                            <div className="flex flex-col items-center space-y-4 p-4 bg-blue-50 rounded-lg">
                                <img
                                    src="https://promptpay.io/0899999999.png"
                                    alt="QR Code"
                                    className="w-64 h-64"
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
                                <Label
                                    htmlFor="payment-file"
                                    value="แนบหลักฐานการโอน"
                                />
                                <FileInput
                                    id="payment-file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setPaymentFile(e.target.files[0])
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
                                    value={paymentNote}
                                    onChange={(e) =>
                                        setPaymentNote(e.target.value)
                                    }
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="border-t bg-gray-50">
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
    );
};

export default PaymethodModal;
