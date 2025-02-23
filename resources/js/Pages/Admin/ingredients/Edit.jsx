import IngredientsForm from "@/Components/Admin/ingredients/IngredientsForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function EditIngredient({ ingredient, units, errors }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    แก้ไขวัตถุดิบ {ingredient.name}
                </h2>
            }
        >
            <Head title="แก้ไขวัตถุดิบ" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/ingredients">วัตถุดิบทั้งหมด</Breadcrumb.Item>
                    <Breadcrumb.Item>แก้ไขวัตถุดิบ</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <AdminLayout>
                <IngredientsForm
                    ingredient={ingredient}
                    units={units}
                    isEditing={true}
                    errors={errors}
                />
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
