import React from "react";
import { Modal, Button } from "flowbite-react";
import { Receipt, Printer } from "lucide-react";

const ViewReceiptModal = ({ show, onClose, receiptPath }) => {
    // สำหรับการพิมพ์เฉพาะส่วนใบเสร็จ
    const handlePrint = () => {
        const printWindow = window.open(`/images/receipt/${receiptPath}`, '_blank');
        printWindow.onload = function() {
            printWindow.print();
        };
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            size="xl"
        >
            <Modal.Header>
                <div className="flex items-center space-x-2">
                    <Receipt className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                        ใบเสร็จรับเงิน
                    </h3>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="relative w-full h-[600px]">
                    <img
                        src={`/images/receipt/${receiptPath}`}
                        alt="Receipt"
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-between w-full">
                    <Button color="gray" onClick={onClose}>
                        ปิด
                    </Button>
                    <Button color="gray" onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-2" />
                        พิมพ์ใบเสร็จ
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewReceiptModal;
