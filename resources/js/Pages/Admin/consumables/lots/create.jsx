import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { Breadcrumb, Button } from "flowbite-react";
import { HiHome, HiPlus, HiTrash } from "react-icons/hi2";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Swal from "sweetalert2";

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
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถลบได้',
                text: 'ต้องมีอย่างน้อย 1 รายการ',
            });
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
                Swal.fire({
                    icon: 'error',
                    title: 'วัสดุสิ้นเปลืองถูกเลือกแล้ว',
                    text: 'วัสดุสิ้นเปลืองนี้ถูกเลือกไปแล้ว กรุณาเลือกรายการอื่น',
                });
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
                errors.push(`รายการที่ ${index + 1}: กรุณาเลือกวัสดุสิ้นเปลือง`);
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

        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาตรวจสอบข้อมูล',
                html: errors.join('<br>'),
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถบันทึกได้',
                text: 'กรุณาเพิ่มวัสดุสิ้นเปลืองอย่างน้อย 1 รายการ',
            });
            return;
        }

        if (!validateForm()) {
            return;
        }

        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'ยืนยันการเพิ่มล็อตวัสดุสิ้นเปลือง?',
            text: 'คุณต้องการบันทึกข้อมูลล็อตวัสดุสิ้นเปลืองใหม่ใช่หรือไม่?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        });

        if (!result.isConfirmed) {
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

        router.post(route("admin.consumables.lots.store"), sanitizedData, {
            onSuccess: () => {
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'บันทึกข้อมูลล็อตวัสดุสิ้นเปลืองเรียบร้อยแล้ว',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    router.visit(route("admin.consumables.lots.index"));
                });
            },
            onError: (errors) => {
                console.log('Submission Errors:', errors);
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                    icon: 'error'
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    เพิ่ม Lot วัสดุสิ้นเปลือง
                </h2>
            }
        >
            <AdminLayout>
                <Head title="เพิ่ม Lot วัสดุสิ้นเปลือง" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                                วัสดุสิ้นเปลือง
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>เพิ่ม Lot ใหม่</Breadcrumb.Item>
                        </Breadcrumb>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        {data.map((item, index) => (
                                            <div
                                                key={index}
                                                className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow duration-200 hover:shadow"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
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
                                                            <HiTrash className="mr-2 w-4 h-4" />
                                                            ลบรายการ
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`consumable-${index}`}
                                                        >
                                                            ชื่อวัสดุสิ้นเปลือง *
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
                                                                เลือกวัสดุสิ้นเปลือง
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
                                                        <p className="mt-2 text-sm text-gray-500">
                                                            เลือกวัสดุสิ้นเปลืองที่ต้องการเพิ่มในล็อต
                                                        </p>
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
                                                            <p className="mt-2 text-sm text-gray-500">
                                                                เลือกยี่ห้อหรือขนาดของวัสดุสิ้นเปลืองที่ต้องการ
                                                                <br />
                                                                <p className="text-red-500">(*จะแสดงเฉพาะยี่ห้อ/ขนาดที่ตั้งค่าไว้กับวัสดุสิ้นเปลืองที่เลือก)</p>
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`quantity-${index}`}
                                                        >
                                                            จำนวน(แพคเกจจิ้ง) *
                                                        </InputLabel>
                                                        <TextInput
                                                            id={`quantity-${index}`}
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            value={
                                                                item.quantity
                                                            }
                                                            className="block mt-1 w-full"
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
                                                        <p className="mt-2 text-sm text-gray-500">
                                                            ระบุจำนวนที่ต้องการเพิ่มใน Lot
                                                        </p>
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
                                                            className="block mt-1 w-full"
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
                                                        <p className="mt-2 text-sm text-gray-500">
                                                            ราคาของวัสดุสิ้นเปลืองต่อชิ้น
                                                        </p>
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
                                                            className="block mt-1 w-full"
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
                                                        <p className="mt-2 text-sm text-gray-500">
                                                            ปริมาณของวัสดุสิ้นเปลืองต่อชิ้น
                                                        </p>
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
                                                            ราคา(แพคเกจจิ้ง) *
                                                        </InputLabel>
                                                        <TextInput
                                                            id={`price-${index}`}
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            value={item.price}
                                                            className="block mt-1 w-full"
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
                                                        <p className="mt-2 text-sm text-gray-500">
                                                            ราคาที่ซื้อมาต่อแพ็คเกจจิ้ง
                                                            <br />
                                                            <p className="text-red-500">
                                                                (*หากมีอาจอ้างอิงราคาส่งของวัสดุสิ้นเปลืองจากใบเสร็จ)
                                                            </p>
                                                        </p>
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
                                                            className="block mt-1 w-full"
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
                                                        <p className="mt-2 text-sm text-gray-500">
                                                            ระบุผู้จำหน่าย
                                                        </p>
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
                                                            className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            rows="2"
                                                        />
                                                        <p className="mt-2 text-sm text-gray-500">
                                                            ระบุหมายเหตุของรายการหากมี
                                                        </p>
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

                                    <div className="flex justify-between items-center mt-6">
                                        <Button
                                            type="button"
                                            gradientDuoTone="purpleToBlue"
                                            onClick={handleAddRow}
                                        >
                                            <HiPlus className="mr-2 w-4 h-4" />
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
