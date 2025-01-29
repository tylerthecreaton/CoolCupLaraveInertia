import ProductsForm from "@/Components/Admin/products/ProductsForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function EditProduct({ 
    product, 
    categories, 
    ingredients, 
    consumables,
    productIngredients,
    productConsumables 
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    แก้ไขสินค้า {product.name}
                </h2>
            }
        >
            <Head title="เพิ่มสินค้า" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/products">สินค้าทั้งหมด</Breadcrumb.Item>
                    <Breadcrumb.Item>แก้ไขสินค้า</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <ProductsForm 
                product={product} 
                isEditing={true} 
                categories={categories}
                ingredients={ingredients}
                consumables={consumables}
                productIngredients={productIngredients}
                productConsumables={productConsumables}
            />
        </AuthenticatedLayout>
    );
}
