import React from "react";
import { Button, Datepicker, Label, TextInput } from "flowbite-react";
import Swal from "sweetalert2";

export default function MainContent() {
    return (
        <main >
            <div className="w-full max-w-[1000px] mx-auto px-4 py-12 ">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">สมัครสมาชิก</h2>
                    <p className="text-base text-gray-600">กรุณากรอกข้อมูลให้ครบถ้วน</p>
                </div>

                <form className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
                    <div className="space-y-8">

                        <div className="relative">
                            <Label
                                htmlFor="name"
                                value="ชื่อ-นามสกุล"
                                className="block text-base font-medium text-gray-700 mb-2"
                            />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                placeholder="กรุณากรอกชื่อ-นามสกุล"
                                required
                                className="w-full focus:ring-2 focus:ring-green-500"
                                sizing="lg"
                            />
                        </div>


                        <div className="relative">
                            <Label
                                className="block text-base font-medium text-gray-700 mb-2"
                                htmlFor="phone_number"
                                value="เบอร์โทรศัพท์"
                            />
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <TextInput
                                        id="phone_number"
                                        type="number"
                                        name="phone_number"
                                        placeholder="กรุณากรอกเบอร์โทรศัพท์"
                                        required
                                        className="w-full focus:ring-2 focus:ring-green-500"
                                        sizing="lg"
                                    />
                                    <span className="mt-2 block text-sm"></span>
                                </div>
                                <Button
                                    type="button"
                                    color="success"
                                    size="lg"
                                    className="whitespace-nowrap px-8 hover:scale-105 transition-transform duration-200"
                                    onClick={() => {
                                        const phoneNumber = document.getElementById("phone_number").value;
                                        if (phoneNumber.length !== 10) {
                                            Swal.fire({
                                                title: "เบอร์โทรไม่ถูกต้อง",
                                                text: "เบอร์โทรต้องมี 10 หลัก",
                                                icon: "error",
                                                confirmButtonColor: '#10B981'
                                            });
                                        } else {
                                            Swal.fire({
                                                title: "ตรวจสอบเบอร์โทร",
                                                text: `เบอร์โทร ${phoneNumber} ถูกใช้งานแล้วหรือไม่`,
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonText: 'ตรวจสอบ',
                                                cancelButtonText: 'ยกเลิก',
                                                confirmButtonColor: '#10B981',
                                                cancelButtonColor: '#EF4444'
                                            }).then((result) => {
                                                const statusSpan = document.querySelector(`#phone_number + span`);
                                                const phoneInput = document.getElementById("phone_number");
                                                if (result.isConfirmed) {
                                                    statusSpan.innerHTML = `<div class="flex items-center gap-1">
                                                        <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                                        </svg>
                                                        <span>เบอร์มือถือ ${phoneNumber} สามารถใช้งานได้</span>
                                                    </div>`;
                                                    statusSpan.className = "mt-2 block text-sm text-green-600";
                                                    phoneInput.classList.remove('border-red-500', 'ring-red-500');
                                                    phoneInput.classList.add('!border-green-500', '!ring-1', '!ring-green-500');
                                                } else {
                                                    statusSpan.innerHTML = `<div class="flex items-center gap-1">
                                                        <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                                        </svg>
                                                        <span>เบอร์มือถือ ${phoneNumber} ไม่สามารถใช้งานได้</span>
                                                    </div>`;
                                                    statusSpan.className = "mt-2 block text-sm text-red-600";
                                                    phoneInput.classList.remove('border-green-500', 'ring-green-500');
                                                    phoneInput.classList.add('!border-red-500', '!ring-1', '!ring-red-500');
                                                }
                                            });
                                        }
                                    }}
                                >
                                    ตรวจสอบ
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <Label
                                className="block text-base font-medium text-gray-700 mb-2"
                                htmlFor="birthdate"
                                value="วัน/เดือน/ปีเกิด"
                            />
                            <Datepicker
                                language="th-Th"
                                labelTodayButton="วันนี้"
                                labelClearButton="ล้าง"
                                id="birthdate"
                                name="birthdate"
                                className="w-full focus:ring-2 focus:ring-green-500"
                                sizing="lg"
                                theme={{
                                    root: {
                                        base: "relative"
                                    },
                                    popup: {
                                        root: {
                                            base: "absolute top-10 z-50 block pt-2",
                                            inline: "relative top-0 z-auto",
                                        }
                                    }
                                }}
                            />
                        </div>


                        <div className="pt-4">
                            <Button
                                type="submit"
                                color="success"
                                size="lg"
                                className="w-full text-base font-medium hover:scale-[1.02] transform transition-transform duration-200 hover:shadow-lg"
                            >
                                ลงทะเบียน
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
