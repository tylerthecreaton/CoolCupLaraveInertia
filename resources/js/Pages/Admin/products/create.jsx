import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import ProductsForm from "@/Components/Admin/products/ProductsForm";

export default function CreateProduct({ categories, ingredients, consumables }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    เพิ่มสินค้า
                </h2>
            }
        >
            <Head title="เพิ่มสินค้า" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        หน้าแรก
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/products">
                        สินค้าทั้งหมด
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>เพิ่มสินค้า</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <ProductsForm
                categories={categories}
                ingredients={ingredients}
                consumables={consumables}
                productIngredients={[]}
                productConsumables={[]}
            />
        </AuthenticatedLayout>
    );
}
