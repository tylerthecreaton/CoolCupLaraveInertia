import UserForm from "@/Components/Admin/users/UserForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Button, FileInput, Label, TextInput } from "flowbite-react";

import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function CreateUser() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการผู้ใช้
                </h2>
            }
        >
            <Head title="เพิ่มผู้ใช้งาน" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="#" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/users">Users</Breadcrumb.Item>
                    <Breadcrumb.Item>เพิ่มผู้ใช้งาน</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <UserForm />
        </AuthenticatedLayout>
    );
}
