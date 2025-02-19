import React, { useEffect, useRef, useState } from "react";
import { Modal, Button } from "flowbite-react";
import { Receipt } from "lucide-react";
import html2canvas from 'html2canvas';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useGlobalState } from "@/Store/state";
import { clientScreenActions } from "@/Store/state/clientScreenState";

const ReceiptModal = ({ show, onClose, orderData }) => {
    const receiptRef = useRef(null);
    const [receiptUrl, setReceiptUrl] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [isSaving, setIsSaving] = React.useState(false);
    const { state, dispatch } = useGlobalState();
    const settings = state.app.settings || [];
    const vatRate = Array.isArray(settings) ? settings.find(setting => setting.key === 'vat_rate')?.value || 7 : 7;
    const taxpayerNumber = Array.isArray(settings) ? settings.find(setting => setting.key === 'taxpayer_number')?.value || '-' : '-';

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
            dispatch(clientScreenActions.showCustomerInfo(null));
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
            <div ref={receiptRef} className="p-8 bg-white receipt-content">
                {error && (
                    <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}
                {/* {receiptUrl && !error && (
                    <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">
                        Receipt saved successfully!
                    </div>
                )} */}
                <div className="p-6 mx-auto space-y-4 max-w-lg bg-white rounded-lg shadow-sm">
                    {/* ส่วนหัวใบเสร็จ */}
                    <div className="space-y-2 text-center">
                        <img src="/images/CoolCup Dicut.png" alt="Cool Cup Logo" className="mx-auto w-auto h-20 drop-shadow-md" />
                        <div>
                            <p className="mt-1 text-sm text-gray-600">สาขา: {orderData?.branch?.name || 'สาขาหลัก'}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p className="font-medium">ใบเสร็จรับเงิน/ใบกำกับภาษีอย่างย่อ</p>
                            <p className="text-xs">เลขประจำตัวผู้เสียภาษี: {taxpayerNumber}</p>
                            <p className="text-xs">ราคารวมภาษีมูลค่าเพิ่มแล้ว (VAT INCLUDED)</p>
                        </div>
                    </div>

                    {/* ข้อมูลใบเสร็จ */}
                    <div className="px-4 py-3 space-y-2 text-sm bg-gray-50 rounded-md">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">วันที่:</span>
                            <span className="font-medium">{formatDate(orderData?.created_at)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">เลขที่:</span>
                            <span className="font-medium">{orderData?.order_number}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">พนักงาน:</span>
                            <span className="font-medium">{orderData?.user?.name || '-'}</span>
                        </div>
                    </div>

                    {/* รายการสินค้า */}
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                                    <th className="px-3 py-2 font-medium text-left text-gray-700">รายการ</th>
                                    <th className="px-2 py-2 w-16 font-medium text-center text-gray-700">จำนวน</th>
                                    <th className="px-3 py-2 w-24 font-medium text-right text-gray-700">ราคา</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orderData?.order_details?.map((item, index) => (
                                    <tr
                                        key={item.id || index}
                                        className="transition duration-150 ease-in-out hover:bg-gray-50"
                                    >
                                        <td className="px-3 py-2">
                                            <div className="font-medium text-gray-800">{item.product_name}</div>
                                            {(item.size || item.sweetness || (item.toppings && item.toppings !== "[]")) && (
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {[
                                                        item.size && `ขนาด: ${item.size}`,
                                                        item.sweetness && `หวาน: ${item.sweetness}`,
                                                        item.toppings && item.toppings !== "[]" && `ท็อปปิ้ง: ${JSON.parse(item.toppings).map(topping => `${topping.name} (฿${topping.price})`).join(', ')}`,
                                                    ].filter(Boolean).join(" • ")}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <span className="inline-flex justify-center items-center w-5 h-5 text-xs font-medium text-blue-800 bg-blue-100 rounded">
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 font-medium text-right text-gray-900">
                                            ฿{Number(item.subtotal).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* สรุปยอด */}
                    <div className="space-y-2">
                        <div className="bg-gray-50 rounded-md p-3 space-y-1.5 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>รวมทั้งสิ้น</span>
                                <span className="font-medium">฿{Number(orderData?.total_amount || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>ส่วนลด</span>
                                <span className="text-red-600">-฿{Number(orderData?.discount_amount || 0).toFixed(2)}</span>
                            </div>
                            {/* คำนวณ VAT */}
                            {(() => {
                                const totalAfterDiscount = Number(orderData?.total_amount || 0) - Number(orderData?.discount_amount || 0);
                                const vatAmount = (totalAfterDiscount * vatRate) / (100 + Number(vatRate));
                                const priceBeforeVat = totalAfterDiscount - vatAmount;
                                return (
                                    <div className="border-t border-gray-200 pt-1.5">
                                        <div className="flex justify-between text-gray-600">
                                            <span>ราคาก่อน VAT</span>
                                            <span>฿{priceBeforeVat.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>VAT {vatRate}%</span>
                                            <span>฿{vatAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                );
                            })()}
                            <div className="border-t border-gray-200 pt-1.5">
                                <div className="flex justify-between text-base font-medium">
                                    <span>ยอดสุทธิ</span>
                                    <span className="text-blue-600">฿{Number(orderData?.final_amount || 0).toFixed(2)}</span>
                                </div>
                            </div>
                            {orderData?.payment_method === "cash" && (
                                <div className="border-t border-gray-200 pt-1.5 space-y-1">
                                    <div className="flex justify-between text-gray-600">
                                        <span>รับเงิน</span>
                                        <span>฿{Number(orderData?.cash || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>เงินทอน</span>
                                        <span>฿{(Number(orderData?.cash || 0) - Number(orderData?.final_amount || 0)).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* แต้มสะสม */}
                        <div className="p-3 space-y-2 text-sm bg-green-50 rounded-md">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-green-700">แต้มสะสมที่ได้รับ</span>
                                <span className="bg-green-100 px-2 py-0.5 rounded font-medium text-green-700">
                                    +{Number(orderData?.received_points || 0).toFixed(2)}
                                </span>
                            </div>
                            {orderData?.customer && (
                                <div className="pt-1.5 border-t border-green-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-700">แต้มสะสมทั้งหมด</span>
                                        <span className="font-medium text-green-700">
                                            {Number(orderData.customer.loyalty_points || 0).toFixed(2)} แต้ม
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ข้อมูลลูกค้า */}
                        {orderData?.customer && (
                            <div className="p-4 bg-gray-50 rounded-md">
                                <div className="pb-2 mb-3 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-gray-700">ข้อมูลลูกค้า</p>
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">ชื่อ-นามสกุล:</span>
                                        <span className="font-medium text-gray-800">{orderData.customer.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">หมายเลขโทรศัพท์:</span>
                                        <span className="font-medium text-gray-800">{orderData.customer.phone_number || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ส่วนท้ายใบเสร็จ */}
                    <div className="space-y-2 text-center">
                        <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-md">
                            <p className="text-sm">
                                ชำระโดย:{" "}
                                <span className="font-medium text-blue-600">
                                    {orderData?.payment_method === "cash"
                                        ? "เงินสด"
                                        : "พร้อมเพย์"}
                                </span>
                            </p>
                        </div>
                        <div className="text-gray-500 space-y-0.5 text-sm">
                            <p className="font-medium">ขอบคุณที่ใช้บริการ</p>
                            <p className="text-xs">Cool Cup</p>
                        </div>
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
                                    <svg className="mr-3 w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    กำลังบันทึก...
                                </>
                            ) : (
                                <>
                                    <Receipt className="mr-2 w-4 h-4" />
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
