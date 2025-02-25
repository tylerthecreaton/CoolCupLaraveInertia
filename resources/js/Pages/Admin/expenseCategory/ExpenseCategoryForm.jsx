import { useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { HiCurrencyDollar } from "react-icons/hi";
import Swal from "sweetalert2";

export default function ExpenseCategoryForm({ category = null, errors = {} }) {
    const { data, setData, processing } = useForm({
        name: category?.name || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: category ? "ยืนยันการแก้ไข?" : "ยืนยันการเพิ่ม?",
            text: category 
                ? "คุณต้องการแก้ไขหมวดหมู่รายจ่ายนี้ใช่หรือไม่?" 
                : "คุณต้องการเพิ่มหมวดหมู่รายจ่ายใหม่ใช่หรือไม่?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"
        }).then((result) => {
            if (result.isConfirmed) {
                if (category) {
                    router.post(route("admin.expense-categories.update", category.id), {
                        _method: 'PUT',
                        ...data
                    }, {
                        onSuccess: () => {
                            Swal.fire({
                                title: "สำเร็จ!",
                                text: "แก้ไขหมวดหมู่รายจ่ายเรียบร้อยแล้ว",
                                icon: "success",
                                timer: 1500,
                                showConfirmButton: false
                            }).then(() => {
                                // Redirect after success
                                router.visit(route("admin.expense-categories.index"));
                            });
                        },
                        onError: (errors) => {
                            console.log('Submission Errors:', errors);
                            Swal.fire({
                                title: "เกิดข้อผิดพลาด!",
                                text: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
                                icon: "error"
                            });
                        }
                    });
                } else {
                    router.post(route("admin.expense-categories.store"), {
                        ...data
                    }, {
                        onSuccess: () => {
                            Swal.fire({
                                title: "สำเร็จ!",
                                text: "เพิ่มหมวดหมู่รายจ่ายใหม่เรียบร้อยแล้ว",
                                icon: "success",
                                timer: 1500,
                                showConfirmButton: false
                            }).then(() => {
                                // Redirect after success
                                router.visit(route("admin.expense-categories.index"));
                            });
                        },
                        onError: (errors) => {
                            console.log('Submission Errors:', errors);
                            Swal.fire({
                                title: "เกิดข้อผิดพลาด!",
                                text: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
                                icon: "error"
                            });
                        }
                    });
                }
            }
        });
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
