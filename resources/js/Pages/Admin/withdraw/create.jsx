import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { HiHome, HiPlus, HiTrash } from "react-icons/hi";
import { Head, useForm } from "@inertiajs/react";
import { Breadcrumb, Button, Label, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";

export default function CreateWithdraw({ ingredients, consumables }) {
    const [withdrawItems, setWithdrawItems] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedLot, setSelectedLot] = useState("");
    const [availableItems, setAvailableItems] = useState([]);
    const [availableLots, setAvailableLots] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
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
        setQuantity(1);
        // Reset available lots based on type
        const items = type === "ingredient" ? ingredients : consumables;
        setAvailableLots(items);
    };

    // เมื่อเลือก Lot
    const handleLotChange = (lotId) => {
        setSelectedLot(lotId);
        const selectedLotItem = availableLots.find(
            (lot) => lot.id === parseInt(lotId)
        );
        if (selectedLotItem) {
            setAvailableItems([selectedLotItem]);
            setSelectedItem("");
            setQuantity(1);
        }
    };

    // เมื่อเลือกสินค้า
    const handleItemChange = (itemId) => {
        setSelectedItem(itemId);
        const item = availableItems.find((i) => i.id === parseInt(itemId));
        setMaxQuantity(item?.quantity || 0);
        setQuantity(1);
    };

    // เพิ่มรายการเบิก
    const addWithdrawItem = () => {
        // ตรวจสอบว่ามีการเลือกสินค้าซ้ำใน lot เดียวกันหรือไม่
        const isDuplicate = withdrawItems.some(
            (item) =>
                item.lot_id === selectedLot && item.item_id === selectedItem
        );

        if (isDuplicate) {
            alert("ไม่สามารถเลือกสินค้าซ้ำใน lot เดียวกันได้");
            return;
        }

        const newItem = {
            type: selectedType,
            lot_id: selectedLot,
            item_id: selectedItem,
            quantity: quantity,
            item_name: availableItems.find((i) => i.id === selectedItem)?.name,
        };

        setWithdrawItems([...withdrawItems, newItem]);
        setData("items", [...withdrawItems, newItem]);

        // Reset form
        setSelectedType("");
        setSelectedLot("");
        setSelectedItem("");
        setQuantity(1);
    };

    // ลบรายการเบิก
    const removeWithdrawItem = (index) => {
        const updatedItems = withdrawItems.filter((_, i) => i !== index);
        setWithdrawItems(updatedItems);
        setData("items", updatedItems);
    };

    // ส่งฟอร์ม
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.withdraws.store"));
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
                <form onSubmit={handleSubmit} className="space-y-6">
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
                                    onChange={(e) =>
                                        handleTypeChange(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">เลือกประเภท</option>
                                    <option value="ingredient">วัตถุดิบ</option>
                                    <option value="consumable">
                                        วัสดุสิ้นเปลือง
                                    </option>
                                </Select>
                            </div>

                            {/* เลือก Lot */}
                            <div>
                                <Label htmlFor="lot">Lot</Label>
                                <Select
                                    id="lot"
                                    value={selectedLot}
                                    onChange={(e) =>
                                        handleLotChange(e.target.value)
                                    }
                                    disabled={!selectedType}
                                    required
                                >
                                    <option value="">เลือก Lot</option>
                                    {availableLots?.map((lot) => (
                                        <option key={lot.id} value={lot.id}>
                                            {lot.name} (ID: {lot.id}, คงเหลือ:{" "}
                                            {lot.quantity})
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
                                    onChange={(e) =>
                                        handleItemChange(e.target.value)
                                    }
                                    disabled={!selectedLot}
                                    required
                                >
                                    <option value="">เลือกสินค้า</option>
                                    {availableItems?.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} (ID: {item.id}, คงเหลือ:{" "}
                                            {item.quantity})
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {/* จำนวน */}
                            <div>
                                <Label htmlFor="quantity">จำนวน</Label>
                                <TextInput
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    max={maxQuantity}
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(Number(e.target.value))
                                    }
                                    disabled={!selectedItem}
                                    required
                                />
                            </div>

                            {/* ปุ่มเพิ่มรายการ */}
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    onClick={addWithdrawItem}
                                    disabled={!selectedItem || quantity < 1}
                                >
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
                                            onClick={() =>
                                                removeWithdrawItem(index)
                                            }
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
                            type="submit"
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
