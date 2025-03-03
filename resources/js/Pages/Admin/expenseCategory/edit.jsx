import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import ExpenseCategoryForm from "./ExpenseCategoryForm";

export default function Edit({ auth, category, errors }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="แก้ไขหมวดหมู่รายจ่าย" />
            <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5">
                <div className="mb-1 w-full">
                    <div className="mb-4">
                        <Breadcrumb aria-label="Default breadcrumb example">
                            <Breadcrumb.Item
                                href={route("dashboard")}
                                icon={HiHome}
                            >
                                หน้าแรก
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                href={route("admin.expense-categories.index")}
                            >
                                หมวดหมู่รายจ่ายทั้งหมด
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>แก้ไข</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                        แก้ไขหมวดหมู่รายจ่าย {category.name}
                    </h1>
                </div>
            </div>
            <div className="p-4">
                <ExpenseCategoryForm category={category} errors={errors}/>
            </div>
        </AuthenticatedLayout>
    );
}
