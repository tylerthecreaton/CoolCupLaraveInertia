import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button, Label, Select, TextInput, Table, Card } from "flowbite-react";
import { HiPlus, HiTrash, HiPencil, HiCheck, HiX } from "react-icons/hi";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function ProductIngredientsForm({
    product,
    ingredients,
    productIngredients = [],
}) {
    const [localIngredients, setLocalIngredients] = useState(productIngredients);
    const [editingId, setEditingId] = useState(null);
    const [editQuantity, setEditQuantity] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData } = useForm({
        product_id: product?.id,
        ingredient_id: "",
        quantity_used: "",
    });

    const handleAddIngredient = (e) => {
        e.preventDefault();
        
        const selectedIngredient = ingredients.find(ing => ing.id === parseInt(data.ingredient_id));
        if (!selectedIngredient) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาเลือกวัตถุดิบ",
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

        if (localIngredients.some(item => item.ingredient_id === parseInt(data.ingredient_id))) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "วัตถุดิบนี้ถูกเพิ่มในสูตรแล้ว",
                icon: "warning",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        const newIngredient = {
            id: `temp_${Date.now()}`,
            ingredient_id: parseInt(data.ingredient_id),
            quantity_used: parseFloat(data.quantity_used),
            ingredient: selectedIngredient,
            isNew: true
        };

        setLocalIngredients(prev => [...prev, newIngredient]);
        setData({
            product_id: product?.id,
            ingredient_id: "",
            quantity_used: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (localIngredients.length === 0) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาเพิ่มวัตถุดิบอย่างน้อย 1 รายการ",
                icon: "warning",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await router.post(route("admin.product-ingredients.batch-update"), {
                product_id: product.id,
                ingredients: localIngredients.map(item => ({
                    id: item.isNew ? null : item.id,
                    ingredient_id: item.ingredient_id,
                    quantity_used: parseFloat(item.quantity_used)
                }))
            });

            MySwal.fire({
                title: "สำเร็จ",
                text: "บันทึกข้อมูลสำเร็จ",
                icon: "success",
                confirmButtonText: "ตกลง",
            });
        } catch (error) {
            console.error("Error saving ingredients:", error);
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

    const handleUpdate = (productIngredient) => {
        if (!editQuantity || parseFloat(editQuantity) <= 0) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาระบุปริมาณที่ถูกต้อง",
                icon: "warning",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        setLocalIngredients(prev =>
            prev.map(item =>
                item.id === productIngredient.id
                    ? { ...item, quantity_used: parseFloat(editQuantity) }
                    : item
            )
        );
        setEditingId(null);
        setEditQuantity("");
    };

    const handleDelete = (productIngredient) => {
        MySwal.fire({
            title: "ยืนยันการลบ",
            text: "คุณต้องการลบวัตถุดิบนี้ออกจากสูตรใช่หรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ใช่, ลบเลย",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setLocalIngredients(prev =>
                    prev.filter(item => item.id !== productIngredient.id)
                );
                MySwal.fire({
                    title: "สำเร็จ",
                    text: "ลบวัตถุดิบเรียบร้อยแล้ว",
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
                    จัดการวัตถุดิบสำหรับ {product?.name}
                </h2>

                <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                        เพิ่มวัตถุดิบใหม่
                    </h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <div className="block mb-2">
                                    <Label
                                        htmlFor="ingredient_id"
                                        value="เลือกวัตถุดิบ"
                                        className="text-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <Select
                                    id="ingredient_id"
                                    name="ingredient_id"
                                    value={data.ingredient_id}
                                    onChange={(e) => setData('ingredient_id', e.target.value)}
                                    required
                                    className="w-full"
                                >
                                    <option value="">เลือกวัตถุดิบ</option>
                                    {ingredients.map((ingredient) => (
                                        <option
                                            key={ingredient.id}
                                            value={ingredient.id}
                                            disabled={localIngredients.some(
                                                (item) => item.ingredient_id === ingredient.id
                                            )}
                                        >
                                            {ingredient.name} {ingredient.unit ? `(${ingredient.unit.name})` : ''}
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
                            onClick={handleAddIngredient}
                            disabled={!data.ingredient_id || !data.quantity_used}
                            color="primary"
                            type="button"
                        >
                            <HiPlus className="h-4 w-4 mr-2" />
                            เพิ่มวัตถุดิบ
                        </Button>
                    </form>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            วัตถุดิบที่ใช้ในสูตร
                        </h3>
                        {localIngredients.length > 0 && (
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
                                <Table.HeadCell className="bg-gray-50">วัตถุดิบ</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">ปริมาณ</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">หน่วย</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {localIngredients.map((item) => (
                                    <Table.Row
                                        key={item.id}
                                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.ingredient.name}
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
                                                        {item.ingredient.unit?.name || ''}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-medium">
                                                    {item.quantity_used}
                                                </span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {item.ingredient.unit?.name || '-'}
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
                                {localIngredients.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={4} className="text-center py-4 text-gray-500">
                                            ยังไม่มีวัตถุดิบในสูตรนี้
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
