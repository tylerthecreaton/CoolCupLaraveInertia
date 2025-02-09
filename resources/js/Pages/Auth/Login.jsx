import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaUser, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

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

        post(route('login'), {
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
                reset('password');
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="เข้าสู่ระบบ" />

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-beach-coral via-beach-shell to-beach-water bg-clip-text text-transparent">ยินดีต้อนรับกลับ!</h2>
                <p className="text-summer-700 mt-2">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
            </div>

            {status && (
                <div className="mb-4 font-medium text-sm text-beach-water">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-beach-coral-light/5 via-beach-shell-light/5 to-beach-water-light/5 rounded-lg"></div>
                    <div className="relative space-y-6">
                        <div className="relative group">
                            <InputLabel htmlFor="username" value="ชื่อผู้ใช้" className="text-summer-700" />
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-beach-coral/60 group-focus-within:text-beach-coral transition-colors">
                                    <FaUser />
                                </div>
                                <TextInput
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={data.username}
                                    className="mt-1 block w-full pl-10 bg-white/50 border-beach-coral/20 focus:border-beach-coral focus:ring focus:ring-beach-coral/20 rounded-lg transition-all duration-200"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('username', e.target.value)}
                                    placeholder="กรุณากรอกชื่อผู้ใช้"
                                />
                            </div>
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        <div className="relative group">
                            <div className="flex items-center justify-between">
                                <InputLabel htmlFor="password" value="รหัสผ่าน" className="text-summer-700" />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-beach-coral hover:text-beach-shell transition-colors duration-200"
                                    >
                                        ลืมรหัสผ่าน?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-beach-coral/60 group-focus-within:text-beach-coral transition-colors">
                                    <FaLock />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full pl-10 bg-white/50 border-beach-coral/20 focus:border-beach-coral focus:ring focus:ring-beach-coral/20 rounded-lg transition-all duration-200"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="กรุณากรอกรหัสผ่าน"
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-beach-coral/20 text-beach-coral focus:ring-beach-coral/20"
                                />
                                <span className="ml-2 text-sm text-summer-700">จดจำการเข้าสู่ระบบ</span>
                            </label>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <PrimaryButton
                                className="w-full justify-center bg-gradient-to-r from-beach-coral via-beach-shell to-beach-water hover:from-beach-coral-light hover:via-beach-shell-light hover:to-beach-water-light transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-75"
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

                            {/* <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-beach-coral/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-summer-700">ยังไม่มีบัญชี?</span>
                                </div>
                            </div>

                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center px-4 py-2 bg-white/50 border border-beach-coral/20 rounded-md font-semibold text-xs text-summer-700 uppercase tracking-widest hover:bg-beach-coral/5 focus:bg-beach-coral/5 active:bg-beach-coral/10 focus:outline-none focus:ring-2 focus:ring-beach-coral/20 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                สร้างบัญชีใหม่
                            </Link> */}
                        </div>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
