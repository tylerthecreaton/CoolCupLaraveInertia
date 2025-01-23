import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { HiHome, HiPlus, HiTrash } from "react-icons/hi";
import { Head, useForm } from "@inertiajs/react";
import { Breadcrumb, Button, Label, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function CreateWithdraw({ ingredientLots, consumables }) {
    const [withdrawItems, setWithdrawItems] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const [selectedTransformer, setSelectedTransformer] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [availableItems, setAvailableItems] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        items: [],
    });

    // เมื่อเลือกประเภทวัตถุดิบ
    const handleTypeChange = (type) => {
        setSelectedType(type);
        setSelectedItem("");
        setSelectedTransformer("");
        setQuantity(1);
        setMaxQuantity(0);

        if (!type) {
            setAvailableItems([]);
            return;
        }

        const items = type === "ingredient" ? ingredientLots : consumables;
        setAvailableItems(items || []);
    };

    // เมื่อเลือกสินค้าและ lot
    const handleItemChange = (value) => {
        setSelectedItem(value);
        setSelectedTransformer("");
        setQuantity(1);

        if (!value) {
            setMaxQuantity(0);
            return;
        }

        if (selectedType === "consumable") {
            const [groupIndex, itemIndex] = value.split("-").map(Number);
            const group = availableItems[groupIndex];
            const item = group.items[itemIndex];
            setMaxQuantity(item.quantity);
        } else {
            // Handle ingredient selection
            const [lotId, itemId] = value.split("-").map(Number);
            const lot = availableItems.find(l => l.id === lotId);
            if (lot) {
                const item = lot.items.find(i => i.id === itemId);
                if (item) {
                    setMaxQuantity(item.quantity);
                }
            }
        }
    };

    // เมื่อเลือก transformer
    const handleTransformerChange = (transformerId) => {
        setSelectedTransformer(transformerId);
    };

    // เพิ่มรายการเบิก
    const handleAddItem = () => {
        if (!selectedItem || !quantity || (selectedType === "consumable" && !selectedTransformer)) {
            Swal.fire({
                icon: "error",
                title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                text: "กรุณาเลือกสินค้า, จำนวน และประเภทสินค้า (สำหรับวัสดุสิ้นเปลือง)",
            });
            return;
        }

        if (quantity > maxQuantity) {
            Swal.fire({
                icon: "error",
                title: "จำนวนไม่ถูกต้อง",
                text: `จำนวนต้องไม่เกิน ${maxQuantity}`,
            });
            return;
        }

        let selectedItemData;
        let lotId, lotCreatedAt;

        if (selectedType === "consumable") {
            const [groupIndex, itemIndex] = selectedItem.split("-").map(Number);
            const group = availableItems[groupIndex];
            selectedItemData = group.items[itemIndex];
            lotId = selectedItemData.lot_id;
            lotCreatedAt = selectedItemData.lot_created_at;
        } else {
            const [lotId_, itemId] = selectedItem.split("-").map(Number);
            const lot = availableItems.find(l => l.id === lotId_);
            selectedItemData = lot.items.find(i => i.id === itemId);
            lotId = lot.id;
            lotCreatedAt = lot.created_at;
        }

        let selectedTransformerData = null;
        if (selectedType === "consumable") {
            selectedTransformerData = selectedItemData.transformers.find(
                (t) => t.id.toString() === selectedTransformer.toString()
            );
        }

        const newItem = {
            type: selectedType,
            lot_id: lotId,
            lot_created_at: lotCreatedAt,
            item_id: selectedItemData.id,
            item_name: selectedItemData.name,
            quantity: quantity,
            transformer_id: selectedTransformerData?.id || null,
            transformer_name: selectedTransformerData?.name || null,
        };

        setWithdrawItems([...withdrawItems, newItem]);
        setData("items", [...withdrawItems, newItem]);

        // Reset form
        setSelectedItem("");
        setSelectedTransformer("");
        setQuantity(1);
    };

    return (
        <AdminLayout>
            <Head title="เบิกวัตถุดิบ" />
            <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5">
                <div className="mb-1 w-full">
                    <div className="mb-4">
                        <Breadcrumb>
                            <Breadcrumb.Item href={route("dashboard")} icon={HiHome}>
                                แดชบอร์ด
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href={route("admin.withdraw.index")}>
                                รายการเบิกวัตถุดิบ
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>เบิกวัตถุดิบ</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                            เบิกวัตถุดิบ
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="p-4">
                            <form>
                                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="type" value="ประเภท" />
                                        </div>
                                        <Select
                                            id="type"
                                            value={selectedType}
                                            onChange={(e) => handleTypeChange(e.target.value)}
                                        >
                                            <option value="">เลือกประเภท</option>
                                            <option value="ingredient">วัตถุดิบ</option>
                                            <option value="consumable">วัสดุสิ้นเปลือง</option>
                                        </Select>
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="item" value="สินค้า" />
                                        </div>
                                        <Select
                                            id="item"
                                            value={selectedItem}
                                            onChange={(e) => handleItemChange(e.target.value)}
                                        >
                                            <option value="">เลือกสินค้า</option>
                                            {selectedType === "consumable" ? (
                                                availableItems.map((group, groupIndex) => (
                                                    <optgroup key={groupIndex} label={group.name}>
                                                        {group.items.map((item, itemIndex) => (
                                                            <option
                                                                key={`${groupIndex}-${itemIndex}`}
                                                                value={`${groupIndex}-${itemIndex}`}
                                                            >
                                                                Lot #{item.lot_id} - {new Date(item.lot_created_at).toLocaleDateString()} (คงเหลือ: {item.quantity})
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))
                                            ) : (
                                                availableItems.map((lot) => (
                                                    <optgroup
                                                        key={lot.id}
                                                        label={`Lot #${lot.id} - ${new Date(lot.created_at).toLocaleDateString()}`}
                                                    >
                                                        {lot.items.map((item) => (
                                                            <option
                                                                key={`${lot.id}-${item.id}`}
                                                                value={`${lot.id}-${item.id}`}
                                                            >
                                                                {item.name} (คงเหลือ: {item.quantity})
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))
                                            )}
                                        </Select>
                                    </div>

                                    {selectedType === "consumable" && selectedItem && (
                                        <div>
                                            <div className="mb-2 block">
                                                <Label htmlFor="transformer" value="ประเภทสินค้า" />
                                            </div>
                                            <Select
                                                id="transformer"
                                                value={selectedTransformer}
                                                onChange={(e) => handleTransformerChange(e.target.value)}
                                            >
                                                <option value="">เลือกประเภทสินค้า</option>
                                                {(() => {
                                                    if (selectedItem) {
                                                        const [groupIndex, itemIndex] = selectedItem.split("-").map(Number);
                                                        const group = availableItems[groupIndex];
                                                        const item = group.items[itemIndex];
                                                        return item.transformers.map((transformer) => (
                                                            <option key={transformer.id} value={transformer.id}>
                                                                {transformer.name} (x{transformer.multiplier})
                                                            </option>
                                                        ));
                                                    }
                                                    return null;
                                                })()}
                                            </Select>
                                        </div>
                                    )}

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="quantity" value="จำนวน" />
                                        </div>
                                        <TextInput
                                            id="quantity"
                                            type="number"
                                            min={1}
                                            max={maxQuantity}
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <Button type="button" onClick={handleAddItem}>
                                    <HiPlus className="mr-2 h-5 w-5" />
                                    เพิ่มรายการ
                                </Button>
                            </form>

                            {withdrawItems.length > 0 && (
                                <div className="mt-4">
                                    <h2 className="text-lg font-semibold mb-2">รายการที่เลือก</h2>
                                    <div className="relative overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">
                                                        ประเภท
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Lot
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        สินค้า
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        ประเภทสินค้า
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        จำนวน
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        จัดการ
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {withdrawItems.map((item, index) => (
                                                    <tr key={index} className="bg-white border-b">
                                                        <td className="px-6 py-4">
                                                            {item.type === "ingredient"
                                                                ? "วัตถุดิบ"
                                                                : "วัสดุสิ้นเปลือง"}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {new Date(item.lot_created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4">{item.item_name}</td>
                                                        <td className="px-6 py-4">
                                                            {item.transformer_name || "-"}
                                                        </td>
                                                        <td className="px-6 py-4">{item.quantity}</td>
                                                        <td className="px-6 py-4">
                                                            <Button
                                                                color="failure"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const newItems = withdrawItems.filter(
                                                                        (_, i) => i !== index
                                                                    );
                                                                    setWithdrawItems(newItems);
                                                                    setData("items", newItems);
                                                                }}
                                                            >
                                                                <HiTrash className="mr-2 h-4 w-4" />
                                                                ลบ
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-4">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                post(route("admin.withdraws.store"));
                                            }}
                                            disabled={processing}
                                        >
                                            บันทึกการเบิก
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
