import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ConsumablesForm from "@/Components/Admin/consumables/ConsumablesForm";
import { Link } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function Create({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <AdminLayout>
                <Head title="Create Consumable" />
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
                                <Breadcrumb.Item>Create</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                            Create Consumable
                        </h1>
                    </div>
                </div>
                <div className="p-4">
                    <ConsumablesForm />
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
