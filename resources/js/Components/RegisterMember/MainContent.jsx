import React, { useEffect } from "react";
import { Button, Datepicker, Label, TextInput } from "flowbite-react";
import Swal from "sweetalert2";
import { router, usePage } from "@inertiajs/react";

export default function MainContent() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.phoneCheck) {
            handlePhoneCheckResult(flash.phoneCheck.exists);
        }
    }, [flash.phoneCheck]);

    const handlePhoneCheckResult = (exists) => {
        const statusSpan = document.querySelector(`#phone_number + span`);
        const phoneInput = document.getElementById("phone_number");

        if (exists) {
            Swal.fire({
                title: '<span class="text-red-500">เบอร์โทรถูกใช้งานแล้ว</span>',
                html: '<div class="text-gray-600">กรุณาใช้เบอร์โทรอื่นในการสมัครสมาชิก</div>',
                icon: "error",
                confirmButtonColor: "#10B981",
                confirmButtonText: "ตกลง",
                customClass: {
                    popup: 'rounded-xl shadow-xl',
                    title: 'text-xl font-semibold',
                    htmlContainer: 'text-base'
                }
            });
            statusSpan.innerHTML = `
                <div class="flex items-center gap-2 text-red-600 animate-fade-in">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <span class="font-medium">เบอร์โทรนี้ถูกใช้งานแล้ว</span>
                </div>`;
            phoneInput.className = "w-full focus:ring-2 focus:ring-red-500 border-red-500 transition-all duration-300";
        } else {
            Swal.fire({
                title: '<span class="text-green-500">เบอร์โทรสามารถใช้งานได้</span>',
                html: '<div class="text-gray-600">คุณสามารถใช้เบอร์โทรนี้ในการสมัครสมาชิก</div>',
                icon: "success",
                confirmButtonColor: "#10B981",
                confirmButtonText: "ตกลง",
                customClass: {
                    popup: 'rounded-xl shadow-xl',
                    title: 'text-xl font-semibold',
                    htmlContainer: 'text-base'
                }
            });
            statusSpan.innerHTML = `
                <div class="flex items-center gap-2 text-green-600 animate-fade-in">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span class="font-medium">เบอร์โทรนี้สามารถใช้งานได้</span>
                </div>`;
            phoneInput.className = "w-full focus:ring-2 focus:ring-green-500 border-green-500 transition-all duration-300";
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="w-full max-w-[1000px] mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        สมัครสมาชิก
                    </h2>
                    <p className="text-base text-gray-600">
                        กรุณากรอกข้อมูลให้ครบถ้วน
                    </p>
                </div>

                <form className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
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
                                className="w-full transition-all duration-300"
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
                                        className="w-full transition-all duration-300"
                                        sizing="lg"
                                    />
                                    <span className="mt-2 block text-sm"></span>
                                </div>
                                <Button
                                    type="button"
                                    color="success"
                                    size="lg"
                                    className="whitespace-nowrap px-8 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                                    onClick={() => {
                                        const phoneNumber =
                                            document.getElementById(
                                                "phone_number"
                                            ).value;
                                        if (phoneNumber.length !== 10) {
                                            Swal.fire({
                                                title: '<span class="text-red-500">เบอร์โทรไม่ถูกต้อง</span>',
                                                html: '<div class="text-gray-600">เบอร์โทรต้องมี 10 หลัก</div>',
                                                icon: "error",
                                                confirmButtonColor: "#10B981",
                                                confirmButtonText: "ตกลง",
                                                customClass: {
                                                    popup: 'rounded-xl shadow-xl',
                                                    title: 'text-xl font-semibold',
                                                    htmlContainer: 'text-base'
                                                }
                                            });
                                        } else {
                                            Swal.fire({
                                                title: '<span class="text-gray-700 font-semibold">ตรวจสอบเบอร์โทร</span>',
                                                html: `<div class="text-gray-600">เบอร์โทร <span class="font-medium text-gray-800">${phoneNumber}</span> ถูกใช้งานแล้วหรือไม่</div>`,
                                                icon: "question",
                                                showCancelButton: true,
                                                confirmButtonText: 'ตรวจสอบ',
                                                cancelButtonText: 'ยกเลิก',
                                                confirmButtonColor: '#10B981',
                                                cancelButtonColor: '#EF4444',
                                                customClass: {
                                                    popup: 'rounded-xl shadow-xl',
                                                    title: 'text-xl',
                                                    htmlContainer: 'text-base my-4',
                                                    confirmButton: 'px-6 py-2.5',
                                                    cancelButton: 'px-6 py-2.5',
                                                    actions: 'gap-3'
                                                }
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    Swal.fire({
                                                        title: '<span class="text-gray-700">กำลังตรวจสอบ...</span>',
                                                        html: `<div class="text-gray-600">กำลังตรวจสอบเบอร์โทร <span class="font-medium text-gray-800">${phoneNumber}</span></div>`,
                                                        allowOutsideClick: false,
                                                        allowEscapeKey: false,
                                                        showConfirmButton: false,
                                                        customClass: {
                                                            popup: 'rounded-xl shadow-xl',
                                                            title: 'text-xl font-semibold',
                                                            htmlContainer: 'text-base my-4'
                                                        },
                                                        didOpen: () => {
                                                            Swal.showLoading();
                                                        }
                                                    });

                                                    router.post(
                                                        "/api/check-phone",
                                                        {
                                                            phone_number: phoneNumber,
                                                        },
                                                        {
                                                            preserveScroll: true,
                                                            onSuccess: () => {},
                                                            onError: (errors) => {
                                                                Swal.close();

                                                                Swal.fire({
                                                                    title: '<span class="text-red-500">เกิดข้อผิดพลาด</span>',
                                                                    html: '<div class="text-gray-600">ไม่สามารถตรวจสอบเบอร์โทรได้ กรุณาลองใหม่อีกครั้ง</div>',
                                                                    icon: "error",
                                                                    confirmButtonColor: "#10B981",
                                                                    confirmButtonText: "ตกลง",
                                                                    customClass: {
                                                                        popup: 'rounded-xl shadow-xl',
                                                                        title: 'text-xl font-semibold',
                                                                        htmlContainer: 'text-base my-4',
                                                                        confirmButton: 'px-6 py-2.5'
                                                                    }
                                                                });
                                                                const statusSpan = document.querySelector(`#phone_number + span`);
                                                                const phoneInput = document.getElementById("phone_number");
                                                                statusSpan.innerHTML = `
                                                                    <div class="flex items-center gap-2 text-red-600 animate-fade-in">
                                                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                                                        </svg>
                                                                        <span class="font-medium">ไม่สามารถตรวจสอบเบอร์โทรได้</span>
                                                                    </div>`;
                                                                phoneInput.className = "w-full focus:ring-2 focus:ring-red-500 border-red-500 transition-all duration-300";
                                                            },
                                                            onFinish: () => {
                                                                // Ensure loading state is cleared if something unexpected happens
                                                                if (
                                                                    Swal.isVisible() &&
                                                                    Swal.getTitle()?.textContent === "กำลังตรวจสอบ..."
                                                                ) {
                                                                    Swal.close();
                                                                }
                                                            },
                                                        }
                                                    );
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
                                        base: "relative",
                                    },
                                    popup: {
                                        root: {
                                            base: "absolute top-10 z-50 block pt-2",
                                            inline: "relative top-0 z-auto",
                                        },
                                    },
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
                                สมัครสมาชิก
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
