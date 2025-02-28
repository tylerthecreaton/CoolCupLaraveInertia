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
    const [editQuantityS, setEditQuantityS] = useState("");
    const [editQuantityM, setEditQuantityM] = useState("");
    const [editQuantityL, setEditQuantityL] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData } = useForm({
        product_id: product?.id,
        ingredient_id: "",
        quantity_size_s: 0,
        quantity_size_m: 0,
        quantity_size_l: 0,
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

        if (!data.quantity_size_s || !data.quantity_size_m || !data.quantity_size_l ||
            parseFloat(data.quantity_size_s) < 0 || parseFloat(data.quantity_size_m) < 0 || parseFloat(data.quantity_size_l) < 0) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาระบุปริมาณที่ถูกต้องสำหรับทุกขนาด",
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
            quantity_size_s: parseFloat(data.quantity_size_s),
            quantity_size_m: parseFloat(data.quantity_size_m),
            quantity_size_l: parseFloat(data.quantity_size_l),
            ingredient: selectedIngredient,
            isNew: true
        };

        setLocalIngredients(prev => [...prev, newIngredient]);
        setData({
            product_id: product?.id,
            ingredient_id: "",
            quantity_size_s: "",
            quantity_size_m: "",
            quantity_size_l: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product?.id) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาบันทึกข้อมูลสินค้าก่อนเพิ่มวัตถุดิบ",
                icon: "warning",
                confirmButtonText: "ตกลง",
            });
            return;
        }

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
                    quantity_size_s: item.quantity_size_s,
                    quantity_size_m: item.quantity_size_m,
                    quantity_size_l: item.quantity_size_l,
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
        if (!editQuantityS || !editQuantityM || !editQuantityL ||
            parseFloat(editQuantityS) < 0 || parseFloat(editQuantityM) < 0 || parseFloat(editQuantityL) < 0) {
            MySwal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาระบุปริมาณที่ถูกต้องสำหรับทุกขนาด",
                icon: "warning",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        setLocalIngredients(prev =>
            prev.map(item =>
                item.id === productIngredient.id
                    ? {
                        ...item,
                        quantity_size_s: parseFloat(editQuantityS),
                        quantity_size_m: parseFloat(editQuantityM),
                        quantity_size_l: parseFloat(editQuantityL)
                    }
                    : item
            )
        );
        setEditingId(null);
        setEditQuantityS("");
        setEditQuantityM("");
        setEditQuantityL("");
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
        setEditQuantityS(item.quantity_size_s.toString());
        setEditQuantityM(item.quantity_size_m.toString());
        setEditQuantityL(item.quantity_size_l.toString());
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditQuantityS("");
        setEditQuantityM("");
        setEditQuantityL("");
    };

    return (
        <Card className="max-w-5xl mx-auto p-6">
            <div className="space-y-8">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="bg-blue-100 dark:bg-blue-900 p-2.5 rounded-lg">
                            🥤
                        </span>
                        จัดการวัตถุดิบสำหรับ{" "}
                        <span className="text-blue-600 dark:text-blue-400">
                            {product?.name}
                        </span>
                    </h2>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                        <HiPlus className="h-6 w-6 text-blue-500" />
                        เพิ่มวัตถุดิบใหม่
                    </h3>
                    <form className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-5">
                            <div className="sm:col-span-2">
                                <Label htmlFor="ingredient_id" value="วัตถุดิบ" className="text-sm font-medium mb-2.5 block" />
                                <Select
                                    id="ingredient_id"
                                    value={data.ingredient_id}
                                    onChange={(e) => setData("ingredient_id", e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">เลือกวัตถุดิบ</option>
                                    {ingredients.map((ingredient) => (
                                        <option
                                            key={ingredient.id}
                                            value={ingredient.id}
                                            className="py-2"
                                        >
                                            {ingredient.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="quantity_size_s" value="ปริมาณ (ไซส์ S)" className="text-sm font-medium mb-2.5 block" />
                                <TextInput
                                    id="quantity_size_s"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.quantity_size_s}
                                    onChange={(e) => setData("quantity_size_s", e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <Label htmlFor="quantity_size_m" value="ปริมาณ (ไซส์ M)" className="text-sm font-medium mb-2.5 block" />
                                <TextInput
                                    id="quantity_size_m"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.quantity_size_m}
                                    onChange={(e) => setData("quantity_size_m", e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <Label htmlFor="quantity_size_l" value="ปริมาณ (ไซส์ L)" className="text-sm font-medium mb-2.5 block" />
                                <TextInput
                                    id="quantity_size_l"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.quantity_size_l}
                                    onChange={(e) => setData("quantity_size_l", e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button
                                onClick={handleAddIngredient}
                                disabled={!data.ingredient_id || !data.quantity_size_s || !data.quantity_size_m || !data.quantity_size_l}
                                color="primary"
                                type="button"
                                className="px-6 py-2.5 text-sm font-medium transition-transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
                            >
                                <HiPlus className="h-5 w-5 mr-2" />
                                เพิ่มวัตถุดิบ
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
                            วัตถุดิบที่ใช้ในสูตร
                        </h3>
                        {localIngredients.length > 0 && (
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
                                <Table.HeadCell className="py-4 px-6 font-semibold">วัตถุดิบ</Table.HeadCell>
                                <Table.HeadCell className="py-4 px-6 font-semibold">ปริมาณ (ไซส์ S)</Table.HeadCell>
                                <Table.HeadCell className="py-4 px-6 font-semibold">ปริมาณ (ไซส์ M)</Table.HeadCell>
                                <Table.HeadCell className="py-4 px-6 font-semibold">ปริมาณ (ไซส์ L)</Table.HeadCell>
                                <Table.HeadCell className="py-4 px-6 font-semibold">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                                {localIngredients.map((item) => (
                                    <Table.Row 
                                        key={item.id}
                                        className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <Table.Cell className="py-4 px-6 font-medium">
                                            {item.ingredient.name}
                                        </Table.Cell>
                                        <Table.Cell className="py-4 px-6">
                                            {editingId === item.id ? (
                                                <TextInput
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={editQuantityS}
                                                    onChange={(e) => setEditQuantityS(e.target.value)}
                                                    className="w-24 text-center rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block min-w-[60px] text-center">
                                                    {item.quantity_size_s}
                                                </span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell className="py-4 px-6">
                                            {editingId === item.id ? (
                                                <TextInput
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={editQuantityM}
                                                    onChange={(e) => setEditQuantityM(e.target.value)}
                                                    className="w-24 text-center rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block min-w-[60px] text-center">
                                                    {item.quantity_size_m}
                                                </span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell className="py-4 px-6">
                                            {editingId === item.id ? (
                                                <TextInput
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={editQuantityL}
                                                    onChange={(e) => setEditQuantityL(e.target.value)}
                                                    className="w-24 text-center rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block min-w-[60px] text-center">
                                                    {item.quantity_size_l}
                                                </span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell className="py-4 px-6">
                                            {editingId === item.id ? (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="xs"
                                                        color="success"
                                                        onClick={() => handleUpdate(item)}
                                                        className="transition-transform hover:scale-110 active:scale-95"
                                                    >
                                                        <HiCheck className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="xs"
                                                        color="gray"
                                                        onClick={cancelEditing}
                                                        className="transition-transform hover:scale-110 active:scale-95"
                                                    >
                                                        <HiX className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="xs"
                                                        color="info"
                                                        onClick={() => startEditing(item)}
                                                        className="transition-transform hover:scale-110 active:scale-95"
                                                    >
                                                        <HiPencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="xs"
                                                        color="failure"
                                                        onClick={() => handleDelete(item)}
                                                        className="transition-transform hover:scale-110 active:scale-95"
                                                    >
                                                        <HiTrash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {localIngredients.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={5} className="text-center py-8 text-gray-500">
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
