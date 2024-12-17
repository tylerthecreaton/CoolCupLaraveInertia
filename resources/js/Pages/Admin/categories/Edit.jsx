import CategoriesForm from "@/Components/Admin/categories/CategoriesForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function EditCategory({ category }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    แก้ไขหมวดหมู่ {category.name}
                </h2>
            }
        >
            <Head title="เพิ่มผู้ใช้งาน" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="#" icon={HiHome}>
                        หน้าหลัก
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/categories">หมวดหมู่</Breadcrumb.Item>
                    <Breadcrumb.Item>แก้ไขหมวดหมู่</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <CategoriesForm category={category} isEditing={true} />
        </AuthenticatedLayout>
    );
}
