import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { Breadcrumb, Button, Label, Alert } from "flowbite-react";
import { HiHome, HiUpload, HiDocumentText } from "react-icons/hi";
import Swal from 'sweetalert2';

export default function UploadSlip({ order }) {
    const [preview, setPreview] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        slip_image: null,
        order_id: order?.id
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('slip_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('order.uploadSlip', { id: order.id }), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPreview(null);
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'อัพโหลดหลักฐานการชำระเงินเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    router.visit(route('receipt.history'));
                });
            },
            onError: (errors) => {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: errors.message || 'ไม่สามารถอัพโหลดหลักฐานการชำระเงินได้',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#d33'
                });
            }
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(price);
    };

    return (
        <AuthenticatedLayout>
            <Head title="อัพโหลดหลักฐานการชำระเงิน" />
            <div className="p-4 min-h-screen bg-gray-50">
                <Breadcrumb className="p-3 mb-4 bg-white rounded-lg shadow-sm">
                    <Breadcrumb.Item>
                        <Link href={route('dashboard')} className="text-blue-600 hover:text-blue-800">
                            <HiHome className="inline-block mr-2" />
                            หน้าหลัก
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link href={route('receipt.history')} className="text-blue-600 hover:text-blue-800">
                            รายการคำสั่งซื้อ
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        อัพโหลดสลิป
                    </Breadcrumb.Item>
                </Breadcrumb>

                <div className="mx-auto max-w-2xl">
                    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    อัพโหลดหลักฐานการชำระเงิน
                                </h2>
                                <HiDocumentText className="w-8 h-8 text-blue-500" />
                            </div>

                            {order && (
                                <div className="p-4 mb-6 bg-blue-50 rounded-lg border border-blue-100">
                                    <h3 className="mb-2 text-lg font-medium text-blue-800">ข้อมูลคำสั่งซื้อ</h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p className="flex justify-between">
                                            <span>หมายเลขคำสั่งซื้อ:</span>
                                            <span className="font-medium text-blue-700">#{order.order_number}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>ยอดชำระ:</span>
                                            <span className="font-medium text-green-600">{formatPrice(order.final_amount)}</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="slip_image" value="อัพโหลดสลิปการโอนเงิน" className="block mb-2 text-gray-700" />
                                    <div className="flex justify-center px-6 pt-5 pb-6 mt-1 rounded-lg border-2 border-gray-300 border-dashed transition-colors duration-200 hover:border-blue-400">
                                        <div className="space-y-1 text-center">
                                            <HiUpload className="mx-auto w-12 h-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="slip_image" className="relative font-medium text-blue-600 rounded-md cursor-pointer hover:text-blue-700 focus-within:outline-none">
                                                    <span>อัพโหลดรูปภาพ</span>
                                                    <input
                                                        id="slip_image"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="sr-only"
                                                    />
                                                </label>
                                                <p className="pl-1">หรือลากไฟล์มาวาง</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, JPEG ขนาดไม่เกิน 4MB
                                            </p>
                                        </div>
                                    </div>
                                    {errors.slip_image && (
                                        <p className="mt-2 text-sm text-red-600">{errors.slip_image}</p>
                                    )}
                                </div>

                                {preview && (
                                    <div className="mt-4">
                                        <p className="mb-2 text-sm text-gray-600">ตัวอย่างรูปภาพ:</p>
                                        <div className="overflow-hidden relative rounded-lg border border-gray-200">
                                            <img
                                                src={preview}
                                                alt="ตัวอย่างสลิป"
                                                className="mx-auto max-w-full h-auto max-h-96"
                                            />
                                        </div>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={processing || !data.slip_image}
                                    className="w-full"
                                    gradientDuoTone="greenToBlue"
                                >
                                    <HiUpload className="mr-2 w-5 h-5" />
                                    {processing ? 'กำลังอัพโหลด...' : 'ยืนยันการอัพโหลด'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
