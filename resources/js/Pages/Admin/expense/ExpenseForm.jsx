import { useForm } from "@inertiajs/react";
import { Button, Label, TextInput, Select, Textarea } from "flowbite-react";
import Swal from "sweetalert2";

export default function ExpenseForm({ expense = null, expenseCategories }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: expense?.name || "",
        expense_category_id: expense?.expense_category_id || "",
        amount: expense?.amount || "",
        date: expense?.date || "",
        description: expense?.description || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (expense) {
            put(route("admin.expenses.update", expense.id), {
                onSuccess: () => {
                    Swal.fire({
                        title: "อัปเดตสำเร็จ!",
                        text: "รายจ่ายถูกอัปเดตเรียบร้อยแล้ว",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                },
            });
        } else {
            post(route("admin.expenses.store"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="name">ชื่อค่าใช้จ่าย</Label>
                <TextInput
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                />
                {errors.name && (
                    <div className="text-red-500 p-2">{errors.name}</div>
                )}
            </div>

            <div>
                <Label htmlFor="expense_category_id">หมวดหมู่ค่าใช้จ่าย</Label>
                <Select
                    id="expense_category_id"
                    name="expense_category_id"
                    value={data.expense_category_id}
                    onChange={(e) =>
                        setData("expense_category_id", e.target.value)
                    }
                    required
                >
                    <option value="">เลือกหมวดหมู่</option>
                    {expenseCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </Select>
                {errors.expense_category_id && (
                    <div className="text-red-500 ">
                        {errors.expense_category_id}
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="amount">จำนวนเงิน</Label>
                <TextInput
                    id="amount"
                    type="number"
                    name="amount"
                    value={data.amount}
                    onChange={(e) => setData("amount", e.target.value)}
                    required
                />
                {errors.amount && (
                    <div className="text-red-500">{errors.amount}</div>
                )}
            </div>

            <div>
                <Label htmlFor="date">วันที่</Label>
                <TextInput
                    id="date"
                    type="date"
                    name="date"
                    value={data.date}
                    onChange={(e) => setData("date", e.target.value)}
                    required
                />
                {errors.date && (
                    <div className="text-red-500">{errors.date}</div>
                )}
            </div>

            <div>
                <Label htmlFor="description">รายละเอียด</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    rows={4}
                />
                {errors.description && (
                    <div className="text-red-500">{errors.description}</div>
                )}
            </div>

            <Button type="submit"  disabled={processing}>
                {expense ? "อัปเดตค่าใช้จ่าย" : "สร้างค่าใช้จ่าย"}
            </Button>
        </form>
    );
}
