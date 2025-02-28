import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button, Label, Select, TextInput, Table, Card } from "flowbite-react";
import { HiPlus, HiTrash, HiPencil, HiCheck, HiX } from "react-icons/hi";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function ProductConsumablesForm({
    product,
    consumables,
    productConsumables = [],
}) {
    const [localConsumables, setLocalConsumables] = useState(productConsumables);
    const [editingId, setEditingId] = useState(null);
    const [editQuantity, setEditQuantity] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData } = useForm({
        product_id: product?.id,
        consumable_id: "",
        quantity_used: "",
        size: "s",
    });

    const handleAddConsumable = (e) => {
        e.preventDefault();

        const selectedConsumable = consumables.find(cons => cons.id === parseInt(data.consumable_id));
        if (!selectedConsumable) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาเลือกวัตถุดิบสิ้นเปลือง",
                icon: "warning",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        if (!data.quantity_used || parseFloat(data.quantity_used) <= 0) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาระบุปริมาณที่ถูกต้อง",
                icon: "warning",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        if (localConsumables.some(item => item.consumable_id === parseInt(data.consumable_id))) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "วัตถุดิบสิ้นเปลืองนี้ถูกเพิ่มในสูตรแล้ว",
                icon: "warning",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        const newConsumable = {
            id: `temp_${Date.now()}`,
            consumable_id: parseInt(data.consumable_id),
            quantity_used: parseFloat(data.quantity_used),
            size: data.size,
            consumable: selectedConsumable,
            isNew: true
        };

        setLocalConsumables(prev => [...prev, newConsumable]);
        setData({
            product_id: product?.id,
            consumable_id: "",
            quantity_used: "",
            size: "s",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!product?.id) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาบันทึกข้อมูลสินค้าก่อนเพิ่มวัตถุดิบสิ้นเปลือง",
                icon: "warning",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        if (localConsumables.length === 0) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาเพิ่มวัตถุดิบสิ้นเปลืองอย่างน้อย 1 รายการ",
                icon: "warning",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await router.post(route("admin.product-consumables.batch-update"), {
                product_id: product.id,
                consumables: localConsumables.map(item => ({
                    id: item.isNew ? null : item.id,
                    consumable_id: item.consumable_id,
                    quantity_used: parseFloat(item.quantity_used),
                    size: item.size
                })),
                preserveScroll: true
            });

            MySwal.fire({
                title: "สำเร็จ",
                text: "บันทึกข้อมูลสำเร็จ",
                icon: "success",
                confirmButtonText: "ตกลง",
            });
        } catch (error) {
            console.error("Error saving consumables:", error);
            MySwal.fire({
                title: "ผิดพลาด",
                text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
                icon: "error",
                confirmButtonText: "ตกลง",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = (productConsumable) => {
        if (!editQuantity || parseFloat(editQuantity) <= 0) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาระบุปริมาณที่ถูกต้อง",
                icon: "warning",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        setLocalConsumables(prev =>
            prev.map(item =>
                item.id === productConsumable.id
                    ? { ...item, quantity_used: parseFloat(editQuantity) }
                    : item
            )
        );
        setEditingId(null);
        setEditQuantity("");
    };

    const handleDelete = (productConsumable) => {
        MySwal.fire({
            title: "ยืนยันการลบ",
            text: "คุณต้องการลบวัตถุดิบสิ้นเปลืองนี้ออกจากสูตรใช่หรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ใช่, ลบเลย",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setLocalConsumables(prev =>
                    prev.filter(item => item.id !== productConsumable.id)
                );
                MySwal.fire({
                    title: "สำเร็จ",
                    text: "ลบวัตถุดิบสิ้นเปลืองเรียบร้อยแล้ว",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                });
            }
        });
    };

    const startEditing = (item) => {
        setEditingId(item.id);
        setEditQuantity(item.quantity_used);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditQuantity("");
    };

    return (
        <Card className="max-w-5xl mx-auto p-6">
            <div className="space-y-8">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="bg-purple-100 dark:bg-purple-900 p-2.5 rounded-lg">
                            📦
                        </span>
                        จัดการวัตถุดิบสิ้นเปลืองสำหรับ{" "}
                        <span className="text-purple-600 dark:text-purple-400">
                            {product?.name}
                        </span>
                    </h2>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                        <HiPlus className="h-6 w-6 text-purple-500" />
                        เพิ่มวัตถุดิบสิ้นเปลืองใหม่
                    </h3>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <div className="mb-2.5">
                                    <Label
                                        htmlFor="consumable_id"
                                        value="เลือกวัตถุดิบสิ้นเปลือง"
                                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <Select
                                    id="consumable_id"
                                    name="consumable_id"
                                    value={data.consumable_id}
                                    onChange={(e) => setData('consumable_id', e.target.value)}
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">เลือกวัตถุดิบสิ้นเปลือง</option>
                                    {consumables.map((consumable) => (
                                        <option
                                            key={consumable.id}
                                            value={consumable.id}
                                            disabled={localConsumables.some(
                                                (item) => item.consumable_id === consumable.id
                                            )}
                                            className="py-2"
                                        >
                                            {consumable.name} {consumable.unit ? `(${consumable.unit.name})` : ''}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="mb-2.5">
                                        <Label
                                            htmlFor="quantity_used"
                                            value="ปริมาณ"
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        />
                                    </div>
                                    <TextInput
                                        id="quantity_used"
                                        name="quantity_used"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={data.quantity_used}
                                        onChange={(e) => setData('quantity_used', e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <div className="mb-2.5">
                                        <Label
                                            htmlFor="size"
                                            value="ขนาด"
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        />
                                    </div>
                                    <Select
                                        id="size"
                                        name="size"
                                        value={data.size}
                                        onChange={(e) => setData('size', e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="s">S</option>
                                        <option value="m">M</option>
                                        <option value="l">L</option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button
                                onClick={handleAddConsumable}
                                disabled={!data.consumable_id || !data.quantity_used}
                                color="primary"
                                type="button"
                                className="px-6 py-2.5 text-sm font-medium transition-transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
                            >
                                <HiPlus className="h-5 w-5 mr-2" />
                                เพิ่มวัตถุดิบสิ้นเปลือง
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="bg-green-100 dark:bg-green-900 p-2.5 rounded-lg">
                                📋
                            </span>
                            วัตถุดิบสิ้นเปลืองที่ใช้ในสูตร
                        </h3>
                        {localConsumables.length > 0 && (
                            <Button
                                onClick={handleSubmit}
                                color="success"
                                className="px-6 py-2.5 text-sm font-medium transition-transform hover:scale-105 active:scale-95"
                                disabled={isSubmitting}
                            >
                                <HiCheck className="h-5 w-5 mr-2" />
                                บันทึกสูตร
                            </Button>
                        )}
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                        <Table hoverable>
                            <Table.Head className="bg-gray-50 dark:bg-gray-800">
                                <Table.HeadCell className="py-4 px-6 font-semibold">วัตถุดิบสิ้นเปลือง</Table.HeadCell>
                                <Table.HeadCell className="py-4 px-6 font-semibold">ปริมาณ</Table.HeadCell>
                                <Table.HeadCell className="py-4 px-6 font-semibold">หน่วย</Table.HeadCell>
                                <Table.HeadCell className="py-4 px-6 font-semibold">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                                {localConsumables.map((item) => (
                                    <Table.Row
                                        key={item.id}
                                        className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <Table.Cell className="py-4 px-6 font-medium">
                                            {item.consumable.name}
                                        </Table.Cell>
                                        <Table.Cell className="py-4 px-6">
                                            {editingId === item.id ? (
                                                <div className="flex items-center gap-3">
                                                    <TextInput
                                                        type="number"
                                                        min="0.01"
                                                        step="0.01"
                                                        value={editQuantity}
                                                        onChange={(e) => setEditQuantity(e.target.value)}
                                                        className="w-24 text-center rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                                                    />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {item.consumable.unit?.name || ''}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block min-w-[60px] text-center">
                                                    {item.quantity_used}
                                                </span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell className="py-4 px-6">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {item.consumable.unit?.name || '-'}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="py-4 px-6">
                                            <div className="flex gap-2">
                                                {editingId === item.id ? (
                                                    <>
                                                        <Button
                                                            color="success"
                                                            size="xs"
                                                            onClick={() => handleUpdate(item)}
                                                            className="transition-transform hover:scale-110 active:scale-95"
                                                        >
                                                            <HiCheck className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            color="gray"
                                                            size="xs"
                                                            onClick={cancelEditing}
                                                            className="transition-transform hover:scale-110 active:scale-95"
                                                        >
                                                            <HiX className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            color="info"
                                                            size="xs"
                                                            onClick={() => startEditing(item)}
                                                            className="transition-transform hover:scale-110 active:scale-95"
                                                        >
                                                            <HiPencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            color="failure"
                                                            size="xs"
                                                            onClick={() => handleDelete(item)}
                                                            className="transition-transform hover:scale-110 active:scale-95"
                                                        >
                                                            <HiTrash className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {localConsumables.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={4} className="text-center py-8 text-gray-500">
                                            ยังไม่มีวัตถุดิบสิ้นเปลืองในสูตรนี้
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </Card>
    );
}
