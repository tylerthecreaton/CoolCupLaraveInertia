import UserForm from "@/Components/Admin/users/UserForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function EditUser({ customer }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    แก้ไขสมาชิก {customer.name}
                </h2>
            }
        >
            <Head title="เพิ่มสมาชิก" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/customers">สมาชิกทั้งหมด</Breadcrumb.Item>
                    <Breadcrumb.Item>แก้ไขสมาชิก</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <UserForm customer={customer} isEditing={true} />
        </AuthenticatedLayout>
    );
}
