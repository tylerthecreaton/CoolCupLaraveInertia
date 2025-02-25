import React from "react";
import { useForm } from "@inertiajs/react";
import { Label, TextInput, Button } from "flowbite-react";
import Swal from "sweetalert2";
import {
    HiTag,
    HiPencilAlt,
    HiCube,
    HiBeaker,
    HiCalculator,
} from "react-icons/hi";

export default function TransformerForm({
    transformer,
    ingredients,
    consumables,
    isEditing = false,
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: isEditing ? transformer?.name : "",
        description: isEditing ? transformer?.description : "",
        ingredient_id: isEditing ? transformer?.ingredient_id : "",
        consumable_id: isEditing ? transformer?.consumable_id : "",
        multiplier: isEditing ? transformer?.multiplier : "",
        type: isEditing ? transformer?.type : "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const action = isEditing ? put : post;
        const url = isEditing 
            ? route("admin.transformers.update", transformer.id)
            : route("admin.transformers.store");

        Swal.fire({
            title: isEditing ? "ยืนยันการแก้ไข?" : "ยืนยันการเพิ่ม?",
            text: isEditing 
                ? "คุณต้องการแก้ไขสูตรแปรรูปนี้ใช่หรือไม่?" 
                : "คุณต้องการเพิ่มสูตรแปรรูปนี้ใช่หรือไม่?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"
        }).then((result) => {
            if (result.isConfirmed) {
                action(url, {
                    onSuccess: () => {
                        Swal.fire({
                            title: "สำเร็จ!",
                            text: isEditing 
                                ? "แก้ไขสูตรแปรรูปเรียบร้อยแล้ว"
                                : "เพิ่มสูตรแปรรูปเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: "เกิดข้อผิดพลาด!",
                            text: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
                            icon: "error"
                        });
                    }
                });
            }
        });
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <div className="p-6 sm:p-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                        {isEditing ? "แก้ไขสูตรแปรรูป" : "เพิ่มสูตรแปรรูปใหม่"}
                    </h2>

                    {isEditing && transformer && (
                        <div className="mb-6 text-gray-600">
                            <p>
                                วัตถุดิบปัจจุบัน:{" "}
                                {transformer?.ingredient?.name || "ไม่ได้เลือก"}
                            </p>
                            <p>
                                วัตถุดิบสิ้นเปลืองปัจจุบัน:{" "}
                                {transformer?.consumable?.name || "ไม่ได้เลือก"}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <Label
                                htmlFor="name"
                                value="ชื่อสูตรแปรรูป"
                                className="inline-flex items-center mb-2"
                            >
                                <HiTag className="mr-2 w-5 h-5 text-gray-500" />
                                <span>ชื่อสูตรแปรรูป</span>
                            </Label>
                            <TextInput
                                id="name"
                                type="text"
                                value={data.name || ""}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="กรุณากรอกชื่อสูตรแปรรูป"
                                required
                                color={errors.name ? "failure" : "gray"}
                                helperText={<span className="text-red-500">{errors.name}</span>}

                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <Label
                                htmlFor="description"
                                value="คำอธิบาย"
                                className="inline-flex items-center mb-2"
                            >
                                <HiPencilAlt className="mr-2 w-5 h-5 text-gray-500" />
                                <span>คำอธิบาย</span>
                            </Label>
                            <textarea
                                id="description"
                                value={data.description || ""}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="กรุณากรอกคำอธิบาย"
                                rows={4}
                                className={`block w-full px-4 py-2.5 text-sm rounded-lg border ${errors.description
                                        ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                    } bg-white shadow-sm`}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Type Selection */}
                        <div>
                            <Label
                                htmlFor="type"
                                value="ประเภท"
                                className="inline-flex items-center mb-2"
                            >
                                <HiTag className="mr-2 w-5 h-5 text-gray-500" />
                                <span>ประเภท</span>
                            </Label>
                            <select
                                id="type"
                                value={data.type || ""}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className="block w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="">เลือกประเภท</option>
                                <option value="ingredient">วัตถุดิบ</option>
                                <option value="consumable">
                                    วัตถุดิบสิ้นเปลือง
                                </option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        {/* Ingredient Selection */}
                        {data.type === "ingredient" && (
                            <div>
                                <Label
                                    htmlFor="ingredient_id"
                                    value="วัตถุดิบที่ใช้"
                                    className="inline-flex items-center mb-2"
                                >
                                    <HiCube className="mr-2 w-5 h-5 text-gray-500" />
                                    <span>วัตถุดิบที่ใช้</span>
                                </Label>
                                <select
                                    id="ingredient_id"
                                    value={data.ingredient_id || ""}
                                    onChange={(e) =>
                                        setData("ingredient_id", e.target.value)
                                    }
                                    className={`block w-full px-4 py-2.5 text-sm rounded-lg border ${errors.ingredient_id
                                            ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                        } bg-white shadow-sm`}
                                >
                                    <option value="">เลือกวัตถุดิบ</option>
                                    {ingredients?.map((ingredient) => (
                                        <option
                                            key={ingredient.id}
                                            value={ingredient.id}
                                        >
                                            {ingredient.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.ingredient_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.ingredient_id}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Consumable Selection */}
                        {data.type === "consumable" && (
                            <div>
                                <Label
                                    htmlFor="consumable_id"
                                    value="วัตถุดิบสิ้นเปลือง"
                                    className="inline-flex items-center mb-2"
                                >
                                    <HiBeaker className="mr-2 w-5 h-5 text-gray-500" />
                                    <span>วัตถุดิบสิ้นเปลือง</span>
                                </Label>
                                <select
                                    id="consumable_id"
                                    value={data.consumable_id || ""}
                                    onChange={(e) =>
                                        setData("consumable_id", e.target.value)
                                    }
                                    className={`block w-full px-4 py-2.5 text-sm rounded-lg border ${errors.consumable_id
                                            ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                        } bg-white shadow-sm`}
                                >
                                    <option value="">
                                        เลือกวัตถุดิบสิ้นเปลือง
                                    </option>
                                    {consumables?.map((consumable) => (
                                        <option
                                            key={consumable.id}
                                            value={consumable.id}
                                        >
                                            {consumable.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.consumable_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.consumable_id}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Multiplier Field */}
                        <div>
                            <Label
                                htmlFor="multiplier"
                                value="ปริมาณสุทธิของวัตถุดิบ"
                                className="inline-flex items-center mb-2"
                            >
                                <HiCalculator className="mr-2 w-5 h-5 text-gray-500" />
                                <span>ตัวคูณ</span>
                            </Label>
                            <TextInput
                                id="multiplier"
                                type="number"
                                step="0.01"
                                value={data.multiplier || ""}
                                onChange={(e) =>
                                    setData("multiplier", e.target.value)
                                }
                                placeholder="กรุณากรอกปริมาณสุทธิของวัตถุดิบ"
                                required
                                color={errors.multiplier ? "failure" : "gray"}
                                helperText={errors.multiplier}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 justify-end">
                            <Button
                                color="gray"
                                onClick={() => window.history.back()}
                                type="button"
                            >
                                ยกเลิก
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {isEditing
                                    ? "บันทึกการแก้ไข"
                                    : "เพิ่มสูตรแปรรูป"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
