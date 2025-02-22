import UserForm from "@/Components/Admin/users/UserForm";
import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function CreateUser({errors}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    เพิ่มผู้ใช้งาน
                </h2>
            }
        >
            <Head title="เพิ่มผู้ใช้งาน" />
            <AdminLayout>
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        หน้าแรก
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/users">
                        ผู้ใช้งานทั้งหมด
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>เพิ่มผู้ใช้งาน</Breadcrumb.Item>
                </Breadcrumb>

                <UserForm errors={errors}/>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
