import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import IngredientsForm from "@/Components/Admin/ingredients/IngredientsForm";
import { Link } from "@inertiajs/react";

export default function CreateIngredients({ units }) {
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
                <AdminLayout>
                    <IngredientsForm units={units} />
                </AdminLayout>
            </div>
        </AuthenticatedLayout>
    );
}
