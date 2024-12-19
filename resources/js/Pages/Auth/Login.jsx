import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi";
import Swal from "sweetalert2";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Show loading alert
        Swal.fire({
            title: 'กำลังเข้าสู่ระบบ',
            html: 'กรุณารอสักครู่...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        post(route("login"), {
            onSuccess: () => {
                Swal.fire({
                    title: 'เข้าสู่ระบบสำเร็จ',
                    text: 'ยินดีต้อนรับกลับ!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'เข้าสู่ระบบไม่สำเร็จ',
                    text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
                    icon: 'error',
                    confirmButtonText: 'ลองใหม่',
                    confirmButtonColor: '#0891b2'
                });
                reset("password");
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="เข้าสู่ระบบ" />

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">ยินดีต้อนรับกลับ! 👋</h2>
                <p className="text-gray-600 mt-2">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
            </div>

            {status && (
                <div className="mb-4 p-4 rounded-lg bg-green-50 text-sm font-medium text-green-600 border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="username" value="ชื่อผู้ใช้" className="text-gray-700 " />
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiOutlineUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="username"
                            type="text"
                            name="username"
                            value={data.username}
                            className="pl-10 w-full rounded-lg border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("username", e.target.value)}
                            placeholder="กรุณากรอกชื่อผู้ใช้"
                        />
                    </div>
                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="รหัสผ่าน" className="text-gray-700" />
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors duration-200"
                            >
                                ลืมรหัสผ่าน?
                            </Link>
                        )}
                    </div>
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="pl-10 w-full rounded-lg border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                            autoComplete="current-password"
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="กรุณากรอกรหัสผ่าน"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData("remember", e.target.checked)}
                            className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-gray-600 ms-2">
                            จดจำการเข้าสู่ระบบ
                        </span>
                    </label>
                </div>

                <div>
                    <PrimaryButton
                        className="w-full justify-center py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 transition-all duration-200"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                กำลังเข้าสู่ระบบ...
                            </>
                        ) : (
                            'เข้าสู่ระบบ'
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
