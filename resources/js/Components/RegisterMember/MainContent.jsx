import React from "react";
import { Button, Datepicker, Label, TextInput } from "flowbite-react";
import Swal from "sweetalert2";
export default function MainContent() {
    return (
        <main className="flex-1 relative py-10">
            <form className="flex flex-col gap-4 mx-auto w-full max-w-screen-2xl bg-white bg-opacity-100 p-8 rounded-md">
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="name"
                            value="ชื่อ-นามสกุล"
                            className="text-base"
                        />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        placeholder="กรุณากรอกชื่อ-นามสกุล"
                        required
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <div className="mb-2 block">
                            <Label
                                className="text-base"
                                htmlFor="phone_number"
                                value="เบอร์โทรศัพท์"
                            />
                        </div>
                        <TextInput
                            id="phone_number"
                            type="number"
                            name="phone_number"
                            placeholder="กรุณากรอกเบอร์โทรศัพท์"
                            required
                            className={
                                document.getElementById("phone_number")?.value
                                    ?.length === 10 &&
                                document
                                    .querySelector(`#phone_number + span`)
                                    .textContent.includes("ใช้งานได้")
                                    ? "border-green-500"
                                    : ""
                            }
                        />
                    </div>
                    <Button
                        type="button"
                        color="success"
                        size="xl"
                        onClick={() => {
                            const phoneNumber = document.getElementById(
                                "phone_number"
                            ).value;
                            if (phoneNumber.length !== 10) {
                                Swal.fire({
                                    title: "เบอร์โทรไม่ถูกต้อง",
                                    text: "เบอร์โทรต้องมี 10 หลัก",
                                    icon: "error",
                                });
                            } else {
                                Swal.fire({
                                    title: "ตรวจสอบเบอร์โทร",
                                    text: `เบอร์โทร ${phoneNumber} ถูกใช้งานแล้วหรือไม่`,
                                    icon: "warning",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        document.querySelector(
                                            `#phone_number + span`
                                        ).innerHTML = `เบอร์โทร ${phoneNumber} ใช้งานได้`;
                                    } else {
                                        document.querySelector(
                                            `#phone_number + span`
                                        ).innerHTML = `เบอร์โทร ${phoneNumber} ไม่สามารถใช้งานได้`;
                                    }
                                });
                            }
                        }}
                    >
                        ตรวจสอบ
                    </Button>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label
                            className="text-base"
                            htmlFor="birthdate"
                            value="วัน/เดือน/ปีเกิด"
                        />
                    </div>
                    <Datepicker
                        language="th-Th"
                        labelTodayButton="วันนี้"
                        labelClearButton="ล้าง"
                        id="birthdate"
                        name="birthdate"
                        placeholder="กรุณากรอกวัน/เดือน/ปีเกิด"
                        required
                    />
                </div>
                <Button type="submit">สมัครสมาชิก</Button>
            </form>
        </main>
    );
}
