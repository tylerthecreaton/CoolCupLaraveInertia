import { useForm } from "@inertiajs/react";
import {
    Label,
    TextInput,
    Button,
    FileInput,
} from "flowbite-react";
import { Link } from "@inertiajs/react";
import { HiOutlinePhotograph, HiCalendar, HiScale, HiCube, HiTag } from "react-icons/hi";

export default function IngredientsForm({ ingredient, units = [], isEditing = false }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: isEditing ? ingredient.name : "",
        unit: isEditing ? ingredient.unit_id : "",
        quantity: isEditing ? ingredient.quantity : "",
        expiration_date: isEditing ? ingredient.expiration_date : "",
        image: null,
    });

    const handleFileChange = (e) => {
        setData("image", e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.ingredients.update", ingredient.id), data, {
                forceFormData: true,
            });
        } else {
            post(route("admin.ingredients.store"), data, {
                forceFormData: true,
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {isEditing ? "แก้ไขวัตถุดิบ" : "เพิ่มวัตถุดิบใหม่"}
                    </h2>

                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <Label htmlFor="name" value="ชื่อวัตถุดิบ" className="inline-flex items-center mb-2">
                                <HiTag className="w-5 h-5 mr-2 text-gray-500" />
                                <span>ชื่อวัตถุดิบ</span>
                            </Label>
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="กรุณากรอกชื่อวัตถุดิบ"
                                required
                                color={errors.name ? "failure" : "gray"}
                                helperText={errors.name}
                            />
                        </div>

                        {/* Quantity and Unit Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="quantity" value="จำนวน" className="inline-flex items-center mb-2">
                                    <HiCube className="w-5 h-5 mr-2 text-gray-500" />
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
                                    helperText={errors.quantity}
                                />
                            </div>

                            <div>
                                <Label htmlFor="unit" value="หน่วยวัด" className="inline-flex items-center mb-2">
                                    <HiScale className="w-5 h-5 mr-2 text-gray-500" />
                                    <span>หน่วยวัด</span>
                                </Label>
                                <select
                                    id="unit"
                                    name="unit"
                                    value={data.unit}
                                    onChange={(e) => setData("unit", e.target.value)}
                                    required
                                    className={`block w-full px-4 py-2.5 text-sm rounded-lg border ${
                                        errors.unit
                                            ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                    } bg-white shadow-sm`}
                                >
                                    <option value="">เลือกหน่วยวัด</option>
                                    {units.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.name} {unit.abbreviation ? `(${unit.abbreviation})` : ""}
                                        </option>
                                    ))}
                                </select>
                                {errors.unit && (
                                    <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                                )}
                            </div>
                        </div>

                        {/* Expiration Date Field */}
                        <div>
                            <Label htmlFor="expiration_date" value="วันหมดอายุ" className="inline-flex items-center mb-2">
                                <HiCalendar className="w-5 h-5 mr-2 text-gray-500" />
                                <span>วันหมดอายุ</span>
                            </Label>
                            <TextInput
                                id="expiration_date"
                                type="date"
                                name="expiration_date"
                                value={data.expiration_date}
                                onChange={(e) => setData("expiration_date", e.target.value)}
                                required
                                color={errors.expiration_date ? "failure" : "gray"}
                                helperText={errors.expiration_date}
                            />
                        </div>

                        {/* Image Upload Field */}
                        <div>
                            <Label htmlFor="image" value="รูปภาพวัตถุดิบ" className="inline-flex items-center mb-2">
                                <HiOutlinePhotograph className="w-5 h-5 mr-2 text-gray-500" />
                                <span>รูปภาพวัตถุดิบ</span>
                            </Label>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="image"
                                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <HiOutlinePhotograph className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">คลิกเพื่ออัพโหลดรูปภาพ</span>
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG หรือ GIF (สูงสุด 2MB)</p>
                                    </div>
                                    <input
                                        id="image"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                            {errors.image && (
                                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                            )}
                            {data.image && (
                                <p className="mt-2 text-sm text-gray-500">
                                    ไฟล์ที่เลือก: {data.image.name}
                                </p>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                            <Link
                                href={route("admin.ingredients.index")}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                ยกเลิก
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="w-4 h-4 mr-2 animate-spin"
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
