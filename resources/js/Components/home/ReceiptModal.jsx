import React, { useEffect, useRef, useState } from "react";
import { Modal, Button } from "flowbite-react";
import { Receipt } from "lucide-react";
import html2canvas from 'html2canvas';
import axios from 'axios';
import Swal from 'sweetalert2';

const ReceiptModal = ({ show, onClose, orderData }) => {
    const receiptRef = useRef(null);
    const [receiptUrl, setReceiptUrl] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [isSaving, setIsSaving] = React.useState(false);
    
    // แสดงใบเสร็จตอนกด Button พิมพ์ใบเสร็จ
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                body * {
                    visibility: hidden;
                }
                .receipt-content {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .receipt-content, .receipt-content * {
                    visibility: visible;
                }
                .modal-footer {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    useEffect(() => {
        if (show && receiptRef.current && orderData?.id) {
            setTimeout(() => {
                captureAndSaveReceipt();
            }, 500);
        }
    }, [show, orderData]);

    const captureAndSaveReceipt = async () => {
        try {
            setError(null);
            console.log('Capturing receipt for order:', orderData);
            
            if (!orderData?.id) {
                console.error('No order ID available');
                return;
            }

            const canvas = await html2canvas(receiptRef.current);
            const imageData = canvas.toDataURL('image/png');

            console.log('Sending request with order ID:', orderData.id);
            const response = await axios.post('/receipt/store', {
                svgData: imageData,
                orderId: orderData.id
            });

            console.log('Receipt save response:', response.data);
            if (response.data.success) {
                setReceiptUrl(response.data.url);
            } else {
                setError(response.data.message || 'Failed to save receipt');
            }
        } catch (error) {
            console.error('Failed to save receipt:', error);
            setError(error.response?.data?.message || 'Failed to save receipt: Network error');
        }
    };

    const handleSaveReceipt = async () => {
        if (!receiptRef.current) return;

        setIsSaving(true);
        try {
            setError(null);
            console.log('Manually saving receipt for order:', orderData);
            
            if (!orderData?.id) {
                throw new Error('No order ID available');
            }

            const canvas = await html2canvas(receiptRef.current);
            const imageData = canvas.toDataURL('image/png');

            console.log('Sending request with order ID:', orderData.id);
            const response = await axios.post('/receipt/store', {
                svgData: imageData,
                orderId: orderData.id
            });

            console.log('Receipt save response:', response.data);
            if (response.data.success) {
                setReceiptUrl(response.data.url);
                Swal.fire({
                    title: 'บันทึกสำเร็จ',
                    text: 'บันทึกใบเสร็จเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                });
            } else {
                throw new Error(response.data.message || 'Failed to save receipt');
            }
        } catch (error) {
            console.error('Failed to save receipt:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: error.response?.data?.message || 'ไม่สามารถบันทึกใบเสร็จได้',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
        } finally {
            setIsSaving(false);
        }
    };

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
        <Modal
            show={show}
            onClose={onClose}
            size="xl"
        >
            <Modal.Header className="bg-gray-50 border-b">
                <div className="flex items-center space-x-2">
                    <Receipt className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                        ใบเสร็จรับเงิน
                    </h3>
                </div>
            </Modal.Header>
            <div ref={receiptRef} className="receipt-content bg-white p-8">
                {error && (
                    <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}
                {receiptUrl && !error && (
                    <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">
                        Receipt saved successfully!
                    </div>
                )}
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Cool Cup</h2>
                        <p className="text-gray-600">
                            ใบเสร็จรับเงิน/ใบกำกับภาษีอย่างย่อ
                        </p>
                        <p className="text-gray-600">
                            วันที่:{" "}
                            {formatDate(new Date(orderData?.created_at))}
                        </p>
                        <p className="text-gray-600">
                            เลขที่: {orderData?.order_number}
                        </p>
                    </div>
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
                                {orderData?.order_details?.map(
                                    (item, index) => (
                                        <tr
                                            key={item.id || index}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="py-2">
                                                <div>
                                                    {item.product_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.size && `ขนาด: ${item.size}`}
                                                    {item.sweetness && `, หวาน: ${item.sweetness}`}
                                                    {item.toppings && item.toppings !== "[]" &&
                                                        `, ท็อปปิ้ง: ${JSON.parse(item.toppings).join(", ")}`}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                {item.quantity}
                                            </td>
                                            <td className="text-right">
                                                ฿{Number(item.subtotal).toFixed(2)}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>รวมทั้งสิ้น</span>
                            <span className="font-bold">
                                ฿{Number(orderData?.total_amount || 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>ส่วนลด</span>
                            <span>
                                ฿{Number(orderData?.discount_amount || 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>ยอดสุทธิ</span>
                            <span>฿{Number(orderData?.final_amount || 0).toFixed(2)}</span>
                        </div>
                        {orderData?.payment_method === "cash" && (
                            <>
                                <div className="flex justify-between text-gray-600">
                                    <span>รับเงิน</span>
                                    <span>
                                        ฿{Number(orderData?.cash || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>เงินทอน</span>
                                    <span>
                                        ฿{(Number(orderData?.cash || 0) - Number(orderData?.final_amount || 0)).toFixed(2)}
                                    </span>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between text-gray-600">
                            <span>แต้มสะสม</span>
                            <span>+{Number(orderData?.received_points || 0).toFixed(2)}</span>
                        </div>
                        {orderData?.customer && (
                            <div className="mt-4 text-base text-gray-600">
                                <p>ลูกค้า: {orderData.customer.name || '-'}</p>
                                <p>เบอร์โทร: {orderData.customer.phone_number || '-'}</p>
                                <p>แต้มสะสมทั้งหมด: {Number(orderData.customer.loyalty_points || 0).toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                    <div className="text-center text-gray-600">
                        <p>
                            ชำระโดย:{" "}
                            {orderData?.payment_method === "cash"
                                ? "เงินสด"
                                : "พร้อมเพย์"}
                        </p>
                    </div>
                    <div className="text-sm text-center text-gray-600">
                        <p>ขอบคุณที่ใช้บริการ</p>
                        <p>Cool Cup</p>
                    </div>
                </div>
            </div>
            <Modal.Footer className="bg-gray-50 border-t modal-footer">
                <div className="flex justify-between w-full">
                    <Button color="gray" onClick={onClose}>
                        ปิด
                    </Button>
                    <div className="flex space-x-2">
                        <Button
                            color="gray"
                            onClick={() => window.print()}
                        >
                            พิมพ์ใบเสร็จ
                        </Button>
                        <Button
                            color="blue"
                            onClick={handleSaveReceipt}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    กำลังบันทึก...
                                </>
                            ) : (
                                <>
                                    <Receipt className="w-4 h-4 mr-2" />
                                    บันทึกใบเสร็จ
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ReceiptModal;
