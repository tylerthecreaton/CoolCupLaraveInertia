import { useForm } from "@inertiajs/react";
import { Label, TextInput, Button, FileInput } from "flowbite-react";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import {
    HiOutlinePhotograph,
    HiCalendar,
    HiScale,
    HiCube,
    HiTag,
} from "react-icons/hi";

export default function IngredientsForm({
    ingredient,
    units = [],
    isEditing = false,
}) {
    const [previewImage, setPreviewImage] = useState(
        isEditing && ingredient.image_url ? ingredient.image_url : null
    );

    const { data, setData, post, put, processing, errors } = useForm({
        name: isEditing ? ingredient.name : "",
        unit_id: isEditing ? ingredient.unit_id : "",
        quantity: isEditing ? ingredient.quantity : "",
        expiration_date: isEditing ? ingredient.expiration_date : "",
        image: null,
        is_sweetness: isEditing ? ingredient.is_sweetness : false,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.ingredients.update", ingredient.id), data, {
                forceFormData: true,
                onSuccess: () => {
                    Swal.fire({
                        title: "สำเร็จ!",
                        text: "แก้ไขวัตถุดิบเรียบร้อยแล้ว",
                        icon: "success",
                        confirmButtonText: "ตกลง",
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
                        icon: "error",
                        confirmButtonText: "ตกลง",
                    });
                },
            });
        } else {
            post(route("admin.ingredients.store"), data, {
                forceFormData: true,
                onSuccess: () => {
                    Swal.fire({
                        title: "สำเร็จ!",
                        text: "เพิ่มวัตถุดิบใหม่เรียบร้อยแล้ว",
                        icon: "success",
                        confirmButtonText: "ตกลง",
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
                        icon: "error",
                        confirmButtonText: "ตกลง",
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
                        {isEditing ? "แก้ไขวัตถุดิบ" : "เพิ่มวัตถุดิบใหม่"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="space-y-6"
                    >
                        {/* Name Field */}
                        <div>
                            <Label
                                htmlFor="name"
                                value="ชื่อวัตถุดิบ"
                                className="inline-flex items-center mb-2"
                            >
                                <HiTag className="mr-2 w-5 h-5 text-gray-500" />
                                <span>ชื่อวัตถุดิบ</span>
                            </Label>
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="กรุณากรอกชื่อวัตถุดิบ"
                                required
                                color={errors.name ? "failure" : "gray"}
                                helperText={errors.name}
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
                                    onChange={(e) =>
                                        setData("quantity", e.target.value)
                                    }
                                    placeholder="กรุณากรอกจำนวน"
                                    required
                                    min="0"
                                    step="0.01"
                                    color={errors.quantity ? "failure" : "gray"}
                                    helperText={errors.quantity}
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="unit"
                                    value="หน่วยวัด"
                                    className="inline-flex items-center mb-2"
                                >
                                    <HiScale className="mr-2 w-5 h-5 text-gray-500" />
                                    <span>หน่วยวัด</span>
                                </Label>
                                <select
                                    id="unit"
                                    name="unit_id"
                                    value={data.unit_id}
                                    onChange={(e) =>
                                        setData("unit_id", e.target.value)
                                    }
                                    required
                                    className={`block w-full px-4 py-2.5 text-sm rounded-lg border ${
                                        errors.unit_id
                                            ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                    } bg-white shadow-sm`}
                                >
                                    <option value="">เลือกหน่วยวัด</option>
                                    {units
                                        .filter((unit) => unit.type === "ingredient")
                                        .map((unit) => (
                                            <option key={unit.id} value={unit.id}>
                                                {unit.name}{" "}
                                                {unit.abbreviation
                                                    ? `(${unit.abbreviation})`
                                                    : ""}
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

                        {/* Expiration Date Field */}
                        <div>
                            <Label
                                htmlFor="expiration_date"
                                value="วันหมดอายุ"
                                className="inline-flex items-center mb-2"
                            >
                                <HiCalendar className="mr-2 w-5 h-5 text-gray-500" />
                                <span>วันหมดอายุ</span>
                            </Label>
                            <TextInput
                                id="expiration_date"
                                type="date"
                                name="expiration_date"
                                value={data.expiration_date}
                                onChange={(e) =>
                                    setData("expiration_date", e.target.value)
                                }
                                required
                                color={
                                    errors.expiration_date ? "failure" : "gray"
                                }
                                helperText={errors.expiration_date}
                            />
                        </div>

                        {/* Sweetness Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="is_sweetness"
                                type="checkbox"
                                checked={data.is_sweetness}
                                onChange={(e) =>
                                    setData("is_sweetness", e.target.checked)
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <Label
                                htmlFor="is_sweetness"
                                className="ml-2 text-sm font-medium text-gray-900"
                            >
                                เป็นวัตถุดิบให้ความหวาน
                            </Label>
                        </div>

                        {/* Image Upload Field */}
                        <div>
                            <Label
                                htmlFor="image"
                                value="รูปภาพ"
                                className="inline-flex items-center mb-2"
                            >
                                <HiOutlinePhotograph className="mr-2 w-5 h-5 text-gray-500" />
                                <span>รูปภาพ</span>
                            </Label>
                            <FileInput
                                id="image"
                                name="image"
                                onChange={handleFileChange}
                                color={errors.image ? "failure" : "gray"}
                                helperText={errors.image}
                            />
                            {previewImage && (
                                <div className="mt-4">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="max-w-xs rounded-lg shadow-md"
                                    />
                                </div>
                            )}
                            {isEditing && ingredient.image_url && !previewImage && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">รูปภาพปัจจุบัน:</p>
                                    <img
                                        src={ingredient.image_url}
                                        alt="Current"
                                        className="max-w-xs rounded-lg shadow-md"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end items-center pt-6 space-x-4 border-t">
                            <Link
                                href={route("admin.ingredients.index")}
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
                                    "บันทึก"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
