import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Breadcrumb, Button } from "flowbite-react";
import { HiHome, HiPlus, HiTrash } from "react-icons/hi2";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function Create({ consumables }) {
    console.log(consumables);
    const { data, setData, post, processing, errors } = useForm([
        {
            consumable_id: "",
            cost_per_unit: "",
            quantity: "",
            note: "",
            per_pack: "",
            price: "",
            supplier: "",
            transformer_id: 0,
        },
    ]);

    const validatePositiveNumber = (value) => {
        return value && parseFloat(value) > 0;
    };

    const validatePositiveInteger = (value) => {
        return (
            value && Number.isInteger(parseFloat(value)) && parseInt(value) > 0
        );
    };

    const handleAddRow = () => {
        setData([
            ...data,
            {
                consumable_id: "",
                cost_per_unit: "",
                quantity: "",
                note: "",
                per_pack: "",
                price: "",
                supplier: "",
                transformer_id: 0,
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

    const handleConsumableChange = (index, value) => {
        if (value !== "") {
            const isAlreadySelected = data.some(
                (item, i) => i !== index && item.consumable_id === value
            );
            if (isAlreadySelected) {
                alert("วัตถุดิบนี้ถูกเลือกไปแล้ว");
                const newData = [...data];
                newData[index].consumable_id = "";
                setData(newData);
                return;
            }
        }

        const selectedConsumable = consumables.find(
            (c) => c.id.toString() === value
        );
        const newData = [...data];
        newData[index].consumable_id = value;
        newData[index].transformer_id = ""; // Reset transformer when consumable changes
        newData[index].cost_per_unit = selectedConsumable
            ? selectedConsumable.cost_per_unit
            : "";
        setData(newData);
    };

    const handleTransformerChange = (index, value) => {
        const selectedConsumable = consumables.find(
            (c) => c.id.toString() === data[index].consumable_id
        );
        const selectedTransformer = selectedConsumable?.transformers.find(
            (t) => t.id.toString() === value
        );

        const newData = [...data];
        newData[index].transformer_id = value;
        if (selectedTransformer) {
            newData[index].per_pack = selectedTransformer.multiplier.toString();
        }
        setData(newData);
    };

    const handleNumberChange = (index, field, value, validator) => {
        if (value === "" || validator(value)) {
            const newData = [...data];
            newData[index][field] = value;
            setData(newData);
        }
    };

    const getAvailableConsumables = (currentIndex) => {
        const selectedConsumables = data
            .map((item, index) =>
                index !== currentIndex && item.consumable_id
                    ? item.consumable_id
                    : null
            )
            .filter((id) => id !== null);

        return consumables.filter(
            (consumable) =>
                !selectedConsumables.includes(consumable.id.toString())
        );
    };

    const validateForm = () => {
        const errors = [];

        data.forEach((item, index) => {
            if (!item.consumable_id)
                errors.push(`รายการที่ ${index + 1}: กรุณาเลือกวัตถุดิบ`);
            if (!item.transformer_id)
                errors.push(`รายการที่ ${index + 1}: กรุณาเลือกยี่ห้อ/ขนาด`);
            if (!item.supplier)
                errors.push(`รายการที่ ${index + 1}: กรุณาระบุผู้จำหน่าย`);
            if (!validatePositiveNumber(item.cost_per_unit))
                errors.push(
                    `รายการที่ ${index + 1}: ราคาต่อหน่วยต้องมากกว่า 0`
                );
            if (!validatePositiveNumber(item.price))
                errors.push(`รายการที่ ${index + 1}: ราคาต้องมากกว่า 0`);
            if (!validatePositiveNumber(item.quantity))
                errors.push(`รายการที่ ${index + 1}: จำนวนต้องมากกว่า 0`);
            if (!validatePositiveInteger(item.per_pack))
                errors.push(
                    `รายการที่ ${
                        index + 1
                    }: จำนวนต่อแพ็กต้องเป็นจำนวนเต็มและมากกว่า 0`
                );
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
            note: item.note.trim(),
            supplier: item.supplier.trim(),
            cost_per_unit: parseFloat(item.cost_per_unit),
            price: parseFloat(item.price),
            quantity: parseFloat(item.quantity),
            per_pack: parseInt(item.per_pack),
        }));

        post(route("admin.consumables.lots.store"), {
            data: sanitizedData,
            onSuccess: () => {
                setData([
                    {
                        consumable_id: "",
                        cost_per_unit: "",
                        quantity: "",
                        note: "",
                        per_pack: "",
                        price: "",
                        supplier: "",
                    },
                ]);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    เพิ่ม Lot วัตถุดิบสิ้นเปลือง
                </h2>
            }
        >
            <AdminLayout>
                <Head title="เพิ่ม Lot วัตถุดิบสิ้นเปลือง" />

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
                                href={route("admin.consumables.lots.index")}
                            >
                                วัตถุดิบสิ้นเปลือง
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
                                                            htmlFor={`consumable-${index}`}
                                                        >
                                                            ชื่อวัตถุดิบ *
                                                        </InputLabel>
                                                        <select
                                                            id={`consumable-${index}`}
                                                            value={
                                                                item.consumable_id
                                                            }
                                                            onChange={(e) =>
                                                                handleConsumableChange(
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
                                                            {getAvailableConsumables(
                                                                index
                                                            ).map(
                                                                (
                                                                    consumable
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            consumable.id
                                                                        }
                                                                        value={
                                                                            consumable.id
                                                                        }
                                                                    >
                                                                        {
                                                                            consumable.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>

                                                    {item.consumable_id && (
                                                        <div>
                                                            <InputLabel
                                                                htmlFor={`transformer-${index}`}
                                                            >
                                                                ยี่ห้อ/ขนาด *
                                                            </InputLabel>
                                                            <select
                                                                id={`transformer-${index}`}
                                                                value={
                                                                    item.transformer_id
                                                                }
                                                                onChange={(e) =>
                                                                    handleTransformerChange(
                                                                        index,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                                                            >
                                                                <option value="">
                                                                    เลือกยี่ห้อ/ขนาด
                                                                </option>
                                                                {consumables
                                                                    .find(
                                                                        (c) =>
                                                                            c.id.toString() ===
                                                                            item.consumable_id
                                                                    )
                                                                    ?.transformers.map(
                                                                        (
                                                                            transformer
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    transformer.id
                                                                                }
                                                                                value={
                                                                                    transformer.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    transformer.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                            </select>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`quantity-${index}`}
                                                        >
                                                            จำนวน *
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
                                                            htmlFor={`cost_per_unit-${index}`}
                                                        >
                                                            ราคาต่อหน่วย *
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
                                                            htmlFor={`per_pack-${index}`}
                                                        >
                                                            จำนวนต่อแพ็ก *
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
                                                                    validatePositiveInteger
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

                                                    <div className="md:col-span-3">
                                                        <InputLabel
                                                            htmlFor={`note-${index}`}
                                                        >
                                                            หมายเหตุ
                                                        </InputLabel>
                                                        <textarea
                                                            id={`note-${index}`}
                                                            value={item.note}
                                                            onChange={(e) => {
                                                                const newData =
                                                                    [...data];
                                                                newData[
                                                                    index
                                                                ].note =
                                                                    e.target.value;
                                                                setData(
                                                                    newData
                                                                );
                                                            }}
                                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                            rows="2"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `${index}.note`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex justify-between items-center">
                                        <Button
                                            type="button"
                                            gradientDuoTone="purpleToBlue"
                                            onClick={handleAddRow}
                                        >
                                            <HiPlus className="mr-2 h-4 w-4" />
                                            เพิ่มรายการ
                                        </Button>

                                        <div className="flex gap-4">
                                            <Button
                                                type="submit"
                                                gradientDuoTone="greenToBlue"
                                                disabled={processing}
                                            >
                                                บันทึก
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
