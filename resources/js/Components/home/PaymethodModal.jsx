import React, { useState } from "react";
import { Modal, Button, Label, Radio } from "flowbite-react";
import { CreditCard, Wallet } from "lucide-react";

const PaymethodModal = ({ show, onClose, onConfirm, total }) => {
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const handleConfirm = () => {
        onConfirm(paymentMethod);
        onClose();
    };

    return (
        <Modal 
            show={show} 
            onClose={onClose} 
            size="md" 
            popup={true}
        >
            <Modal.Header>เลือกวิธีการชำระเงิน</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Radio
                            id="cash"
                            name="payment"
                            value="cash"
                            checked={paymentMethod === "cash"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <Label htmlFor="cash" className="flex items-center gap-2">
                            <Wallet className="w-5 h-5" />
                            <span>เงินสด</span>
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Radio
                            id="credit"
                            name="payment"
                            value="credit"
                            checked={paymentMethod === "credit"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <Label htmlFor="credit" className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            <span>บัตรเครดิต/เดบิต</span>
                        </Label>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold flex justify-between">
                            <span>ยอดชำระ:</span>
                            <span>฿{total}</span>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="w-full flex justify-end gap-3">
                    <Button color="gray" onClick={onClose}>
                        ยกเลิก
                    </Button>
                    <Button onClick={handleConfirm}>
                        ยืนยันการชำระเงิน
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymethodModal;
