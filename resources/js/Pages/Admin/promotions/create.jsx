import PromotionForm from "@/Components/Admin/promotions/PromotionForm";
import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function CreatePromotion({ categories }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    เพิ่มโปรโมชัน
                </h2>
            }
        >
            <Head title="เพิ่มโปรโมชัน" />
            <AdminLayout>
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/promotions">
                        โปรโมชันทั้งหมด
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>เพิ่มโปรโมชัน</Breadcrumb.Item>
                </Breadcrumb>
                <PromotionForm categories={categories} />
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
