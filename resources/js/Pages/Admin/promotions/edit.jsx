import PromotionForm from "@/Components/Admin/promotions/PromotionForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function EditPromotion({ promotion, errors, categories }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    แก้ไขโปรโมชัน {promotion.name}
                </h2>
            }
        >
            <Head title="แก้ไขโปรโมชัน" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/promotions">
                        โปรโมชันทั้งหมด
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>แก้ไขโปรโมชัน</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <PromotionForm promotion={promotion} categories={categories} isEditing={true} errors={errors} />
        </AuthenticatedLayout>
    );
}
