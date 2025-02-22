import { useForm, usePage } from "@inertiajs/react";
import { Button, Label, TextInput, Card } from "flowbite-react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import { HiPhone, HiUser, HiCalendar, HiCheck } from "react-icons/hi";

export default function CustomersForm({ isEditing = false, customer = null, errors = {} }) {
    const { flash } = usePage().props;
    const [phoneError, setPhoneError] = useState("");
    const { data, setData, post, put, processing } = useForm({
        name: isEditing ? customer.name : "",
        phone_number: isEditing ? customer.phone_number : "",
        birthdate: isEditing ? customer.birthdate : "",
    });

    useEffect(() => {
        if (flash.phoneCheck) {
            handlePhoneCheckResult(flash.phoneCheck.exists);
        }
    }, [flash.phoneCheck]);

    const handlePhoneCheckResult = (exists) => {
        if (exists) {
            Swal.fire({
                icon: 'error',
                title: 'เบอร์นี้มีผู้ใช้งานแล้ว',
                text: 'กรุณาใช้เบอร์อื่น',
            });
            return;
        } else {
            Swal.fire({
                icon: 'success',
                title: 'สามารถใช้เบอร์นี้ได้',
                text: 'คุณสามารถใช้เบอร์นี้ได้',
            });
        }
    };

    const validatePhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return false;
        // Remove any spaces or dashes
        const cleanPhone = phoneNumber.replace(/[\s-]/g, '');
        
        // Check if it's a valid Thai mobile number (10 digits starting with 06, 08, or 09)
        const mobilePattern = /^(06|08|09)\d{8}$/;
        
        // Check if it's a valid Thai landline number (9 digits starting with 0)
        const landlinePattern = /^0\d{8}$/;
        
        return mobilePattern.test(cleanPhone) || landlinePattern.test(cleanPhone);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setData("phone_number", value);
        
        if (!value) {
            setPhoneError("กรุณากรอกเบอร์โทรศัพท์");
        } else if (value.length < 9) {
            setPhoneError("กรุณากรอกเบอร์โทรให้ครบ (เบอร์มือถือ 10 หลัก หรือเบอร์บ้าน 9 หลัก)");
        } else if (!validatePhoneNumber(value)) {
            setPhoneError("รูปแบบเบอร์โทรไม่ถูกต้อง (เบอร์มือถือขึ้นต้นด้วย 06, 08, 09)");
        } else {
            setPhoneError("");
        }
    };

    const handleCheckPhoneNumber = async () => {
        if (!data.phone_number) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกเบอร์โทรศัพท์',
                text: 'กรุณากรอกเบอร์โทรศัพท์ก่อนตรวจสอบ',
            });
            return;
        }

        if (!validatePhoneNumber(data.phone_number)) {
            Swal.fire({
                icon: 'error',
                title: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง',
                text: 'กรุณากรอกเบอร์มือถือ 10 หลัก (06,08,09) หรือเบอร์บ้าน 9 หลัก',
            });
            return;
        }

        try {
            const response = await axios.post(route("member.checkPhoneNumber"), {
                phone_number: data.phone_number,
                exclude_id: isEditing ? customer.id : null
            });
            handlePhoneCheckResult(response.data.exists);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถตรวจสอบเบอร์โทรศัพท์ได้',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.phone_number) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกเบอร์โทรศัพท์',
                text: 'กรุณากรอกเบอร์โทรศัพท์ก่อนบันทึก',
            });
            return;
        }

        if (!validatePhoneNumber(data.phone_number)) {
            Swal.fire({
                icon: 'error',
                title: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง',
                text: 'กรุณากรอกเบอร์มือถือ 10 หลัก (06,08,09) หรือเบอร์บ้าน 9 หลัก',
            });
            return;
        }

        // Skip phone number check if editing and phone number hasn't changed
        if (!isEditing || (isEditing && data.phone_number !== customer.phone_number)) {
            try {
                const response = await axios.post(route("member.checkPhoneNumber"), {
                    phone_number: data.phone_number,
                    exclude_id: isEditing ? customer.id : null
                });

                if (response.data.exists) {
                    Swal.fire({
                        icon: 'error',
                        title: 'เบอร์นี้มีผู้ใช้งานแล้ว',
                        text: 'กรุณาใช้เบอร์อื่น',
                    });
                    return;
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถตรวจสอบเบอร์โทรศัพท์ได้',
                });
                return;
            }
        }

        // ดำเนินการ submit form หลังจากตรวจสอบเบอร์โทรศัพท์แล้ว
        if (isEditing) {
            put(route("admin.customers.update", customer.id), data, {
                forceFormData: true,
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'แก้ไขข้อมูลสำเร็จ',
                        text: 'ข้อมูลลูกค้าถูกแก้ไขเรียบร้อยแล้ว',
                    });
                },
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'แก้ไขข้อมูลไม่สำเร็จ',
                        text: 'กรุณาลองใหม่อีกครั้ง',
                    });
                },
            });
        } else {
            post(route("admin.customers.store"), data, {
                forceFormData: true,
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'เพิ่มข้อมูลสำเร็จ',
                        text: 'ข้อมูลลูกค้าถูกเพิ่มเรียบร้อยแล้ว',
                    });
                },
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'เพิ่มข้อมูลไม่สำเร็จ',
                        text: 'กรุณาลองใหม่อีกครั้ง',
                    });
                },
            });
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="name" value="ชื่อ-นามสกุล" />
                        </div>
                        <TextInput
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="กรุณากรอกชื่อ-นามสกุล"
                            required
                            icon={HiUser}
                            color={errors.name ? "failure" : "gray"}
                            helperText={errors?.name && (
                                <>
                                  <span className="font-medium">Oops!</span> {errors.name}
                                </>
                              )}
                        />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="phone_number" value="เบอร์โทรศัพท์" />
                        </div>
                        <div className="flex gap-2">
                            <TextInput
                                id="phone_number"
                                type="tel"
                                value={data.phone_number}
                                onChange={handlePhoneChange}
                                placeholder="กรุณากรอกเบอร์โทรศัพท์"
                                required
                                icon={HiPhone}
                                color={phoneError || errors?.phone_number ? "failure" : "gray"}
                                className="flex-1"
                            />

                            <Button
                                type="button"
                                onClick={handleCheckPhoneNumber}
                                disabled={!data.phone_number || phoneError}
                                color="light"
                            >
                                ตรวจสอบเบอร์
                            </Button>
                        </div>
                        {(phoneError || errors?.phone_number) && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                <span className="font-medium">Oops!</span> {phoneError || errors.phone_number}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="birthdate" value="วันเกิด" />
                        </div>
                        <TextInput
                            id="birthdate"
                            type="date"
                            value={data.birthdate}
                            onChange={(e) => setData("birthdate", e.target.value)}
                            placeholder="เลือกวันเกิด"
                            required
                            icon={HiCalendar}
                            color={errors.birthdate ? "failure" : "gray"}
                            helperText={errors?.birthdate && (
                                <>
                                  <span className="font-medium">Oops!</span> {errors.birthdate}
                                </>
                              )}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            color="success"
                        >
                            <HiCheck className="mr-2 h-5 w-5" />
                            {isEditing ? "บันทึกการแก้ไข" : "เพิ่มลูกค้า"}
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    );
}
