import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { useState } from "react";
import { HiHome } from "react-icons/hi";

export default function IngredientLot({ ingredients }) {
    const { data, setData } = useForm([
        {
            ingredient_id: "",
            expire_date: "",
            quantity: "",
            unit_name: "", // Add unit_name to store the selected ingredient's unit
        },
    ]);

    const handleIngredientChange = (index, value) => {
        const newData = [...data];
        // Only check for duplicates if selecting a new ingredient (not clearing)
        if (value !== "") {
            // Check if ingredient is already selected in another row
            const isDuplicate = data.some(
                (item, i) => i !== index && item.ingredient_id === value
            );
            if (isDuplicate) {
                alert("วัตถุดิบนี้ถูกเลือกไปแล้ว");
                return;
            }
        }
        
        newData[index].ingredient_id = value;
        // Clear unit name if deselecting ingredient
        if (value === "") {
            newData[index].unit_name = "";
        } else {
            // Find the selected ingredient and get its unit
            const selectedIngredient = ingredients.find(
                (ing) => ing.id.toString() === value
            );
            newData[index].unit_name = selectedIngredient?.unit?.name || "";
        }
        setData(newData);
    };

    const handleQuantityChange = (index, value) => {
        const newData = [...data];
        newData[index].quantity = value;
        setData(newData);
    };

    const handleRemoveRow = (index) => {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    };

    const handleAddRow = () => {
        // Count how many ingredients are already selected
        const selectedCount = data.filter(item => item.ingredient_id !== "").length;
        // Count available (unselected) ingredients
        const availableCount = ingredients.length - selectedCount;

        if (availableCount === 0) {
            alert("ไม่มีวัตถุดิบที่สามารถเพิ่มได้แล้ว");
            return;
        }

        setData([
            ...data,
            {
                ingredient_id: "",
                expire_date: "",
                quantity: "",
                unit_name: "",
            },
        ]);
    };

    // Function to get available ingredients for dropdown
    const getAvailableIngredients = (currentIndex) => {
        const selectedIngredients = data
            .map((item, index) => index !== currentIndex && item.ingredient_id ? item.ingredient_id : null)
            .filter(id => id !== null);
        
        return ingredients.filter(ing => !selectedIngredients.includes(ing.id.toString()));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    เพิ่ม lot วัตถุดิบ
                </h2>
            }
        >
            <Head title="เพิ่มวัตถุดิบ" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/ingredients">
                        วัตถุดิบทั้งหมด
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>จัดการวัตถุดิบ</Breadcrumb.Item>
                </Breadcrumb>
                <AdminLayout>
                    <div className="space-y-4">
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 bg-white rounded-lg shadow"
                            >
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div>
                                        <label
                                            htmlFor={`ingredient-${index}`}
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            วัตถุดิบ
                                        </label>
                                        <select
                                            id={`ingredient-${index}`}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            value={item.ingredient_id}
                                            onChange={(e) =>
                                                handleIngredientChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">เลือกวัตถุดิบ</option>
                                            {getAvailableIngredients(index).map((ingredient) => (
                                                <option
                                                    key={ingredient.id}
                                                    value={ingredient.id}
                                                >
                                                    {ingredient.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`quantity-${index}`}
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            จำนวน{" "}
                                            {item.unit_name && (
                                                <>({item.unit_name})</>
                                            )}
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                id={`quantity-${index}`}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`expire-${index}`}
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            วันหมดอายุ
                                        </label>
                                        <input
                                            type="date"
                                            id={`expire-${index}`}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            value={item.expire_date}
                                            onChange={(e) => {
                                                const newData = [...data];
                                                newData[index].expire_date =
                                                    e.target.value;
                                                setData(newData);
                                            }}
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        {data.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveRow(index)
                                                }
                                                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                            >
                                                ลบ
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                                onClick={handleAddRow}
                                disabled={data.length >= ingredients.length}
                            >
                                เพิ่มวัตถุดิบ
                            </button>
                            <button
                                type="submit"
                                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </AdminLayout>
            </div>
        </AuthenticatedLayout>
    );
}
