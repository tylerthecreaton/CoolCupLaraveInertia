import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import CategoriesForm from "@/Components/Admin/categories/CategoriesForm";
import { Link } from "@inertiajs/react";
export default function CreateCategory({ errors }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการหมวดหมู่
                </h2>
            }
        >
            <Head title="เพิ่มหมวดหมู่" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        หน้าแรก
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/categories">
                        หมวดหมู่ทั้งหมด
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>เพิ่มหมวดหมู่</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <CategoriesForm errors={errors} />
        </AuthenticatedLayout>
    );
}
