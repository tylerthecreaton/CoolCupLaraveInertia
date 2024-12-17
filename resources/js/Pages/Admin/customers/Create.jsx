import CustomersForm from "@/Components/Admin/customers/CustomersForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function CreateCustomer() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    เพิ่มสมาชิก
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
                    <Breadcrumb.Item>เพิ่มสมาชิก</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <CustomersForm />
        </AuthenticatedLayout>
    );
}
