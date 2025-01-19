import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import ExpenseCategoryForm from "./ExpenseCategoryForm";

export default function Edit({ auth, category }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Expense Category" />
            <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5">
                <div className="mb-1 w-full">
                    <div className="mb-4">
                        <Breadcrumb aria-label="Default breadcrumb example">
                            <Breadcrumb.Item
                                href={route("dashboard")}
                                icon={HiHome}
                            >
                                Dashboard
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                href={route("admin.expense-categories.index")}
                            >
                                Expense Categories
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Edit</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Edit Expense Category: {category.name}
                    </h1>
                </div>
            </div>
            <div className="p-4">
                <ExpenseCategoryForm category={category} />
            </div>
        </AuthenticatedLayout>
    );
}
