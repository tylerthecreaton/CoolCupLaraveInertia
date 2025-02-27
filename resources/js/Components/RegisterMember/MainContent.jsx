import React, { useEffect, useState, forwardRef } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import Swal from "sweetalert2";
import { useForm, usePage } from "@inertiajs/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);
dayjs.locale('th');

// Custom header for the datepicker to display Buddhist Era years
const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
}) => {
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 80 + i);
    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    return (
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b border-gray-200">
            <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="p-2 text-green-700 rounded-full transition-colors duration-200 hover:bg-green-100 disabled:opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </button>
            <div className="flex space-x-2">
                <select
                    value={date.getMonth()}
                    onChange={({ target: { value } }) => changeMonth(value)}
                    className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                >
                    {months.map((month, i) => (
                        <option key={i} value={i}>
                            {month}
                        </option>
                    ))}
                </select>
                <select
                    value={date.getFullYear()}
                    onChange={({ target: { value } }) => changeYear(value)}
                    className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year + 543}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="p-2 text-green-700 rounded-full transition-colors duration-200 hover:bg-green-100 disabled:opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

// Custom input component for the datepicker
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="relative">
        <input
            ref={ref}
            onClick={onClick}
            value={value}
            readOnly
            placeholder={placeholder}
            className="px-5 py-3 pr-12 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-400"
        />
        <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
        </div>
    </div>
));

CustomInput.displayName = 'CustomInput';

export default function MainContent() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        phone_number: "",
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
                icon: "error",
                title: "เบอร์นี้มีผู้ใช้งานแล้ว",
                text: "กรุณาใช้เบอร์อื่น",
                confirmButtonColor: '#10b981',
            });
            return;
        } else {
            Swal.fire({
                icon: "success",
                title: "สามารถใช้เบอร์นี้ได้",
                text: "คุณสามารถใช้เบอร์นี้ได้",
                confirmButtonColor: '#10b981',
            });
        }
    };

    const handleCheckPhoneNumber = async () => {
        const response = await axios.post(route("member.checkPhoneNumber"), {
            phone_number: data.phone_number,
        });
        handlePhoneCheckResult(response.data.exists);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("member.store"), {
            forceFormData: true,
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "สมัครสมาชิกสําเร็จ",
                    text: "คุณสามารถเข้าสู่ระบบได้",
                    confirmButtonColor: '#10b981',
                });
            },
            onError: (errors) => {
                Swal.fire({
                    icon: "error",
                    title: "สมัครสมาชิกไม่สําเร็จ",
                    text: "กรุณาลองใหม่อีกครั้ง",
                    confirmButtonColor: '#10b981',
                });
            },
        });
    };

    const handleDateChange = (date) => {
        setData("birthdate", date);
    };

    // Format date to display in Thai Buddhist Era
    const formatDate = (date) => {
        if (!date) return "";
        return dayjs(date).format('DD MMMM') + ' พ.ศ. ' + (dayjs(date).year() + 543);
    };

    // Add custom styles for the datepicker
    useEffect(() => {
        // Add custom CSS for the datepicker
        const style = document.createElement('style');
        style.innerHTML = `
            .react-datepicker {
                font-family: 'Kanit', sans-serif;
                border-radius: 0.75rem;
                border: 1px solid #e5e7eb;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                overflow: hidden;
            }
            .react-datepicker__day--selected {
                background-color: #10b981 !important;
                border-radius: 0.375rem;
                color: white !important;
                font-weight: bold;
            }
            .react-datepicker__day:hover {
                background-color: #d1fae5 !important;
                border-radius: 0.375rem;
                color: #047857 !important;
            }
            .react-datepicker__day--today {
                font-weight: bold;
                color: #10b981;
                position: relative;
            }
            .react-datepicker__day--today::after {
                content: '';
                position: absolute;
                bottom: 2px;
                left: 50%;
                transform: translateX(-50%);
                width: 4px;
                height: 4px;
                background-color: #10b981;
                border-radius: 50%;
            }
            .react-datepicker__day--outside-month {
                color: #9ca3af;
            }
            .react-datepicker__header {
                background-color: #f9fafb;
                border-bottom: 1px solid #e5e7eb;
                padding-top: 12px;
                padding-bottom: 8px;
            }
            .react-datepicker__day-name {
                color: #4b5563;
                font-weight: 500;
                margin: 0.4rem;
            }
            .react-datepicker__day {
                margin: 0.4rem;
                width: 2rem;
                height: 2rem;
                line-height: 2rem;
                border-radius: 0.375rem;
                transition: all 0.2s ease;
            }
            .react-datepicker__triangle {
                display: none;
            }
            .datepicker-popper {
                z-index: 40 !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <main className="px-4 py-12 min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
            <div className="w-full max-w-[1000px] mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold tracking-tight text-transparent text-gray-900 bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                        สมัครสมาชิก
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
                        กรุณากรอกข้อมูลให้ครบถ้วนเพื่อสมัครสมาชิกและรับสิทธิประโยชน์
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-8 rounded-3xl border border-emerald-100 shadow-2xl backdrop-filter backdrop-blur-sm transition-all duration-300 bg-white/90 md:p-12 hover:shadow-emerald-100"
                >
                    <div className="space-y-8">
                        <div className="relative group">
                            <Label
                                htmlFor="name"
                                value="ชื่อ-นามสกุล"
                                className="block mb-2 text-base font-medium text-gray-700 transition-colors duration-200 group-hover:text-emerald-700"
                            />
                            <TextInput
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="กรุณากรอกชื่อ-นามสกุล"
                                required
                                className="w-full shadow-sm transition-all duration-300 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-400"
                                sizing="lg"

                            />
                            {errors.name && (
                                <span className="block mt-2 text-base text-red-500">
                                    Oop!! {errors.name}
                                </span>
                            )}
                        </div>

                        <div className="relative group">
                            <Label
                                className="block mb-2 text-base font-medium text-gray-700 transition-colors duration-200 group-hover:text-emerald-700"
                                htmlFor="phone_number"
                                value="เบอร์โทรศัพท์"
                            />
                            <div className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <TextInput
                                        id="phone_number"
                                        type="number"
                                        value={data.phone_number}
                                        onChange={(e) =>
                                            setData(
                                                "phone_number",
                                                e.target.value
                                            )
                                        }
                                        placeholder="กรุณากรอกเบอร์โทรศัพท์"
                                        required
                                        className="w-full shadow-sm transition-all duration-300 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-400"
                                        sizing="lg"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    color="success"
                                    size="lg"
                                    className="px-8 font-medium whitespace-nowrap bg-emerald-600 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-emerald-700 focus:ring-emerald-500"
                                    onClick={handleCheckPhoneNumber}
                                >
                                    ตรวจสอบ
                                </Button>
                            </div>
                            {errors.phone_number && (
                                <span className="block mt-2 text-base text-red-500">
                                    Oop!! {errors.phone_number}
                                </span>
                            )}
                        </div>

                        <div className="relative group">
                            <Label
                                className="block mb-2 text-base font-medium text-gray-700 transition-colors duration-200 group-hover:text-emerald-700"
                                htmlFor="birthdate"
                                value="วัน/เดือน/ปีเกิด"
                            />
                            <div className="w-full">
                                <DatePicker
                                    id="birthdate"
                                    selected={data.birthdate}
                                    onChange={handleDateChange}
                                    dateFormat="dd MMMM yyyy"
                                    renderCustomHeader={CustomHeader}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    maxDate={new Date()}
                                    placeholderText="เลือกวันเกิด"
                                    className="w-full shadow-sm transition-all duration-300 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-400"
                                    customInput={<CustomInput />}
                                    formatWeekDay={(day) => day.substring(0, 3)}
                                    popperClassName="datepicker-popper"
                                    popperPlacement="bottom-start"
                                    popperModifiers={[
                                        {
                                            name: "offset",
                                            options: {
                                                offset: [0, 8],
                                            },
                                        },
                                        {
                                            name: "preventOverflow",
                                            options: {
                                                rootBoundary: "viewport",
                                                tether: false,
                                                altAxis: true,
                                            },
                                        },
                                    ]}
                                />
                            </div>
                            {errors.birthdate && (
                                <span className="block mt-2 text-base text-red-500">
                                    {errors.birthdate}
                                </span>
                            )}
                        </div>

                        <div className="pt-8">
                            <Button
                                type="submit"
                                color="success"
                                size="lg"
                                className="w-full text-base font-medium hover:scale-[1.02] transform transition-transform duration-200 hover:shadow-lg py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex justify-center items-center">
                                        <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        กำลังสมัคร...
                                    </div>
                                ) : (
                                    "สมัครสมาชิก"
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
