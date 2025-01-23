import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Breadcrumb, Button } from "flowbite-react";
import { HiHome, HiPlus, HiTrash } from "react-icons/hi2";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function Create({ auth, ingredients }) {
    const { data, setData, post, processing, errors } = useForm([
        {
            ingredient_id: "",
            cost_per_unit: "",
            quantity: "",
            per_pack: "",
            price: "",
            supplier: "",
            expiration_date: "",
            notes: "",
        },
    ]);

    const validatePositiveNumber = (value) => {
        return value && parseFloat(value) > 0;
    };

    const getIngredientUnit = (ingredientId) => {
        const ingredient = ingredients.find(
            (ing) => ing.id.toString() === ingredientId
        );
        return ingredient?.unit?.name || "";
    };

    const handleAddRow = () => {
        setData([
            ...data,
            {
                ingredient_id: "",
                cost_per_unit: "",
                quantity: "",
                per_pack: "",
                price: "",
                supplier: "",
                expiration_date: "",
                notes: "",
            },
        ]);
    };

    const handleRemoveRow = (index) => {
        if (data.length === 1) {
            alert("ต้องมีอย่างน้อย 1 รายการ");
            return;
        }
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    };

    const handleIngredientChange = (index, value) => {
        if (value !== "") {
            const isAlreadySelected = data.some(
                (item, i) => i !== index && item.ingredient_id === value
            );
            if (isAlreadySelected) {
                alert("วัตถุดิบนี้ถูกเลือกไปแล้ว");
                const newData = [...data];
                newData[index].ingredient_id = "";
                setData(newData);
                return;
            }
        }

        const selectedIngredient = ingredients.find(
            (ing) => ing.id.toString() === value
        );
        const newData = [...data];
        newData[index].ingredient_id = value;
        newData[index].cost_per_unit = selectedIngredient
            ? selectedIngredient.cost_per_unit
            : "";
        setData(newData);
    };

    const handleNumberChange = (index, field, value, validator) => {
        if (value === "" || validator(value)) {
            const newData = [...data];
            newData[index][field] = value;
            setData(newData);
        }
    };

    const getAvailableIngredients = (currentIndex) => {
        const selectedIngredients = data
            .map((item, index) =>
                index !== currentIndex && item.ingredient_id
                    ? item.ingredient_id
                    : null
            )
            .filter((id) => id !== null);

        return ingredients.filter(
            (ingredient) =>
                !selectedIngredients.includes(ingredient.id.toString())
        );
    };

    const validateForm = () => {
        const errors = [];

        data.forEach((item, index) => {
            if (!item.ingredient_id)
                errors.push(`รายการที่ ${index + 1}: กรุณาเลือกวัตถุดิบ`);
            if (!validatePositiveNumber(item.cost_per_unit))
                errors.push(
                    `รายการที่ ${index + 1}: ราคาต่อหน่วยต้องมากกว่า 0`
                );
            if (!validatePositiveNumber(item.quantity))
                errors.push(`รายการที่ ${index + 1}: จำนวนต้องมากกว่า 0`);
            if (!validatePositiveNumber(item.per_pack))
                errors.push(
                    `รายการที่ ${index + 1}: จำนวนต่อแพ็คต้องมากกว่า 0`
                );
            if (!validatePositiveNumber(item.price))
                errors.push(`รายการที่ ${index + 1}: ราคาต้องมากกว่า 0`);
            if (!item.supplier)
                errors.push(`รายการที่ ${index + 1}: กรุณาระบุผู้จำหน่าย`);
            if (!item.expiration_date)
                errors.push(`รายการที่ ${index + 1}: กรุณาระบุวันหมดอายุ`);
        });

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.length === 0) {
            alert("กรุณาเพิ่มวัตถุดิบอย่างน้อย 1 รายการ");
            return;
        }

        const formErrors = validateForm();
        if (formErrors.length > 0) {
            alert(formErrors.join("\n"));
            return;
        }

        const sanitizedData = data.map((item) => ({
            ...item,
            notes: item.notes.trim(),
            cost_per_unit: parseFloat(item.cost_per_unit),
            quantity: parseFloat(item.quantity),
            per_pack: parseFloat(item.per_pack),
            price: parseFloat(item.price),
            supplier: item.supplier.trim(),
        }));

        post(route("admin.ingredient-lots.store"), {
            ...sanitizedData,
            onSuccess: () => {
                setData([
                    {
                        ingredient_id: "",
                        cost_per_unit: "",
                        quantity: "",
                        per_pack: "",
                        price: "",
                        supplier: "",
                        expiration_date: "",
                        notes: "",
                    },
                ]);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    เพิ่ม Lot วัตถุดิบ
                </h2>
            }
        >
            <AdminLayout>
                <Head title="เพิ่ม Lot วัตถุดิบ" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <Breadcrumb className="mb-4">
                            <Breadcrumb.Item
                                href={route("dashboard")}
                                icon={HiHome}
                            >
                                หน้าแรก
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                href={route("admin.ingredient-lots.index")}
                            >
                                วัตถุดิบ
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>เพิ่ม Lot ใหม่</Breadcrumb.Item>
                        </Breadcrumb>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        {data.map((item, index) => (
                                            <div
                                                key={index}
                                                className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-shadow duration-200"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                                        <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded">
                                                            รายการที่{" "}
                                                            {index + 1}
                                                        </span>
                                                    </h3>
                                                    {data.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            color="failure"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleRemoveRow(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <HiTrash className="mr-2 h-4 w-4" />
                                                            ลบรายการ
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`ingredient-${index}`}
                                                        >
                                                            ชื่อวัตถุดิบ *
                                                        </InputLabel>
                                                        <select
                                                            id={`ingredient-${index}`}
                                                            value={
                                                                item.ingredient_id
                                                            }
                                                            onChange={(e) =>
                                                                handleIngredientChange(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                                                        >
                                                            <option value="">
                                                                เลือกวัตถุดิบ
                                                            </option>
                                                            {getAvailableIngredients(
                                                                index
                                                            ).map(
                                                                (
                                                                    ingredient
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            ingredient.id
                                                                        }
                                                                        value={
                                                                            ingredient.id
                                                                        }
                                                                    >
                                                                        {
                                                                            ingredient.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `${index}.ingredient_id`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`quantity-${index}`}
                                                        >
                                                            จำนวน
                                                            {/* ({getIngredientUnit(item.ingredient_id)}) * */}
                                                        </InputLabel>
                                                        <TextInput
                                                            id={`quantity-${index}`}
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            value={
                                                                item.quantity
                                                            }
                                                            className="mt-1 block w-full"
                                                            onChange={(e) =>
                                                                handleNumberChange(
                                                                    index,
                                                                    "quantity",
                                                                    e.target
                                                                        .value,
                                                                    validatePositiveNumber
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `${index}.quantity`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`price-${index}`}
                                                        >
                                                            ราคา *
                                                        </InputLabel>
                                                        <TextInput
                                                            id={`price-${index}`}
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            value={item.price}
                                                            className="mt-1 block w-full"
                                                            onChange={(e) =>
                                                                handleNumberChange(
                                                                    index,
                                                                    "price",
                                                                    e.target
                                                                        .value,
                                                                    validatePositiveNumber
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `${index}.price`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`per_pack-${index}`}
                                                        >
                                                            ปริมาณต่อแพ็ค (
                                                            {getIngredientUnit(
                                                                item.ingredient_id
                                                            )}
                                                            ) *
                                                        </InputLabel>
                                                        <TextInput
                                                            id={`per_pack-${index}`}
                                                            type="number"
                                                            min="1"
                                                            step="1"
                                                            value={
                                                                item.per_pack
                                                            }
                                                            className="mt-1 block w-full"
                                                            onChange={(e) =>
                                                                handleNumberChange(
                                                                    index,
                                                                    "per_pack",
                                                                    e.target
                                                                        .value,
                                                                    validatePositiveNumber
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `${index}.per_pack`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`cost_per_unit-${index}`}
                                                        >
                                                            ราคาต่อแพ็ค *
                                                        </InputLabel>
                                                        <TextInput
                                                            id={`cost_per_unit-${index}`}
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            value={
                                                                item.cost_per_unit
                                                            }
                                                            className="mt-1 block w-full"
                                                            onChange={(e) =>
                                                                handleNumberChange(
                                                                    index,
                                                                    "cost_per_unit",
                                                                    e.target
                                                                        .value,
                                                                    validatePositiveNumber
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `${index}.cost_per_unit`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`supplier-${index}`}
                                                        >
                                                            ผู้จำหน่าย *
                                                        </InputLabel>
                                                        <TextInput
                                                            id={`supplier-${index}`}
                                                            type="text"
                                                            value={
                                                                item.supplier
                                                            }
                                                            className="mt-1 block w-full"
                                                            onChange={(e) => {
                                                                const newData =
                                                                    [...data];
                                                                newData[
                                                                    index
                                                                ].supplier =
                                                                    e.target.value;
                                                                setData(
                                                                    newData
                                                                );
                                                            }}
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `${index}.supplier`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`expiration_date-${index}`}
                                                        >
                                                            วันหมดอายุ *
                                                        </InputLabel>
                                                        <TextInput
                                                            id={`expiration_date-${index}`}
                                                            type="date"
                                                            value={
                                                                item.expiration_date
                                                            }
                                                            className="mt-1 block w-full"
                                                            onChange={(e) => {
                                                                const newData =
                                                                    [...data];
                                                                newData[
                                                                    index
                                                                ].expiration_date =
                                                                    e.target.value;
                                                                setData(
                                                                    newData
                                                                );
                                                            }}
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `${index}.expiration_date`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div className="md:col-span-3">
                                                        <InputLabel
                                                            htmlFor={`notes-${index}`}
                                                        >
                                                            หมายเหตุ
                                                        </InputLabel>
                                                        <textarea
                                                            id={`notes-${index}`}
                                                            value={item.notes}
                                                            onChange={(e) => {
                                                                const newData =
                                                                    [...data];
                                                                newData[
                                                                    index
                                                                ].notes =
                                                                    e.target.value;
                                                                setData(
                                                                    newData
                                                                );
                                                            }}
                                                            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                                                            rows="3"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `${index}.notes`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-center">
                                            <Button
                                                type="button"
                                                gradientDuoTone="greenToBlue"
                                                size="lg"
                                                onClick={handleAddRow}
                                            >
                                                <HiPlus className="mr-2 h-5 w-5" />
                                                เพิ่มรายการ
                                            </Button>
                                        </div>

                                        <div className="flex justify-end space-x-4">
                                            <Button
                                                type="submit"
                                                gradientDuoTone="purpleToBlue"
                                                size="lg"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? "กำลังบันทึก..."
                                                    : "บันทึก"}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
