import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ConsumablesForm from "@/Components/Admin/consumables/ConsumablesForm";
import { Link } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function Create({ auth, units }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <AdminLayout>
                <Head title="Create Consumable" />
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
                        <Breadcrumb.Item>เพิ่มวัตถุดิบสิ้นเปลือง</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="p-4">
                    <ConsumablesForm units={units} />
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
