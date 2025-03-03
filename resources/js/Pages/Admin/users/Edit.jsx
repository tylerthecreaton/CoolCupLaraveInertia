import UserForm from "@/Components/Admin/users/UserForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function EditUser({ user, errors }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    แก้ไขผู้ใช้งาน {user.name}
                </h2>
            }
        >
            <Head title="แก้ไขผู้ใช้งาน" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/users">ผู้ใช้งานทั้งหมด</Breadcrumb.Item>
                    <Breadcrumb.Item>แก้ไขผู้ใช้งาน</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <UserForm user={user} isEditing={true} errors={errors} />
        </AuthenticatedLayout>
    );
}
