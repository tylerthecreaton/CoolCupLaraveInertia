import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    HiHome,
    HiPlus,
    HiTrash,
    HiTag,
    HiCube,
    HiBeaker,
    HiCalculator,
} from "react-icons/hi";
import { Head, useForm } from "@inertiajs/react";
import {
    Breadcrumb,
    Button,
    Label,
    Select,
    TextInput,
    Card,
} from "flowbite-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function CreateWithdraw({ auth, ingredientLots, consumables }) {
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
        console.log('Available Items:', items); // For debugging
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

        let newMaxQuantity = 0;
        if (selectedType === "consumable") {
            const [groupIndex, itemIndex] = value.split("-").map(Number);
            const group = availableItems[groupIndex];
            const item = group.items[itemIndex];
            newMaxQuantity = item.quantity;
        } else {
            const [lotId, itemId] = value.split("-").map(Number);
            const lot = availableItems.find((l) => l.id === lotId);
            if (lot) {
                const item = lot.items.find((i) => i.id === itemId);
                if (item) {
                    newMaxQuantity = item.quantity;
                }
            }
        }

        setMaxQuantity(newMaxQuantity);
        // Reset quantity to 1 or max if 1 is too high
        setQuantity(Math.min(1, newMaxQuantity));
    };

    // เมื่อเลือก transformer
    const handleTransformerChange = (transformerId) => {
        setSelectedTransformer(transformerId);
    };

    // เพิ่มรายการเบิก
    const handleAddItem = () => {
        if (
            !selectedItem ||
            !quantity ||
            !selectedTransformer
        ) {
            Swal.fire({
                icon: "error",
                title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                text: "กรุณาเลือกสินค้า, จำนวน และประเภทสินค้า",
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
            const lot = availableItems.find((l) => l.id === lotId_);
            selectedItemData = lot.items.find((i) => i.id === itemId);
            lotId = lot.id;
            lotCreatedAt = lot.created_at;
        }

        let selectedTransformerData = null;
        if (selectedTransformer) {
            selectedTransformerData = selectedItemData.transformers?.find(
                (t) => t.id.toString() === selectedTransformer.toString()
            );
        }

        const newItem = {
            type: selectedType,
            lot_id: lotId,
            lot_created_at: lotCreatedAt,
            item_id: selectedItemData.id,
            item_name: selectedItemData.name,
            ingredient_type: selectedType === 'ingredient' ? selectedItemData.ingredient_type : null,
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
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    เบิกวัตถุดิบ
                </h2>
            }
        >
            <Head title="เบิกวัตถุดิบ" />

            <div className="py-6 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Breadcrumb aria-label="Default breadcrumb example" className="bg-white shadow-sm rounded-lg px-4 py-3">
                            <Breadcrumb.Item href={route("dashboard")} icon={HiHome} className="text-gray-600 hover:text-blue-600">
                                หน้าแรก
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href={route("admin.withdraw.index")} className="text-gray-600 hover:text-blue-600">
                                รายการเบิกวัตถุดิบ
                            </Breadcrumb.Item>
                            <Breadcrumb.Item className="text-gray-800">
                                เบิกวัตถุดิบ
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div className="p-6 sm:p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            เบิกวัตถุดิบใหม่
                                        </h2>
                                        <div className="hidden sm:block">
                                            <span className="inline-flex items-center px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-full">
                                                <HiCalculator className="w-4 h-4 mr-2" />
                                                คงเหลือ: {maxQuantity || 0}
                                            </span>
                                        </div>
                                    </div>

                                    <form className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="col-span-2">
                                                <Label
                                                    htmlFor="type"
                                                    value="ประเภท"
                                                    className="inline-flex items-center mb-2 text-gray-700"
                                                >
                                                    <HiTag className="mr-2 w-5 h-5 text-blue-500" />
                                                    <span>ประเภท</span>
                                                </Label>
                                                <Select
                                                    id="type"
                                                    value={selectedType}
                                                    onChange={(e) => handleTypeChange(e.target.value)}
                                                    required
                                                    color={errors.type ? "failure" : "gray"}
                                                    className="w-full"
                                                >
                                                    <option value="">เลือกประเภท</option>
                                                    <option value="ingredient">วัตถุดิบ</option>
                                                    <option value="consumable">วัสดุสิ้นเปลือง</option>
                                                </Select>
                                            </div>

                                            <div className="col-span-2">
                                                <Label
                                                    htmlFor="item"
                                                    value="สินค้า"
                                                    className="inline-flex items-center mb-2 text-gray-700"
                                                >
                                                    <HiCube className="mr-2 w-5 h-5 text-blue-500" />
                                                    <span>สินค้า</span>
                                                </Label>
                                                <Select
                                                    id="item"
                                                    value={selectedItem}
                                                    onChange={(e) => handleItemChange(e.target.value)}
                                                    required
                                                    color={errors.item ? "failure" : "gray"}
                                                    className="w-full"
                                                >
                                                    {selectedType === "consumable"
                                                        ? availableItems.map(
                                                              (group, groupIndex) => (
                                                                  <optgroup
                                                                      key={groupIndex}
                                                                      label={group.name}
                                                                  >
                                                                      {group.items.map(
                                                                          (
                                                                              item,
                                                                              itemIndex
                                                                          ) => (
                                                                              <option
                                                                                  key={`${groupIndex}-${itemIndex}`}
                                                                                  value={`${groupIndex}-${itemIndex}`}
                                                                              >
                                                                                  Lot #
                                                                                  {
                                                                                      item.lot_id
                                                                                  }{" "}
                                                                                  -{" "}
                                                                                  {new Date(
                                                                                      item.lot_created_at
                                                                                  ).toLocaleDateString()}{" "}
                                                                                  (คงเหลือ:{" "}
                                                                                  {
                                                                                      item.quantity
                                                                                  }
                                                                                  )
                                                                              </option>
                                                                          )
                                                                      )}
                                                                  </optgroup>
                                                              )
                                                          )
                                                        : availableItems.map((lot) => (
                                                              <optgroup
                                                                  key={lot.id}
                                                                  label={`Lot #${
                                                                      lot.id
                                                                  } - ${new Date(
                                                                      lot.created_at
                                                                  ).toLocaleDateString()}`}
                                                              >
                                                                  {lot.items.map(
                                                                      (item) => (
                                                                          <option
                                                                              key={`${lot.id}-${item.id}`}
                                                                              value={`${lot.id}-${item.id}`}
                                                                          >
                                                                              {item.name} - {item.ingredient_type || 'วัตถุดิบ'}{" "}
                                                                              (คงเหลือ:{" "}
                                                                              {item.quantity}
                                                                              )
                                                                          </option>
                                                                      )
                                                                  )}
                                                              </optgroup>
                                                          ))}
                                                </Select>
                                            </div>

                                            {/* Show transformer selection for both ingredient and consumable */}
                                            {selectedItem && (
                                                <div className="col-span-2">
                                                    <Label
                                                        htmlFor="transformer"
                                                        value="ประเภทสินค้า"
                                                        className="inline-flex items-center mb-2 text-gray-700"
                                                    >
                                                        <HiBeaker className="mr-2 w-5 h-5 text-blue-500" />
                                                        <span>ประเภทสินค้า</span>
                                                    </Label>
                                                    <Select
                                                        id="transformer"
                                                        value={selectedTransformer}
                                                        onChange={(e) => handleTransformerChange(e.target.value)}
                                                        required
                                                        color={errors.transformer ? "failure" : "gray"}
                                                        className="w-full"
                                                    >
                                                        <option value="">เลือกประเภทสินค้า</option>
                                                        {(() => {
                                                            if (selectedItem) {
                                                                if (selectedType === "consumable") {
                                                                    const [groupIndex, itemIndex] = selectedItem.split("-").map(Number);
                                                                    const group = availableItems[groupIndex];
                                                                    const item = group.items[itemIndex];
                                                                    return item.transformers.map((transformer) => (
                                                                        <option
                                                                            key={transformer.id}
                                                                            value={transformer.id}
                                                                        >
                                                                            {transformer.name}
                                                                        </option>
                                                                    ));
                                                                } else {
                                                                    const [lotId, itemId] = selectedItem.split("-").map(Number);
                                                                    const lot = availableItems.find((l) => l.id === lotId);
                                                                    const item = lot.items.find((i) => i.id === itemId);
                                                                    return item.transformers?.map((transformer) => (
                                                                        <option
                                                                            key={transformer.id}
                                                                            value={transformer.id}
                                                                        >
                                                                            {transformer.name}
                                                                        </option>
                                                                    )) || [];
                                                                }
                                                            }
                                                            return [];
                                                        })()}
                                                    </Select>
                                                </div>
                                            )}

                                            <div className="col-span-2 sm:col-span-1">
                                                <Label
                                                    htmlFor="quantity"
                                                    value="จำนวน"
                                                    className="inline-flex items-center mb-2 text-gray-700"
                                                >
                                                    <HiCalculator className="mr-2 w-5 h-5 text-blue-500" />
                                                    <span>จำนวน (สูงสุด: {maxQuantity})</span>
                                                </Label>
                                                <TextInput
                                                    id="quantity"
                                                    type="number"
                                                    min="1"
                                                    max={maxQuantity}
                                                    value={quantity}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value);
                                                        if (value > maxQuantity) {
                                                            Swal.fire({
                                                                icon: "warning",
                                                                title: "เกินจำนวนที่มี",
                                                                text: `จำนวนต้องไม่เกิน ${maxQuantity}`,
                                                            });
                                                            setQuantity(maxQuantity);
                                                        } else if (value < 1) {
                                                            setQuantity(1);
                                                        } else {
                                                            setQuantity(value);
                                                        }
                                                    }}
                                                    color={errors.quantity ? "failure" : "gray"}
                                                    required
                                                />
                                                {errors.quantity && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        {errors.quantity}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="col-span-2 sm:col-span-1 flex items-end">
                                                <Button
                                                    type="button"
                                                    onClick={handleAddItem}
                                                    gradientDuoTone="purpleToBlue"
                                                    className="w-full transition-all duration-200 hover:scale-105"
                                                >
                                                    <HiPlus className="mr-2 h-5 w-5" />
                                                    เพิ่มรายการ
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            {withdrawItems.length > 0 && (
                                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                รายการที่เลือก
                                            </h2>
                                            <span className="text-sm text-gray-500">
                                                {withdrawItems.length} รายการ
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            {withdrawItems.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                                                >
                                                    <div className="flex-1 min-w-0 mr-4">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {item.item_name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {item.type === "ingredient"
                                                                ? `วัตถุดิบ${item.ingredient_type ? ` • ${item.ingredient_type}` : ''}`
                                                                : "วัสดุสิ้นเปลือง"}
                                                            {item.transformer_name && ` • ${item.transformer_name}`}
                                                        </p>
                                                        <div className="flex items-center mt-1">
                                                            <span className="text-xs text-gray-500">
                                                                Lot #{item.lot_id} {new Date(item.lot_created_at).toLocaleDateString()}
                                                            </span>
                                                            <span className="mx-2 text-gray-300">•</span>
                                                            <span className="text-xs font-medium text-blue-600">
                                                                จำนวน: {item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        color="failure"
                                                        size="xs"
                                                        onClick={() => {
                                                            const newItems = withdrawItems.filter(
                                                                (_, i) => i !== index
                                                            );
                                                            setWithdrawItems(newItems);
                                                            setData("items", newItems);
                                                        }}
                                                        className="transition-all duration-200 hover:scale-105 shrink-0"
                                                    >
                                                        <HiTrash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6">
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    post(route("admin.withdraw.store"), {
                                                        onSuccess: () => {
                                                            Swal.fire({
                                                                title: "สำเร็จ!",
                                                                text: "บันทึกการเบิกเรียบร้อยแล้ว",
                                                                icon: "success",
                                                                confirmButtonText: "ตกลง",
                                                            }).then(() => {
                                                                window.location.href = route("admin.withdraw.index");
                                                            });
                                                        },
                                                        onError: () => {
                                                            Swal.fire({
                                                                title: "เกิดข้อผิดพลาด!",
                                                                text: "ไม่สามารถบันทึกการเบิกได้",
                                                                icon: "error",
                                                                confirmButtonText: "ตกลง",
                                                            });
                                                        },
                                                    });
                                                }}
                                                gradientDuoTone="purpleToBlue"
                                                size="lg"
                                                className="w-full transition-all duration-200 hover:scale-105"
                                                disabled={processing}
                                            >
                                                บันทึกการเบิก
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
