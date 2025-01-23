import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { HiHome, HiPlus, HiTrash } from "react-icons/hi";
import { Head, useForm } from "@inertiajs/react";
import { Breadcrumb, Button, Label, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function CreateWithdraw({ ingredientLots, consumableLots }) {
    const [withdrawItems, setWithdrawItems] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedLot, setSelectedLot] = useState("");
    const [availableItems, setAvailableItems] = useState([]);
    const [availableLots, setAvailableLots] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [selectedTransformer, setSelectedTransformer] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [maxQuantity, setMaxQuantity] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        items: [],
    });

    // เมื่อเลือกประเภทวัตถุดิบ
    const handleTypeChange = (type) => {
        setSelectedType(type);
        setSelectedLot("");
        setSelectedItem("");
        setSelectedTransformer("");
        setQuantity(1);
        setAvailableLots([]);

        if (!type) {
            setAvailableItems([]);
            return;
        }

        const items = type === "ingredient" ? ingredientLots : consumableLots;
        setAvailableLots(items || []);
    };

    // เมื่อเลือก lot
    const handleLotChange = (lotId) => {
        setSelectedLot(lotId);
        setSelectedItem("");
        setSelectedTransformer("");
        setQuantity(1);

        if (!lotId) {
            setAvailableItems([]);
            return;
        }

        const selectedLotData = availableLots.find((lot) => lot.id.toString() === lotId.toString());
        if (selectedLotData && selectedLotData.items) {
            setAvailableItems(selectedLotData.items);
        } else {
            setAvailableItems([]);
        }
    };

    // เมื่อเลือกสินค้า
    const handleItemChange = (itemId) => {
        setSelectedItem(itemId);
        setSelectedTransformer("");
        setQuantity(1);

        if (!itemId) {
            setMaxQuantity(0);
            return;
        }

        const selectedItemData = availableItems.find((item) => item.id.toString() === itemId.toString());
        if (selectedItemData) {
            setMaxQuantity(selectedItemData.quantity);
        }
    };

    // เมื่อเลือก transformer
    const handleTransformerChange = (transformerId) => {
        setSelectedTransformer(transformerId);
    };

    // เพิ่มรายการเบิก
    const handleAddItem = () => {
        if (!selectedLot || !selectedItem || !quantity || (selectedType === "consumable" && !selectedTransformer)) {
            Swal.fire({
                icon: "error",
                title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                text: "กรุณาเลือก Lot, สินค้า, จำนวน และประเภทสินค้า (สำหรับวัสดุสิ้นเปลือง)",
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

        const selectedLotData = availableLots.find((lot) => lot.id.toString() === selectedLot.toString());
        const selectedItemData = availableItems.find((item) => item.id.toString() === selectedItem.toString());
        let selectedTransformerData = null;

        if (selectedType === "consumable") {
            selectedTransformerData = selectedItemData.transformers.find(
                (t) => t.id.toString() === selectedTransformer.toString()
            );
        }

        const newItem = {
            type: selectedType,
            lot_id: selectedLot,
            lot_created_at: selectedLotData.created_at,
            item_id: selectedItem,
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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    เบิกวัตถุดิบ
                </h2>
            }
        >
            <Head title="เบิกวัตถุดิบ" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        หน้าแรก
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/withdraws">
                        รายการเบิกทั้งหมด
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>เบิกวัตถุดิบ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <AdminLayout>
                <form>
                    {/* ส่วนเพิ่มรายการเบิก */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="mb-4 text-lg font-medium">
                            เพิ่มรายการเบิก
                        </h3>
                        <div className="grid gap-4 md:grid-cols-5">
                            {/* เลือกประเภทวัตถุดิบ */}
                            <div>
                                <Label htmlFor="type">ประเภทวัตถุดิบ</Label>
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

                            {/* เลือก Lot */}
                            <div>
                                <Label htmlFor="lot">Lot</Label>
                                <Select
                                    id="lot"
                                    value={selectedLot}
                                    onChange={(e) => handleLotChange(e.target.value)}
                                >
                                    <option value="">เลือก Lot</option>
                                    {availableLots.map((lot) => (
                                        <option key={lot.id} value={lot.id}>
                                            {new Date(lot.created_at).toLocaleDateString()} (
                                            {lot.items_count} รายการ)
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {/* เลือกสินค้า */}
                            <div>
                                <Label htmlFor="item">สินค้า</Label>
                                <Select
                                    id="item"
                                    value={selectedItem}
                                    onChange={(e) => handleItemChange(e.target.value)}
                                >
                                    <option value="">เลือกสินค้า</option>
                                    {availableItems.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} (คงเหลือ: {item.quantity})
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {selectedType === "consumable" && selectedItem && (
                                <div>
                                    <Label htmlFor="transformer">ประเภทสินค้า</Label>
                                    <Select
                                        id="transformer"
                                        value={selectedTransformer}
                                        onChange={(e) => handleTransformerChange(e.target.value)}
                                    >
                                        <option value="">เลือกประเภทสินค้า</option>
                                        {availableItems
                                            .find((item) => item.id.toString() === selectedItem.toString())
                                            ?.transformers.map((transformer) => (
                                                <option key={transformer.id} value={transformer.id}>
                                                    {transformer.name} (x{transformer.multiplier})
                                                </option>
                                            ))}
                                    </Select>
                                </div>
                            )}

                            {/* จำนวน */}
                            <div>
                                <Label htmlFor="quantity">จำนวน</Label>
                                <TextInput
                                    id="quantity"
                                    type="number"
                                    min={1}
                                    max={maxQuantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                />
                            </div>

                            {/* ปุ่มเพิ่มรายการ */}
                            <div className="flex items-end">
                                <Button type="button" onClick={handleAddItem}>
                                    <HiPlus className="w-4 h-4 mr-2" />
                                    เพิ่มรายการ
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* แสดงรายการที่เลือก */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="mb-4 text-lg font-medium">
                            รายการที่เลือก
                        </h3>
                        {withdrawItems.length === 0 ? (
                            <p className="text-gray-500">
                                ยังไม่มีรายการที่เลือก
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {withdrawItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {item.item_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {item.type === "ingredient"
                                                    ? "วัตถุดิบ"
                                                    : "วัสดุสิ้นเปลือง"}{" "}
                                                | Lot: {item.lot_id} | จำนวน:{" "}
                                                {item.quantity}
                                            </p>
                                        </div>
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
                                            <HiTrash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ปุ่มบันทึก */}
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={() => {
                                post(route("admin.withdraws.store"));
                            }}
                            disabled={processing || withdrawItems.length === 0}
                        >
                            {processing ? "กำลังบันทึก..." : "บันทึกการเบิก"}
                        </Button>
                    </div>
                </form>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
