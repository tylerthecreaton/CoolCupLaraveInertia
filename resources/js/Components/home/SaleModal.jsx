import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";
export default function SaleModal({ show, onClose }) {
    return (
        <Modal show={show} onClose={onClose}>
            <Modal.Header>Sale</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col justify-center items-center p-4 rounded-b border-t border-gray-200 md:p-5 dark:border-gray-600">
                    <div className="flex flex-col justify-between items-center py-8 w-52 h-64 border">
                        <img
                            src="/images/1687847225574.jpg"
                            className="w-full"
                            alt=""
                        />
                        <p>ชาเขียว</p>
                    </div>
                    <div className="flex flex-col justify-center items-center pt-6 font-semibold">
                        ราคา
                        <div className="flex gap-4 justify-center items-center mt-4">
                            <button className="flex justify-center items-center w-8 h-8 font-bold bg-gray-200 rounded-full quantity-btn">
                                -
                            </button>
                            <span className="text-lg" id="quantity">
                                1
                            </span>
                            <button className="flex justify-center items-center w-8 h-8 font-bold bg-gray-200 rounded-full quantity-btn">
                                +
                            </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="mb-2 font-semibold text-center">ขนาด</h3>
                        <div className="flex gap-4 justify-center">
                            <button
                                className="px-4 py-2 rounded border size-btn"
                                data-size="S"
                            >
                                S (+0)
                            </button>
                            <button
                                className="px-4 py-2 rounded border size-btn"
                                data-size="M"
                            >
                                M (+5)
                            </button>
                            <button
                                className="px-4 py-2 rounded border size-btn"
                                data-size="L"
                            >
                                L (+10)
                            </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="mb-2 font-medium text-center">
                            ความหวาน
                        </h3>
                        <div className="flex flex-row gap-3 justify-between items-center py-6">
                            <button
                                className="px-4 py-2 rounded border sweetness-btn"
                                data-sweetness="0%"
                            >
                                0%
                            </button>
                            <button
                                className="px-4 py-2 rounded border sweetness-btn"
                                data-sweetness="25%"
                            >
                                25%
                            </button>
                            <button
                                className="px-4 py-2 rounded border sweetness-btn"
                                data-sweetness="50%"
                            >
                                50%
                            </button>
                            <button
                                className="px-4 py-2 rounded border sweetness-btn"
                                data-sweetness="75%"
                            >
                                75%
                            </button>
                            <button
                                className="px-4 py-2 rounded border sweetness-btn"
                                data-sweetness="100%"
                            >
                                100%
                            </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="mb-2 font-semibold text-center">
                            ท็อปปิ้ง
                        </h3>
                        <div className="flex flex-row gap-3 justify-between items-center py-6">
                            <button
                                className="px-4 py-2 rounded border topping-btn"
                                data-topping="ไข่มุก"
                            >
                                ไข่มุก
                            </button>
                            <button
                                className="px-4 py-2 rounded border topping-btn"
                                data-topping="ฟองนม"
                            >
                                ฟองนม
                            </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setShowSaleModal(false)}>
                    I accept
                </Button>
                <Button color="gray" onClick={() => setShowSaleModal(false)}>
                    Decline
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
