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
            consumable: selectedConsumable,
            isNew: true
        };

        setLocalConsumables(prev => [...prev, newConsumable]);
        setData({
            product_id: product?.id,
            consumable_id: "",
            quantity_used: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

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
                    quantity_used: parseFloat(item.quantity_used)
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
        <Card className="max-w-4xl mx-auto">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    จัดการวัตถุดิบสิ้นเปลืองสำหรับ {product?.name}
                </h2>

                <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                        เพิ่มวัตถุดิบสิ้นเปลืองใหม่
                    </h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <div className="block mb-2">
                                    <Label
                                        htmlFor="consumable_id"
                                        value="เลือกวัตถุดิบสิ้นเปลือง"
                                        className="text-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <Select
                                    id="consumable_id"
                                    name="consumable_id"
                                    value={data.consumable_id}
                                    onChange={(e) => setData('consumable_id', e.target.value)}
                                    required
                                    className="w-full"
                                >
                                    <option value="">เลือกวัตถุดิบสิ้นเปลือง</option>
                                    {consumables.map((consumable) => (
                                        <option
                                            key={consumable.id}
                                            value={consumable.id}
                                            disabled={localConsumables.some(
                                                (item) => item.consumable_id === consumable.id
                                            )}
                                        >
                                            {consumable.name} {consumable.unit ? `(${consumable.unit.name})` : ''}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <div className="block mb-2">
                                    <Label
                                        htmlFor="quantity_used"
                                        value="ปริมาณ"
                                        className="text-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <TextInput
                                        id="quantity_used"
                                        name="quantity_used"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={data.quantity_used}
                                        onChange={(e) => setData('quantity_used', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={handleAddConsumable}
                            disabled={!data.consumable_id || !data.quantity_used}
                            color="primary"
                            type="button"
                        >
                            <HiPlus className="h-4 w-4 mr-2" />
                            เพิ่มวัตถุดิบสิ้นเปลือง
                        </Button>
                    </form>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            วัตถุดิบสิ้นเปลืองที่ใช้ในสูตร
                        </h3>
                        {localConsumables.length > 0 && (
                            <Button
                                onClick={handleSubmit}
                                color="success"
                                className="px-4"
                                disabled={isSubmitting}
                            >
                                <HiCheck className="h-4 w-4 mr-2" />
                                บันทึกสูตร
                            </Button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="bg-gray-50">วัตถุดิบสิ้นเปลือง</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">ปริมาณ</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">หน่วย</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {localConsumables.map((item) => (
                                    <Table.Row
                                        key={item.id}
                                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.consumable.name}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {editingId === item.id ? (
                                                <div className="flex items-center gap-2">
                                                    <TextInput
                                                        type="number"
                                                        min="0.01"
                                                        step="0.01"
                                                        value={editQuantity}
                                                        onChange={(e) => setEditQuantity(e.target.value)}
                                                        className="w-24"
                                                    />
                                                    <span className="text-gray-600">
                                                        {item.consumable.unit?.name || ''}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-medium">
                                                    {item.quantity_used}
                                                </span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {item.consumable.unit?.name || '-'}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex gap-2">
                                                {editingId === item.id ? (
                                                    <>
                                                        <Button
                                                            color="success"
                                                            size="sm"
                                                            onClick={() => handleUpdate(item)}
                                                            className="px-2"
                                                        >
                                                            <HiCheck className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            color="gray"
                                                            size="sm"
                                                            onClick={cancelEditing}
                                                            className="px-2"
                                                        >
                                                            <HiX className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            color="info"
                                                            size="sm"
                                                            onClick={() => startEditing(item)}
                                                            className="px-2"
                                                        >
                                                            <HiPencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            color="failure"
                                                            size="sm"
                                                            onClick={() => handleDelete(item)}
                                                            className="px-2"
                                                        >
                                                            <HiTrash className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </Card>
    );
}