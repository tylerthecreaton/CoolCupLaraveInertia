import { useForm } from "@inertiajs/react";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { HiCurrencyDollar } from "react-icons/hi";

export default function ExpenseCategoryForm({ category = null, errors = {} }) {
    const { data, setData, post, put, processing } = useForm({
        name: category?.name || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (category) {
            put(route("admin.expense-categories.update", category.id));
        } else {
            post(route("admin.expense-categories.store"));
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category ? "แก้ไขหมวดหมู่รายจ่าย" : "เพิ่มหมวดหมู่รายจ่าย"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="name"
                                value="ชื่อหมวดหมู่"
                                className="text-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="กรุณากรอกชื่อหมวดหมู่"
                            icon={HiCurrencyDollar}
                            color={errors?.name ? "failure" : "gray"}
                            helperText={errors?.name}
                            required
                        />
                    </div>

                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto"
                        >
                            {category ? "อัปเดต" : "สร้าง"}หมวดหมู่รายจ่าย
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    );
}
