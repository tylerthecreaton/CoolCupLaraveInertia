import { useForm } from "@inertiajs/react";
import {
    Button,
    FileInput,
    Label,
    Select,
    TextInput,
    Alert,
} from "flowbite-react";
import { useEffect } from "react";

export default function PromotionForm({
    categories = [],
    isEditing = false,
    promotion = null,
}) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: isEditing ? promotion?.name : "",
        description: isEditing ? promotion?.description : "",
        type: isEditing ? promotion?.type : "PERCENTAGE",
        percentage: isEditing ? promotion?.discount_value : 0,
        fixed: isEditing ? promotion?.discount_value : 0,
        buyXGetY: {
            buy: isEditing ? promotion?.buyXGetY?.buy : 0,
            get: isEditing ? promotion?.buyXGetY?.get : 0,
        },
        category: {
            discount_type: isEditing
                ? promotion?.category?.discount_type
                : "PERCENTAGE",
            discount_value: isEditing ? promotion?.category?.discount_value : 0,
            category_id: isEditing ? promotion?.category?.category_id : "",
        },
        start_date: isEditing ? promotion?.start_date : "",
        end_date: isEditing ? promotion?.end_date : "",
    });

    useEffect(() => {
        // Reset discount values when type changes
        if (data.type === "PERCENTAGE") {
            setData("fixed", 0);
            setData("buyXGetY", { buy: 0, get: 0 });
            setData("category", { ...data.category, discount_value: 0 });
        } else if (data.type === "FIXED") {
            setData("percentage", 0);
            setData("buyXGetY", { buy: 0, get: 0 });
            setData("category", { ...data.category, discount_value: 0 });
        } else if (data.type === "BUY_X_GET_Y") {
            setData("percentage", 0);
            setData("fixed", 0);
            setData("category", { ...data.category, discount_value: 0 });
        } else if (data.type === "CATEGORY_DISCOUNT") {
            setData("percentage", 0);
            setData("fixed", 0);
            setData("buyXGetY", { buy: 0, get: 0 });
        }
    }, [data.type]);

    const validateDates = () => {
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        return start <= end;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateDates()) {
            alert("วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น");
            return;
        }

        if (isEditing) {
            put(route("admin.promotions.update", promotion.id), data, {
                forceFormData: true,
            });
        } else {
            post(route("admin.promotions.store"), data, {
                forceFormData: true,
            });
        }
    };

    return (
        <div className="container px-4 py-8 mx-auto mt-5 bg-white rounded-lg shadow-md sm:px-8">
            <form
                className="flex flex-col gap-6 mx-auto max-w-2xl"
                onSubmit={handleSubmit}
            >
                {errors.message && (
                    <Alert color="failure">
                        <span>
                            <span className="font-medium">Error! </span>
                            {errors.message}
                        </span>
                    </Alert>
                )}
                {/* Basic Information Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        ข้อมูลพื้นฐาน
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="name" value="ชื่อโปรโมชั่น" />
                            <TextInput
                                id="name"
                                type="text"
                                placeholder="กรุณากรอกชื่อโปรโมชั่น"
                                required
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                color={errors.name ? "failure" : "gray"}
                                helperText={errors.name}
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="description"
                                value="รายละเอียดโปรโมชั่น"
                            />
                            <TextInput
                                id="description"
                                type="text"
                                placeholder="กรุณากรอกรายละเอียดโปรโมชั่น"
                                required
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                color={errors.description ? "failure" : "gray"}
                                helperText={errors.description}
                            />
                        </div>
                    </div>
                </div>

                {/* Promotion Type Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        ประเภทโปรโมชั่น
                    </h3>
                    <div>
                        <Label htmlFor="type" value="ประเภทโปรโมชั่น" />
                        <Select
                            id="type"
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            required
                            color={errors.type ? "failure" : "gray"}
                        >
                            <option value="PERCENTAGE">เปอร์เซ็นต์</option>
                            <option value="FIXED">ค่าคงที่</option>
                            <option value="BUY_X_GET_Y">ซื้อ X ได้ Y</option>
                            <option value="CATEGORY_DISCOUNT">
                                ส่วนลดประเภท
                            </option>
                        </Select>
                    </div>
                </div>

                {/* Discount Details Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        รายละเอียดส่วนลด
                    </h3>

                    {data.type === "PERCENTAGE" && (
                        <div>
                            <Label
                                htmlFor="percentage"
                                value="เปอร์เซ็นต์ส่วนลด (%)"
                            />
                            <TextInput
                                id="percentage"
                                type="number"
                                min="0"
                                max="100"
                                required
                                value={data.percentage}
                                onChange={(e) =>
                                    setData(
                                        "percentage",
                                        Math.min(
                                            100,
                                            Math.max(0, e.target.valueAsNumber)
                                        )
                                    )
                                }
                                color={errors.percentage ? "failure" : "gray"}
                                helperText={errors.percentage}
                            />
                        </div>
                    )}

                    {data.type === "FIXED" && (
                        <div>
                            <Label
                                htmlFor="fixed"
                                value="จำนวนเงินส่วนลด (บาท)"
                            />
                            <TextInput
                                id="fixed"
                                type="number"
                                min="0"
                                required
                                value={data.fixed}
                                onChange={(e) =>
                                    setData(
                                        "fixed",
                                        Math.max(0, e.target.valueAsNumber)
                                    )
                                }
                                color={errors.fixed ? "failure" : "gray"}
                                helperText={errors.fixed}
                            />
                        </div>
                    )}

                    {data.type === "BUY_X_GET_Y" && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="buy_x" value="ซื้อ X ชิ้น" />
                                <TextInput
                                    id="buy_x"
                                    type="number"
                                    min="1"
                                    required
                                    value={data.buyXGetY.buy}
                                    onChange={(e) =>
                                        setData("buyXGetY", {
                                            ...data.buyXGetY,
                                            buy: Math.max(
                                                1,
                                                e.target.valueAsNumber
                                            ),
                                        })
                                    }
                                    color={
                                        errors["buyXGetY.buy"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={errors["buyXGetY.buy"]}
                                />
                            </div>
                            <div>
                                <Label htmlFor="get_y" value="ได้ Y ชิ้น" />
                                <TextInput
                                    id="get_y"
                                    type="number"
                                    min="1"
                                    required
                                    value={data.buyXGetY.get}
                                    onChange={(e) =>
                                        setData("buyXGetY", {
                                            ...data.buyXGetY,
                                            get: Math.max(
                                                1,
                                                e.target.valueAsNumber
                                            ),
                                        })
                                    }
                                    color={
                                        errors["buyXGetY.get"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={errors["buyXGetY.get"]}
                                />
                            </div>
                        </div>
                    )}

                    {data.type === "CATEGORY_DISCOUNT" && (
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="category_id"
                                    value="ประเภทสินค้า"
                                />
                                <Select
                                    id="category_id"
                                    value={data.category.category_id}
                                    onChange={(e) =>
                                        setData("category", {
                                            ...data.category,
                                            category_id: e.target.value,
                                        })
                                    }
                                    required
                                    color={
                                        errors["category.category_id"]
                                            ? "failure"
                                            : "gray"
                                    }
                                >
                                    <option value="">เลือกประเภทสินค้า</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </Select>
                                {errors["category.category_id"] && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors["category.category_id"]}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label
                                    htmlFor="category_discount_type"
                                    value="ประเภทส่วนลด"
                                />
                                <Select
                                    id="category_discount_type"
                                    value={data.category.discount_type}
                                    onChange={(e) =>
                                        setData("category", {
                                            ...data.category,
                                            discount_type: e.target.value,
                                        })
                                    }
                                    required
                                    color={
                                        errors["category.discount_type"]
                                            ? "failure"
                                            : "gray"
                                    }
                                >
                                    <option value="PERCENTAGE">
                                        เปอร์เซ็นต์
                                    </option>
                                    <option value="FIXED">ค่าคงที่</option>
                                </Select>
                            </div>
                            <div>
                                <Label
                                    htmlFor="category_discount_value"
                                    value={`มูลค่าส่วนลด ${
                                        data.category.discount_type ===
                                        "PERCENTAGE"
                                            ? "(%)"
                                            : "(บาท)"
                                    }`}
                                />
                                <TextInput
                                    id="category_discount_value"
                                    type="number"
                                    min="0"
                                    max={
                                        data.category.discount_type ===
                                        "PERCENTAGE"
                                            ? "100"
                                            : undefined
                                    }
                                    required
                                    value={data.category.discount_value}
                                    onChange={(e) => {
                                        const value =
                                            data.category.discount_type ===
                                            "PERCENTAGE"
                                                ? Math.min(
                                                      100,
                                                      Math.max(
                                                          0,
                                                          e.target.valueAsNumber
                                                      )
                                                  )
                                                : Math.max(
                                                      0,
                                                      e.target.valueAsNumber
                                                  );
                                        setData("category", {
                                            ...data.category,
                                            discount_value: value,
                                        });
                                    }}
                                    color={
                                        errors["category.discount_value"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={
                                        errors["category.discount_value"]
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Date Range Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        ระยะเวลาโปรโมชั่น
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label
                                htmlFor="start_date"
                                value="วันที่เริ่มต้น"
                            />
                            <TextInput
                                id="start_date"
                                type="date"
                                required
                                value={data.start_date}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                                color={errors.start_date ? "failure" : "gray"}
                                helperText={errors.start_date}
                            />
                        </div>
                        <div>
                            <Label htmlFor="end_date" value="วันที่สิ้นสุด" />
                            <TextInput
                                id="end_date"
                                type="date"
                                required
                                value={data.end_date}
                                onChange={(e) =>
                                    setData("end_date", e.target.value)
                                }
                                color={errors.end_date ? "failure" : "gray"}
                                helperText={errors.end_date}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        color="light"
                        onClick={() => reset()}
                        disabled={processing}
                    >
                        ล้างข้อมูล
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing
                            ? "กำลังบันทึก..."
                            : isEditing
                            ? "อัพเดท"
                            : "บันทึก"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
