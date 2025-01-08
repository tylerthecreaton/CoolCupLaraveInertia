import React, { useRef } from "react";
import { Button, Modal } from "flowbite-react";
import { Receipt, Printer, Download } from "lucide-react";

const ViewReceiptModal = ({ show, onClose, receiptUrl }) => {
    const handlePrint = () => {
        const printWindow = window.open(receiptUrl, '_blank');
        printWindow.onload = function() {
            printWindow.print();
        };
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = receiptUrl;
        link.download = `receipt-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            size="4xl"
            className="dark:bg-gray-800"
            dismissible
        >
            <Modal.Header className="border-b border-gray-200 !p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Receipt className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            ใบเสร็จรับเงิน
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            คุณสามารถพิมพ์หรือดาวน์โหลดใบเสร็จได้จากปุ่มด้านล่าง
                        </p>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body className="!p-0">
                <div className="bg-gray-100 p-6">
                    <div className="bg-white rounded-lg shadow-lg p-4 flex justify-center items-center" style={{ minHeight: '70vh' }}>
                        <img
                            src={receiptUrl}
                            alt="ใบเสร็จรับเงิน"
                            className="max-w-full h-auto rounded-lg"
                            style={{
                                maxHeight: '65vh',
                                objectFit: 'contain',
                                backgroundColor: 'white'
                            }}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-t border-gray-200 !p-6 bg-gray-50">
                <div className="w-full flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Button
                            size="sm"
                            color="gray"
                            onClick={handleDownload}
                            className="bg-white hover:bg-gray-100"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            ดาวน์โหลด
                        </Button>
                        <Button
                            size="sm"
                            color="blue"
                            onClick={handlePrint}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            พิมพ์ใบเสร็จ
                        </Button>
                    </div>
                    <Button
                        color="gray"
                        onClick={onClose}
                        className="bg-white hover:bg-gray-100"
                    >
                        ปิด
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewReceiptModal;
