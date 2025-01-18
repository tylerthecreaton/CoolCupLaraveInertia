import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ConsumablesForm from "@/Components/Admin/consumables/ConsumablesForm";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function Edit({ auth, consumable }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <AdminLayout>
                <Head title="Edit Consumable" />
                <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5">
                    <div className="mb-1 w-full">
                        <div className="mb-4">
                            <Breadcrumb aria-label="Default breadcrumb example">
                                <Breadcrumb.Item
                                    href={route("dashboard")}
                                    icon={HiHome}
                                >
                                    Dashboard
                                </Breadcrumb.Item>
                                <Breadcrumb.Item
                                    href={route("admin.consumables.index")}
                                >
                                    Consumables
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>Edit</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                            Edit Consumable: {consumable.name}
                        </h1>
                    </div>
                </div>
                <div className="p-4">
                    <ConsumablesForm consumable={consumable} />
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
