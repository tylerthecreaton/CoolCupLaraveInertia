import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import IngredientsForm from "@/Components/Admin/ingredients/IngredientsForm";
import { Link } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function CreateIngredients({ units, errors }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการวัตถุดิบ
                </h2>
            }
        >
            <Head title="เพิ่มวัตถุดิบ" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        หน้าแรก
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/ingredients">
                        วัตถุดิบทั้งหมด
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>เพิ่มวัตถุดิบ</Breadcrumb.Item>
                </Breadcrumb>
                <AdminLayout>
                    <IngredientsForm units={units} errors={errors} />
                </AdminLayout>
            </div>
        </AuthenticatedLayout>
    );
}
