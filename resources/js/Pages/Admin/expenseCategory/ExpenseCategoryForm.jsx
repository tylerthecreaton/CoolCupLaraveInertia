import { useForm } from "@inertiajs/react";
import { Button, Label, TextInput } from "flowbite-react";

export default function ExpenseCategoryForm({ category = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <Label htmlFor="name" value="ชื่อหมวดหมู่" />
                <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="ชื่อหมวดหมู่"
                />
                {errors.name && (
                    <div className="text-red-500">{errors.name}</div>
                )}
            </div>
            <Button type="submit" disabled={processing}>
                {category ? "อัปเดต" : "สร้าง"}หมวดหมู่
            </Button>
        </form>
    );
}
