import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button, Label, Select, TextInput, Table, Card } from "flowbite-react";
import { HiPlus, HiTrash, HiPencil, HiCheck, HiX } from "react-icons/hi";

export default function ProductIngredientsForm({
    product,
    ingredients,
    productIngredients = [],
}) {
    const [editingId, setEditingId] = useState(null);
    const [editQuantity, setEditQuantity] = useState("");

    const { data, setData, post, put, processing, errors, reset } = useForm({
        product_id: product?.id,
        ingredient_id: "",
        quantity_used: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.product-ingredients.store"), {
            onSuccess: () => {
                reset("ingredient_id", "quantity_used");
            },
        });
    };

    const handleUpdate = (productIngredient) => {
        put(route("admin.product-ingredients.update", productIngredient.id), {
            quantity_used: editQuantity,
        });
        setEditingId(null);
    };

    const handleDelete = (productIngredient) => {
        if (confirm("คุณต้องการลบวัตถุดิบนี้ออกจากสูตรใช่หรือไม่?")) {
            router.delete(
                route("admin.product-ingredients.destroy", productIngredient.id)
            );
        }
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
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                    onChange={(e) => setData("ingredient_id", e.target.value)}
                                    required
                                    className="w-full"
                                >
                                    <option value="">เลือกวัตถุดิบ</option>
                                    {ingredients.map((ingredient) => (
                                        <option
                                            key={ingredient.id}
                                            value={ingredient.id}
                                            disabled={productIngredients.some(
                                                (item) => item.ingredient_id === ingredient.id
                                            )}
                                        >
                                            {ingredient.name} ({ingredient.unit?.name || "หน่วย"})
                                        </option>
                                    ))}
                                </Select>
                                {errors.ingredient_id && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.ingredient_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <div className="block mb-2">
                                    <Label
                                        htmlFor="quantity_used"
                                        value="ปริมาณ"
                                        className="text-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <TextInput
                                    id="quantity_used"
                                    name="quantity_used"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.quantity_used}
                                    onChange={(e) => setData("quantity_used", e.target.value)}
                                    required
                                />
                                {errors.quantity_used && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.quantity_used}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button type="submit" disabled={processing} className="w-full md:w-auto">
                            <HiPlus className="h-4 w-4 mr-2" />
                            เพิ่มวัตถุดิบ
                        </Button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        วัตถุดิบที่ใช้ในสูตร
                    </h3>
                    <div className="overflow-x-auto">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="bg-gray-50">วัตถุดิบ</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">ปริมาณ</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">หน่วย</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {productIngredients.map((item) => (
                                    <Table.Row
                                        key={item.id}
                                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.ingredient.name}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {editingId === item.id ? (
                                                <TextInput
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={editQuantity}
                                                    onChange={(e) => setEditQuantity(e.target.value)}
                                                    className="w-24"
                                                />
                                            ) : (
                                                <span className="font-medium">
                                                    {item.quantity_used}
                                                </span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {item.ingredient.unit?.name || "หน่วย"}
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
                                {productIngredients.length === 0 && (
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
