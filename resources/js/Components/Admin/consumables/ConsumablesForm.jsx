import React from "react";
import { useForm } from "@inertiajs/react";
import { Label, TextInput, Button } from "flowbite-react";
import { Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { HiCube, HiScale, HiTag, HiShoppingCart } from "react-icons/hi";

export default function ConsumablesForm({ consumable, units = [], isEditing = false }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: isEditing ? consumable?.name : "",
        quantity: isEditing ? consumable?.quantity : "",
        unit_id: isEditing ? consumable?.unit_id : "",
        is_depend_on_sale: isEditing ? consumable?.is_depend_on_sale : false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.consumables.update", consumable.id), {
                onSuccess: () => {
                    Swal.fire({
                        title: "สำเร็จ",
                        text: "อัพเดทข้อมูลเรียบร้อยแล้ว",
                        icon: "success",
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
                        icon: "error",
                    });
                },
            });
        } else {
            post(route("admin.consumables.store"), {
                onSuccess: () => {
                    Swal.fire({
                        title: "สำเร็จ",
                        text: "เพิ่มข้อมูลเรียบร้อยแล้ว",
                        icon: "success",
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
                        icon: "error",
                    });
                },
            });
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <div className="p-6 sm:p-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                        {isEditing ? "แก้ไขวัตถุดิบสิ้นเปลือง" : "เพิ่มวัตถุดิบสิ้นเปลือง"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <Label
                                htmlFor="name"
                                value="ชื่อวัตถุดิบสิ้นเปลือง"
                                className="inline-flex items-center mb-2"
                            >
                                <HiTag className="mr-2 w-5 h-5 text-gray-500" />
                                <span>ชื่อวัตถุดิบสิ้นเปลือง</span>
                            </Label>
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="กรุณากรอกชื่อวัตถุดิบสิ้นเปลือง"
                                required
                                color={errors.name ? "failure" : "gray"}
                                helperText={
                                    <span className="text-red-500">
                                        {errors.name}
                                    </span>
                                }
                            />
                        </div>

                        {/* Quantity and Unit Fields */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label
                                    htmlFor="quantity"
                                    value="จำนวน"
                                    className="inline-flex items-center mb-2"
                                >
                                    <HiCube className="mr-2 w-5 h-5 text-gray-500" />
                                    <span>จำนวน</span>
                                </Label>
                                <TextInput
                                    id="quantity"
                                    type="number"
                                    name="quantity"
                                    value={data.quantity}
                                    onChange={(e) => setData("quantity", e.target.value)}
                                    placeholder="กรุณากรอกจำนวน"
                                    required
                                    min="0"
                                    step="0.01"
                                    color={errors.quantity ? "failure" : "gray"}
                                    helperText={
                                        <span className="text-red-500">
                                            {errors.quantity}
                                        </span>
                                    }
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="unit_id"
                                    value="หน่วยวัด"
                                    className="inline-flex items-center mb-2"
                                >
                                    <HiScale className="mr-2 w-5 h-5 text-gray-500" />
                                    <span>หน่วยวัด</span>
                                </Label>
                                <select
                                    id="unit_id"
                                    name="unit_id"
                                    value={data.unit_id}
                                    onChange={(e) => setData("unit_id", e.target.value)}
                                    required
                                    className={`block w-full px-4 py-2.5 text-sm rounded-lg border ${errors.unit_id
                                        ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                        } bg-white shadow-sm`}
                                >
                                    <option value="">เลือกหน่วยวัด</option>
                                    {units?.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.name} ({unit.abbreviation})
                                        </option>
                                    ))}
                                </select>
                                {errors.unit_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.unit_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Is Depend on Sale Field */}
                        <div className="flex items-center">
                            <input
                                id="is_depend_on_sale"
                                type="checkbox"
                                checked={data.is_depend_on_sale}
                                onChange={(e) => setData("is_depend_on_sale", e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <Label
                                htmlFor="is_depend_on_sale"
                                className="ml-2 text-sm font-medium text-gray-900"
                            >
                                ใช้ในการขาย
                            </Label>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end items-center pt-6 space-x-4 border-t">
                            <Link
                                href={route("admin.consumables.index")}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                ยกเลิก
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg border border-transparent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="mr-2 w-4 h-4 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        กำลังบันทึก...
                                    </>
                                ) : (
                                    isEditing ? "บันทึกการแก้ไข" : "เพิ่มวัตถุดิบสิ้นเปลือง"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
