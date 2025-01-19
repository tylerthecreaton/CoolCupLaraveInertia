import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Breadcrumb,
    Button,
    Pagination,
    Table,
    TextInput,
} from "flowbite-react";
import { HiHome, HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { useState } from "react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function Index({ expenses }) {
    console.log(expenses);
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(
            route("admin.expenses.index"),
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณไม่สามารถย้อนกลับการกระทำนี้ได้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.expenses.destroy", id), {
                    preserveState: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "รายจ่ายถูกลบเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <AdminLayout>
                <Head title="รายจ่าย" />
                <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5">
                    <div className="mb-1 w-full">
                        <div className="mb-4">
                            <Breadcrumb aria-label="ตัวอย่างเส้นทางการนำทาง">
                                <Breadcrumb.Item
                                    href={route("dashboard")}
                                    icon={HiHome}
                                >
                                    แดชบอร์ด
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>รายจ่าย</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                            รายจ่าย
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-1/2">
                        <TextInput
                            type="text"
                            placeholder="ค้นหารายจ่าย..."
                            value={search}
                            onChange={handleSearch}
                            icon={HiSearch}
                        />
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                        <Link href={route("admin.expenses.create")}>
                            <Button>
                                <HiPlus className="mr-2 h-5 w-5" />
                                เพิ่มรายจ่าย
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table striped>
                        <Table.Head>
                            <Table.HeadCell>รหัส</Table.HeadCell>
                            <Table.HeadCell>ชื่อ</Table.HeadCell>
                            <Table.HeadCell>หมวดหมู่</Table.HeadCell>
                            <Table.HeadCell>จำนวนเงิน</Table.HeadCell>
                            <Table.HeadCell>โดย</Table.HeadCell>
                            <Table.HeadCell>การดำเนินการ</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {expenses.data.map((expense) => (
                                <Table.Row
                                    key={expense.id}
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <Table.Cell>{expense.id}</Table.Cell>
                                    <Table.Cell>{expense.name}</Table.Cell>
                                    <Table.Cell>
                                        {expense.expense_category?.name}
                                    </Table.Cell>
                                    <Table.Cell>{expense.amount}</Table.Cell>
                                    <Table.Cell>
                                        {expense.user?.name}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route(
                                                    "admin.expenses.edit",
                                                    expense.id
                                                )}
                                            >
                                                <Button
                                                    size="sm"
                                                    color="warning"
                                                >
                                                    <HiPencil className="mr-2 h-4 w-4" />
                                                    แก้ไข
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                color="failure"
                                                onClick={() =>
                                                    handleDelete(expense.id)
                                                }
                                            >
                                                <HiTrash className="mr-2 h-4 w-4" />
                                                ลบ
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <Pagination
                        currentPage={expenses.current_page}
                        totalPages={expenses.last_page}
                        onPageChange={(page) =>
                            router.get(route("admin.expenses.index", { page }))
                        }
                    />
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
