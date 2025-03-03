import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ConsumablesForm from "@/Components/Admin/consumables/ConsumablesForm";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function Edit({ auth, consumable, units ,errors}) {
    return (
        <AuthenticatedLayout user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    แก้ไขวัตถุดิบสิ้นเปลือง {consumable.name}
                </h2>
            }
        >
            <AdminLayout>
                <Head title="แก้ไขวัตถุดิบสิ้นเปลือง" />
                <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item
                            href={route("dashboard")}
                            icon={HiHome}
                        >
                            หน้าแรก
                        </Breadcrumb.Item>
                                <Breadcrumb.Item
                                    href={route("admin.consumables.index")}
                                >
                                    วัตถุดิบสิ้นเปลือง
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>แก้ไขวัตถุดิบสิ้นเปลือง</Breadcrumb.Item>
                            </Breadcrumb>
                </div>
                <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                    <ConsumablesForm consumable={consumable} units={units} isEditing = {true} errors={errors} />
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
