import React from "react";
import { Modal, Button } from "flowbite-react";
import { Receipt } from "lucide-react";

const ReceiptModal = ({ show, onClose, orderData }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Modal show={show} onClose={onClose} size="lg">
            <Modal.Header className="bg-gray-50 border-b">
                <div className="flex items-center space-x-2">
                    <Receipt className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                        ใบเสร็จรับเงิน
                    </h3>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    {/* Header Information */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Cool Cup</h2>
                        <p className="text-gray-600">
                            ใบเสร็จรับเงิน/ใบกำกับภาษีอย่างย่อ
                        </p>
                        <p className="text-gray-600">
                            วันที่: {formatDate(new Date())}
                        </p>
                        <p className="text-gray-600">
                            เลขที่: {orderData?.orderNumber}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div className="py-4 border-t border-b">
                        <table className="w-full">
                            <thead>
                                <tr className="text-gray-600">
                                    <th className="text-left">รายการ</th>
                                    <th className="text-center">จำนวน</th>
                                    <th className="text-right">ราคา</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderData?.items?.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="py-2">
                                            {item.name}
                                        </td>
                                        <td className="text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="text-right">
                                            ฿
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Total Section */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>รวมทั้งสิ้น</span>
                            <span className="font-bold">
                                ฿{orderData?.total.toFixed(2)}
                            </span>
                        </div>
                        {orderData?.paymentMethod === "cash" && (
                            <>
                                <div className="flex justify-between text-gray-600">
                                    <span>รับเงิน</span>
                                    <span>
                                        ฿
                                        {parseFloat(
                                            orderData?.cashReceived
                                        ).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>เงินทอน</span>
                                    <span>
                                        ฿
                                        {(
                                            orderData?.cashReceived -
                                            orderData?.total
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="text-center text-gray-600">
                        <p>
                            ชำระโดย:{" "}
                            {orderData?.paymentMethod === "cash"
                                ? "เงินสด"
                                : "พร้อมเพย์"}
                        </p>
                        {orderData?.memberPhone && (
                            <p>เบอร์สมาชิก: {orderData?.memberPhone}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="text-sm text-center text-gray-600">
                        <p>ขอบคุณที่ใช้บริการ</p>
                        <p>Cool Cup</p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="bg-gray-50 border-t">
                <div className="flex justify-center space-x-3 w-full">
                    <Button
                        onClick={onClose}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        ปิด
                    </Button>
                    <Button
                        onClick={() => window.print()}
                        className="bg-gray-600 hover:bg-gray-700"
                    >
                        พิมพ์ใบเสร็จ
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ReceiptModal;
