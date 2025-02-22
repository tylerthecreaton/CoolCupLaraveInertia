import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ExpenseCategoryForm from "./ExpenseCategoryForm";
import { Head } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function CreateExpenseCategory({errors}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    เพิ่มหมวดหมู่รายจ่าย
                </h2>
            }
        >
            <Head title="เพิ่มหมวดหมู่รายจ่าย" />
            <div className="container px-5 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        หน้าแรก
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/expense-categories">
                        หมวดหมู่รายจ่ายทั้งหมด
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>เพิ่มหมวดหมู่รายจ่าย</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <ExpenseCategoryForm errors={errors}/>
        </AuthenticatedLayout>
    );
}
