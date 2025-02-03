import React, { useEffect } from "react";
import { Button, Datepicker, Label, TextInput } from "flowbite-react";
import Swal from "sweetalert2";
import { useForm, usePage } from "@inertiajs/react";

export default function MainContent() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone_number: '',
        birthdate: null,
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

    const handleCheckPhoneNumber = async () => {
        const response = await axios.post(route("member.checkPhoneNumber"), { phone_number: data.phone_number });
        handlePhoneCheckResult(response.data.exists);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("member.store"), {
            forceFormData: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'สมัครสมาชิกสําเร็จ',
                    text: 'คุณสามารถเข้าสู่ระบบได้',
                });
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'สมัครสมาชิกไม่สําเร็จ',
                    text: 'กรุณาลองใหม่อีกครั้ง',
                });
            },
        });
    };

    const handleDateChange = (date) => {
        setData('birthdate', date);
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

                <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
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
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="กรุณากรอกชื่อ-นามสกุล"
                                required
                                className="w-full transition-all duration-300"
                                sizing="lg"
                            />
                            {errors.name && <span className="text-red-500">{errors.name}</span>}
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
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
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
                                    onClick={handleCheckPhoneNumber}
                                >
                                    ตรวจสอบ
                                </Button>
                            </div>
                            {errors.phone_number && <span className="text-red-500">{errors.phone_number}</span>}
                        </div>

                        <div className="relative">
                            <Label
                                className="block text-base font-medium text-gray-700 mb-2"
                                htmlFor="birthdate"
                                value="วัน/เดือน/ปีเกิด"
                            />
                            <Datepicker
                                labelTodayButton="วันนี้"
                                labelClearButton="ล้าง"
                                id="birthdate"
                                name="birthdate"
                                value={data.birthdate}
                                onChange={handleDateChange}
                                className="w-full focus:ring-2 focus:ring-green-500"
                                sizing="lg"
                                maxDate={new Date()}
                                showmonthdropdown="true"
                                showyeardropdown="true"
                                dropdownmode="select"
                                dateformat="dd/MM/yyyy"
                                locale="th"
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
                            {errors.birthdate && <span className="text-red-500">{errors.birthdate}</span>}
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                color="success"
                                size="lg"
                                className="w-full text-base font-medium hover:scale-[1.02] transform transition-transform duration-200 hover:shadow-lg"
                                disabled={processing}
                            >
                                {processing ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
