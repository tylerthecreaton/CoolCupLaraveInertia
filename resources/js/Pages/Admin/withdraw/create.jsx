import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { HiHome, HiPlus, HiTrash } from "react-icons/hi";
import { Head, useForm } from "@inertiajs/react";
import { Breadcrumb, Button, Label, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function CreateWithdraw({ ingredients, consumables }) {
    console.log(consumables);
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
        setAvailableLots([]);

        if (!type) {
            setAvailableItems([]);
            return;
        }

        const items = type === "ingredient" ? ingredients : consumables;
        if (!items || !Array.isArray(items)) {
            setAvailableItems([]);
            return;
        }

        // Group items by their name and collect all lots
        const groupedItems = items.reduce((acc, lot) => {
            if (!lot || !Array.isArray(lot.items)) return acc;

            lot.items.forEach((item) => {
                if (!item) return;

                const existingGroup = acc.find((g) => g.name === item.name);
                if (!existingGroup) {
                    acc.push({
                        id: item.id,
                        name: item.name,
                        items: [
                            {
                                ...item,
                                lotId: lot.id,
                                lotDate: lot.created_at,
                                quantity: item.quantity || 0,
                            },
                        ],
                    });
                } else {
                    existingGroup.items.push({
                        ...item,
                        lotId: lot.id,
                        lotDate: lot.created_at,
                        quantity: item.quantity || 0,
                    });
                }
            });
            return acc;
        }, []);

        setAvailableItems(groupedItems);
    };

    // เมื่อเลือกสินค้า
    const handleItemChange = (itemId) => {
        setSelectedItem(itemId);
        setQuantity(1);

        if (!itemId) {
            setAvailableLots([]);
            setSelectedLot("");
            setMaxQuantity(0);
            return;
        }

        const [groupId, itemId2] = itemId.split('-');
        const group = availableItems.find(g => g.id.toString() === groupId);
        if (group) {
            const selectedItem = group.items.find(item => item.id.toString() === itemId2);
            if (selectedItem) {
                // Auto select the lot and set its quantity
                setSelectedLot(selectedItem.lotId.toString());
                setMaxQuantity(selectedItem.quantity);
                setAvailableLots([{
                    id: selectedItem.lotId,
                    created_at: selectedItem.lotDate,
                    quantity: selectedItem.quantity
                }]);
            } else {
                setAvailableLots([]);
                setSelectedLot("");
                setMaxQuantity(0);
            }
        } else {
            setAvailableLots([]);
            setSelectedLot("");
            setMaxQuantity(0);
        }
    };

    // เมื่อเลือก Lot
    const handleLotChange = (lotId) => {
        setSelectedLot(lotId);

        if (!lotId || !selectedItem) {
            setMaxQuantity(0);
            setQuantity(1);
            return;
        }

        const selectedItemObj = availableItems.find(
            (g) => g.id.toString() === selectedItem.split("-")[0]
        );
        if (!selectedItemObj || !Array.isArray(selectedItemObj.items)) {
            setMaxQuantity(0);
            setQuantity(1);
            return;
        }

        const selectedLot = selectedItemObj.items.find(
            (item) => item.lotId === parseInt(lotId)
        );
        setMaxQuantity(selectedLot?.quantity || 0);
        setQuantity(1);
    };

    // เมื่อเปลี่ยนแปลงจำนวน
    const handleQuantityChange = (value) => {
        const newQuantity = parseFloat(value);
        if (isNaN(newQuantity) || newQuantity < 0) {
            setQuantity(0);
            return;
        }

        if (newQuantity > maxQuantity) {
            Swal.fire({
                title: 'ข้อผิดพลาด',
                text: `ไม่สามารถเบิกได้มากกว่า ${maxQuantity}`,
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
            setQuantity(maxQuantity);
            return;
        }

        setQuantity(newQuantity);
    };

    // เพิ่มรายการเบิก
    const addWithdrawItem = () => {
        if (!selectedType || !selectedItem || !quantity) {
            Swal.fire({
                title: "ข้อผิดพลาด",
                text: "กรุณากรอกข้อมูลให้ครบถ้วน",
                icon: "error",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        // ตรวจสอบว่ามีการเลือกสินค้าซ้ำใน lot เดียวกันหรือไม่
        const isDuplicate = withdrawItems.some(
            (item) =>
                item.lot_id === selectedLot && item.item_id === selectedItem
        );

        if (isDuplicate) {
            Swal.fire({
                title: "ข้อผิดพลาด",
                text: "ไม่สามารถเลือกสินค้าซ้ำใน lot เดียวกันได้",
                icon: "error",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        // ตรวจสอบจำนวนที่เบิก
        if (quantity > maxQuantity) {
            Swal.fire({
                title: "ข้อผิดพลาด",
                text: `ไม่สามารถเบิกได้มากกว่า ${maxQuantity}`,
                icon: "error",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        const newItem = {
            type: selectedType,
            lot_id: selectedLot,
            item_id: selectedItem,
            quantity: quantity,
            item_name: availableItems.find(
                (g) => g.id.toString() === selectedItem.split("-")[0]
            )?.name,
        };

        setWithdrawItems([...withdrawItems, newItem]);
        setData("items", [...withdrawItems, newItem]);

        // Reset form
        setSelectedType("");
        setSelectedLot("");
        setSelectedItem("");
        setQuantity(1);

        // แสดง success message
        Swal.fire({
            title: "สำเร็จ",
            text: "เพิ่มรายการเบิกเรียบร้อยแล้ว",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
        });
    };

    // ลบรายการเบิก
    const removeWithdrawItem = (index) => {
        Swal.fire({
            title: "ยืนยันการลบ",
            text: "คุณต้องการลบรายการนี้ใช่หรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ใช่, ลบเลย",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedItems = withdrawItems.filter(
                    (_, i) => i !== index
                );
                setWithdrawItems(updatedItems);
                setData("items", updatedItems);

                Swal.fire({
                    title: "ลบแล้ว!",
                    text: "ลบรายการเรียบร้อยแล้ว",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
    };

    // ส่งฟอร์ม
    const handleSubmit = (e) => {
        e.preventDefault();

        if (withdrawItems.length === 0) {
            Swal.fire({
                title: "ข้อผิดพลาด",
                text: "กรุณาเพิ่มรายการเบิกอย่างน้อย 1 รายการ",
                icon: "error",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        Swal.fire({
            title: "ยืนยันการเบิก",
            text: "คุณต้องการบันทึกรายการเบิกใช่หรือไม่?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ใช่, บันทึกเลย",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                post(route("admin.withdraws.store"));
            }
        });
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

                            {/* เลือกสินค้า */}
                            <div>
                                <Label htmlFor="item">สินค้า</Label>
                                <Select
                                    id="item"
                                    value={selectedItem}
                                    onChange={(e) =>
                                        handleItemChange(e.target.value)
                                    }
                                    disabled={!selectedType}
                                    required
                                    className="font-sarabun"
                                >
                                    <option value="">เลือกสินค้า</option>
                                    {availableItems?.map((group) => (
                                        <optgroup
                                            key={group.id}
                                            label={group.name}
                                        >
                                            {group.items.map((item) => {
                                                const date = new Date(
                                                    item.lotDate
                                                );
                                                const formattedDate =
                                                    date.toLocaleDateString(
                                                        "th-TH",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    );
                                                return (
                                                    <option
                                                        key={`${group.id}-${item.id}`}
                                                        value={`${group.id}-${item.id}`}
                                                    >
                                                        Lot #{item.lotId} -{" "}
                                                        {formattedDate}{" "}
                                                        (คงเหลือ:{" "}
                                                        {Number(
                                                            item.quantity
                                                        ).toFixed(1)}
                                                        )
                                                    </option>
                                                );
                                            })}
                                        </optgroup>
                                    ))}
                                </Select>
                            </div>

                            {/* เลือก Lot */}
                            <div className="hidden">
                                <Label htmlFor="lot">Lot</Label>
                                <Select
                                    id="lot"
                                    value={selectedLot}
                                    onChange={(e) =>
                                        handleLotChange(e.target.value)
                                    }
                                    disabled={!selectedItem}
                                    required
                                >
                                    <option value="">เลือก Lot</option>
                                    {availableLots?.map((lot) => (
                                        <option key={lot.id} value={lot.id}>
                                            #{lot.id} - คงเหลือ:{" "}
                                            {Number(lot.quantity).toFixed(1)}
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
                                    value={quantity}
                                    onChange={(e) =>
                                        handleQuantityChange(e.target.value)
                                    }
                                    disabled={!selectedItem}
                                    min="0"
                                    max={maxQuantity}
                                    step="0.1"
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
